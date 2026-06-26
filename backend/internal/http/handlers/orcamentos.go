package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
	"github.com/lucsb/artemise/backend/internal/respond"
	"github.com/lucsb/artemise/backend/internal/store"
)

// RegisterOrcamentos registra os orçamentos por paciente e seus itens
// (RF-46, RF-47).
func RegisterOrcamentos(mux *http.ServeMux, a *app.App) {
	mux.HandleFunc("GET /api/pacientes/{id}/orcamentos", listOrcamentos(a))
	mux.HandleFunc("POST /api/pacientes/{id}/orcamentos", createOrcamento(a))
	mux.HandleFunc("GET /api/pacientes/{id}/orcamentos/{oid}", getOrcamento(a))
	mux.HandleFunc("PATCH /api/pacientes/{id}/orcamentos/{oid}", patchOrcamento(a))
	mux.HandleFunc("DELETE /api/pacientes/{id}/orcamentos/{oid}", deleteOrcamento(a))

	// Itens do orçamento
	mux.HandleFunc("POST /api/pacientes/{id}/orcamentos/{oid}/itens", addOrcamentoItem(a))
	mux.HandleFunc("PATCH /api/pacientes/{id}/orcamentos/{oid}/itens/{iid}", patchOrcamentoItem(a))
	mux.HandleFunc("DELETE /api/pacientes/{id}/orcamentos/{oid}/itens/{iid}", deleteOrcamentoItem(a))
}

func listOrcamentos(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		orcs, err := store.ListOrcamentos(r.Context(), tx, r.PathValue("id"))
		if err != nil {
			slog.Error("orcamentos: list", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		respond.JSON(w, http.StatusOK, map[string]any{"items": orcs, "total": len(orcs)})
	}
}

func getOrcamento(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		orc, found, err := store.GetOrcamento(r.Context(), tx, r.PathValue("id"), r.PathValue("oid"))
		if err != nil {
			slog.Error("orcamentos: get", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		if !found {
			respond.Error(w, http.StatusNotFound, "orçamento não encontrado", "NOT_FOUND")
			return
		}
		respond.JSON(w, http.StatusOK, orc)
	}
}

func createOrcamento(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		var in store.OrcamentoInput
		if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
			respond.Error(w, http.StatusBadRequest, "payload inválido", "VALIDATION_ERROR")
			return
		}
		orc, err := store.CreateOrcamento(r.Context(), tx, r.PathValue("id"), in)
		if err != nil {
			slog.Error("orcamentos: create", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		respond.JSON(w, http.StatusCreated, orc)
	}
}

func patchOrcamento(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		pacienteID := r.PathValue("id")
		oid := r.PathValue("oid")

		existente, found, err := store.GetOrcamento(r.Context(), tx, pacienteID, oid)
		if err != nil {
			slog.Error("orcamentos: get pré-patch", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		if !found {
			respond.Error(w, http.StatusNotFound, "orçamento não encontrado", "NOT_FOUND")
			return
		}

		// Decodifica o corpo por cima dos valores atuais do cabeçalho.
		in := store.OrcamentoInput{
			VendedorID: existente.VendedorID,
			Cliente:    existente.Cliente,
			Vendedor:   existente.Vendedor,
			Data:       existente.Data.Format("2006-01-02"),
		}
		if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
			respond.Error(w, http.StatusBadRequest, "payload inválido", "VALIDATION_ERROR")
			return
		}

		orc, ok, err := store.UpdateOrcamento(r.Context(), tx, pacienteID, oid, in)
		if err != nil {
			slog.Error("orcamentos: update", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		if !ok {
			respond.Error(w, http.StatusNotFound, "orçamento não encontrado", "NOT_FOUND")
			return
		}
		respond.JSON(w, http.StatusOK, orc)
	}
}

func deleteOrcamento(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		ok, err := store.DeleteOrcamento(r.Context(), tx, r.PathValue("id"), r.PathValue("oid"))
		if err != nil {
			slog.Error("orcamentos: delete", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		if !ok {
			respond.Error(w, http.StatusNotFound, "orçamento não encontrado", "NOT_FOUND")
			return
		}
		respond.NoContent(w)
	}
}

func addOrcamentoItem(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		var item store.OrcamentoItemInput
		if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
			respond.Error(w, http.StatusBadRequest, "payload inválido", "VALIDATION_ERROR")
			return
		}
		orc, found, err := store.AddOrcamentoItem(r.Context(), tx, r.PathValue("id"), r.PathValue("oid"), item)
		if err != nil {
			slog.Error("orcamentos: add item", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		if !found {
			respond.Error(w, http.StatusNotFound, "orçamento não encontrado", "NOT_FOUND")
			return
		}
		respond.JSON(w, http.StatusCreated, orc)
	}
}

func patchOrcamentoItem(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		pacienteID := r.PathValue("id")
		oid := r.PathValue("oid")
		iid := r.PathValue("iid")

		existente, found, err := store.GetOrcamentoItem(r.Context(), tx, oid, iid)
		if err != nil {
			slog.Error("orcamentos: get item pré-patch", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		if !found {
			respond.Error(w, http.StatusNotFound, "item não encontrado", "NOT_FOUND")
			return
		}

		// Decodifica o corpo por cima do item atual.
		item := store.OrcamentoItemInput{
			Nome:     existente.Nome,
			Qtd:      existente.Qtd,
			Valor:    existente.Valor,
			Desconto: existente.Desconto,
		}
		if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
			respond.Error(w, http.StatusBadRequest, "payload inválido", "VALIDATION_ERROR")
			return
		}

		orc, ok, err := store.UpdateOrcamentoItem(r.Context(), tx, pacienteID, oid, iid, item)
		if err != nil {
			slog.Error("orcamentos: update item", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		if !ok {
			respond.Error(w, http.StatusNotFound, "item não encontrado", "NOT_FOUND")
			return
		}
		respond.JSON(w, http.StatusOK, orc)
	}
}

func deleteOrcamentoItem(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		orc, found, err := store.DeleteOrcamentoItem(r.Context(), tx,
			r.PathValue("id"), r.PathValue("oid"), r.PathValue("iid"))
		if err != nil {
			slog.Error("orcamentos: delete item", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		if !found {
			respond.Error(w, http.StatusNotFound, "item não encontrado", "NOT_FOUND")
			return
		}
		_ = orc // total recalculado; 204 sem corpo conforme convenção de DELETE
		respond.NoContent(w)
	}
}
