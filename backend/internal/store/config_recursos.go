package store

import (
	"context"

	"github.com/lucsb/artemise/backend/internal/domain"
)

// Colunas dos cadastros de configuração (sem atualizado_em no schema).
// modelos_documento não possui coluna `corpo` no schema (001_schema.sql), então
// só nome/tipo/ativo são expostos, conforme o design §3.11.
const (
	FichaColumns  = `id, clinica_id, nome, ativo, criado_em`
	ModeloColumns = `id, clinica_id, nome, tipo, ativo, criado_em`
)

var fichaListSpec = ListSpec{
	Table:       "fichas_atendimento",
	Columns:     FichaColumns,
	SearchCols:  []string{"nome"},
	SortWhite:   map[string]string{"nome": "nome ASC"},
	DefaultSort: "nome ASC",
}

var modeloListSpec = ListSpec{
	Table:       "modelos_documento",
	Columns:     ModeloColumns,
	SearchCols:  []string{"nome", "tipo"},
	SortWhite:   map[string]string{"nome": "nome ASC"},
	DefaultSort: "nome ASC",
}

// ListFichas devolve a página de fichas de atendimento.
func ListFichas(ctx context.Context, db Queryer, p ListParams) ([]domain.FichaAtendimento, int, error) {
	return List[domain.FichaAtendimento](ctx, db, fichaListSpec, p)
}

// ListModelos devolve a página de modelos de documento.
func ListModelos(ctx context.Context, db Queryer, p ListParams) ([]domain.ModeloDocumento, int, error) {
	return List[domain.ModeloDocumento](ctx, db, modeloListSpec, p)
}
