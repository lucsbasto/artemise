package handlers

import (
	"net/http"
	"time"

	"github.com/lucsb/artemise/backend/internal/app"
	"github.com/lucsb/artemise/backend/internal/domain"
	"github.com/lucsb/artemise/backend/internal/respond"
	"github.com/lucsb/artemise/backend/internal/store"
)

// pacienteInput é o corpo aceito em create/patch de pacientes. Campos ponteiro
// permitem update parcial: nil = não enviado (mantém valor / default do banco).
type pacienteInput struct {
	Nome               *string    `json:"nome"`
	Tipo               *string    `json:"tipo"`
	Etiquetas          *[]string  `json:"etiquetas"`
	Identificador      *string    `json:"identificador"`
	Ativo              *bool      `json:"ativo"`
	Sexo               *string    `json:"sexo"`
	DataNascimento     *time.Time `json:"dataNascimento"`
	CPF                *string    `json:"cpf"`
	Email              *string    `json:"email"`
	Endereco           *string    `json:"endereco"`
	Observacoes        *string    `json:"observacoes"`
	RecebeNotificacoes *bool      `json:"recebeNotificacoes"`
}

// fields traduz o input em colunas/valores não nulos para INSERT/UPDATE.
func (in pacienteInput) fields() fieldSet {
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
	if in.Sexo != nil {
		f.set("sexo", *in.Sexo)
	}
	if in.DataNascimento != nil {
		f.set("data_nascimento", *in.DataNascimento)
	}
	if in.CPF != nil {
		f.set("cpf", *in.CPF)
	}
	if in.Email != nil {
		f.set("email", *in.Email)
	}
	if in.Endereco != nil {
		f.set("endereco", *in.Endereco)
	}
	if in.Observacoes != nil {
		f.set("observacoes", *in.Observacoes)
	}
	if in.RecebeNotificacoes != nil {
		f.set("recebe_notificacoes", *in.RecebeNotificacoes)
	}
	return f
}

// RegisterPacientes registra as rotas de pacientes (RF-10..12).
func RegisterPacientes(mux *http.ServeMux, a *app.App) {
	mux.HandleFunc("GET /api/pacientes", listPacientes(a))
	mux.HandleFunc("POST /api/pacientes", createPaciente(a))
	mux.HandleFunc("GET /api/pacientes/{id}", getPaciente(a))
	mux.HandleFunc("PATCH /api/pacientes/{id}", updatePaciente(a))
	mux.HandleFunc("DELETE /api/pacientes/{id}", deletePaciente(a))
	mux.HandleFunc("PATCH /api/pacientes/{id}/toggle", togglePaciente(a))
}

func listPacientes(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		p := store.ParseListParams(r)
		items, total, err := store.ListPacientes(r.Context(), tx, p)
		if err != nil {
			dbError(w, err, "pacientes: list")
			return
		}
		if items == nil {
			items = []domain.Paciente{}
		}
		respond.JSON(w, http.StatusOK, listResponse[domain.Paciente]{
			Items: items, Total: total, Page: p.Page, PageSize: p.Limit,
		})
	}
}

func createPaciente(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var in pacienteInput
		if !decodeBody(w, r, &in) {
			return
		}
		if in.Nome == nil || *in.Nome == "" {
			respond.Error(w, http.StatusBadRequest, "nome é obrigatório", "VALIDATION_ERROR")
			return
		}
		f := in.fields()
		tx := app.TxFrom(r.Context())
		p, err := store.Insert[domain.Paciente](r.Context(), tx, "pacientes", f.cols, f.vals, store.PacienteColumns)
		if err != nil {
			dbError(w, err, "pacientes: create")
			return
		}
		respond.JSON(w, http.StatusCreated, p)
	}
}

func getPaciente(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		p, err := store.GetByID[domain.Paciente](r.Context(), tx, "pacientes", store.PacienteColumns, r.PathValue("id"))
		if err != nil {
			dbError(w, err, "pacientes: get")
			return
		}
		respond.JSON(w, http.StatusOK, p)
	}
}

func updatePaciente(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var in pacienteInput
		if !decodeBody(w, r, &in) {
			return
		}
		f := in.fields()
		tx := app.TxFrom(r.Context())
		p, err := store.Update[domain.Paciente](r.Context(), tx, "pacientes", f.cols, f.vals, r.PathValue("id"), store.PacienteColumns)
		if err != nil {
			dbError(w, err, "pacientes: update")
			return
		}
		respond.JSON(w, http.StatusOK, p)
	}
}

func deletePaciente(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		ok, err := store.DeleteByID(r.Context(), tx, "pacientes", r.PathValue("id"))
		if err != nil {
			dbError(w, err, "pacientes: delete")
			return
		}
		if !ok {
			respond.Error(w, http.StatusNotFound, "recurso não encontrado", "NOT_FOUND")
			return
		}
		respond.NoContent(w)
	}
}

func togglePaciente(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		p, err := store.Toggle[domain.Paciente](r.Context(), tx, "pacientes", "ativo", r.PathValue("id"), store.PacienteColumns)
		if err != nil {
			dbError(w, err, "pacientes: toggle")
			return
		}
		respond.JSON(w, http.StatusOK, p)
	}
}
