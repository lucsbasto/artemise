package handlers

import (
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
)

// RegisterFinanceiroCadastros registra contas-financeiras, categorias-contas e
// metodos-pagamento (RF-27..32).
func RegisterFinanceiroCadastros(mux *http.ServeMux, a *app.App) {
	// Contas financeiras
	mux.HandleFunc("GET /api/contas-financeiras", notImplemented)
	mux.HandleFunc("POST /api/contas-financeiras", notImplemented)
	mux.HandleFunc("GET /api/contas-financeiras/{id}", notImplemented)
	mux.HandleFunc("PATCH /api/contas-financeiras/{id}", notImplemented)
	mux.HandleFunc("DELETE /api/contas-financeiras/{id}", notImplemented)

	// Categorias de contas (árvore)
	mux.HandleFunc("GET /api/categorias-contas", notImplemented)
	mux.HandleFunc("POST /api/categorias-contas", notImplemented)
	mux.HandleFunc("GET /api/categorias-contas/{id}", notImplemented)
	mux.HandleFunc("PATCH /api/categorias-contas/{id}", notImplemented)
	mux.HandleFunc("DELETE /api/categorias-contas/{id}", notImplemented)
	mux.HandleFunc("PATCH /api/categorias-contas/{id}/toggle", notImplemented)

	// Métodos de pagamento
	mux.HandleFunc("GET /api/metodos-pagamento", notImplemented)
	mux.HandleFunc("POST /api/metodos-pagamento", notImplemented)
	mux.HandleFunc("GET /api/metodos-pagamento/{id}", notImplemented)
	mux.HandleFunc("PATCH /api/metodos-pagamento/{id}", notImplemented)
	mux.HandleFunc("DELETE /api/metodos-pagamento/{id}", notImplemented)
	mux.HandleFunc("PATCH /api/metodos-pagamento/{id}/toggle", notImplemented)
}
