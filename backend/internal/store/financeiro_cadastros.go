package store

import (
	"context"

	"github.com/lucsb/artemise/backend/internal/domain"
)

// Colunas dos três cadastros financeiros (casam as structs domain).
const (
	ContaColumns     = `id, clinica_id, nome, tipo, saldo, icon, ativo, criado_em, atualizado_em`
	CategoriaColumns = `id, clinica_id, descricao, ativo, parent_id, criado_em, atualizado_em`
	MetodoColumns    = `id, clinica_id, descricao, tipo, marca, ativo, criado_em, atualizado_em`
)

var contaListSpec = ListSpec{
	Table:       "contas_financeiras",
	Columns:     ContaColumns,
	SearchCols:  []string{"nome", "tipo"},
	SortWhite:   map[string]string{"nome": "nome ASC"},
	DefaultSort: "nome ASC",
}

var metodoListSpec = ListSpec{
	Table:       "metodos_pagamento",
	Columns:     MetodoColumns,
	SearchCols:  []string{"descricao", "tipo"},
	SortWhite:   map[string]string{"descricao": "descricao ASC"},
	DefaultSort: "descricao ASC",
}

// ListContas devolve a página de contas financeiras.
func ListContas(ctx context.Context, db Queryer, p ListParams) ([]domain.ContaFinanceira, int, error) {
	return List[domain.ContaFinanceira](ctx, db, contaListSpec, p)
}

// ListMetodos devolve a página de métodos de pagamento.
func ListMetodos(ctx context.Context, db Queryer, p ListParams) ([]domain.MetodoPagamento, int, error) {
	return List[domain.MetodoPagamento](ctx, db, metodoListSpec, p)
}

// CategoriasArvore devolve as categorias como árvore pai→filhos (2 níveis):
// raízes (parent_id nulo) com seus filhos aninhados em Filhos.
func CategoriasArvore(ctx context.Context, db Queryer) ([]domain.CategoriaConta, error) {
	all, err := CollectStructLax[domain.CategoriaConta](ctx, db,
		"SELECT "+CategoriaColumns+" FROM categorias_contas ORDER BY descricao")
	if err != nil {
		return nil, err
	}

	roots := make([]domain.CategoriaConta, 0)
	for i := range all {
		if all[i].ParentID == nil {
			roots = append(roots, all[i])
		}
	}
	// id da raiz → índice em roots, para anexar os filhos.
	rootIdx := make(map[string]int, len(roots))
	for i := range roots {
		rootIdx[roots[i].ID] = i
	}
	for i := range all {
		c := all[i]
		if c.ParentID == nil {
			continue
		}
		if ri, ok := rootIdx[*c.ParentID]; ok {
			roots[ri].Filhos = append(roots[ri].Filhos, c)
		}
	}
	return roots, nil
}
