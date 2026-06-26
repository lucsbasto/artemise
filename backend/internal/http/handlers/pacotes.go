package handlers

import (
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
)

// RegisterPacotes registra as rotas de pacotes (RF-20..22).
func RegisterPacotes(mux *http.ServeMux, a *app.App) {
	mux.HandleFunc("GET /api/pacotes", notImplemented)
	mux.HandleFunc("POST /api/pacotes", notImplemented)
	mux.HandleFunc("GET /api/pacotes/{id}", notImplemented)
	mux.HandleFunc("PATCH /api/pacotes/{id}", notImplemented)
	mux.HandleFunc("DELETE /api/pacotes/{id}", notImplemented)
	mux.HandleFunc("PATCH /api/pacotes/{id}/toggle", notImplemented)
}
