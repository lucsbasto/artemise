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

type registerRequest struct {
	Nome    string `json:"nome"`
	Clinica string `json:"clinica"`
	Email   string `json:"email"`
	Senha   string `json:"senha"`
}

// Register cria uma nova clínica (tenant) e seu usuário admin, abre a sessão e
// seta o cookie httpOnly — o usuário já entra logado. Rota pública (não passa
// pelos middlewares de sessão/RLS); usa o pool direto em uma transação para que
// clínica + usuário sejam criados atomicamente.
func Register(a *app.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req registerRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			respond.Error(w, http.StatusBadRequest, "payload inválido", "VALIDATION_ERROR")
			return
		}
		req.Nome = strings.TrimSpace(req.Nome)
		req.Clinica = strings.TrimSpace(req.Clinica)
		req.Email = strings.TrimSpace(strings.ToLower(req.Email))
		if req.Nome == "" || req.Clinica == "" || req.Email == "" {
			respond.Error(w, http.StatusBadRequest, "nome, clínica e email são obrigatórios", "VALIDATION_ERROR")
			return
		}
		if len(req.Senha) < 8 {
			respond.Error(w, http.StatusBadRequest, "a senha deve ter ao menos 8 caracteres", "VALIDATION_ERROR")
			return
		}

		// Email único globalmente: o login resolve usuário só por email (sem
		// clínica), então emails duplicados entre tenants quebrariam o login.
		var exists bool
		if err := a.Pool.QueryRow(r.Context(),
			`SELECT EXISTS(SELECT 1 FROM usuarios WHERE lower(email) = $1)`, req.Email,
		).Scan(&exists); err != nil {
			slog.Error("register: checar email", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		if exists {
			respond.Error(w, http.StatusConflict, "Já existe uma conta com este email", "EMAIL_TAKEN")
			return
		}

		senhaHash, err := auth.HashPassword(req.Senha, auth.Params{
			Time:    a.Cfg.Argon2Time,
			Memory:  a.Cfg.Argon2Memory,
			Threads: a.Cfg.Argon2Threads,
			KeyLen:  a.Cfg.Argon2KeyLen,
			SaltLen: a.Cfg.Argon2SaltLen,
		})
		if err != nil {
			slog.Error("register: hash senha", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}

		tx, err := a.Pool.Begin(r.Context())
		if err != nil {
			slog.Error("register: begin tx", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		defer tx.Rollback(r.Context())

		var clinicaID string
		if err := tx.QueryRow(r.Context(),
			`INSERT INTO clinicas (nome, slug) VALUES ($1, $2) RETURNING id`,
			req.Clinica, newSlug(req.Clinica),
		).Scan(&clinicaID); err != nil {
			slog.Error("register: criar clínica", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}

		var userID string
		if err := tx.QueryRow(r.Context(),
			`INSERT INTO usuarios (clinica_id, nome, email, senha_hash, perfil_acesso)
			 VALUES ($1, $2, $3, $4, 'admin') RETURNING id`,
			clinicaID, req.Nome, req.Email, senhaHash,
		).Scan(&userID); err != nil {
			slog.Error("register: criar usuário", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}

		token, err := newToken()
		if err != nil {
			slog.Error("register: gerar token", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}
		expiraEm := time.Now().Add(a.Cfg.SessionTTL)
		if _, err := tx.Exec(r.Context(),
			`INSERT INTO sessions (token, usuario_id, expira_em) VALUES ($1, $2, $3)`,
			token, userID, expiraEm,
		); err != nil {
			slog.Error("register: criar sessão", "err", err)
			respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
			return
		}

		if err := tx.Commit(r.Context()); err != nil {
			slog.Error("register: commit tx", "err", err)
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

		respond.JSON(w, http.StatusCreated, loginResponse{
			ID: userID, Nome: req.Nome, Email: req.Email, PerfilAcesso: "admin", ClinicaID: clinicaID,
		})
	}
}

// newSlug deriva um slug url-safe do nome da clínica e anexa um sufixo aleatório
// para garantir a unicidade exigida por clinicas.slug sem precisar de retry.
func newSlug(nome string) string {
	var b strings.Builder
	prevDash := false
	for _, r := range strings.ToLower(nome) {
		switch {
		case r >= 'a' && r <= 'z', r >= '0' && r <= '9':
			b.WriteRune(r)
			prevDash = false
		default:
			if !prevDash && b.Len() > 0 {
				b.WriteByte('-')
				prevDash = true
			}
		}
	}
	base := strings.Trim(b.String(), "-")
	if base == "" {
		base = "clinica"
	}
	suffix := make([]byte, 4)
	if _, err := rand.Read(suffix); err != nil {
		return base
	}
	return base + "-" + hex.EncodeToString(suffix)
}

// newToken gera um token de sessão opaco (32 bytes aleatórios em hex).
func newToken() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}
