// Package handlers contém os handlers HTTP de cada recurso. Os recursos de
// negócio são registrados por funções Register<Nome>(mux, app); auth é ligado
// diretamente pelo router. Handlers de negócio começam como stubs 501 para que
// os agentes da Wave B só preencham o corpo do próprio arquivo.
package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"

	"github.com/lucsb/artemise/backend/internal/app"
	"github.com/lucsb/artemise/backend/internal/auth"
	"github.com/lucsb/artemise/backend/internal/respond"
)

const sessionCookie = "session_token"

type loginRequest struct {
	Email string `json:"email"`
	Senha string `json:"senha"`
}

type loginResponse struct {
	ID           string `json:"id"`
	Nome         string `json:"nome"`
	Email        string `json:"email"`
	PerfilAcesso string `json:"perfilAcesso"`
	ClinicaID    string `json:"clinicaId"`
}

// Login valida credenciais, cria a sessão e seta o cookie httpOnly.
// Rota pública (não passa pelos middlewares de sessão/RLS); usa o pool direto.
func Login(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req loginRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			respond.Error(w, http.StatusBadRequest, "payload inválido", "VALIDATION_ERROR")
			return
		}
		req.Email = strings.TrimSpace(strings.ToLower(req.Email))
		if req.Email == "" || req.Senha == "" {
			respond.Error(w, http.StatusBadRequest, "email e senha são obrigatórios", "VALIDATION_ERROR")
			return
		}

		var (
			id, nome, email, perfil, clinicaID, senhaHash string
			ativo                                         bool
		)
		err := a.Pool.QueryRow(r.Context(), `
			SELECT id, nome, email, perfil_acesso, clinica_id, senha_hash, ativo
			FROM usuarios
			WHERE lower(email) = $1`,
			req.Email,
		).Scan(&id, &nome, &email, &perfil, &clinicaID, &senhaHash, &ativo)
		if errors.Is(err, pgx.ErrNoRows) {
			respond.Error(w, http.StatusUnauthorized, "Email ou senha incorretos", "INVALID_CREDENTIALS")
			return
		}
		if err != nil {
			slog.Error("login: buscar usuário", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}

		ok, err := auth.VerifyPassword(senhaHash, req.Senha)
		if err != nil || !ok {
			respond.Error(w, http.StatusUnauthorized, "Email ou senha incorretos", "INVALID_CREDENTIALS")
			return
		}
		if !ativo {
			respond.Error(w, http.StatusForbidden, "usuário inativo", "USER_INACTIVE")
			return
		}

		token, err := newToken()
		if err != nil {
			slog.Error("login: gerar token", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		expiraEm := time.Now().Add(a.Cfg.SessionTTL)
		if _, err := a.Pool.Exec(r.Context(),
			`INSERT INTO sessions (token, usuario_id, expira_em) VALUES ($1, $2, $3)`,
			token, id, expiraEm,
		); err != nil {
			slog.Error("login: criar sessão", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:     sessionCookie,
			Value:    token,
			Path:     "/",
			HttpOnly: true,
			Secure:   a.Cfg.IsProd(),
			SameSite: http.SameSiteLaxMode,
			Expires:  expiraEm,
			MaxAge:   int(a.Cfg.SessionTTL.Seconds()),
		})

		respond.JSON(w, http.StatusOK, loginResponse{
			ID: id, Nome: nome, Email: email, PerfilAcesso: perfil, ClinicaID: clinicaID,
		})
	}
}

// newToken gera um token de sessão opaco (32 bytes aleatórios em hex).
func newToken() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}
