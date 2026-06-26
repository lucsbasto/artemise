package handlers

import (
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
)

// RegisterPacientes registra as rotas de pacientes (RF-10..12).
func RegisterPacientes(mux *http.ServeMux, a *app.App) {
	mux.HandleFunc("GET /api/pacientes", notImplemented)
	mux.HandleFunc("POST /api/pacientes", notImplemented)
	mux.HandleFunc("GET /api/pacientes/{id}", notImplemented)
	mux.HandleFunc("PATCH /api/pacientes/{id}", notImplemented)
	mux.HandleFunc("DELETE /api/pacientes/{id}", notImplemented)
	mux.HandleFunc("PATCH /api/pacientes/{id}/toggle", notImplemented)
}
