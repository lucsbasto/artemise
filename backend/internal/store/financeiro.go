package store

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"

	"github.com/lucsb/artemise/backend/internal/domain"
)

// extratoKPIs computa os indicadores de receita/despesa (aberto vs realizado)
// para o intervalo [inicio, fim].
func extratoKPIs(ctx context.Context, tx pgx.Tx, inicio, fim time.Time) (domain.ExtratoKPIs, error) {
	var k domain.ExtratoKPIs
	err := tx.QueryRow(ctx, `
		SELECT
		  COALESCE(SUM(valor) FILTER (WHERE tipo='receita' AND situacao IN ('Em aberto','Em atraso')), 0),
		  COALESCE(SUM(valor) FILTER (WHERE tipo='receita' AND situacao IN ('Recebido','Pago')), 0),
		  COALESCE(SUM(valor) FILTER (WHERE tipo='despesa' AND situacao IN ('Em aberto','Em atraso')), 0),
		  COALESCE(SUM(valor) FILTER (WHERE tipo='despesa' AND situacao IN ('Recebido','Pago')), 0)
		FROM lancamentos_financeiros
		WHERE vencimento BETWEEN $1 AND $2`,
		inicio, fim,
	).Scan(&k.ReceitasAbertas, &k.ReceitasRealizadas, &k.DespesasAbertas, &k.DespesasRealizadas)
	if err != nil {
		return k, err
	}
	k.TotalPeriodo = k.ReceitasRealizadas - k.DespesasRealizadas
	return k, nil
}

// lancamentosPeriodo lista os lançamentos do intervalo ordenados por vencimento.
func lancamentosPeriodo(ctx context.Context, tx pgx.Tx, inicio, fim time.Time) ([]domain.LancamentoFinanceiro, error) {
	return CollectStruct[domain.LancamentoFinanceiro](ctx, tx, `
		SELECT * FROM lancamentos_financeiros
		WHERE vencimento BETWEEN $1 AND $2
		ORDER BY vencimento, criado_em`,
		inicio, fim,
	)
}

// Extrato — GET /api/financeiro/extrato: KPIs + lançamentos do período.
func Extrato(ctx context.Context, tx pgx.Tx, inicio, fim time.Time) (domain.ExtratoResponse, error) {
	var resp domain.ExtratoResponse
	kpis, err := extratoKPIs(ctx, tx, inicio, fim)
	if err != nil {
		return resp, err
	}
	items, err := lancamentosPeriodo(ctx, tx, inicio, fim)
	if err != nil {
		return resp, err
	}
	resp.KPIs = kpis
	resp.Items = items
	return resp, nil
}

// Competencia — GET /api/financeiro/competencia: KPIs + lançamentos do mês +
// totais bruto/líquido. mes é o primeiro dia do mês de referência.
func Competencia(ctx context.Context, tx pgx.Tx, mes time.Time) (domain.CompetenciaResponse, error) {
	var resp domain.CompetenciaResponse
	inicio := mes
	fim := mes.AddDate(0, 1, 0).Add(-time.Nanosecond)

	kpis, err := extratoKPIs(ctx, tx, inicio, fim)
	if err != nil {
		return resp, err
	}
	items, err := lancamentosPeriodo(ctx, tx, inicio, fim)
	if err != nil {
		return resp, err
	}
	resp.KPIs = kpis
	resp.Items = items
	resp.Totais = domain.CompetenciaTotais{
		Bruto:   kpis.ReceitasRealizadas + kpis.ReceitasAbertas,
		Liquido: kpis.TotalPeriodo,
	}
	return resp, nil
}
