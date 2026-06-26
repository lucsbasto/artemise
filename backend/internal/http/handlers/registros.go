package handlers

import (
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
)

// RegisterRegistros registra os registros de procedimento por paciente
// (RF-33, RF-34; baixa de estoque em RF-38..40).
func RegisterRegistros(mux *http.ServeMux, a *app.App) {
	mux.HandleFunc("GET /api/pacientes/{id}/registros", notImplemented)
	mux.HandleFunc("POST /api/pacientes/{id}/registros", notImplemented)
	mux.HandleFunc("GET /api/pacientes/{id}/registros/{rid}", notImplemented)
	mux.HandleFunc("PATCH /api/pacientes/{id}/registros/{rid}", notImplemented)
	mux.HandleFunc("DELETE /api/pacientes/{id}/registros/{rid}", notImplemented)
}
