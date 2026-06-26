package app

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/jackc/pgx/v5"

	"github.com/lucsb/artemise/backend/internal/respond"
)

// cookieName é o nome do cookie de sessão (httpOnly).
const cookieName = "session_token"

// RequireSession lê o cookie de sessão, resolve o usuário/clínica e injeta
// UserCtx no contexto. Responde 401 se ausente ou expirada.
//
// A query roda fora da transação RLS (no pool), pois precede o SET LOCAL do
// clinica_id; as tabelas sessions/usuarios não têm RLS por isso (ver 002_rls).
func (a *App) RequireSession(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		c, err := r.Cookie(cookieName)
		if err != nil || c.Value == "" {
			respond.Error(w, http.StatusUnauthorized, "sessão ausente", "UNAUTHORIZED")
			return
		}

		var u UserCtx
		err = a.Pool.QueryRow(r.Context(), `
			SELECT u.id, u.clinica_id, u.perfil_acesso, u.nome, u.email
			FROM sessions s
			JOIN usuarios u ON u.id = s.usuario_id
			WHERE s.token = $1 AND s.expira_em > now()`,
			c.Value,
		).Scan(&u.ID, &u.ClinicaID, &u.PerfilAcesso, &u.Nome, &u.Email)
		if errors.Is(err, pgx.ErrNoRows) {
			respond.Error(w, http.StatusUnauthorized, "sessão inválida ou expirada", "UNAUTHORIZED")
			return
		}
		if err != nil {
			slog.Error("middleware: resolver sessão", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}

		ctx := withUser(r.Context(), &u)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// WithTx abre uma transação por request, configura o contexto RLS via
// set_config (app.clinica_id / app.user_id / app.perfil_acesso) e armazena a
// pgx.Tx no contexto. Commit em sucesso; rollback em panic ou status >= 500.
// Deve ser empilhado DEPOIS de RequireSession (precisa do UserCtx).
func (a *App) WithTx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		u := UserFrom(r.Context())
		if u == nil {
			respond.Error(w, http.StatusUnauthorized, "sessão ausente", "UNAUTHORIZED")
			return
		}

		ctx := r.Context()
		conn, err := a.Pool.Acquire(ctx)
		if err != nil {
			slog.Error("middleware: acquire conn", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		defer conn.Release()

		tx, err := conn.Begin(ctx)
		if err != nil {
			slog.Error("middleware: begin tx", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}

		// set_config(name, value, is_local=true) equivale a SET LOCAL: vale só
		// dentro desta transação, sem vazar entre requests no pool.
		if _, err := tx.Exec(ctx, `
			SELECT set_config('app.clinica_id', $1, true),
			       set_config('app.user_id', $2, true),
			       set_config('app.perfil_acesso', $3, true)`,
			u.ClinicaID, u.ID, u.PerfilAcesso,
		); err != nil {
			_ = tx.Rollback(ctx)
			slog.Error("middleware: set_config rls", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}

		rec := &statusRecorder{ResponseWriter: w, status: http.StatusOK}

		defer func() {
			if p := recover(); p != nil {
				_ = tx.Rollback(ctx)
				slog.Error("middleware: panic no handler", "panic", p)
				panic(p) // deixa o recover de topo registrar/responder
			}
		}()

		next.ServeHTTP(rec, r.WithContext(withTx(ctx, tx)))

		if rec.status >= 500 {
			if err := tx.Rollback(ctx); err != nil && !errors.Is(err, pgx.ErrTxClosed) {
				slog.Error("middleware: rollback", "err", err)
			}
			return
		}
		if err := tx.Commit(ctx); err != nil {
			slog.Error("middleware: commit", "err", err)
		}
	})
}

// Recover captura panics não tratados e responde 500, evitando derrubar o server.
func Recover(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if p := recover(); p != nil {
				slog.Error("recover: panic", "panic", p, "path", r.URL.Path)
				respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			}
		}()
		next.ServeHTTP(w, r)
	})
}

// statusRecorder captura o status HTTP escrito pelo handler para decidir
// commit vs. rollback da transação.
type statusRecorder struct {
	http.ResponseWriter
	status      int
	wroteHeader bool
}

func (s *statusRecorder) WriteHeader(code int) {
	if !s.wroteHeader {
		s.status = code
		s.wroteHeader = true
	}
	s.ResponseWriter.WriteHeader(code)
}

func (s *statusRecorder) Write(b []byte) (int, error) {
	if !s.wroteHeader {
		s.wroteHeader = true
	}
	return s.ResponseWriter.Write(b)
}
