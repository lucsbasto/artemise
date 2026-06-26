package handlers

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"

	"github.com/jackc/pgx/v5"

	"github.com/lucsb/artemise/backend/internal/respond"
)

// listResponse padroniza o envelope das listagens: items + metadados de página
// (design §5.1). O frontend consome `.items` via Collection<T>.
type listResponse[T any] struct {
	Items    []T `json:"items"`
	Total    int `json:"total"`
	Page     int `json:"page"`
	PageSize int `json:"pageSize"`
}

// decodeBody decodifica o corpo JSON em dst; responde 400 e devolve false em erro.
func decodeBody(w http.ResponseWriter, r *http.Request, dst any) bool {
	if err := json.NewDecoder(r.Body).Decode(dst); err != nil {
		respond.Error(w, http.StatusBadRequest, "payload inválido", "VALIDATION_ERROR")
		return false
	}
	return true
}

// dbError traduz erros de query em respostas HTTP: 404 para ErrNoRows, 500 demais.
func dbError(w http.ResponseWriter, err error, op string) {
	if errors.Is(err, pgx.ErrNoRows) {
		respond.Error(w, http.StatusNotFound, "recurso não encontrado", "NOT_FOUND")
		return
	}
	slog.Error(op, "err", err)
	respond.Error(w, http.StatusInternalServerError, "erro interno", "INTERNAL")
}

// fieldSet acumula pares coluna/valor para INSERT e UPDATE parciais, montados a
// partir de structs de entrada com campos ponteiro (nil = ausente).
type fieldSet struct {
	cols []string
	vals []any
}

// set registra uma coluna e seu valor no conjunto.
func (f *fieldSet) set(col string, v any) {
	f.cols = append(f.cols, col)
	f.vals = append(f.vals, v)
}
