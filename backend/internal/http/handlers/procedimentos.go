package handlers

import (
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
)

// RegisterProcedimentos registra as rotas de procedimentos (RF-18, RF-19).
func RegisterProcedimentos(mux *http.ServeMux, a *app.App) {
	mux.HandleFunc("GET /api/procedimentos", notImplemented)
	mux.HandleFunc("POST /api/procedimentos", notImplemented)
	mux.HandleFunc("GET /api/procedimentos/{id}", notImplemented)
	mux.HandleFunc("PATCH /api/procedimentos/{id}", notImplemented)
	mux.HandleFunc("DELETE /api/procedimentos/{id}", notImplemented)
	mux.HandleFunc("PATCH /api/procedimentos/{id}/toggle", notImplemented)
}
