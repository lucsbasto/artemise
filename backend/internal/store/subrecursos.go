package store

import (
	"context"

	"github.com/jackc/pgx/v5"
)

// collectLax executa sql e mapeia cada linha para T via RowToStructByNameLax,
// que tolera campos da struct sem coluna correspondente (ex.: sub-coleções
// preenchidas em queries separadas como Itens/Horarios).
func collectLax[T any](ctx context.Context, db Queryer, sql string, args ...any) ([]T, error) {
	rows, err := db.Query(ctx, sql, args...)
	if err != nil {
		return nil, err
	}
	return pgx.CollectRows(rows, pgx.RowToStructByNameLax[T])
}

// getLax é como collectLax mas espera exatamente uma linha. Retorna
// pgx.ErrNoRows quando nada é encontrado.
func getLax[T any](ctx context.Context, db Queryer, sql string, args ...any) (T, error) {
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

// collectScalar coleta uma única coluna escalar por linha (ex.: lista de UUIDs).
func collectScalar[T any](ctx context.Context, db Queryer, sql string, args ...any) ([]T, error) {
	rows, err := db.Query(ctx, sql, args...)
	if err != nil {
		return nil, err
	}
	return pgx.CollectRows(rows, pgx.RowTo[T])
}
