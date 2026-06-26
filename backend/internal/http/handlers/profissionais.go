package handlers

import (
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
)

// RegisterProfissionais registra as rotas de profissionais (RF-13, RF-15).
func RegisterProfissionais(mux *http.ServeMux, a *app.App) {
	mux.HandleFunc("GET /api/profissionais", notImplemented)
	mux.HandleFunc("POST /api/profissionais", notImplemented)
	mux.HandleFunc("GET /api/profissionais/{id}", notImplemented)
	mux.HandleFunc("PATCH /api/profissionais/{id}", notImplemented)
	mux.HandleFunc("DELETE /api/profissionais/{id}", notImplemented)
	mux.HandleFunc("PATCH /api/profissionais/{id}/toggle", notImplemented)
}
