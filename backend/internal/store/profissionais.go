package store

import (
	"context"

	"github.com/lucsb/artemise/backend/internal/domain"
)

// ContatoColumns são as colunas comuns a profissionais e fornecedores (struct
// domain.Contato).
const ContatoColumns = `id, clinica_id, nome, tipo, etiquetas, identificador, ativo,
	avatar_tone, criado_em, atualizado_em`

// contatoListSpec monta a listagem de uma tabela com a forma de contato.
func contatoListSpec(table string) ListSpec {
	return ListSpec{
		Table:       table,
		Columns:     ContatoColumns,
		SearchCols:  []string{"nome", "identificador"},
		SortWhite:   map[string]string{"nome": "nome ASC"},
		DefaultSort: "nome ASC",
	}
}

// ListProfissionais devolve a página de profissionais (identificação básica).
func ListProfissionais(ctx context.Context, db Queryer, p ListParams) ([]domain.Profissional, int, error) {
	return List[domain.Profissional](ctx, db, contatoListSpec("profissionais"), p)
}
