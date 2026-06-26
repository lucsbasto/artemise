package handlers

import (
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
	"github.com/lucsb/artemise/backend/internal/domain"
	"github.com/lucsb/artemise/backend/internal/respond"
	"github.com/lucsb/artemise/backend/internal/store"
)

// --- Fichas de atendimento ---

type fichaInput struct {
	Nome  *string `json:"nome"`
	Ativo *bool   `json:"ativo"`
}

func (in fichaInput) fields() fieldSet {
	var f fieldSet
	if in.Nome != nil {
		f.set("nome", *in.Nome)
	}
	if in.Ativo != nil {
		f.set("ativo", *in.Ativo)
	}
	return f
}

// --- Modelos de documento ---

type modeloInput struct {
	Nome  *string `json:"nome"`
	Tipo  *string `json:"tipo"`
	Ativo *bool   `json:"ativo"`
}

func (in modeloInput) fields() fieldSet {
	var f fieldSet
	if in.Nome != nil {
		f.set("nome", *in.Nome)
	}
	if in.Tipo != nil {
		f.set("tipo", *in.Tipo)
	}
	if in.Ativo != nil {
		f.set("ativo", *in.Ativo)
	}
	return f
}

// RegisterConfigRecursos registra fichas-atendimento e modelos-documento
// (RF-23..26). Toggle em ambos.
func RegisterConfigRecursos(mux *http.ServeMux, a *app.App) {
	// Fichas de atendimento
	mux.HandleFunc("GET /api/fichas-atendimento", listFichas(a))
	mux.HandleFunc("POST /api/fichas-atendimento", createFicha(a))
	mux.HandleFunc("GET /api/fichas-atendimento/{id}", getFicha(a))
	mux.HandleFunc("PATCH /api/fichas-atendimento/{id}", updateFicha(a))
	mux.HandleFunc("DELETE /api/fichas-atendimento/{id}", deleteFicha(a))
	mux.HandleFunc("PATCH /api/fichas-atendimento/{id}/toggle", toggleFicha(a))

	// Modelos de documento
	mux.HandleFunc("GET /api/modelos-documento", listModelos(a))
	mux.HandleFunc("POST /api/modelos-documento", createModelo(a))
	mux.HandleFunc("GET /api/modelos-documento/{id}", getModelo(a))
	mux.HandleFunc("PATCH /api/modelos-documento/{id}", updateModelo(a))
	mux.HandleFunc("DELETE /api/modelos-documento/{id}", deleteModelo(a))
	mux.HandleFunc("PATCH /api/modelos-documento/{id}/toggle", toggleModelo(a))
}

// === Fichas ===

func listFichas(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		p := store.ParseListParams(r)
		items, total, err := store.ListFichas(r.Context(), tx, p)
		if err != nil {
			dbError(w, err, "fichas: list")
			return
		}
		if items == nil {
			items = []domain.FichaAtendimento{}
		}
		respond.JSON(w, http.StatusOK, listResponse[domain.FichaAtendimento]{
			Items: items, Total: total, Page: p.Page, PageSize: p.Limit,
		})
	}
}

func createFicha(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var in fichaInput
		if !decodeBody(w, r, &in) {
			return
		}
		if in.Nome == nil || *in.Nome == "" {
			respond.Error(w, http.StatusBadRequest, "nome é obrigatório", "VALIDATION_ERROR")
			return
		}
		f := in.fields()
		tx := app.TxFrom(r.Context())
		ficha, err := store.Insert[domain.FichaAtendimento](r.Context(), tx, "fichas_atendimento", f.cols, f.vals, store.FichaColumns)
		if err != nil {
			dbError(w, err, "fichas: create")
			return
		}
		respond.JSON(w, http.StatusCreated, ficha)
	}
}

func getFicha(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		ficha, err := store.GetByID[domain.FichaAtendimento](r.Context(), tx, "fichas_atendimento", store.FichaColumns, r.PathValue("id"))
		if err != nil {
			dbError(w, err, "fichas: get")
			return
		}
		respond.JSON(w, http.StatusOK, ficha)
	}
}

func updateFicha(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var in fichaInput
		if !decodeBody(w, r, &in) {
			return
		}
		f := in.fields()
		tx := app.TxFrom(r.Context())
		ficha, err := store.Update[domain.FichaAtendimento](r.Context(), tx, "fichas_atendimento", f.cols, f.vals, r.PathValue("id"), store.FichaColumns)
		if err != nil {
			dbError(w, err, "fichas: update")
			return
		}
		respond.JSON(w, http.StatusOK, ficha)
	}
}

func deleteFicha(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		ok, err := store.DeleteByID(r.Context(), tx, "fichas_atendimento", r.PathValue("id"))
		if err != nil {
			dbError(w, err, "fichas: delete")
			return
		}
		if !ok {
			respond.Error(w, http.StatusNotFound, "recurso não encontrado", "NOT_FOUND")
			return
		}
		respond.NoContent(w)
	}
}

func toggleFicha(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		ficha, err := store.Toggle[domain.FichaAtendimento](r.Context(), tx, "fichas_atendimento", "ativo", r.PathValue("id"), store.FichaColumns)
		if err != nil {
			dbError(w, err, "fichas: toggle")
			return
		}
		respond.JSON(w, http.StatusOK, ficha)
	}
}

// === Modelos ===

func listModelos(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		p := store.ParseListParams(r)
		items, total, err := store.ListModelos(r.Context(), tx, p)
		if err != nil {
			dbError(w, err, "modelos: list")
			return
		}
		if items == nil {
			items = []domain.ModeloDocumento{}
		}
		respond.JSON(w, http.StatusOK, listResponse[domain.ModeloDocumento]{
			Items: items, Total: total, Page: p.Page, PageSize: p.Limit,
		})
	}
}

func createModelo(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var in modeloInput
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
		m, err := store.Insert[domain.ModeloDocumento](r.Context(), tx, "modelos_documento", f.cols, f.vals, store.ModeloColumns)
		if err != nil {
			dbError(w, err, "modelos: create")
			return
		}
		respond.JSON(w, http.StatusCreated, m)
	}
}

func getModelo(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		m, err := store.GetByID[domain.ModeloDocumento](r.Context(), tx, "modelos_documento", store.ModeloColumns, r.PathValue("id"))
		if err != nil {
			dbError(w, err, "modelos: get")
			return
		}
		respond.JSON(w, http.StatusOK, m)
	}
}

func updateModelo(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var in modeloInput
		if !decodeBody(w, r, &in) {
			return
		}
		f := in.fields()
		tx := app.TxFrom(r.Context())
		m, err := store.Update[domain.ModeloDocumento](r.Context(), tx, "modelos_documento", f.cols, f.vals, r.PathValue("id"), store.ModeloColumns)
		if err != nil {
			dbError(w, err, "modelos: update")
			return
		}
		respond.JSON(w, http.StatusOK, m)
	}
}

func deleteModelo(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		ok, err := store.DeleteByID(r.Context(), tx, "modelos_documento", r.PathValue("id"))
		if err != nil {
			dbError(w, err, "modelos: delete")
			return
		}
		if !ok {
			respond.Error(w, http.StatusNotFound, "recurso não encontrado", "NOT_FOUND")
			return
		}
		respond.NoContent(w)
	}
}

func toggleModelo(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		m, err := store.Toggle[domain.ModeloDocumento](r.Context(), tx, "modelos_documento", "ativo", r.PathValue("id"), store.ModeloColumns)
		if err != nil {
			dbError(w, err, "modelos: toggle")
			return
		}
		respond.JSON(w, http.StatusOK, m)
	}
}
