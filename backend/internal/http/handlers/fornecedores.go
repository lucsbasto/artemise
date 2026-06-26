package handlers

import (
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
)

// RegisterFornecedores registra as rotas de fornecedores (RF-16, RF-17).
func RegisterFornecedores(mux *http.ServeMux, a *app.App) {
	mux.HandleFunc("GET /api/fornecedores", notImplemented)
	mux.HandleFunc("POST /api/fornecedores", notImplemented)
	mux.HandleFunc("GET /api/fornecedores/{id}", notImplemented)
	mux.HandleFunc("PATCH /api/fornecedores/{id}", notImplemented)
	mux.HandleFunc("DELETE /api/fornecedores/{id}", notImplemented)
	mux.HandleFunc("PATCH /api/fornecedores/{id}/toggle", notImplemented)
}
