package store

import (
	"context"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5"
)

// CollectStructLax executa sql e mapeia cada linha para T, ignorando campos da
// struct sem coluna correspondente (computados/aninhados como Valor, Itens).
func CollectStructLax[T any](ctx context.Context, db Queryer, sql string, args ...any) ([]T, error) {
	rows, err := db.Query(ctx, sql, args...)
	if err != nil {
		return nil, err
	}
	return pgx.CollectRows(rows, pgx.RowToStructByNameLax[T])
}

// GetStructLax executa sql esperando uma única linha e mapeia para T (lax).
// Retorna pgx.ErrNoRows quando nada é encontrado.
func GetStructLax[T any](ctx context.Context, db Queryer, sql string, args ...any) (T, error) {
	var zero T
	rows, err := db.Query(ctx, sql, args...)
	if err != nil {
		return zero, err
	}
	v, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByNameLax[T])
	if err != nil {
		return zero, err
	}
	return v, nil
}

// ListSpec descreve a listagem de um recurso: tabela, colunas projetadas,
// colunas pesquisáveis por ?q= (ILIKE) e ordenações permitidas (?sort=).
type ListSpec struct {
	Table       string
	Columns     string
	SearchCols  []string
	SortWhite   map[string]string // valor de ?sort= → expressão SQL de ORDER BY
	DefaultSort string
}

// List devolve uma página de T e o total, aplicando busca e ordenação. O filtro
// por clinica_id é responsabilidade do RLS — nunca é adicionado aqui (D-5).
func List[T any](ctx context.Context, db Queryer, spec ListSpec, p ListParams) ([]T, int, error) {
	var (
		where string
		args  []any
	)
	if p.Q != "" && len(spec.SearchCols) > 0 {
		args = append(args, "%"+p.Q+"%")
		conds := make([]string, len(spec.SearchCols))
		for i, c := range spec.SearchCols {
			conds[i] = c + " ILIKE $1"
		}
		where = " WHERE " + strings.Join(conds, " OR ")
	}

	countRows, err := db.Query(ctx, "SELECT count(*) FROM "+spec.Table+where, args...)
	if err != nil {
		return nil, 0, err
	}
	total, err := pgx.CollectExactlyOneRow(countRows, pgx.RowTo[int])
	if err != nil {
		return nil, 0, err
	}

	order := spec.DefaultSort
	if o, ok := spec.SortWhite[p.Sort]; ok && p.Sort != "" {
		order = o
	}

	limPos := len(args) + 1
	offPos := len(args) + 2
	args = append(args, p.Limit, p.Offset())
	sql := fmt.Sprintf("SELECT %s FROM %s%s ORDER BY %s LIMIT $%d OFFSET $%d",
		spec.Columns, spec.Table, where, order, limPos, offPos)

	items, err := CollectStructLax[T](ctx, db, sql, args...)
	if err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

// GetByID busca uma linha por id (RLS aplica o tenant). pgx.ErrNoRows se ausente.
func GetByID[T any](ctx context.Context, db Queryer, table, columns, id string) (T, error) {
	return GetStructLax[T](ctx, db,
		fmt.Sprintf("SELECT %s FROM %s WHERE id = $1", columns, table), id)
}

// Insert cria uma linha em table: define clinica_id a partir do contexto RLS
// (WITH CHECK das policies garante o tenant) e devolve a linha criada em T.
func Insert[T any](ctx context.Context, db Queryer, table string, cols []string, vals []any, returning string) (T, error) {
	allCols := append([]string{"clinica_id"}, cols...)
	ph := make([]string, len(allCols))
	ph[0] = "current_setting('app.clinica_id')::uuid"
	for i := range vals {
		ph[i+1] = fmt.Sprintf("$%d", i+1)
	}
	sql := fmt.Sprintf("INSERT INTO %s (%s) VALUES (%s) RETURNING %s",
		table, strings.Join(allCols, ", "), strings.Join(ph, ", "), returning)
	return GetStructLax[T](ctx, db, sql, vals...)
}

// Update aplica um UPDATE parcial (apenas as colunas informadas) por id e
// devolve a linha atualizada. Sem colunas, apenas relê a linha atual.
func Update[T any](ctx context.Context, db Queryer, table string, cols []string, vals []any, id, returning string) (T, error) {
	if len(cols) == 0 {
		return GetByID[T](ctx, db, table, returning, id)
	}
	sets := make([]string, len(cols))
	for i, c := range cols {
		sets[i] = fmt.Sprintf("%s = $%d", c, i+1)
	}
	args := append(append([]any{}, vals...), id)
	sql := fmt.Sprintf("UPDATE %s SET %s WHERE id = $%d RETURNING %s",
		table, strings.Join(sets, ", "), len(cols)+1, returning)
	return GetStructLax[T](ctx, db, sql, args...)
}

// DeleteByID remove a linha por id; false quando nada foi removido (404/RLS).
func DeleteByID(ctx context.Context, tx pgx.Tx, table, id string) (bool, error) {
	tag, err := tx.Exec(ctx, fmt.Sprintf("DELETE FROM %s WHERE id = $1", table), id)
	if err != nil {
		return false, err
	}
	return tag.RowsAffected() > 0, nil
}

// Toggle inverte a coluna booleana col da linha id e devolve a linha em T.
func Toggle[T any](ctx context.Context, tx pgx.Tx, table, col, id, returning string) (T, error) {
	return GetStructLax[T](ctx, tx,
		fmt.Sprintf("UPDATE %s SET %s = NOT %s WHERE id = $1 RETURNING %s", table, col, col, returning), id)
}
