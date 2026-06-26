// Package respond centraliza a escrita de respostas HTTP em JSON, garantindo
// formato de erro padronizado ({"error","code"}) em toda a API.
package respond

import (
	"encoding/json"
	"log/slog"
	"net/http"
)

// JSON serializa v como JSON com o status informado.
func JSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	if v == nil {
		return
	}
	if err := json.NewEncoder(w).Encode(v); err != nil {
		slog.Error("respond: encode json", "err", err)
	}
}

// Error responde com o formato padrão de erro da API.
func Error(w http.ResponseWriter, status int, msg, code string) {
	JSON(w, status, map[string]string{"error": msg, "code": code})
}

// NoContent responde 204 sem corpo (usado em DELETE).
func NoContent(w http.ResponseWriter) {
	w.WriteHeader(http.StatusNoContent)
}
