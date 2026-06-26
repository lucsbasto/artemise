// Package db abre o pool de conexões pgx e roda as migrations SQL.
package db

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/jackc/pgx/v5/pgxpool"
)

// New abre um pgxpool a partir da connection string e valida com Ping.
// Loga "db ok" em caso de sucesso.
func New(ctx context.Context, url string) (*pgxpool.Pool, error) {
	pool, err := pgxpool.New(ctx, url)
	if err != nil {
		return nil, fmt.Errorf("db: abrir pool: %w", err)
	}
	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("db: ping: %w", err)
	}
	slog.Info("db ok")
	return pool, nil
}
