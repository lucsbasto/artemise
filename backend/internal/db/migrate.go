package db

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// migration representa um arquivo NNN_*.sql dividido em seções up/down.
type migration struct {
	version string // nome do arquivo (ex.: "001_schema.sql")
	up      string
	down    string
}

const (
	markerUp   = "-- migrate:up"
	markerDown = "-- migrate:down"
)

// loadMigrations lê todos os *.sql de dir em ordem lexicográfica e separa as
// seções "-- migrate:up" / "-- migrate:down" de cada arquivo.
func loadMigrations(dir string) ([]migration, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return nil, fmt.Errorf("migrate: ler dir %q: %w", dir, err)
	}
	var files []string
	for _, e := range entries {
		if !e.IsDir() && strings.HasSuffix(e.Name(), ".sql") {
			files = append(files, e.Name())
		}
	}
	sort.Strings(files)

	migs := make([]migration, 0, len(files))
	for _, name := range files {
		raw, err := os.ReadFile(filepath.Join(dir, name))
		if err != nil {
			return nil, fmt.Errorf("migrate: ler %q: %w", name, err)
		}
		up, down, err := splitSections(string(raw))
		if err != nil {
			return nil, fmt.Errorf("migrate: %q: %w", name, err)
		}
		migs = append(migs, migration{version: name, up: up, down: down})
	}
	return migs, nil
}

// splitSections extrai o conteúdo entre os marcadores up/down.
func splitSections(content string) (up, down string, err error) {
	iUp := strings.Index(content, markerUp)
	if iUp < 0 {
		return "", "", fmt.Errorf("marcador %q ausente", markerUp)
	}
	iDown := strings.Index(content, markerDown)
	if iDown < 0 {
		// Sem seção down: tudo após up é considerado up.
		return strings.TrimSpace(content[iUp+len(markerUp):]), "", nil
	}
	up = strings.TrimSpace(content[iUp+len(markerUp) : iDown])
	down = strings.TrimSpace(content[iDown+len(markerDown):])
	return up, down, nil
}

// ensureMigrationsTable cria schema_migrations se ainda não existir.
func ensureMigrationsTable(ctx context.Context, pool *pgxpool.Pool) error {
	_, err := pool.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS schema_migrations (
			version     TEXT PRIMARY KEY,
			aplicado_em TIMESTAMPTZ NOT NULL DEFAULT now()
		)`)
	if err != nil {
		return fmt.Errorf("migrate: criar schema_migrations: %w", err)
	}
	return nil
}

// appliedVersions retorna o conjunto de versões já aplicadas.
func appliedVersions(ctx context.Context, pool *pgxpool.Pool) (map[string]bool, error) {
	rows, err := pool.Query(ctx, `SELECT version FROM schema_migrations`)
	if err != nil {
		return nil, fmt.Errorf("migrate: listar aplicadas: %w", err)
	}
	defer rows.Close()
	applied := map[string]bool{}
	for rows.Next() {
		var v string
		if err := rows.Scan(&v); err != nil {
			return nil, err
		}
		applied[v] = true
	}
	return applied, rows.Err()
}

// MigrateUp aplica todas as migrations pendentes em ordem ascendente. Cada
// arquivo roda em sua própria transação; idempotente (pula já aplicadas).
func MigrateUp(ctx context.Context, pool *pgxpool.Pool, dir string) error {
	if err := ensureMigrationsTable(ctx, pool); err != nil {
		return err
	}
	migs, err := loadMigrations(dir)
	if err != nil {
		return err
	}
	applied, err := appliedVersions(ctx, pool)
	if err != nil {
		return err
	}

	for _, m := range migs {
		if applied[m.version] {
			slog.Info("migrate: skip", "version", m.version)
			continue
		}
		if err := applyInTx(ctx, pool, m.up, func(tx pgx.Tx) error {
			_, e := tx.Exec(ctx, `INSERT INTO schema_migrations (version) VALUES ($1)`, m.version)
			return e
		}); err != nil {
			return fmt.Errorf("migrate up %q: %w", m.version, err)
		}
		slog.Info("migrate: aplicada", "version", m.version)
	}
	return nil
}

// MigrateDown reverte todas as migrations aplicadas em ordem descendente.
func MigrateDown(ctx context.Context, pool *pgxpool.Pool, dir string) error {
	if err := ensureMigrationsTable(ctx, pool); err != nil {
		return err
	}
	migs, err := loadMigrations(dir)
	if err != nil {
		return err
	}
	applied, err := appliedVersions(ctx, pool)
	if err != nil {
		return err
	}

	for i := len(migs) - 1; i >= 0; i-- {
		m := migs[i]
		if !applied[m.version] {
			continue
		}
		if strings.TrimSpace(m.down) == "" {
			slog.Warn("migrate: sem seção down, pulando", "version", m.version)
		}
		if err := applyInTx(ctx, pool, m.down, func(tx pgx.Tx) error {
			_, e := tx.Exec(ctx, `DELETE FROM schema_migrations WHERE version = $1`, m.version)
			return e
		}); err != nil {
			return fmt.Errorf("migrate down %q: %w", m.version, err)
		}
		slog.Info("migrate: revertida", "version", m.version)
	}
	return nil
}

// applyInTx executa o SQL da migration e, na mesma transação, o bookkeeping de
// schema_migrations. Faz rollback em qualquer erro.
func applyInTx(ctx context.Context, pool *pgxpool.Pool, sqlText string, bookkeep func(pgx.Tx) error) error {
	tx, err := pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx) //nolint:errcheck // rollback é no-op após commit

	if strings.TrimSpace(sqlText) != "" {
		if _, err := tx.Exec(ctx, sqlText); err != nil {
			return err
		}
	}
	if err := bookkeep(tx); err != nil {
		return err
	}
	return tx.Commit(ctx)
}
