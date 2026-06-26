package handlers

import (
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
)

// RegisterAgenda registra eventos da agenda e os relatórios de agenda
// (RF-42..45, RF-53, RF-54).
func RegisterAgenda(mux *http.ServeMux, a *app.App) {
	// Eventos
	mux.HandleFunc("GET /api/eventos-agenda", notImplemented)
	mux.HandleFunc("POST /api/eventos-agenda", notImplemented)
	mux.HandleFunc("GET /api/eventos-agenda/proximos", notImplemented)
	mux.HandleFunc("GET /api/eventos-agenda/{id}", notImplemented)
	mux.HandleFunc("PATCH /api/eventos-agenda/{id}", notImplemented)
	mux.HandleFunc("DELETE /api/eventos-agenda/{id}", notImplemented)

	// Relatórios de agenda
	mux.HandleFunc("GET /api/agenda/visao-geral", notImplemented)
	mux.HandleFunc("GET /api/agenda/relatorio", notImplemented)
}
