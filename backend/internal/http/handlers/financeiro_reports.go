package handlers

import (
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
)

// RegisterFinanceiroReports registra os relatórios financeiros computados
// (RF-55..63).
func RegisterFinanceiroReports(mux *http.ServeMux, a *app.App) {
	mux.HandleFunc("GET /api/financeiro/extrato", notImplemented)
	mux.HandleFunc("GET /api/financeiro/competencia", notImplemented)
	mux.HandleFunc("GET /api/financeiro/fluxo", notImplemented)
	mux.HandleFunc("GET /api/financeiro/categorias", notImplemented)
	mux.HandleFunc("GET /api/financeiro/contas-receber", notImplemented)
	mux.HandleFunc("GET /api/financeiro/contas-pagar", notImplemented)
	mux.HandleFunc("GET /api/financeiro/comissoes", notImplemented)
}
