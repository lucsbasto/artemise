package handlers

import (
	"log/slog"
	"net/http"
	"time"

	"github.com/lucsb/artemise/backend/internal/app"
	"github.com/lucsb/artemise/backend/internal/respond"
	"github.com/lucsb/artemise/backend/internal/store"
)

// RegisterDashboard registra o endpoint computado do dashboard (RF-52, BK-23).
func RegisterDashboard(mux *http.ServeMux, a *app.App) {
	mux.HandleFunc("GET /api/dashboard", dashboardHandler(a))
}

// dashboardHandler agrega KPIs, balance, fluxo diário, próximos 24h e
// relatórios a partir das tabelas reais. ?inicio=&fim= (YYYY-MM-DD) delimitam o
// período; default = mês corrente até hoje.
func dashboardHandler(_ *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		inicio, fim := periodo(r, "inicio", "fim")

		resp, err := store.Dashboard(r.Context(), tx, inicio, fim, time.Now())
		if err != nil {
			slog.Error("dashboard", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro ao computar dashboard", "INTERNAL")
			return
		}
		respond.JSON(w, http.StatusOK, resp)
	}
}
