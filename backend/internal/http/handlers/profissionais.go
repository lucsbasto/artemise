package handlers

import (
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
	"github.com/lucsb/artemise/backend/internal/domain"
	"github.com/lucsb/artemise/backend/internal/respond"
	"github.com/lucsb/artemise/backend/internal/store"
)

// contatoInput é o corpo de create/patch de profissionais e fornecedores, que
// compartilham a estrutura de contato (domain.Contato).
type contatoInput struct {
	Nome          *string   `json:"nome"`
	Tipo          *string   `json:"tipo"`
	Etiquetas     *[]string `json:"etiquetas"`
	Identificador *string   `json:"identificador"`
	Ativo         *bool     `json:"ativo"`
	AvatarTone    *string   `json:"avatarTone"`
}

// fields traduz o input em colunas/valores não nulos para INSERT/UPDATE.
func (in contatoInput) fields() fieldSet {
	var f fieldSet
	if in.Nome != nil {
		f.set("nome", *in.Nome)
	}
	if in.Tipo != nil {
		f.set("tipo", *in.Tipo)
	}
	if in.Etiquetas != nil {
		f.set("etiquetas", *in.Etiquetas)
	}
	if in.Identificador != nil {
		f.set("identificador", *in.Identificador)
	}
	if in.Ativo != nil {
		f.set("ativo", *in.Ativo)
	}
	if in.AvatarTone != nil {
		f.set("avatar_tone", *in.AvatarTone)
	}
	return f
}

// RegisterProfissionais registra as rotas de profissionais (RF-13, RF-15).
func RegisterProfissionais(mux *http.ServeMux, a *app.App) {
	mux.HandleFunc("GET /api/profissionais", listProfissionais(a))
	mux.HandleFunc("POST /api/profissionais", createContato(a, "profissionais"))
	mux.HandleFunc("GET /api/profissionais/{id}", getContato(a, "profissionais"))
	mux.HandleFunc("PATCH /api/profissionais/{id}", updateContato(a, "profissionais"))
	mux.HandleFunc("DELETE /api/profissionais/{id}", deleteContato(a, "profissionais"))
	mux.HandleFunc("PATCH /api/profissionais/{id}/toggle", toggleContato(a, "profissionais"))
}

func listProfissionais(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		p := store.ParseListParams(r)
		items, total, err := store.ListProfissionais(r.Context(), tx, p)
		if err != nil {
			dbError(w, err, "profissionais: list")
			return
		}
		if items == nil {
			items = []domain.Contato{}
		}
		respond.JSON(w, http.StatusOK, listResponse[domain.Contato]{
			Items: items, Total: total, Page: p.Page, PageSize: p.Limit,
		})
	}
}

// createContato/getContato/... são compartilhados por profissionais e
// fornecedores: só muda o nome da tabela.
func createContato(a *app.App, table string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var in contatoInput
		if !decodeBody(w, r, &in) {
			return
		}
		if in.Nome == nil || *in.Nome == "" {
			respond.Error(w, http.StatusBadRequest, "nome é obrigatório", "VALIDATION_ERROR")
			return
		}
		f := in.fields()
		tx := app.TxFrom(r.Context())
		c, err := store.Insert[domain.Contato](r.Context(), tx, table, f.cols, f.vals, store.ContatoColumns)
		if err != nil {
			dbError(w, err, table+": create")
			return
		}
		respond.JSON(w, http.StatusCreated, c)
	}
}

func getContato(a *app.App, table string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		c, err := store.GetByID[domain.Contato](r.Context(), tx, table, store.ContatoColumns, r.PathValue("id"))
		if err != nil {
			dbError(w, err, table+": get")
			return
		}
		respond.JSON(w, http.StatusOK, c)
	}
}

func updateContato(a *app.App, table string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var in contatoInput
		if !decodeBody(w, r, &in) {
			return
		}
		f := in.fields()
		tx := app.TxFrom(r.Context())
		c, err := store.Update[domain.Contato](r.Context(), tx, table, f.cols, f.vals, r.PathValue("id"), store.ContatoColumns)
		if err != nil {
			dbError(w, err, table+": update")
			return
		}
		respond.JSON(w, http.StatusOK, c)
	}
}

func deleteContato(a *app.App, table string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		ok, err := store.DeleteByID(r.Context(), tx, table, r.PathValue("id"))
		if err != nil {
			dbError(w, err, table+": delete")
			return
		}
		if !ok {
			respond.Error(w, http.StatusNotFound, "recurso não encontrado", "NOT_FOUND")
			return
		}
		respond.NoContent(w)
	}
}

func toggleContato(a *app.App, table string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		c, err := store.Toggle[domain.Contato](r.Context(), tx, table, "ativo", r.PathValue("id"), store.ContatoColumns)
		if err != nil {
			dbError(w, err, table+": toggle")
			return
		}
		respond.JSON(w, http.StatusOK, c)
	}
}
