package handlers

import (
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
)

// RegisterConfigRecursos registra fichas-atendimento e modelos-documento
// (RF-23..26).
func RegisterConfigRecursos(mux *http.ServeMux, a *app.App) {
	// Fichas de atendimento
	mux.HandleFunc("GET /api/fichas-atendimento", notImplemented)
	mux.HandleFunc("POST /api/fichas-atendimento", notImplemented)
	mux.HandleFunc("GET /api/fichas-atendimento/{id}", notImplemented)
	mux.HandleFunc("PATCH /api/fichas-atendimento/{id}", notImplemented)
	mux.HandleFunc("DELETE /api/fichas-atendimento/{id}", notImplemented)
	mux.HandleFunc("PATCH /api/fichas-atendimento/{id}/toggle", notImplemented)

	// Modelos de documento
	mux.HandleFunc("GET /api/modelos-documento", notImplemented)
	mux.HandleFunc("POST /api/modelos-documento", notImplemented)
	mux.HandleFunc("GET /api/modelos-documento/{id}", notImplemented)
	mux.HandleFunc("PATCH /api/modelos-documento/{id}", notImplemented)
	mux.HandleFunc("DELETE /api/modelos-documento/{id}", notImplemented)
	mux.HandleFunc("PATCH /api/modelos-documento/{id}/toggle", notImplemented)
}
