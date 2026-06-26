package store

import (
	"context"

	"github.com/lucsb/artemise/backend/internal/domain"
)

// ListFornecedores devolve a página de fornecedores (mesma forma de contato).
func ListFornecedores(ctx context.Context, db Queryer, p ListParams) ([]domain.Fornecedor, int, error) {
	return List[domain.Fornecedor](ctx, db, contatoListSpec("fornecedores"), p)
}
