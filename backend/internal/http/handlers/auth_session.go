package handlers

import (
	"log/slog"
	"net/http"

	"github.com/lucsb/artemise/backend/internal/app"
	"github.com/lucsb/artemise/backend/internal/respond"
)

// Logout deleta a sessão atual e limpa o cookie. Rota protegida.
func Logout(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if c, err := r.Cookie(sessionCookie); err == nil && c.Value != "" {
			if _, err := a.Pool.Exec(r.Context(),
				`DELETE FROM sessions WHERE token = $1`, c.Value); err != nil {
				slog.Error("logout: deletar sessão", "err", err)
			}
		}
		http.SetCookie(w, &http.Cookie{
			Name:     sessionCookie,
			Value:    "",
			Path:     "/",
			HttpOnly: true,
			Secure:   a.Cfg.IsProd(),
			SameSite: http.SameSiteLaxMode,
			MaxAge:   -1,
		})
		respond.JSON(w, http.StatusOK, map[string]string{"status": "ok"})
	}
}

// Me retorna os dados do usuário autenticado injetado no contexto.
func Me(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		u := app.UserFrom(r.Context())
		if u == nil {
			respond.Error(w, http.StatusUnauthorized, "sessão ausente", "UNAUTHORIZED")
			return
		}
		respond.JSON(w, http.StatusOK, loginResponse{
			ID: u.ID, Nome: u.Nome, Email: u.Email, PerfilAcesso: u.PerfilAcesso, ClinicaID: u.ClinicaID,
		})
	}
}
