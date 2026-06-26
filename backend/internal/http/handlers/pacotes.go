package handlers

import (
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
	"github.com/lucsb/artemise/backend/internal/domain"
	"github.com/lucsb/artemise/backend/internal/respond"
	"github.com/lucsb/artemise/backend/internal/store"
)

// pacoteInput é o corpo de create/patch de pacotes. Itens só é considerado no
// create (POST cria pacote + itens na mesma transação).
type pacoteInput struct {
	Descricao  *string             `json:"descricao"`
	ValorTotal *float64            `json:"valorTotal"`
	Validade   *string             `json:"validade"`
	Ativo      *bool               `json:"ativo"`
	Itens      []domain.PacoteItem `json:"itens"`
}

// fields traduz os campos base do pacote em colunas/valores não nulos.
func (in pacoteInput) fields() fieldSet {
	var f fieldSet
	if in.Descricao != nil {
		f.set("descricao", *in.Descricao)
	}
	if in.ValorTotal != nil {
		f.set("valor_total", *in.ValorTotal)
	}
	if in.Validade != nil {
		f.set("validade", *in.Validade)
	}
	if in.Ativo != nil {
		f.set("ativo", *in.Ativo)
	}
	return f
}

// RegisterPacotes registra as rotas de pacotes (RF-20..22).
func RegisterPacotes(mux *http.ServeMux, a *app.App) {
	mux.HandleFunc("GET /api/pacotes", listPacotes(a))
	mux.HandleFunc("POST /api/pacotes", createPacote(a))
	mux.HandleFunc("GET /api/pacotes/{id}", getPacote(a))
	mux.HandleFunc("PATCH /api/pacotes/{id}", updatePacote(a))
	mux.HandleFunc("DELETE /api/pacotes/{id}", deletePacote(a))
	mux.HandleFunc("PATCH /api/pacotes/{id}/toggle", togglePacote(a))
}

func listPacotes(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		p := store.ParseListParams(r)
		items, total, err := store.ListPacotes(r.Context(), tx, p)
		if err != nil {
			dbError(w, err, "pacotes: list")
			return
		}
		if items == nil {
			items = []domain.Pacote{}
		}
		respond.JSON(w, http.StatusOK, listResponse[domain.Pacote]{
			Items: items, Total: total, Page: p.Page, PageSize: p.Limit,
		})
	}
}

func createPacote(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var in pacoteInput
		if !decodeBody(w, r, &in) {
			return
		}
		if in.Descricao == nil || *in.Descricao == "" {
			respond.Error(w, http.StatusBadRequest, "descrição é obrigatória", "VALIDATION_ERROR")
			return
		}
		f := in.fields()
		tx := app.TxFrom(r.Context())
		p, err := store.CreatePacote(r.Context(), tx, f.cols, f.vals, in.Itens)
		if err != nil {
			dbError(w, err, "pacotes: create")
			return
		}
		respond.JSON(w, http.StatusCreated, p)
	}
}

func getPacote(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		p, err := store.GetPacote(r.Context(), tx, r.PathValue("id"))
		if err != nil {
			dbError(w, err, "pacotes: get")
			return
		}
		respond.JSON(w, http.StatusOK, p)
	}
}

func updatePacote(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var in pacoteInput
		if !decodeBody(w, r, &in) {
			return
		}
		f := in.fields()
		tx := app.TxFrom(r.Context())
		p, err := store.Update[domain.Pacote](r.Context(), tx, "pacotes", f.cols, f.vals, r.PathValue("id"), store.PacoteColumns)
		if err != nil {
			dbError(w, err, "pacotes: update")
			return
		}
		// Recarrega os itens para a resposta refletir o estado completo.
		if itens, ierr := store.GetPacote(r.Context(), tx, p.ID); ierr == nil {
			p.Itens = itens.Itens
		}
		respond.JSON(w, http.StatusOK, p)
	}
}

func deletePacote(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		ok, err := store.DeleteByID(r.Context(), tx, "pacotes", r.PathValue("id"))
		if err != nil {
			dbError(w, err, "pacotes: delete")
			return
		}
		if !ok {
			respond.Error(w, http.StatusNotFound, "recurso não encontrado", "NOT_FOUND")
			return
		}
		respond.NoContent(w)
	}
}

func togglePacote(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		p, err := store.Toggle[domain.Pacote](r.Context(), tx, "pacotes", "ativo", r.PathValue("id"), store.PacoteColumns)
		if err != nil {
			dbError(w, err, "pacotes: toggle")
			return
		}
		respond.JSON(w, http.StatusOK, p)
	}
}
