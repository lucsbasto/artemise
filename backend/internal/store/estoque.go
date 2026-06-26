package store

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"

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

// SaldoInsuficiente reporta qual item barrou um débito de estoque e o saldo
// atualmente disponível, para compor o aviso 409 (BK-22 / RF-39).
type SaldoInsuficiente struct {
	ItemID string  `json:"itemId"`
	Saldo  float64 `json:"saldoAtual"`
}

// AjustarSaldo aplica `delta` ao saldo de um item dentro da transação RLS do
// request (delta > 0 debita, delta < 0 credita/estorna). Usa UPDATE guardado:
// a cláusula `saldo >= delta` impede saldo negativo de forma atômica — quando o
// débito excederia o saldo, 0 linhas são afetadas (ok=false) sem alterar nada e
// o saldo atual é lido para o aviso. Créditos (delta < 0) nunca são barrados
// pela guarda. Item inexistente ⇒ ok=false com saldo 0.
func AjustarSaldo(ctx context.Context, tx pgx.Tx, itemID string, delta float64) (saldo float64, ok bool, err error) {
	err = tx.QueryRow(ctx, `
		UPDATE itens_estoque SET saldo = saldo - $2
		WHERE id = $1 AND saldo >= $2
		RETURNING saldo`, itemID, delta).Scan(&saldo)
	if err == nil {
		return saldo, true, nil
	}
	if !errors.Is(err, pgx.ErrNoRows) {
		return 0, false, err
	}
	// 0 linhas: saldo insuficiente ou item inexistente. Lê o saldo atual para o
	// aviso; ausência (item removido) é tratada como saldo 0.
	if err = tx.QueryRow(ctx, `SELECT saldo FROM itens_estoque WHERE id = $1`, itemID).Scan(&saldo); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return 0, false, nil
		}
		return 0, false, err
	}
	return saldo, false, nil
}

// AplicarDelta aplica cada variação de DeltaEstoque na transação. Débitos
// (delta > 0) são guardados: se algum exceder o saldo, retorna o item barrado
// (falta != nil) sem tentar os demais — o caller deve dar rollback e responder
// 409. Créditos (delta < 0, estorno) sempre se aplicam, mesmo que o item tenha
// sido removido (no-op silencioso).
func AplicarDelta(ctx context.Context, tx pgx.Tx, delta domain.DeltaEstoque) (*SaldoInsuficiente, error) {
	for sub, d := range delta {
		if d == 0 {
			continue
		}
		saldo, ok, err := AjustarSaldo(ctx, tx, sub, d)
		if err != nil {
			return nil, err
		}
		if !ok && d > 0 {
			return &SaldoInsuficiente{ItemID: sub, Saldo: saldo}, nil
		}
	}
	return nil, nil
}
