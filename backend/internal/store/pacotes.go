package store

import (
	"context"

	"github.com/jackc/pgx/v5"

	"github.com/lucsb/artemise/backend/internal/domain"
)

// PacoteColumns são as colunas base de pacotes (sem os itens, carregados à parte).
const PacoteColumns = `id, clinica_id, descricao, valor_total, validade, ativo, criado_em, atualizado_em`

// PacoteItemColumns são as colunas de pacote_itens (struct domain.PacoteItem).
const PacoteItemColumns = `id, pacote_id, nome, procedimento_id, qtd, preco_unitario, desconto, total`

var pacoteListSpec = ListSpec{
	Table:       "pacotes",
	Columns:     PacoteColumns,
	SearchCols:  []string{"descricao"},
	SortWhite:   map[string]string{"descricao": "descricao ASC", "valor": "valor_total ASC"},
	DefaultSort: "descricao ASC",
}

// ListPacotes devolve a página de pacotes (sem itens; ver GetPacote).
func ListPacotes(ctx context.Context, db Queryer, p ListParams) ([]domain.Pacote, int, error) {
	return List[domain.Pacote](ctx, db, pacoteListSpec, p)
}

// itensDoPacote carrega os itens de um pacote ordenados por nome.
func itensDoPacote(ctx context.Context, db Queryer, pacoteID string) ([]domain.PacoteItem, error) {
	itens, err := CollectStructLax[domain.PacoteItem](ctx, db,
		"SELECT "+PacoteItemColumns+" FROM pacote_itens WHERE pacote_id = $1 ORDER BY nome", pacoteID)
	if err != nil {
		return nil, err
	}
	if itens == nil {
		itens = []domain.PacoteItem{}
	}
	return itens, nil
}

// GetPacote busca um pacote por id com seus itens (JOIN via segunda query).
func GetPacote(ctx context.Context, db Queryer, id string) (domain.Pacote, error) {
	p, err := GetByID[domain.Pacote](ctx, db, "pacotes", PacoteColumns, id)
	if err != nil {
		return p, err
	}
	p.Itens, err = itensDoPacote(ctx, db, id)
	return p, err
}

// CreatePacote insere o pacote e seus itens na mesma transação e devolve o
// pacote completo. clinica_id vem do contexto RLS (current_setting).
func CreatePacote(ctx context.Context, tx pgx.Tx, cols []string, vals []any, itens []domain.PacoteItem) (domain.Pacote, error) {
	p, err := Insert[domain.Pacote](ctx, tx, "pacotes", cols, vals, PacoteColumns)
	if err != nil {
		return p, err
	}
	for _, it := range itens {
		if _, err := tx.Exec(ctx, `
			INSERT INTO pacote_itens
				(clinica_id, pacote_id, nome, procedimento_id, qtd, preco_unitario, desconto, total)
			VALUES (current_setting('app.clinica_id')::uuid, $1, $2, $3, $4, $5, $6, $7)`,
			p.ID, it.Nome, it.ProcedimentoID, it.Qtd, it.PrecoUnitario, it.Desconto, it.Total,
		); err != nil {
			return p, err
		}
	}
	p.Itens, err = itensDoPacote(ctx, tx, p.ID)
	return p, err
}
