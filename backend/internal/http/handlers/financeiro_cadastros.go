package handlers

import (
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
	"github.com/lucsb/artemise/backend/internal/domain"
	"github.com/lucsb/artemise/backend/internal/respond"
	"github.com/lucsb/artemise/backend/internal/store"
)

// --- Contas financeiras ---

type contaInput struct {
	Nome  *string  `json:"nome"`
	Tipo  *string  `json:"tipo"`
	Saldo *float64 `json:"saldo"`
	Icon  *string  `json:"icon"`
	Ativo *bool    `json:"ativo"`
}

func (in contaInput) fields() fieldSet {
	var f fieldSet
	if in.Nome != nil {
		f.set("nome", *in.Nome)
	}
	if in.Tipo != nil {
		f.set("tipo", *in.Tipo)
	}
	if in.Saldo != nil {
		f.set("saldo", *in.Saldo)
	}
	if in.Icon != nil {
		f.set("icon", *in.Icon)
	}
	if in.Ativo != nil {
		f.set("ativo", *in.Ativo)
	}
	return f
}

// --- Categorias de contas ---

type categoriaInput struct {
	Descricao *string `json:"descricao"`
	Ativo     *bool   `json:"ativo"`
	ParentID  *string `json:"parentId"`
}

func (in categoriaInput) fields() fieldSet {
	var f fieldSet
	if in.Descricao != nil {
		f.set("descricao", *in.Descricao)
	}
	if in.Ativo != nil {
		f.set("ativo", *in.Ativo)
	}
	if in.ParentID != nil {
		f.set("parent_id", *in.ParentID)
	}
	return f
}

// --- Métodos de pagamento ---

type metodoInput struct {
	Descricao *string `json:"descricao"`
	Tipo      *string `json:"tipo"`
	Marca     *string `json:"marca"`
	Ativo     *bool   `json:"ativo"`
}

func (in metodoInput) fields() fieldSet {
	var f fieldSet
	if in.Descricao != nil {
		f.set("descricao", *in.Descricao)
	}
	if in.Tipo != nil {
		f.set("tipo", *in.Tipo)
	}
	if in.Marca != nil {
		f.set("marca", *in.Marca)
	}
	if in.Ativo != nil {
		f.set("ativo", *in.Ativo)
	}
	return f
}

// RegisterFinanceiroCadastros registra contas-financeiras, categorias-contas e
// metodos-pagamento (RF-27..32). Toggle nos 3 recursos.
func RegisterFinanceiroCadastros(mux *http.ServeMux, a *app.App) {
	// Contas financeiras
	mux.HandleFunc("GET /api/contas-financeiras", listContas(a))
	mux.HandleFunc("POST /api/contas-financeiras", createConta(a))
	mux.HandleFunc("GET /api/contas-financeiras/{id}", getConta(a))
	mux.HandleFunc("PATCH /api/contas-financeiras/{id}", updateConta(a))
	mux.HandleFunc("DELETE /api/contas-financeiras/{id}", deleteConta(a))
	mux.HandleFunc("PATCH /api/contas-financeiras/{id}/toggle", toggleConta(a))

	// Categorias de contas (árvore)
	mux.HandleFunc("GET /api/categorias-contas", listCategorias(a))
	mux.HandleFunc("POST /api/categorias-contas", createCategoria(a))
	mux.HandleFunc("GET /api/categorias-contas/{id}", getCategoria(a))
	mux.HandleFunc("PATCH /api/categorias-contas/{id}", updateCategoria(a))
	mux.HandleFunc("DELETE /api/categorias-contas/{id}", deleteCategoria(a))
	mux.HandleFunc("PATCH /api/categorias-contas/{id}/toggle", toggleCategoria(a))

	// Métodos de pagamento
	mux.HandleFunc("GET /api/metodos-pagamento", listMetodos(a))
	mux.HandleFunc("POST /api/metodos-pagamento", createMetodo(a))
	mux.HandleFunc("GET /api/metodos-pagamento/{id}", getMetodo(a))
	mux.HandleFunc("PATCH /api/metodos-pagamento/{id}", updateMetodo(a))
	mux.HandleFunc("DELETE /api/metodos-pagamento/{id}", deleteMetodo(a))
	mux.HandleFunc("PATCH /api/metodos-pagamento/{id}/toggle", toggleMetodo(a))
}

// === Contas ===

func listContas(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		p := store.ParseListParams(r)
		items, total, err := store.ListContas(r.Context(), tx, p)
		if err != nil {
			dbError(w, err, "contas: list")
			return
		}
		if items == nil {
			items = []domain.ContaFinanceira{}
		}
		respond.JSON(w, http.StatusOK, listResponse[domain.ContaFinanceira]{
			Items: items, Total: total, Page: p.Page, PageSize: p.Limit,
		})
	}
}

func createConta(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var in contaInput
		if !decodeBody(w, r, &in) {
			return
		}
		if in.Nome == nil || *in.Nome == "" {
			respond.Error(w, http.StatusBadRequest, "nome é obrigatório", "VALIDATION_ERROR")
			return
		}
		if in.Tipo == nil || *in.Tipo == "" {
			respond.Error(w, http.StatusBadRequest, "tipo é obrigatório", "VALIDATION_ERROR")
			return
		}
		f := in.fields()
		tx := app.TxFrom(r.Context())
		c, err := store.Insert[domain.ContaFinanceira](r.Context(), tx, "contas_financeiras", f.cols, f.vals, store.ContaColumns)
		if err != nil {
			dbError(w, err, "contas: create")
			return
		}
		respond.JSON(w, http.StatusCreated, c)
	}
}

func getConta(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		c, err := store.GetByID[domain.ContaFinanceira](r.Context(), tx, "contas_financeiras", store.ContaColumns, r.PathValue("id"))
		if err != nil {
			dbError(w, err, "contas: get")
			return
		}
		respond.JSON(w, http.StatusOK, c)
	}
}

func updateConta(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var in contaInput
		if !decodeBody(w, r, &in) {
			return
		}
		f := in.fields()
		tx := app.TxFrom(r.Context())
		c, err := store.Update[domain.ContaFinanceira](r.Context(), tx, "contas_financeiras", f.cols, f.vals, r.PathValue("id"), store.ContaColumns)
		if err != nil {
			dbError(w, err, "contas: update")
			return
		}
		respond.JSON(w, http.StatusOK, c)
	}
}

func deleteConta(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		ok, err := store.DeleteByID(r.Context(), tx, "contas_financeiras", r.PathValue("id"))
		if err != nil {
			dbError(w, err, "contas: delete")
			return
		}
		if !ok {
			respond.Error(w, http.StatusNotFound, "recurso não encontrado", "NOT_FOUND")
			return
		}
		respond.NoContent(w)
	}
}

func toggleConta(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		c, err := store.Toggle[domain.ContaFinanceira](r.Context(), tx, "contas_financeiras", "ativo", r.PathValue("id"), store.ContaColumns)
		if err != nil {
			dbError(w, err, "contas: toggle")
			return
		}
		respond.JSON(w, http.StatusOK, c)
	}
}

// === Categorias (árvore) ===

func listCategorias(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		arvore, err := store.CategoriasArvore(r.Context(), tx)
		if err != nil {
			dbError(w, err, "categorias: list")
			return
		}
		respond.JSON(w, http.StatusOK, arvore)
	}
}

func createCategoria(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var in categoriaInput
		if !decodeBody(w, r, &in) {
			return
		}
		if in.Descricao == nil || *in.Descricao == "" {
			respond.Error(w, http.StatusBadRequest, "descrição é obrigatória", "VALIDATION_ERROR")
			return
		}
		f := in.fields()
		tx := app.TxFrom(r.Context())
		c, err := store.Insert[domain.CategoriaConta](r.Context(), tx, "categorias_contas", f.cols, f.vals, store.CategoriaColumns)
		if err != nil {
			dbError(w, err, "categorias: create")
			return
		}
		respond.JSON(w, http.StatusCreated, c)
	}
}

func getCategoria(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		c, err := store.GetByID[domain.CategoriaConta](r.Context(), tx, "categorias_contas", store.CategoriaColumns, r.PathValue("id"))
		if err != nil {
			dbError(w, err, "categorias: get")
			return
		}
		respond.JSON(w, http.StatusOK, c)
	}
}

func updateCategoria(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var in categoriaInput
		if !decodeBody(w, r, &in) {
			return
		}
		f := in.fields()
		tx := app.TxFrom(r.Context())
		c, err := store.Update[domain.CategoriaConta](r.Context(), tx, "categorias_contas", f.cols, f.vals, r.PathValue("id"), store.CategoriaColumns)
		if err != nil {
			dbError(w, err, "categorias: update")
			return
		}
		respond.JSON(w, http.StatusOK, c)
	}
}

func deleteCategoria(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		ok, err := store.DeleteByID(r.Context(), tx, "categorias_contas", r.PathValue("id"))
		if err != nil {
			dbError(w, err, "categorias: delete")
			return
		}
		if !ok {
			respond.Error(w, http.StatusNotFound, "recurso não encontrado", "NOT_FOUND")
			return
		}
		respond.NoContent(w)
	}
}

func toggleCategoria(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		c, err := store.Toggle[domain.CategoriaConta](r.Context(), tx, "categorias_contas", "ativo", r.PathValue("id"), store.CategoriaColumns)
		if err != nil {
			dbError(w, err, "categorias: toggle")
			return
		}
		respond.JSON(w, http.StatusOK, c)
	}
}

// === Métodos de pagamento ===

func listMetodos(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		p := store.ParseListParams(r)
		items, total, err := store.ListMetodos(r.Context(), tx, p)
		if err != nil {
			dbError(w, err, "metodos: list")
			return
		}
		if items == nil {
			items = []domain.MetodoPagamento{}
		}
		respond.JSON(w, http.StatusOK, listResponse[domain.MetodoPagamento]{
			Items: items, Total: total, Page: p.Page, PageSize: p.Limit,
		})
	}
}

func createMetodo(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var in metodoInput
		if !decodeBody(w, r, &in) {
			return
		}
		if in.Descricao == nil || *in.Descricao == "" {
			respond.Error(w, http.StatusBadRequest, "descrição é obrigatória", "VALIDATION_ERROR")
			return
		}
		if in.Tipo == nil || *in.Tipo == "" {
			respond.Error(w, http.StatusBadRequest, "tipo é obrigatório", "VALIDATION_ERROR")
			return
		}
		f := in.fields()
		tx := app.TxFrom(r.Context())
		m, err := store.Insert[domain.MetodoPagamento](r.Context(), tx, "metodos_pagamento", f.cols, f.vals, store.MetodoColumns)
		if err != nil {
			dbError(w, err, "metodos: create")
			return
		}
		respond.JSON(w, http.StatusCreated, m)
	}
}

func getMetodo(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		m, err := store.GetByID[domain.MetodoPagamento](r.Context(), tx, "metodos_pagamento", store.MetodoColumns, r.PathValue("id"))
		if err != nil {
			dbError(w, err, "metodos: get")
			return
		}
		respond.JSON(w, http.StatusOK, m)
	}
}

func updateMetodo(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var in metodoInput
		if !decodeBody(w, r, &in) {
			return
		}
		f := in.fields()
		tx := app.TxFrom(r.Context())
		m, err := store.Update[domain.MetodoPagamento](r.Context(), tx, "metodos_pagamento", f.cols, f.vals, r.PathValue("id"), store.MetodoColumns)
		if err != nil {
			dbError(w, err, "metodos: update")
			return
		}
		respond.JSON(w, http.StatusOK, m)
	}
}

func deleteMetodo(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		ok, err := store.DeleteByID(r.Context(), tx, "metodos_pagamento", r.PathValue("id"))
		if err != nil {
			dbError(w, err, "metodos: delete")
			return
		}
		if !ok {
			respond.Error(w, http.StatusNotFound, "recurso não encontrado", "NOT_FOUND")
			return
		}
		respond.NoContent(w)
	}
}

func toggleMetodo(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		m, err := store.Toggle[domain.MetodoPagamento](r.Context(), tx, "metodos_pagamento", "ativo", r.PathValue("id"), store.MetodoColumns)
		if err != nil {
			dbError(w, err, "metodos: toggle")
			return
		}
		respond.JSON(w, http.StatusOK, m)
	}
}
