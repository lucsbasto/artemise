package store

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"

	"github.com/lucsb/artemise/backend/internal/domain"
)

// AgendaVisaoGeral computa o panorama da agenda no período: contagem por status,
// rankings de profissional/procedimento, heatmap de horários e dias movimentados.
func AgendaVisaoGeral(ctx context.Context, tx pgx.Tx, inicio, fim time.Time) (domain.AgendaVisaoGeral, error) {
	var vg domain.AgendaVisaoGeral

	eventos, err := CollectStruct[eventoAgg](ctx, tx, `
		SELECT profissional, procedimento, inicio, status
		FROM eventos_agenda
		WHERE inicio BETWEEN $1 AND $2`,
		inicio, fim,
	)
	if err != nil {
		return vg, err
	}

	profCount := map[string]int{}
	procCount := map[string]int{}
	var horas [24]int
	var dias [7]int

	for _, e := range eventos {
		switch e.Status {
		case "Agendado":
			vg.PorStatus.Agendado++
		case "Confirmado":
			vg.PorStatus.Confirmado++
		case "Não compareceu":
			vg.PorStatus.NaoCompareceu++
		case "Concluído":
			vg.PorStatus.Concluido++
		case "Cancelado":
			vg.PorStatus.Cancelado++
		}
		if n := deref(e.Profissional); n != "" {
			profCount[n]++
		}
		if n := deref(e.Procedimento); n != "" {
			procCount[n]++
		}
		horas[e.Inicio.Hour()]++
		dias[int(e.Inicio.Weekday())]++
	}

	vg.RankingsProfissional = topLabels(profCount, nil, 10)
	vg.RankingsProcedimento = topLabels(procCount, nil, 10)

	vg.HorariosMovimentados = make([]domain.HorarioMovimentado, 24)
	for h := 0; h < 24; h++ {
		vg.HorariosMovimentados[h] = domain.HorarioMovimentado{Hora: h, Total: horas[h]}
	}
	vg.DiasMovimentados = make([]domain.DiaTotal, 7)
	for d := 0; d < 7; d++ {
		vg.DiasMovimentados[d] = domain.DiaTotal{Dia: labelDiaSemana[d], Total: dias[d]}
	}
	return vg, nil
}

// AgendaRelatorioFiltros — filtros opcionais do relatório paginado.
type AgendaRelatorioFiltros struct {
	DataIni        *time.Time
	DataFim        *time.Time
	Status         string
	ProfissionalID string
	PacienteID     string
}

// AgendaRelatorio lista eventos paginados aplicando os filtros. Retorna os
// itens da página e o total (sem paginação) para o frontend.
func AgendaRelatorio(ctx context.Context, tx pgx.Tx, f AgendaRelatorioFiltros, p ListParams) ([]domain.EventoAgenda, int, error) {
	var where []string
	var args []any
	add := func(cond string, val any) {
		args = append(args, val)
		where = append(where, fmt.Sprintf(cond, len(args)))
	}
	if f.DataIni != nil {
		add("inicio >= $%d", *f.DataIni)
	}
	if f.DataFim != nil {
		add("inicio <= $%d", *f.DataFim)
	}
	if f.Status != "" {
		add("status = $%d", f.Status)
	}
	if f.ProfissionalID != "" {
		add("profissional_id = $%d", f.ProfissionalID)
	}
	if f.PacienteID != "" {
		add("paciente_id = $%d", f.PacienteID)
	}
	clause := ""
	if len(where) > 0 {
		clause = " WHERE " + strings.Join(where, " AND ")
	}

	var total int
	if err := tx.QueryRow(ctx, "SELECT count(*) FROM eventos_agenda"+clause, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	args = append(args, p.Limit, p.Offset())
	q := fmt.Sprintf(
		"SELECT * FROM eventos_agenda%s ORDER BY inicio DESC LIMIT $%d OFFSET $%d",
		clause, len(args)-1, len(args))
	items, err := CollectStruct[domain.EventoAgenda](ctx, tx, q, args...)
	if err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

// --- Eventos da agenda (CRUD) ---

// EventosList lista eventos numa janela [inicio, fim].
func EventosList(ctx context.Context, tx pgx.Tx, inicio, fim time.Time) ([]domain.EventoAgenda, error) {
	return CollectStruct[domain.EventoAgenda](ctx, tx, `
		SELECT * FROM eventos_agenda
		WHERE inicio >= $1 AND inicio <= $2
		ORDER BY inicio`,
		inicio, fim,
	)
}

// EventosProximos lista os próximos eventos nas próximas 24h (exceto cancelados).
func EventosProximos(ctx context.Context, tx pgx.Tx) ([]domain.EventoAgenda, error) {
	return CollectStruct[domain.EventoAgenda](ctx, tx, `
		SELECT * FROM eventos_agenda
		WHERE inicio BETWEEN now() AND now() + interval '24 hours'
		  AND status <> 'Cancelado'
		ORDER BY inicio LIMIT 20`,
	)
}

// EventoGet busca um evento por id (pgx.ErrNoRows se inexistente).
func EventoGet(ctx context.Context, tx pgx.Tx, id string) (domain.EventoAgenda, error) {
	return GetStruct[domain.EventoAgenda](ctx, tx, `SELECT * FROM eventos_agenda WHERE id = $1`, id)
}

// EventoInput — payload de criação/edição de evento. Campos ponteiro distinguem
// "ausente" de zero-value (permite PATCH parcial).
type EventoInput struct {
	PacienteID     *string    `json:"pacienteId"`
	ProfissionalID *string    `json:"profissionalId"`
	ProcedimentoID *string    `json:"procedimentoId"`
	Paciente       *string    `json:"paciente"`
	Profissional   *string    `json:"profissional"`
	Procedimento   *string    `json:"procedimento"`
	Inicio         *time.Time `json:"inicio"`
	Fim            *time.Time `json:"fim"`
	Status         *string    `json:"status"`
	Tipo           *string    `json:"tipo"`
	Valor          *float64   `json:"valor"`
	Observacoes    *string    `json:"observacoes"`
}

// EventoCreate insere um evento e devolve a linha criada.
func EventoCreate(ctx context.Context, tx pgx.Tx, in EventoInput) (domain.EventoAgenda, error) {
	return GetStruct[domain.EventoAgenda](ctx, tx, `
		INSERT INTO eventos_agenda (
		  clinica_id, paciente_id, profissional_id, procedimento_id,
		  paciente, profissional, procedimento, inicio, fim,
		  status, tipo, valor, observacoes)
		VALUES (
		  current_setting('app.clinica_id')::uuid, $1, $2, $3,
		  $4, $5, $6, $7, $8,
		  COALESCE($9, 'Agendado'), COALESCE($10, 'Agendamento'), $11, $12)
		RETURNING *`,
		in.PacienteID, in.ProfissionalID, in.ProcedimentoID,
		in.Paciente, in.Profissional, in.Procedimento, in.Inicio, in.Fim,
		in.Status, in.Tipo, in.Valor, in.Observacoes,
	)
}

// EventoUpdate aplica um PATCH parcial via COALESCE (só sobrescreve campos
// enviados) e devolve a linha atualizada. pgx.ErrNoRows se o id não existe.
func EventoUpdate(ctx context.Context, tx pgx.Tx, id string, in EventoInput) (domain.EventoAgenda, error) {
	return GetStruct[domain.EventoAgenda](ctx, tx, `
		UPDATE eventos_agenda SET
		  paciente_id     = COALESCE($2, paciente_id),
		  profissional_id = COALESCE($3, profissional_id),
		  procedimento_id = COALESCE($4, procedimento_id),
		  paciente        = COALESCE($5, paciente),
		  profissional    = COALESCE($6, profissional),
		  procedimento    = COALESCE($7, procedimento),
		  inicio          = COALESCE($8, inicio),
		  fim             = COALESCE($9, fim),
		  status          = COALESCE($10, status),
		  tipo            = COALESCE($11, tipo),
		  valor           = COALESCE($12, valor),
		  observacoes     = COALESCE($13, observacoes)
		WHERE id = $1
		RETURNING *`,
		id, in.PacienteID, in.ProfissionalID, in.ProcedimentoID,
		in.Paciente, in.Profissional, in.Procedimento, in.Inicio, in.Fim,
		in.Status, in.Tipo, in.Valor, in.Observacoes,
	)
}

// EventoDelete remove um evento. Retorna o número de linhas afetadas.
func EventoDelete(ctx context.Context, tx pgx.Tx, id string) (int64, error) {
	tag, err := tx.Exec(ctx, `DELETE FROM eventos_agenda WHERE id = $1`, id)
	if err != nil {
		return 0, err
	}
	return tag.RowsAffected(), nil
}
