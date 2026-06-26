package handlers

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
	"github.com/lucsb/artemise/backend/internal/respond"
	"github.com/lucsb/artemise/backend/internal/store"
)

// RegisterProfissionalDetalhe registra o perfil rico do profissional (RF-14).
func RegisterProfissionalDetalhe(mux *http.ServeMux, a *app.App) {
	mux.HandleFunc("GET /api/profissionais/{id}/detalhe", getProfissionalDetalhe(a))
	mux.HandleFunc("PATCH /api/profissionais/{id}/detalhe", patchProfissionalDetalhe(a))
}

// getProfissionalDetalhe devolve detalhe 1:1 + horarios/comissoes/procedimentos/certificacoes.
func getProfissionalDetalhe(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		id := r.PathValue("id")

		existe, err := store.ProfissionalExiste(r.Context(), tx, id)
		if err != nil {
			slog.Error("detalhe: existe", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		if !existe {
			respond.Error(w, http.StatusNotFound, "profissional não encontrado", "NOT_FOUND")
			return
		}

		det, err := store.GetProfissionalDetalhe(r.Context(), tx, id)
		if err != nil {
			slog.Error("detalhe: get", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		respond.JSON(w, http.StatusOK, det)
	}
}

// patchProfissionalDetalhe aplica update parcial e devolve o detalhe atualizado.
func patchProfissionalDetalhe(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		id := r.PathValue("id")

		existe, err := store.ProfissionalExiste(r.Context(), tx, id)
		if err != nil {
			slog.Error("detalhe: existe", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		if !existe {
			respond.Error(w, http.StatusNotFound, "profissional não encontrado", "NOT_FOUND")
			return
		}

		var body map[string]json.RawMessage
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			respond.Error(w, http.StatusBadRequest, "payload inválido", "VALIDATION_ERROR")
			return
		}

		if err := store.PatchProfissionalDetalhe(r.Context(), tx, id, body); err != nil {
			if errors.Is(err, store.ErrInvalidPayload) {
				respond.Error(w, http.StatusBadRequest, err.Error(), "VALIDATION_ERROR")
				return
			}
			slog.Error("detalhe: patch", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}

		det, err := store.GetProfissionalDetalhe(r.Context(), tx, id)
		if err != nil {
			slog.Error("detalhe: get pós-patch", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		respond.JSON(w, http.StatusOK, det)
	}
}
