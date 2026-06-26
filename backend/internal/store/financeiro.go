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

// fluxoBucket é a agregação por bucket (dia ou mês) — saídas chegam positivas.
type fluxoBucket struct {
	Bucket    time.Time `db:"bucket"`
	Entradas  float64   `db:"entradas"`
	SaidasPos float64   `db:"saidas_pos"`
}

// FluxoMensal — 12 meses (Jan..Dez) do ano de ref, com saldo encadeado.
func FluxoMensal(ctx context.Context, tx pgx.Tx, ref time.Time) ([]domain.FluxoRow, error) {
	rows, err := CollectStruct[fluxoBucket](ctx, tx, `
		SELECT date_trunc('month', vencimento) AS bucket,
		  COALESCE(SUM(valor) FILTER (WHERE tipo='receita'), 0) AS entradas,
		  COALESCE(SUM(valor) FILTER (WHERE tipo='despesa'), 0) AS saidas_pos
		FROM lancamentos_financeiros
		WHERE date_trunc('year', vencimento) = date_trunc('year', $1::date)
		GROUP BY bucket`,
		ref.Format("2006-01-02"),
	)
	if err != nil {
		return nil, err
	}
	porMes := map[int]fluxoBucket{}
	for _, r := range rows {
		porMes[int(r.Bucket.Month())] = r
	}
	points := make([]domain.CashflowPoint, 12)
	for m := 1; m <= 12; m++ {
		b := porMes[m]
		mesData := time.Date(ref.Year(), time.Month(m), 1, 0, 0, 0, 0, time.UTC)
		points[m-1] = domain.CashflowPoint{
			Label:    labelMes(mesData),
			Entradas: b.Entradas,
			Saidas:   -b.SaidasPos,
		}
	}
	return domain.FluxoRows(points, 0), nil
}

// FluxoDiario — todos os dias do mês de ref, com saldo encadeado.
func FluxoDiario(ctx context.Context, tx pgx.Tx, ref time.Time) ([]domain.FluxoRow, error) {
	rows, err := CollectStruct[fluxoBucket](ctx, tx, `
		SELECT vencimento::date AS bucket,
		  COALESCE(SUM(valor) FILTER (WHERE tipo='receita'), 0) AS entradas,
		  COALESCE(SUM(valor) FILTER (WHERE tipo='despesa'), 0) AS saidas_pos
		FROM lancamentos_financeiros
		WHERE date_trunc('month', vencimento) = date_trunc('month', $1::date)
		GROUP BY bucket`,
		ref.Format("2006-01-02"),
	)
	if err != nil {
		return nil, err
	}
	porDia := map[int]fluxoBucket{}
	for _, r := range rows {
		porDia[r.Bucket.Day()] = r
	}
	// Número de dias do mês: dia 0 do mês seguinte.
	diasNoMes := time.Date(ref.Year(), ref.Month()+1, 0, 0, 0, 0, 0, time.UTC).Day()
	points := make([]domain.CashflowPoint, diasNoMes)
	for d := 1; d <= diasNoMes; d++ {
		b := porDia[d]
		diaData := time.Date(ref.Year(), ref.Month(), d, 0, 0, 0, 0, time.UTC)
		points[d-1] = domain.CashflowPoint{
			Label:    labelDia(diaData),
			Entradas: b.Entradas,
			Saidas:   -b.SaidasPos,
		}
	}
	return domain.FluxoRows(points, 0), nil
}

// catRow é a soma de lançamentos de um tipo por categoria, no mês.
type catRow struct {
	ID        string  `db:"id"`
	Descricao string  `db:"descricao"`
	ParentID  *string `db:"parent_id"`
	Valor     float64 `db:"valor"`
}

// Categorias — GET /api/financeiro/categorias: árvores receitas e despesas com
// percentual sobre o grupo, no mês de ref.
func Categorias(ctx context.Context, tx pgx.Tx, mes time.Time) (domain.CategoriasResponse, error) {
	var resp domain.CategoriasResponse
	ref := mes.Format("2006-01-02")

	receitas, err := categoriasPorTipo(ctx, tx, "receita", ref)
	if err != nil {
		return resp, err
	}
	despesas, err := categoriasPorTipo(ctx, tx, "despesa", ref)
	if err != nil {
		return resp, err
	}
	resp.Receitas = receitas
	resp.Despesas = despesas
	return resp, nil
}

func categoriasPorTipo(ctx context.Context, tx pgx.Tx, tipo, ref string) ([]domain.CategoriaReportNode, error) {
	rows, err := CollectStruct[catRow](ctx, tx, `
		SELECT cc.id, cc.descricao, cc.parent_id,
		  COALESCE(SUM(lf.valor), 0) AS valor
		FROM categorias_contas cc
		LEFT JOIN lancamentos_financeiros lf
		  ON lf.categoria_id = cc.id
		  AND lf.tipo = $2
		  AND date_trunc('month', lf.vencimento) = date_trunc('month', $1::date)
		GROUP BY cc.id, cc.descricao, cc.parent_id`,
		ref, tipo,
	)
	if err != nil {
		return nil, err
	}
	return buildCategoriaTree(rows), nil
}

// buildCategoriaTree monta a árvore pai→filhos (2 níveis), totaliza pais a
// partir dos filhos (TotalNode), descarta nós zerados e calcula o percentual de
// cada nó sobre o total do grupo.
func buildCategoriaTree(rows []catRow) []domain.CategoriaReportNode {
	own := map[string]float64{}
	desc := map[string]string{}
	childrenOf := map[string][]string{}
	var rootIDs []string

	for _, r := range rows {
		own[r.ID] = r.Valor
		desc[r.ID] = r.Descricao
		if r.ParentID != nil {
			childrenOf[*r.ParentID] = append(childrenOf[*r.ParentID], r.ID)
		} else {
			rootIDs = append(rootIDs, r.ID)
		}
	}

	var build func(id string) domain.CategoriaReportNode
	build = func(id string) domain.CategoriaReportNode {
		node := domain.CategoriaReportNode{Nome: desc[id]}
		var childTotal float64
		for _, cid := range childrenOf[id] {
			child := build(cid)
			if child.Valor == 0 {
				continue // descarta filhos zerados
			}
			childTotal += child.Valor
			node.Filhos = append(node.Filhos, child)
		}
		node.Valor = own[id] + childTotal
		return node
	}

	var roots []domain.CategoriaReportNode
	var groupTotal float64
	for _, id := range rootIDs {
		n := build(id)
		if n.Valor == 0 {
			continue
		}
		groupTotal += n.Valor
		roots = append(roots, n)
	}
	aplicarPercentual(roots, groupTotal)
	return roots
}

// aplicarPercentual preenche o percentual de cada nó (e filhos) sobre o total.
func aplicarPercentual(nodes []domain.CategoriaReportNode, total float64) {
	for i := range nodes {
		nodes[i].Percentual = domain.Percentual(nodes[i].Valor, total)
		aplicarPercentual(nodes[i].Filhos, total)
	}
}

// ListLancamentos lista lançamentos de um tipo (receita/despesa) paginados, com
// filtro opcional de situação. Retorna a página e o total. Usado por
// contas-receber e contas-pagar.
func ListLancamentos(ctx context.Context, tx pgx.Tx, tipo, situacao string, p ListParams) ([]domain.LancamentoFinanceiro, int, error) {
	var total int
	if situacao != "" {
		if err := tx.QueryRow(ctx,
			`SELECT count(*) FROM lancamentos_financeiros WHERE tipo=$1 AND situacao=$2`,
			tipo, situacao).Scan(&total); err != nil {
			return nil, 0, err
		}
		items, err := CollectStruct[domain.LancamentoFinanceiro](ctx, tx, `
			SELECT * FROM lancamentos_financeiros
			WHERE tipo=$1 AND situacao=$2
			ORDER BY vencimento, criado_em LIMIT $3 OFFSET $4`,
			tipo, situacao, p.Limit, p.Offset())
		return items, total, err
	}
	if err := tx.QueryRow(ctx,
		`SELECT count(*) FROM lancamentos_financeiros WHERE tipo=$1`, tipo).Scan(&total); err != nil {
		return nil, 0, err
	}
	items, err := CollectStruct[domain.LancamentoFinanceiro](ctx, tx, `
		SELECT * FROM lancamentos_financeiros
		WHERE tipo=$1
		ORDER BY vencimento, criado_em LIMIT $2 OFFSET $3`,
		tipo, p.Limit, p.Offset())
	return items, total, err
}

// registroComissao é um registro realizado usado no cálculo de comissão.
type registroComissao struct {
	ProfissionalID *string `db:"profissional_id"`
	ProcedimentoID *string `db:"procedimento_id"`
	Valor          float64 `db:"valor"`
	Profissional   string  `db:"profissional"`
}

// regraRow é uma regra de comissão de um profissional.
type regraRow struct {
	ProfissionalID string  `db:"profissional_id"`
	ProcedimentoID *string `db:"procedimento_id"`
	Tipo           string  `db:"tipo"`
	Valor          float64 `db:"valor"`
}

// Comissoes — GET /api/financeiro/comissoes: consolida a comissão por
// profissional sobre os registros realizados no período (design §6.3).
func Comissoes(ctx context.Context, tx pgx.Tx, inicio, fim time.Time) ([]domain.ComissaoItem, error) {
	registros, err := CollectStruct[registroComissao](ctx, tx, `
		SELECT rp.profissional_id, rp.procedimento_id, rp.valor,
		       COALESCE(p.nome, rp.profissional) AS profissional
		FROM registros_procedimento rp
		LEFT JOIN profissionais p ON p.id = rp.profissional_id
		WHERE rp.status = 'realizado'
		  AND rp.data BETWEEN $1 AND $2
		  AND rp.profissional_id IS NOT NULL`,
		inicio, fim,
	)
	if err != nil {
		return nil, err
	}

	regras, err := CollectStruct[regraRow](ctx, tx, `
		SELECT profissional_id, procedimento_id, tipo, valor
		FROM profissional_comissoes`,
	)
	if err != nil {
		return nil, err
	}
	regrasPorProf := map[string][]domain.RegraComissao{}
	for _, r := range regras {
		regrasPorProf[r.ProfissionalID] = append(regrasPorProf[r.ProfissionalID], domain.RegraComissao{
			ProcedimentoID: r.ProcedimentoID,
			Tipo:           r.Tipo,
			Valor:          r.Valor,
		})
	}

	type acc struct {
		nome     string
		base     float64
		comissao float64
		qtd      int
	}
	porProf := map[string]*acc{}
	var ordem []string
	for _, reg := range registros {
		pid := deref(reg.ProfissionalID)
		a := porProf[pid]
		if a == nil {
			a = &acc{nome: reg.Profissional}
			porProf[pid] = a
			ordem = append(ordem, pid)
		}
		a.base += reg.Valor
		a.comissao += domain.CalcComissao(reg.Valor, regrasPorProf[pid], deref(reg.ProcedimentoID))
		a.qtd++
	}

	items := make([]domain.ComissaoItem, 0, len(ordem))
	for _, pid := range ordem {
		a := porProf[pid]
		items = append(items, domain.ComissaoItem{
			ProfissionalID: pid,
			Profissional:   a.nome,
			Base:           a.base,
			Comissao:       a.comissao,
			Quantidade:     a.qtd,
		})
	}
	return items, nil
}
