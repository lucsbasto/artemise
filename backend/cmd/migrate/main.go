// Command migrate aplica ou reverte as migrations SQL versionadas.
//
// Uso:
//
//	go run ./cmd/migrate up     # aplica pendentes
//	go run ./cmd/migrate down   # reverte aplicadas (ordem inversa)
package main

import (
	"context"
	"fmt"
	"log/slog"
	"os"

	"github.com/lucsb/artemise/backend/internal/config"
	"github.com/lucsb/artemise/backend/internal/db"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Fprintln(os.Stderr, "uso: migrate <up|down>")
		os.Exit(2)
	}
	cmd := os.Args[1]

	cfg, err := config.Load()
	if err != nil {
		slog.Error("config", "err", err)
		os.Exit(1)
	}

	ctx := context.Background()
	pool, err := db.New(ctx, cfg.DatabaseURL)
	if err != nil {
		slog.Error("db", "err", err)
		os.Exit(1)
	}
	defer pool.Close()

	dir := migrationsDir()
	switch cmd {
	case "up":
		err = db.MigrateUp(ctx, pool, dir)
	case "down":
		err = db.MigrateDown(ctx, pool, dir)
	default:
		fmt.Fprintf(os.Stderr, "comando inválido %q (use up|down)\n", cmd)
		os.Exit(2)
	}
	if err != nil {
		slog.Error("migrate", "err", err)
		os.Exit(1)
	}
	slog.Info("migrate: concluído", "cmd", cmd)
}

// migrationsDir resolve o diretório de migrations relativo ao cwd.
func migrationsDir() string {
	if v := os.Getenv("MIGRATIONS_DIR"); v != "" {
		return v
	}
	for _, c := range []string{"migrations", "backend/migrations"} {
		if st, err := os.Stat(c); err == nil && st.IsDir() {
			return c
		}
	}
	return "migrations"
}
