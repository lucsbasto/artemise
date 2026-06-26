package handlers

import (
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
)

// RegisterProfissionalDetalhe registra o perfil rico do profissional (RF-14).
func RegisterProfissionalDetalhe(mux *http.ServeMux, a *app.App) {
	mux.HandleFunc("GET /api/profissionais/{id}/detalhe", notImplemented)
	mux.HandleFunc("PATCH /api/profissionais/{id}/detalhe", notImplemented)
}
