package store

import (
	"context"
	"fmt"
	"sort"
	"time"

	"github.com/jackc/pgx/v5"

	"github.com/lucsb/artemise/backend/internal/domain"
)

// Dashboard computa o payload de GET /api/dashboard a partir das tabelas reais.
// inicio/fim delimitam o período de balance/cashflow/relatórios; os KPIs de
// "mês corrente" usam a data do servidor (now). Todas as queries rodam na tx do
// request (RLS já escopa por clinica_id).
func Dashboard(ctx context.Context, tx pgx.Tx, inicio, fim, now time.Time) (domain.DashboardResponse, error) {
	var resp domain.DashboardResponse

	kpis, err := dashboardKPIs(ctx, tx, now)
	if err != nil {
		return resp, fmt.Errorf("dashboard kpis: %w", err)
	}
	resp.KPIs = kpis

	balance, err := dashboardBalance(ctx, tx, inicio, fim)
	if err != nil {
		return resp, fmt.Errorf("dashboard balance: %w", err)
	}
	resp.Balance = balance

	cashflow, err := dashboardCashflow(ctx, tx, inicio, fim)
	if err != nil {
		return resp, fmt.Errorf("dashboard cashflow: %w", err)
	}
	resp.CashflowDaily = cashflow

	next24h, err := dashboardNext24h(ctx, tx, now)
	if err != nil {
		return resp, fmt.Errorf("dashboard next24h: %w", err)
	}
	resp.Next24h = next24h

	reports, err := dashboardReports(ctx, tx, inicio, fim, cashflow, kpis.TotalPacientes)
	if err != nil {
		return resp, fmt.Errorf("dashboard reports: %w", err)
	}
	resp.Reports = reports

	return resp, nil
}

func dashboardKPIs(ctx context.Context, tx pgx.Tx, now time.Time) (domain.DashboardKPIs, error) {
	var k domain.DashboardKPIs
	ref := now.Format("2006-01-02")

	if err := tx.QueryRow(ctx,
		`SELECT count(*) FROM pacientes`).Scan(&k.TotalPacientes); err != nil {
		return k, err
	}
	if err := tx.QueryRow(ctx,
		`SELECT count(*) FROM eventos_agenda WHERE inicio::date = CURRENT_DATE`).
		Scan(&k.AgendamentosHoje); err != nil {
		return k, err
	}
	if err := tx.QueryRow(ctx, `
		SELECT COALESCE(SUM(valor), 0)
		FROM lancamentos_financeiros
		WHERE tipo = 'receita'
		  AND situacao IN ('Recebido','Pago')
		  AND date_trunc('month', vencimento) = date_trunc('month', $1::date)`,
		ref).Scan(&k.ReceitaMes); err != nil {
		return k, err
	}
	if err := tx.QueryRow(ctx, `
		SELECT count(*)
		FROM registros_procedimento
		WHERE status = 'realizado'
		  AND date_trunc('month', data) = date_trunc('month', $1::date)`,
		ref).Scan(&k.ProcedimentosMes); err != nil {
		return k, err
	}
	// taxa_retorno: % de pacientes com >= 2 registros no mês corrente.
	var taxa float64
	if err := tx.QueryRow(ctx, `
		SELECT COALESCE(
		  count(*) FILTER (WHERE c >= 2)::float / NULLIF(count(*), 0) * 100, 0)
		FROM (
		  SELECT paciente_id, count(*) AS c
		  FROM registros_procedimento
		  WHERE date_trunc('month', data) = date_trunc('month', $1::date)
		  GROUP BY paciente_id
		) t`, ref).Scan(&taxa); err != nil {
		return k, err
	}
	k.TaxaRetorno = arredonda1(taxa)
	return k, nil
}

func dashboardBalance(ctx context.Context, tx pgx.Tx, inicio, fim time.Time) (domain.DashboardBalance, error) {
	var (
		entradasReal, saidasRealPos, entradasPrev, saidasPrevPos float64
	)
	err := tx.QueryRow(ctx, `
		SELECT
		  COALESCE(SUM(valor) FILTER (WHERE tipo='receita' AND situacao IN ('Recebido','Pago')), 0),
		  COALESCE(SUM(valor) FILTER (WHERE tipo='despesa' AND situacao IN ('Recebido','Pago')), 0),
		  COALESCE(SUM(valor) FILTER (WHERE tipo='receita'), 0),
		  COALESCE(SUM(valor) FILTER (WHERE tipo='despesa'), 0)
		FROM lancamentos_financeiros
		WHERE vencimento BETWEEN $1 AND $2`,
		inicio, fim,
	).Scan(&entradasReal, &saidasRealPos, &entradasPrev, &saidasPrevPos)
	if err != nil {
		return domain.DashboardBalance{}, err
	}
	return domain.DashboardBalance{
		SaldoRealizado:     entradasReal - saidasRealPos,
		SaldoPrevisto:      entradasPrev - saidasPrevPos,
		EntradasRealizadas: entradasReal,
		EntradasPrevistas:  entradasPrev,
		SaidasRealizadas:   -saidasRealPos,
		SaidasPrevistas:    -saidasPrevPos,
		Periodo:            fmt.Sprintf("%s - %s", inicio.Format("02/01/2006"), fim.Format("02/01/2006")),
	}, nil
}

// cashRow é a agregação diária crua (saídas chegam positivas do SUM).
type cashRow struct {
	Dia           time.Time `db:"dia"`
	Entradas      float64   `db:"entradas"`
	SaidasPos     float64   `db:"saidas_pos"`
	EntradasPrev  float64   `db:"entradas_prev"`
	SaidasPrevPos float64   `db:"saidas_prev_pos"`
}

func dashboardCashflow(ctx context.Context, tx pgx.Tx, inicio, fim time.Time) ([]domain.CashflowPoint, error) {
	rows, err := CollectStruct[cashRow](ctx, tx, `
		SELECT
		  vencimento::date AS dia,
		  COALESCE(SUM(valor) FILTER (WHERE tipo='receita' AND situacao IN ('Recebido','Pago')), 0) AS entradas,
		  COALESCE(SUM(valor) FILTER (WHERE tipo='despesa' AND situacao IN ('Recebido','Pago')), 0) AS saidas_pos,
		  COALESCE(SUM(valor) FILTER (WHERE tipo='receita'), 0) AS entradas_prev,
		  COALESCE(SUM(valor) FILTER (WHERE tipo='despesa'), 0) AS saidas_prev_pos
		FROM lancamentos_financeiros
		WHERE vencimento BETWEEN $1 AND $2
		GROUP BY dia ORDER BY dia`,
		inicio, fim,
	)
	if err != nil {
		return nil, err
	}
	points := make([]domain.CashflowPoint, 0, len(rows))
	var saldo, saldoPrev float64
	for _, r := range rows {
		saldo += r.Entradas - r.SaidasPos
		saldoPrev += r.EntradasPrev - r.SaidasPrevPos
		points = append(points, domain.CashflowPoint{
			Label:             labelDia(r.Dia),
			Entradas:          r.Entradas,
			EntradasPrevistas: r.EntradasPrev,
			Saidas:            -r.SaidasPos,
			SaidasPrevistas:   -r.SaidasPrevPos,
			Saldo:             saldo,
			SaldoPrevisto:     saldoPrev,
		})
	}
	return points, nil
}

// proxRow é uma linha de evento próximo (próximas 24h).
type proxRow struct {
	Paciente     *string   `db:"paciente"`
	Procedimento *string   `db:"procedimento"`
	Inicio       time.Time `db:"inicio"`
	Fim          time.Time `db:"fim"`
}

func dashboardNext24h(ctx context.Context, tx pgx.Tx, _ time.Time) ([]domain.AgendamentoResumo, error) {
	rows, err := CollectStruct[proxRow](ctx, tx, `
		SELECT paciente, procedimento, inicio, fim
		FROM eventos_agenda
		WHERE inicio BETWEEN now() AND now() + interval '24 hours'
		  AND status <> 'Cancelado'
		ORDER BY inicio LIMIT 10`,
	)
	if err != nil {
		return nil, err
	}
	out := make([]domain.AgendamentoResumo, 0, len(rows))
	for _, r := range rows {
		out = append(out, domain.AgendamentoResumo{
			Paciente:     deref(r.Paciente),
			Procedimento: deref(r.Procedimento),
			Horario:      fmt.Sprintf("%s - %s", r.Inicio.Format("15:04"), r.Fim.Format("15:04")),
		})
	}
	return out, nil
}

// eventoAgg é a linha mínima para agregar relatórios do dashboard/agenda.
type eventoAgg struct {
	Profissional *string   `db:"profissional"`
	Procedimento *string   `db:"procedimento"`
	Inicio       time.Time `db:"inicio"`
	Status       string    `db:"status"`
}

func dashboardReports(ctx context.Context, tx pgx.Tx, inicio, fim time.Time, cashflow []domain.CashflowPoint, totalPacientes int) (domain.DashboardReports, error) {
	var rep domain.DashboardReports

	eventos, err := CollectStruct[eventoAgg](ctx, tx, `
		SELECT profissional, procedimento, inicio, status
		FROM eventos_agenda
		WHERE inicio BETWEEN $1 AND $2 AND status <> 'Cancelado'`,
		inicio, fim,
	)
	if err != nil {
		return rep, err
	}

	rep.PorProfissional = rankingPorProfissional(eventos)
	rep.DiasMovimentados = diasMovimentados(eventos)
	rep.Horarios, rep.HeatAtivo = horariosMovimentados(eventos)

	total := len(eventos)
	rep.StatusAgendamento = domain.ResumoIndicador{
		Total:   total,
		Label:   "Agendamentos",
		Legenda: fmt.Sprintf("%d agendamentos no período", total),
	}
	rep.PacientesPorSexo = domain.ResumoIndicador{
		Total:   totalPacientes,
		Label:   "Pacientes",
		Legenda: fmt.Sprintf("%d pacientes no período", totalPacientes),
	}

	rep.FaturamentoComparado = make([]domain.LabelValor, 0, len(cashflow))
	for _, p := range cashflow {
		rep.FaturamentoComparado = append(rep.FaturamentoComparado,
			domain.LabelValor{Label: p.Label, Valor: p.Entradas})
	}
	return rep, nil
}

// rankingPorProfissional conta eventos por profissional (rótulo = iniciais),
// ordenado por contagem desc, no máximo 6 entradas.
func rankingPorProfissional(eventos []eventoAgg) []domain.LabelTotal {
	counts := map[string]int{}
	for _, e := range eventos {
		nome := deref(e.Profissional)
		if nome == "" {
			continue
		}
		counts[nome]++
	}
	return topLabels(counts, iniciais, 6)
}

// diasMovimentados conta eventos por dia da semana em 7 slots fixos (Dom..Sáb).
func diasMovimentados(eventos []eventoAgg) []domain.DiaTotal {
	var buckets [7]int
	for _, e := range eventos {
		buckets[int(e.Inicio.Weekday())]++
	}
	out := make([]domain.DiaTotal, 7)
	for i := 0; i < 7; i++ {
		out[i] = domain.DiaTotal{Dia: labelDiaSemana[i], Total: buckets[i]}
	}
	return out
}

// horariosMovimentados agrupa eventos por hora do dia, devolvendo os rótulos
// "HH:00" das horas com agendamento (ordenados) e a hora de pico (heatAtivo).
// Slice nunca-nil: clínica sem eventos serializa como [] (frontend faz .map).
func horariosMovimentados(eventos []eventoAgg) ([]string, string) {
	counts := map[int]int{}
	for _, e := range eventos {
		counts[e.Inicio.Hour()]++
	}
	horas := make([]int, 0, len(counts))
	for h := range counts {
		horas = append(horas, h)
	}
	sort.Ints(horas)

	labels := make([]string, 0, len(horas))
	ativo, melhor := "", -1
	for _, h := range horas {
		lbl := fmt.Sprintf("%02d:00", h)
		labels = append(labels, lbl)
		if counts[h] > melhor {
			melhor, ativo = counts[h], lbl
		}
	}
	return labels, ativo
}

// arredonda1 arredonda para 1 casa decimal.
func arredonda1(x float64) float64 {
	return float64(int(x*10+0.5)) / 10
}

// deref devolve "" para *string nil.
func deref(p *string) string {
	if p == nil {
		return ""
	}
	return *p
}
