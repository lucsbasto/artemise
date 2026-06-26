package handlers

import (
	"log/slog"
	"net/http"
	"time"

	"github.com/lucsb/artemise/backend/internal/app"
	"github.com/lucsb/artemise/backend/internal/domain"
	"github.com/lucsb/artemise/backend/internal/respond"
	"github.com/lucsb/artemise/backend/internal/store"
)

// RegisterFinanceiroReports registra os relatórios financeiros computados
// (RF-55..63; BK-25, BK-26).
func RegisterFinanceiroReports(mux *http.ServeMux, a *app.App) {
	mux.HandleFunc("GET /api/financeiro/extrato", financeiroExtrato(a))
	mux.HandleFunc("GET /api/financeiro/competencia", financeiroCompetencia(a))
	mux.HandleFunc("GET /api/financeiro/fluxo", financeiroFluxo(a))
	mux.HandleFunc("GET /api/financeiro/categorias", financeiroCategorias(a))
	mux.HandleFunc("GET /api/financeiro/contas-receber", financeiroContasReceber(a))
	mux.HandleFunc("GET /api/financeiro/contas-pagar", financeiroContasPagar(a))
	mux.HandleFunc("GET /api/financeiro/comissoes", financeiroComissoes(a))
}

// financeiroExtrato — ?data_ini=&data_fim= (default mês corrente).
func financeiroExtrato(_ *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		inicio, fim := periodo(r, "data_ini", "data_fim")
		resp, err := store.Extrato(r.Context(), tx, inicio, fim)
		if err != nil {
			slog.Error("financeiro: extrato", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro ao computar extrato", "INTERNAL")
			return
		}
		respond.JSON(w, http.StatusOK, resp)
	}
}

// financeiroCompetencia — ?mes=YYYY-MM (default mês corrente).
func financeiroCompetencia(_ *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		resp, err := store.Competencia(r.Context(), tx, mesRef(r, "mes"))
		if err != nil {
			slog.Error("financeiro: competência", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro ao computar competência", "INTERNAL")
			return
		}
		respond.JSON(w, http.StatusOK, resp)
	}
}

// financeiroFluxo — ?granularidade=dia|mes&ref=YYYY-MM (default mes, mês corrente).
func financeiroFluxo(_ *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		ref := mesRef(r, "ref")

		var (
			rows []domain.FluxoRow
			err  error
		)
		if r.URL.Query().Get("granularidade") == "dia" {
			rows, err = store.FluxoDiario(r.Context(), tx, ref)
		} else {
			rows, err = store.FluxoMensal(r.Context(), tx, ref)
		}
		if err != nil {
			slog.Error("financeiro: fluxo", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro ao computar fluxo", "INTERNAL")
			return
		}
		respond.JSON(w, http.StatusOK, rows)
	}
}

// financeiroCategorias — ?mes=YYYY-MM (default mês corrente).
func financeiroCategorias(_ *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		resp, err := store.Categorias(r.Context(), tx, mesRef(r, "mes"))
		if err != nil {
			slog.Error("financeiro: categorias", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro ao computar categorias", "INTERNAL")
			return
		}
		respond.JSON(w, http.StatusOK, resp)
	}
}

// financeiroContasReceber — lançamentos de receita paginados (?situacao= opcional).
func financeiroContasReceber(_ *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		contasPaginadas(w, r, "receita")
	}
}

// financeiroContasPagar — lançamentos de despesa paginados (?situacao= opcional).
func financeiroContasPagar(_ *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		contasPaginadas(w, r, "despesa")
	}
}

// contasPaginadas é o corpo comum de contas-receber/contas-pagar.
func contasPaginadas(w http.ResponseWriter, r *http.Request, tipo string) {
	tx := app.TxFrom(r.Context())
	p := store.ParseListParams(r)
	situacao := r.URL.Query().Get("situacao")

	items, total, err := store.ListLancamentos(r.Context(), tx, tipo, situacao, p)
	if err != nil {
		slog.Error("financeiro: contas", "tipo", tipo, "err", err)
		respond.Error(w, http.StatusInternalServerError, "erro ao listar contas", "INTERNAL")
		return
	}
	respond.JSON(w, http.StatusOK, map[string]any{
		"items": items, "total": total, "page": p.Page, "pageSize": p.Limit,
	})
}

// financeiroComissoes — comissões por profissional no mês (?mes=YYYY-MM).
func financeiroComissoes(_ *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tx := app.TxFrom(r.Context())
		mes := mesRef(r, "mes")
		inicio := mes
		fim := mes.AddDate(0, 1, 0).Add(-time.Nanosecond)

		items, err := store.Comissoes(r.Context(), tx, inicio, fim)
		if err != nil {
			slog.Error("financeiro: comissões", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro ao computar comissões", "INTERNAL")
			return
		}
		respond.JSON(w, http.StatusOK, map[string]any{"items": items})
	}
}
