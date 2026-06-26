// Package app contém o contexto compartilhado da aplicação HTTP: a struct App
// (pool + config), o usuário injetado por request e os middlewares de
// autenticação e isolamento RLS. É importado tanto pelos handlers quanto pelo
// router, sem nunca importá-los de volta (evita ciclo de import).
package app

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/lucsb/artemise/backend/internal/config"
)

// App reúne as dependências de processo passadas aos handlers.
type App struct {
	Pool *pgxpool.Pool
	Cfg  config.Config
}

// UserCtx são os dados da sessão autenticada injetados no contexto do request.
type UserCtx struct {
	ID           string
	ClinicaID    string
	PerfilAcesso string
	Nome         string
	Email        string
}

type ctxKey int

const (
	userKey ctxKey = iota
	txKey
)

// withUser retorna um contexto carregando o usuário autenticado.
func withUser(ctx context.Context, u *UserCtx) context.Context {
	return context.WithValue(ctx, userKey, u)
}

// UserFrom recupera o usuário autenticado do contexto (nil se ausente).
func UserFrom(ctx context.Context) *UserCtx {
	u, _ := ctx.Value(userKey).(*UserCtx)
	return u
}

// withTx retorna um contexto carregando a transação do request.
func withTx(ctx context.Context, tx pgx.Tx) context.Context {
	return context.WithValue(ctx, txKey, tx)
}

// TxFrom recupera a transação pgx do contexto (nil se ausente). Os handlers de
// recursos de negócio devem usá-la para que o RLS por clinica_id seja aplicado.
func TxFrom(ctx context.Context) pgx.Tx {
	tx, _ := ctx.Value(txKey).(pgx.Tx)
	return tx
}
