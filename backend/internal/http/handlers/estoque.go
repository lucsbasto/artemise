package handlers

import (
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
	"github.com/lucsb/artemise/backend/internal/domain"
	"github.com/lucsb/artemise/backend/internal/respond"
	"github.com/lucsb/artemise/backend/internal/store"
)

// estoqueInput é o corpo de create/patch de itens de estoque. A baixa de saldo
// transacional (injetáveis) é tratada em M6, não aqui.
type estoqueInput struct {
	Nome      *string  `json:"nome"`
	SKU       *string  `json:"sku"`
	Categoria *string  `json:"categoria"`
	Unidade   *string  `json:"unidade"`
	Saldo     *float64 `json:"saldo"`
	Minimo    *float64 `json:"minimo"`
	Custo     *float64 `json:"custo"`
	Ativo     *bool    `json:"ativo"`
}

// fields traduz o input em colunas/valores não nulos para INSERT/UPDATE.
func (in estoqueInput) fields() fieldSet {
	var f fieldSet
	if in.Nome != nil {
		f.set("nome", *in.Nome)
	}
	if in.SKU != nil {
		f.set("sku", *in.SKU)
	}
	if in.Categoria != nil {
		f.set("categoria", *in.Categoria)
	}
	if in.Unidade != nil {
		f.set("unidade", *in.Unidade)
	}
	if in.Saldo != nil {
		f.set("saldo", *in.Saldo)
	}
	if in.Minimo != nil {
		f.set("minimo", *in.Minimo)
	}
	if in.Custo != nil {
		f.set("custo", *in.Custo)
	}
	if in.Ativo != nil {
		f.set("ativo", *in.Ativo)
	}
	return f
}

// RegisterEstoque registra as rotas de itens de estoque (RF-37, RF-41).
func RegisterEstoque(mux *http.ServeMux, a *app.App) {
	mux.HandleFunc("GET /api/itens-estoque", listEstoque(a))
	mux.HandleFunc("POST /api/itens-estoque", createEstoque(a))
	mux.HandleFunc("GET /api/itens-estoque/{id}", getEstoque(a))
	mux.HandleFunc("PATCH /api/itens-estoque/{id}", updateEstoque(a))
	mux.HandleFunc("DELETE /api/itens-estoque/{id}", deleteEstoque(a))
	mux.HandleFunc("PATCH /api/itens-estoque/{id}/toggle", toggleEstoque(a))
}

func listEstoque(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		p := store.ParseListParams(r)
		items, total, err := store.ListEstoque(r.Context(), tx, p)
		if err != nil {
			dbError(w, err, "estoque: list")
			return
		}
		if items == nil {
			items = []domain.ItemEstoque{}
		}
		respond.JSON(w, http.StatusOK, listResponse[domain.ItemEstoque]{
			Items: items, Total: total, Page: p.Page, PageSize: p.Limit,
		})
	}
}

func createEstoque(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var in estoqueInput
		if !decodeBody(w, r, &in) {
			return
		}
		if in.Nome == nil || *in.Nome == "" {
			respond.Error(w, http.StatusBadRequest, "nome é obrigatório", "VALIDATION_ERROR")
			return
		}
		f := in.fields()
		tx := app.TxFrom(r.Context())
		it, err := store.CreateEstoque(r.Context(), tx, f.cols, f.vals)
		if err != nil {
			dbError(w, err, "estoque: create")
			return
		}
		respond.JSON(w, http.StatusCreated, it)
	}
}

func getEstoque(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		it, err := store.GetEstoque(r.Context(), tx, r.PathValue("id"))
		if err != nil {
			dbError(w, err, "estoque: get")
			return
		}
		respond.JSON(w, http.StatusOK, it)
	}
}

func updateEstoque(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var in estoqueInput
		if !decodeBody(w, r, &in) {
			return
		}
		f := in.fields()
		tx := app.TxFrom(r.Context())
		it, err := store.UpdateEstoque(r.Context(), tx, f.cols, f.vals, r.PathValue("id"))
		if err != nil {
			dbError(w, err, "estoque: update")
			return
		}
		respond.JSON(w, http.StatusOK, it)
	}
}

func deleteEstoque(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		ok, err := store.DeleteByID(r.Context(), tx, "itens_estoque", r.PathValue("id"))
		if err != nil {
			dbError(w, err, "estoque: delete")
			return
		}
		if !ok {
			respond.Error(w, http.StatusNotFound, "recurso não encontrado", "NOT_FOUND")
			return
		}
		respond.NoContent(w)
	}
}

func toggleEstoque(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		// ativo existe no schema; o item retornado não expõe ativo no JSON, mas
		// o toggle reflete no banco (consistente com os demais cadastros).
		it, err := store.Toggle[domain.ItemEstoque](r.Context(), tx, "itens_estoque", "ativo", r.PathValue("id"), store.EstoqueColumns)
		if err != nil {
			dbError(w, err, "estoque: toggle")
			return
		}
		respond.JSON(w, http.StatusOK, it)
	}
}
