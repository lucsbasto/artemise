package handlers

import (
	"log/slog"
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
	"github.com/lucsb/artemise/backend/internal/respond"
	"github.com/lucsb/artemise/backend/internal/store"
)

// RegisterFinanceiroReports registra os relatórios financeiros computados
// (RF-55..63; BK-25, BK-26).
func RegisterFinanceiroReports(mux *http.ServeMux, a *app.App) {
	mux.HandleFunc("GET /api/financeiro/extrato", financeiroExtrato(a))
	mux.HandleFunc("GET /api/financeiro/competencia", financeiroCompetencia(a))
	// BK-26 (implementados na task seguinte).
	mux.HandleFunc("GET /api/financeiro/fluxo", notImplemented)
	mux.HandleFunc("GET /api/financeiro/categorias", notImplemented)
	mux.HandleFunc("GET /api/financeiro/contas-receber", notImplemented)
	mux.HandleFunc("GET /api/financeiro/contas-pagar", notImplemented)
	mux.HandleFunc("GET /api/financeiro/comissoes", notImplemented)
}

// financeiroExtrato — ?data_ini=&data_fim= (default mês corrente).
func financeiroExtrato(_ *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		inicio, fim := periodo(r, "data_ini", "data_fim")
		resp, err := store.Extrato(r.Context(), tx, inicio, fim)
		if err != nil {
			slog.Error("financeiro: extrato", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro ao computar extrato", "INTERNAL")
			return
		}
		respond.JSON(w, http.StatusOK, resp)
	}
}

// financeiroCompetencia — ?mes=YYYY-MM (default mês corrente).
func financeiroCompetencia(_ *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		resp, err := store.Competencia(r.Context(), tx, mesRef(r, "mes"))
		if err != nil {
			slog.Error("financeiro: competência", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro ao computar competência", "INTERNAL")
			return
		}
		respond.JSON(w, http.StatusOK, resp)
	}
}
