package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"github.com/jackc/pgx/v5"

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

		// M6 (BK-22 / RF-38): baixa de estoque na MESMA tx. Debita o saldo das
		// substâncias do novo mapa (delta = novo − ∅); saldo insuficiente aborta
		// o registro recém-inserido via rollback explícito + 409.
		if reg.UsaMapa && reg.Mapa != nil {
			if !baixaEstoque(w, r, tx, domain.CalcularDelta(nil, reg.Mapa)) {
				return
			}
		}

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

		// M6 (BK-22 / RF-40): ajuste por delta nesta tx. delta = novo − anterior
		// por substância: positivo debita (com aviso 409), negativo estorna. Cobre
		// também a troca de procedimento (estorno do mapa antigo + baixa do novo).
		if !baixaEstoque(w, r, tx, domain.CalcularDelta(existente.Mapa, reg.Mapa)) {
			return
		}

		respond.JSON(w, http.StatusOK, reg)
	}
}

func deleteRegistro(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		pacienteID := r.PathValue("id")
		rid := r.PathValue("rid")

		// Lê o registro antes de remover para estornar o mapa na mesma tx.
		existente, found, err := store.GetRegistro(r.Context(), tx, pacienteID, rid)
		if err != nil {
			slog.Error("registros: get pré-delete", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		if !found {
			respond.Error(w, http.StatusNotFound, "registro não encontrado", "NOT_FOUND")
			return
		}

		ok, err := store.DeleteRegistro(r.Context(), tx, pacienteID, rid)
		if err != nil {
			slog.Error("registros: delete", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		if !ok {
			respond.Error(w, http.StatusNotFound, "registro não encontrado", "NOT_FOUND")
			return
		}

		// M6 (BK-22 / RF-39): estorno — credita de volta todas as unidades do mapa
		// (delta = ∅ − anterior, sempre ≤ 0, nunca barrado por saldo).
		if existente.Mapa != nil {
			if _, err := store.AplicarDelta(r.Context(), tx, domain.CalcularDelta(existente.Mapa, nil)); err != nil {
				slog.Error("registros: estorno estoque", "err", err)
				respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
				return
			}
		}

		respond.NoContent(w)
	}
}

// baixaEstoque aplica um delta de estoque na transação do request. Em saldo
// insuficiente (débito), dá rollback explícito — o middleware WithTx só reverte
// sozinho em status >= 500, então o 409 precisa desfazer as escritas à mão — e
// responde 409 com o item barrado. Retorna false quando o caller deve abortar.
func baixaEstoque(w http.ResponseWriter, r *http.Request, tx pgx.Tx, delta domain.DeltaEstoque) bool {
	falta, err := store.AplicarDelta(r.Context(), tx, delta)
	if err != nil {
		slog.Error("registros: baixa estoque", "err", err)
		respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
		return false
	}
	if falta != nil {
		_ = tx.Rollback(r.Context())
		respond.JSON(w, http.StatusConflict, map[string]any{
			"error":      "saldo_insuficiente",
			"code":       "INSUFFICIENT_STOCK",
			"itemId":     falta.ItemID,
			"saldoAtual": falta.Saldo,
		})
		return false
	}
	return true
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
