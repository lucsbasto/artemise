package store

import (
	"context"

	"github.com/lucsb/artemise/backend/internal/domain"
)

// EstoqueColumns são as colunas de itens_estoque projetadas (a coluna ativo
// existe no schema mas não é exposta no JSON; valor/estoqueBaixo são computados).
const EstoqueColumns = `id, clinica_id, nome, sku, categoria, unidade, saldo, minimo, custo, criado_em, atualizado_em`

var estoqueListSpec = ListSpec{
	Table:      "itens_estoque",
	Columns:    EstoqueColumns,
	SearchCols: []string{"nome", "sku", "categoria"},
	SortWhite: map[string]string{
		"nome":  "nome ASC",
		"saldo": "saldo ASC",
	},
	DefaultSort: "nome ASC",
}

// computeEstoque preenche os campos calculados: valor = saldo*custo e
// estoqueBaixo = saldo <= minimo.
func computeEstoque(it *domain.ItemEstoque) {
	it.Valor = it.Saldo * it.Custo
	it.EstoqueBaixo = it.Saldo <= it.Minimo
}

// ListEstoque devolve a página de itens de estoque com valores computados.
func ListEstoque(ctx context.Context, db Queryer, p ListParams) ([]domain.ItemEstoque, int, error) {
	items, total, err := List[domain.ItemEstoque](ctx, db, estoqueListSpec, p)
	if err != nil {
		return nil, 0, err
	}
	for i := range items {
		computeEstoque(&items[i])
	}
	return items, total, nil
}

// GetEstoque busca um item de estoque por id com valores computados.
func GetEstoque(ctx context.Context, db Queryer, id string) (domain.ItemEstoque, error) {
	it, err := GetByID[domain.ItemEstoque](ctx, db, "itens_estoque", EstoqueColumns, id)
	if err != nil {
		return it, err
	}
	computeEstoque(&it)
	return it, nil
}

// CreateEstoque insere um item e devolve-o com valores computados.
func CreateEstoque(ctx context.Context, db Queryer, cols []string, vals []any) (domain.ItemEstoque, error) {
	it, err := Insert[domain.ItemEstoque](ctx, db, "itens_estoque", cols, vals, EstoqueColumns)
	if err != nil {
		return it, err
	}
	computeEstoque(&it)
	return it, nil
}

// UpdateEstoque aplica um update parcial e devolve o item com valores computados.
func UpdateEstoque(ctx context.Context, db Queryer, cols []string, vals []any, id string) (domain.ItemEstoque, error) {
	it, err := Update[domain.ItemEstoque](ctx, db, "itens_estoque", cols, vals, id, EstoqueColumns)
	if err != nil {
		return it, err
	}
	computeEstoque(&it)
	return it, nil
}
