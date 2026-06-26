package handlers

import (
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
)

// RegisterEstoque registra as rotas de itens de estoque (RF-37, RF-41).
func RegisterEstoque(mux *http.ServeMux, a *app.App) {
	mux.HandleFunc("GET /api/itens-estoque", notImplemented)
	mux.HandleFunc("POST /api/itens-estoque", notImplemented)
	mux.HandleFunc("GET /api/itens-estoque/{id}", notImplemented)
	mux.HandleFunc("PATCH /api/itens-estoque/{id}", notImplemented)
	mux.HandleFunc("DELETE /api/itens-estoque/{id}", notImplemented)
}
