package store

import (
	"context"

	"github.com/lucsb/artemise/backend/internal/domain"
)

// ProcedimentoColumns são as colunas de procedimentos (struct domain.Procedimento).
const ProcedimentoColumns = `id, clinica_id, nome, categoria, duracao_min, valor, ativo,
	usa_mapa, cor, criado_em, atualizado_em`

var procedimentoListSpec = ListSpec{
	Table:      "procedimentos",
	Columns:    ProcedimentoColumns,
	SearchCols: []string{"nome", "categoria"},
	SortWhite: map[string]string{
		"nome":      "nome ASC",
		"categoria": "categoria ASC NULLS LAST, nome ASC",
		"valor":     "valor ASC",
	},
	DefaultSort: "nome ASC",
}

// ListProcedimentos devolve a página de procedimentos e o total.
func ListProcedimentos(ctx context.Context, db Queryer, p ListParams) ([]domain.Procedimento, int, error) {
	return List[domain.Procedimento](ctx, db, procedimentoListSpec, p)
}
