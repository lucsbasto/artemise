// Command server sobe a API HTTP da Clínica Experts.
package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/lucsb/artemise/backend/internal/app"
	"github.com/lucsb/artemise/backend/internal/config"
	"github.com/lucsb/artemise/backend/internal/db"
	httpapi "github.com/lucsb/artemise/backend/internal/http"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		slog.Error("config", "err", err)
		os.Exit(1)
	}

	// Contexto cancelado em SIGINT/SIGTERM para o shutdown gracioso.
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	pool, err := db.New(ctx, cfg.DatabaseURL)
	if err != nil {
		slog.Error("db", "err", err)
		os.Exit(1)
	}
	defer pool.Close()

	a := &app.App{Pool: pool, Cfg: cfg}
	srv := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           httpapi.NewRouter(a),
		ReadHeaderTimeout: 10 * time.Second,
	}

	go func() {
		slog.Info("server: ouvindo", "port", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("server: listen", "err", err)
			stop()
		}
	}()

	<-ctx.Done()
	slog.Info("server: sinal recebido, encerrando")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(shutdownCtx); err != nil {
		slog.Error("server: shutdown", "err", err)
		os.Exit(1)
	}
	slog.Info("shutdown ok")
}
