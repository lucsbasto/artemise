package handlers

import (
	"net/http"
	"time"
)

// Helpers compartilhados pelos handlers computados (dashboard, agenda,
// financeiro): parsing de datas e janelas de período com defaults sensatos.

// parseDate lê uma data "YYYY-MM-DD". Retorna ok=false se vazia/ inválida.
func parseDate(s string) (time.Time, bool) {
	if s == "" {
		return time.Time{}, false
	}
	t, err := time.Parse("2006-01-02", s)
	if err != nil {
		return time.Time{}, false
	}
	return t, true
}

// periodo lê ?<iniKey>=&<fimKey>= (YYYY-MM-DD). Default: do primeiro dia do mês
// corrente até hoje. fim é normalizado para o fim do dia (23:59:59) para incluir
// lançamentos com vencimento na data final.
func periodo(r *http.Request, iniKey, fimKey string) (inicio, fim time.Time) {
	now := time.Now()
	q := r.URL.Query()

	if v, ok := parseDate(q.Get(iniKey)); ok {
		inicio = v
	} else {
		inicio = time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	}
	if v, ok := parseDate(q.Get(fimKey)); ok {
		fim = v
	} else {
		fim = now
	}
	fim = time.Date(fim.Year(), fim.Month(), fim.Day(), 23, 59, 59, 0, fim.Location())
	return inicio, fim
}

// mesRef lê ?<key>=YYYY-MM e retorna o primeiro dia desse mês. Default: mês
// corrente. Aceita também YYYY-MM-DD (usa o mês).
func mesRef(r *http.Request, key string) time.Time {
	now := time.Now()
	v := r.URL.Query().Get(key)
	if v == "" {
		return time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	}
	if t, err := time.Parse("2006-01", v); err == nil {
		return t
	}
	if t, err := time.Parse("2006-01-02", v); err == nil {
		return time.Date(t.Year(), t.Month(), 1, 0, 0, 0, 0, t.Location())
	}
	return time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
}
