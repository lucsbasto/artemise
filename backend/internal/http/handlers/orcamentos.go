package handlers

import (
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
)

// RegisterOrcamentos registra os orçamentos por paciente e seus itens
// (RF-46, RF-47).
func RegisterOrcamentos(mux *http.ServeMux, a *app.App) {
	mux.HandleFunc("GET /api/pacientes/{id}/orcamentos", notImplemented)
	mux.HandleFunc("POST /api/pacientes/{id}/orcamentos", notImplemented)
	mux.HandleFunc("GET /api/pacientes/{id}/orcamentos/{oid}", notImplemented)
	mux.HandleFunc("PATCH /api/pacientes/{id}/orcamentos/{oid}", notImplemented)
	mux.HandleFunc("DELETE /api/pacientes/{id}/orcamentos/{oid}", notImplemented)

	// Itens do orçamento
	mux.HandleFunc("POST /api/pacientes/{id}/orcamentos/{oid}/itens", notImplemented)
	mux.HandleFunc("PATCH /api/pacientes/{id}/orcamentos/{oid}/itens/{iid}", notImplemented)
	mux.HandleFunc("DELETE /api/pacientes/{id}/orcamentos/{oid}/itens/{iid}", notImplemented)
}
