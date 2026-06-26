// Package store reúne helpers de acesso a dados reutilizados pelos stores de
// cada recurso (paginação, scan genérico via pgx). As queries específicas de
// cada entidade vivem em arquivos próprios (pacientes.go, agenda.go, ...).
package store

import (
	"context"
	"net/http"
	"strconv"

	"github.com/jackc/pgx/v5"
)

// Defaults de paginação.
const (
	DefaultPage  = 1
	DefaultLimit = 25
	MaxLimit     = 1000
)

// ListParams agrega os parâmetros de listagem aceitos por todos os endpoints
// de coleção. q/sort são opcionais (D-01); page/limit têm defaults.
type ListParams struct {
	Q     string
	Sort  string
	Page  int
	Limit int
}

// Offset converte page/limit no OFFSET de SQL.
func (p ListParams) Offset() int { return (p.Page - 1) * p.Limit }

// ParseListParams lê ?q=&sort=&page=&limit= com defaults (page=1, limit=25).
func ParseListParams(r *http.Request) ListParams {
	q := r.URL.Query()
	p := ListParams{
		Q:     q.Get("q"),
		Sort:  q.Get("sort"),
		Page:  DefaultPage,
		Limit: DefaultLimit,
	}
	if v, err := strconv.Atoi(q.Get("page")); err == nil && v > 0 {
		p.Page = v
	}
	if v, err := strconv.Atoi(q.Get("limit")); err == nil && v > 0 {
		p.Limit = v
		if p.Limit > MaxLimit {
			p.Limit = MaxLimit
		}
	}
	// Aceita também ?pageSize= (convenção do design §5.1) como alias de limit.
	if q.Get("limit") == "" {
		if v, err := strconv.Atoi(q.Get("pageSize")); err == nil && v > 0 {
			p.Limit = v
			if p.Limit > MaxLimit {
				p.Limit = MaxLimit
			}
		}
	}
	return p
}

// Queryer abstrai o que pgx.Tx e pgxpool.Pool têm em comum para os helpers
// genéricos: a execução de uma query que retorna linhas.
type Queryer interface {
	Query(ctx context.Context, sql string, args ...any) (pgx.Rows, error)
}

// CollectStruct executa sql e mapeia cada linha para T via RowToStructByName.
// T deve ter tags `db` casando as colunas selecionadas.
func CollectStruct[T any](ctx context.Context, db Queryer, sql string, args ...any) ([]T, error) {
	rows, err := db.Query(ctx, sql, args...)
	if err != nil {
		return nil, err
	}
	return pgx.CollectRows(rows, pgx.RowToStructByName[T])
}

// GetStruct executa sql esperando uma única linha e mapeia para T.
// Retorna pgx.ErrNoRows quando nada é encontrado.
func GetStruct[T any](ctx context.Context, db Queryer, sql string, args ...any) (T, error) {
	var zero T
	rows, err := db.Query(ctx, sql, args...)
	if err != nil {
		return zero, err
	}
	v, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[T])
	if err != nil {
		return zero, err
	}
	return v, nil
}
