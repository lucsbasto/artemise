package handlers

import (
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
	"github.com/lucsb/artemise/backend/internal/domain"
	"github.com/lucsb/artemise/backend/internal/respond"
	"github.com/lucsb/artemise/backend/internal/store"
)

// RegisterFornecedores registra as rotas de fornecedores (RF-16, RF-17).
// Reutiliza os handlers genéricos de contato (mesma forma que profissionais).
func RegisterFornecedores(mux *http.ServeMux, a *app.App) {
	mux.HandleFunc("GET /api/fornecedores", listFornecedores(a))
	mux.HandleFunc("POST /api/fornecedores", createContato(a, "fornecedores"))
	mux.HandleFunc("GET /api/fornecedores/{id}", getContato(a, "fornecedores"))
	mux.HandleFunc("PATCH /api/fornecedores/{id}", updateContato(a, "fornecedores"))
	mux.HandleFunc("DELETE /api/fornecedores/{id}", deleteContato(a, "fornecedores"))
	mux.HandleFunc("PATCH /api/fornecedores/{id}/toggle", toggleContato(a, "fornecedores"))
}

func listFornecedores(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		p := store.ParseListParams(r)
		items, total, err := store.ListFornecedores(r.Context(), tx, p)
		if err != nil {
			dbError(w, err, "fornecedores: list")
			return
		}
		if items == nil {
			items = []domain.Fornecedor{}
		}
		respond.JSON(w, http.StatusOK, listResponse[domain.Fornecedor]{
			Items: items, Total: total, Page: p.Page, PageSize: p.Limit,
		})
	}
}
