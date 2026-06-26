package handlers

import (
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
)

// RegisterDashboard registra o endpoint computado do dashboard (RF-52).
func RegisterDashboard(mux *http.ServeMux, a *app.App) {
	mux.HandleFunc("GET /api/dashboard", notImplemented)
}
