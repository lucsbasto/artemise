package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
	"github.com/lucsb/artemise/backend/internal/domain"
	"github.com/lucsb/artemise/backend/internal/respond"
	"github.com/lucsb/artemise/backend/internal/store"
)

// RegisterRegistros registra os registros de procedimento por paciente
// (RF-33, RF-34; baixa de estoque em RF-38..40).
func RegisterRegistros(mux *http.ServeMux, a *app.App) {
	mux.HandleFunc("GET /api/pacientes/{id}/registros", listRegistros(a))
	mux.HandleFunc("POST /api/pacientes/{id}/registros", createRegistro(a))
	mux.HandleFunc("GET /api/pacientes/{id}/registros/{rid}", getRegistro(a))
	mux.HandleFunc("PATCH /api/pacientes/{id}/registros/{rid}", patchRegistro(a))
	mux.HandleFunc("DELETE /api/pacientes/{id}/registros/{rid}", deleteRegistro(a))
}

func listRegistros(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		rs, err := store.ListRegistros(r.Context(), tx, r.PathValue("id"))
		if err != nil {
			slog.Error("registros: list", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		respond.JSON(w, http.StatusOK, map[string]any{"items": rs, "total": len(rs)})
	}
}

func getRegistro(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		reg, found, err := store.GetRegistro(r.Context(), tx, r.PathValue("id"), r.PathValue("rid"))
		if err != nil {
			slog.Error("registros: get", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		if !found {
			respond.Error(w, http.StatusNotFound, "registro não encontrado", "NOT_FOUND")
			return
		}
		respond.JSON(w, http.StatusOK, reg)
	}
}

func createRegistro(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		pacienteID := r.PathValue("id")

		var in store.RegistroInput
		if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
			respond.Error(w, http.StatusBadRequest, "payload inválido", "VALIDATION_ERROR")
			return
		}
		if !validaMapa(w, &in) {
			return
		}

		reg, err := store.CreateRegistro(r.Context(), tx, pacienteID, in)
		if err != nil {
			slog.Error("registros: create", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}

		// M6: baixa de estoque — BK-22 debita itens_estoque pelos pontos do mapa
		// (injetavel_id/quantidade_usada) dentro desta mesma tx, com aviso 409 de
		// saldo insuficiente. Seam único: nenhuma outra escrita de estoque aqui.

		respond.JSON(w, http.StatusCreated, reg)
	}
}

func patchRegistro(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		pacienteID := r.PathValue("id")
		rid := r.PathValue("rid")

		existente, found, err := store.GetRegistro(r.Context(), tx, pacienteID, rid)
		if err != nil {
			slog.Error("registros: get pré-patch", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		if !found {
			respond.Error(w, http.StatusNotFound, "registro não encontrado", "NOT_FOUND")
			return
		}

		// Decodifica o corpo por cima do existente: campos ausentes ficam intactos.
		in := store.RegistroToInput(existente)
		if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
			respond.Error(w, http.StatusBadRequest, "payload inválido", "VALIDATION_ERROR")
			return
		}
		if !validaMapa(w, &in) {
			return
		}

		reg, ok, err := store.UpdateRegistro(r.Context(), tx, pacienteID, rid, in)
		if err != nil {
			slog.Error("registros: update", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		if !ok {
			respond.Error(w, http.StatusNotFound, "registro não encontrado", "NOT_FOUND")
			return
		}

		// M6: baixa de estoque — BK-22 ajusta saldo pelo delta (nova-anterior
		// quantidade) nesta tx; crédito quando delta < 0, débito com aviso quando > 0.

		respond.JSON(w, http.StatusOK, reg)
	}
}

func deleteRegistro(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		ok, err := store.DeleteRegistro(r.Context(), tx, r.PathValue("id"), r.PathValue("rid"))
		if err != nil {
			slog.Error("registros: delete", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		if !ok {
			respond.Error(w, http.StatusNotFound, "registro não encontrado", "NOT_FOUND")
			return
		}
		respond.NoContent(w)
	}
}

// validaMapa garante que, quando presente, o mapa de injetáveis casa a estrutura
// domain.FichaInjetaveis (design R-6): valida e re-serializa antes de persistir.
// Em JSON inválido responde 400 e retorna false (o caller deve abortar).
func validaMapa(w http.ResponseWriter, in *store.RegistroInput) bool {
	if len(in.Mapa) == 0 || string(in.Mapa) == "null" {
		in.Mapa = nil
		return true
	}
	var ficha domain.FichaInjetaveis
	if err := json.Unmarshal(in.Mapa, &ficha); err != nil {
		respond.Error(w, http.StatusBadRequest, "mapa de injetáveis inválido", "VALIDATION_ERROR")
		return false
	}
	reserialized, err := json.Marshal(ficha)
	if err != nil {
		respond.Error(w, http.StatusBadRequest, "mapa de injetáveis inválido", "VALIDATION_ERROR")
		return false
	}
	in.Mapa = reserialized
	return true
}
