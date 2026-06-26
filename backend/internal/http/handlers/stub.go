package handlers

import (
	"net/http"

	"github.com/lucsb/artemise/backend/internal/respond"
)

// notImplemented é o handler placeholder usado por todas as rotas de recurso
// ainda não implementadas. Os agentes da Wave B substituem estes corpos pela
// lógica real no arquivo de cada recurso, sem tocar no router.
func notImplemented(w http.ResponseWriter, _ *http.Request) {
	respond.Error(w, http.StatusNotImplemented, "não implementado", "NOT_IMPLEMENTED")
}
