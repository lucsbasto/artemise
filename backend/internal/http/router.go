// Package httpapi monta o http.Handler raiz da API: rotas públicas (health,
// login) e rotas protegidas (todas as demais), estas envolvidas pelos
// middlewares de sessão e transação RLS.
//
// IMPORTANTE: cada recurso é registrado por uma função Register<Nome> no
// pacote handlers. Adicionar/implementar um recurso NÃO requer editar este
// arquivo além da linha de registro — assim os agentes de cada recurso só
// tocam no próprio handler/store, sem conflito em router.go.
package httpapi

import (
	"net/http"
	"time"

	"github.com/lucsb/artemise/backend/internal/app"
	"github.com/lucsb/artemise/backend/internal/http/handlers"
	"github.com/lucsb/artemise/backend/internal/respond"
)

// NewRouter monta e devolve o handler raiz da aplicação.
func NewRouter(a *app.App) http.Handler {
	root := http.NewServeMux()

	// --- Rotas públicas (sem sessão) ---
	root.HandleFunc("GET /api/health", health)
	root.HandleFunc("POST /api/auth/login", handlers.Login(a))

	// --- Rotas protegidas (sessão + transação RLS) ---
	protected := http.NewServeMux()
	protected.HandleFunc("POST /api/auth/logout", handlers.Logout(a))
	protected.HandleFunc("GET /api/auth/me", handlers.Me(a))

	registerResources(protected, a)

	// Tudo sob /api/ que não casou uma rota pública cai no mux protegido,
	// envolvido por RequireSession (resolve usuário) + WithTx (abre tx + RLS).
	root.Handle("/api/", a.RequireSession(a.WithTx(protected)))

	return app.Recover(root)
}

// registerResources liga todos os recursos de negócio ao mux protegido.
func registerResources(mux *http.ServeMux, a *app.App) {
	handlers.RegisterPacientes(mux, a)
	handlers.RegisterProfissionais(mux, a)
	handlers.RegisterProfissionalDetalhe(mux, a)
	handlers.RegisterFornecedores(mux, a)
	handlers.RegisterProcedimentos(mux, a)
	handlers.RegisterPacotes(mux, a)
	handlers.RegisterEstoque(mux, a)
	handlers.RegisterFinanceiroCadastros(mux, a)
	handlers.RegisterConfigRecursos(mux, a)
	handlers.RegisterRegistros(mux, a)
	handlers.RegisterOrcamentos(mux, a)
	handlers.RegisterDashboard(mux, a)
	handlers.RegisterAgenda(mux, a)
	handlers.RegisterFinanceiroReports(mux, a)
}

// health responde o liveness check (RF/BK-3).
func health(w http.ResponseWriter, _ *http.Request) {
	respond.JSON(w, http.StatusOK, map[string]string{
		"status": "ok",
		"ts":     time.Now().UTC().Format(time.RFC3339),
	})
}
