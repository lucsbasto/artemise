package handlers

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5"

	"github.com/lucsb/artemise/backend/internal/app"
	"github.com/lucsb/artemise/backend/internal/respond"
	"github.com/lucsb/artemise/backend/internal/store"
)

// RegisterAgenda registra eventos da agenda e os relatórios de agenda
// (RF-42..45, RF-53, RF-54; BK-24).
func RegisterAgenda(mux *http.ServeMux, a *app.App) {
	// Eventos (CRUD)
	mux.HandleFunc("GET /api/eventos-agenda", eventosList(a))
	mux.HandleFunc("POST /api/eventos-agenda", eventosCreate(a))
	mux.HandleFunc("GET /api/eventos-agenda/proximos", eventosProximos(a))
	mux.HandleFunc("GET /api/eventos-agenda/{id}", eventoGet(a))
	mux.HandleFunc("PATCH /api/eventos-agenda/{id}", eventoPatch(a))
	mux.HandleFunc("DELETE /api/eventos-agenda/{id}", eventoDelete(a))

	// Relatórios de agenda (computados)
	mux.HandleFunc("GET /api/agenda/visao-geral", agendaVisaoGeral(a))
	mux.HandleFunc("GET /api/agenda/relatorio", agendaRelatorio(a))
}

// eventosList lista eventos numa janela [inicio, fim] (default: mês corrente).
func eventosList(_ *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		inicio, fim := periodo(r, "inicio", "fim")
		items, err := store.EventosList(r.Context(), tx, inicio, fim)
		if err != nil {
			slog.Error("eventos: list", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro ao listar eventos", "INTERNAL")
			return
		}
		respond.JSON(w, http.StatusOK, map[string]any{"items": items})
	}
}

// eventosProximos lista os próximos eventos nas próximas 24h.
func eventosProximos(_ *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		items, err := store.EventosProximos(r.Context(), tx)
		if err != nil {
			slog.Error("eventos: próximos", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro ao listar próximos", "INTERNAL")
			return
		}
		respond.JSON(w, http.StatusOK, map[string]any{"items": items})
	}
}

// eventosCreate cria um evento.
func eventosCreate(_ *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var in store.EventoInput
		if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
			respond.Error(w, http.StatusBadRequest, "payload inválido", "VALIDATION_ERROR")
			return
		}
		if in.Inicio == nil || in.Fim == nil {
			respond.Error(w, http.StatusBadRequest, "início e fim são obrigatórios", "VALIDATION_ERROR")
			return
		}
		tx := app.TxFrom(r.Context())
		ev, err := store.EventoCreate(r.Context(), tx, in)
		if err != nil {
			slog.Error("eventos: create", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro ao criar evento", "INTERNAL")
			return
		}
		respond.JSON(w, http.StatusCreated, ev)
	}
}

// eventoGet busca um evento por id.
func eventoGet(_ *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		ev, err := store.EventoGet(r.Context(), tx, r.PathValue("id"))
		if errors.Is(err, pgx.ErrNoRows) {
			respond.Error(w, http.StatusNotFound, "evento não encontrado", "NOT_FOUND")
			return
		}
		if err != nil {
			slog.Error("eventos: get", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro ao buscar evento", "INTERNAL")
			return
		}
		respond.JSON(w, http.StatusOK, ev)
	}
}

// eventoPatch aplica um update parcial.
func eventoPatch(_ *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var in store.EventoInput
		if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
			respond.Error(w, http.StatusBadRequest, "payload inválido", "VALIDATION_ERROR")
			return
		}
		tx := app.TxFrom(r.Context())
		ev, err := store.EventoUpdate(r.Context(), tx, r.PathValue("id"), in)
		if errors.Is(err, pgx.ErrNoRows) {
			respond.Error(w, http.StatusNotFound, "evento não encontrado", "NOT_FOUND")
			return
		}
		if err != nil {
			slog.Error("eventos: patch", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro ao atualizar evento", "INTERNAL")
			return
		}
		respond.JSON(w, http.StatusOK, ev)
	}
}

// eventoDelete remove um evento (204 mesmo se já ausente é tratado como 404).
func eventoDelete(_ *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		n, err := store.EventoDelete(r.Context(), tx, r.PathValue("id"))
		if err != nil {
			slog.Error("eventos: delete", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro ao remover evento", "INTERNAL")
			return
		}
		if n == 0 {
			respond.Error(w, http.StatusNotFound, "evento não encontrado", "NOT_FOUND")
			return
		}
		respond.NoContent(w)
	}
}

// agendaVisaoGeral computa o panorama da agenda no período.
func agendaVisaoGeral(_ *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		inicio, fim := periodo(r, "data_ini", "data_fim")
		vg, err := store.AgendaVisaoGeral(r.Context(), tx, inicio, fim)
		if err != nil {
			slog.Error("agenda: visão-geral", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro ao computar visão-geral", "INTERNAL")
			return
		}
		respond.JSON(w, http.StatusOK, vg)
	}
}

// agendaRelatorio lista eventos paginados aplicando os filtros do relatório.
func agendaRelatorio(_ *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		p := store.ParseListParams(r)
		q := r.URL.Query()

		f := store.AgendaRelatorioFiltros{
			Status:         q.Get("status"),
			ProfissionalID: q.Get("profissional_id"),
			PacienteID:     q.Get("paciente_id"),
		}
		if v, ok := parseDate(q.Get("data_ini")); ok {
			f.DataIni = &v
		}
		if v, ok := parseDate(q.Get("data_fim")); ok {
			vf := time.Date(v.Year(), v.Month(), v.Day(), 23, 59, 59, 0, v.Location()) // fim do dia
			f.DataFim = &vf
		}

		items, total, err := store.AgendaRelatorio(r.Context(), tx, f, p)
		if err != nil {
			slog.Error("agenda: relatório", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro ao gerar relatório", "INTERNAL")
			return
		}
		respond.JSON(w, http.StatusOK, map[string]any{"items": items, "total": total})
	}
}
