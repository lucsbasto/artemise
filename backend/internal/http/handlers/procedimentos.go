package handlers

import (
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
	"github.com/lucsb/artemise/backend/internal/domain"
	"github.com/lucsb/artemise/backend/internal/respond"
	"github.com/lucsb/artemise/backend/internal/store"
)

// categoriaInjetaveis é a categoria que obriga usa_mapa=true (invariante de
// domínio: injetáveis sempre usam mapa de pontos).
const categoriaInjetaveis = "Injetáveis"

// procedimentoInput é o corpo de create/patch de procedimentos.
type procedimentoInput struct {
	Nome       *string  `json:"nome"`
	Categoria  *string  `json:"categoria"`
	DuracaoMin *int     `json:"duracaoMin"`
	Valor      *float64 `json:"valor"`
	Ativo      *bool    `json:"ativo"`
	UsaMapa    *bool    `json:"usaMapa"`
	Cor        *string  `json:"cor"`
}

// fields traduz o input em colunas/valores, aplicando a invariante de injetáveis:
// categoria "Injetáveis" força usa_mapa=true independentemente do enviado.
func (in procedimentoInput) fields() fieldSet {
	var f fieldSet
	if in.Nome != nil {
		f.set("nome", *in.Nome)
	}
	if in.Categoria != nil {
		f.set("categoria", *in.Categoria)
	}
	if in.DuracaoMin != nil {
		f.set("duracao_min", *in.DuracaoMin)
	}
	if in.Valor != nil {
		f.set("valor", *in.Valor)
	}
	if in.Ativo != nil {
		f.set("ativo", *in.Ativo)
	}
	usaMapa := in.UsaMapa
	if in.Categoria != nil && *in.Categoria == categoriaInjetaveis {
		t := true
		usaMapa = &t
	}
	if usaMapa != nil {
		f.set("usa_mapa", *usaMapa)
	}
	if in.Cor != nil {
		f.set("cor", *in.Cor)
	}
	return f
}

// RegisterProcedimentos registra as rotas de procedimentos (RF-18, RF-19).
func RegisterProcedimentos(mux *http.ServeMux, a *app.App) {
	mux.HandleFunc("GET /api/procedimentos", listProcedimentos(a))
	mux.HandleFunc("POST /api/procedimentos", createProcedimento(a))
	mux.HandleFunc("GET /api/procedimentos/{id}", getProcedimento(a))
	mux.HandleFunc("PATCH /api/procedimentos/{id}", updateProcedimento(a))
	mux.HandleFunc("DELETE /api/procedimentos/{id}", deleteProcedimento(a))
	mux.HandleFunc("PATCH /api/procedimentos/{id}/toggle", toggleProcedimento(a))
}

func listProcedimentos(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		p := store.ParseListParams(r)
		items, total, err := store.ListProcedimentos(r.Context(), tx, p)
		if err != nil {
			dbError(w, err, "procedimentos: list")
			return
		}
		if items == nil {
			items = []domain.Procedimento{}
		}
		respond.JSON(w, http.StatusOK, listResponse[domain.Procedimento]{
			Items: items, Total: total, Page: p.Page, PageSize: p.Limit,
		})
	}
}

func createProcedimento(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var in procedimentoInput
		if !decodeBody(w, r, &in) {
			return
		}
		if in.Nome == nil || *in.Nome == "" {
			respond.Error(w, http.StatusBadRequest, "nome é obrigatório", "VALIDATION_ERROR")
			return
		}
		f := in.fields()
		tx := app.TxFrom(r.Context())
		p, err := store.Insert[domain.Procedimento](r.Context(), tx, "procedimentos", f.cols, f.vals, store.ProcedimentoColumns)
		if err != nil {
			dbError(w, err, "procedimentos: create")
			return
		}
		respond.JSON(w, http.StatusCreated, p)
	}
}

func getProcedimento(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		p, err := store.GetByID[domain.Procedimento](r.Context(), tx, "procedimentos", store.ProcedimentoColumns, r.PathValue("id"))
		if err != nil {
			dbError(w, err, "procedimentos: get")
			return
		}
		respond.JSON(w, http.StatusOK, p)
	}
}

func updateProcedimento(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var in procedimentoInput
		if !decodeBody(w, r, &in) {
			return
		}
		f := in.fields()
		tx := app.TxFrom(r.Context())
		p, err := store.Update[domain.Procedimento](r.Context(), tx, "procedimentos", f.cols, f.vals, r.PathValue("id"), store.ProcedimentoColumns)
		if err != nil {
			dbError(w, err, "procedimentos: update")
			return
		}
		respond.JSON(w, http.StatusOK, p)
	}
}

func deleteProcedimento(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		ok, err := store.DeleteByID(r.Context(), tx, "procedimentos", r.PathValue("id"))
		if err != nil {
			dbError(w, err, "procedimentos: delete")
			return
		}
		if !ok {
			respond.Error(w, http.StatusNotFound, "recurso não encontrado", "NOT_FOUND")
			return
		}
		respond.NoContent(w)
	}
}

func toggleProcedimento(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		p, err := store.Toggle[domain.Procedimento](r.Context(), tx, "procedimentos", "ativo", r.PathValue("id"), store.ProcedimentoColumns)
		if err != nil {
			dbError(w, err, "procedimentos: toggle")
			return
		}
		respond.JSON(w, http.StatusOK, p)
	}
}
