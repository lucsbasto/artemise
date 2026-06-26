package store

import (
	"fmt"
	"sort"
	"strings"
	"time"

	"github.com/lucsb/artemise/backend/internal/domain"
)

// mesesAbrevPT são as abreviações de mês usadas nos rótulos de fluxo/dashboard,
// casando o formato do frontend ("18 Jun", "Jun 2026").
var mesesAbrevPT = [...]string{
	"Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
	"Jul", "Ago", "Set", "Out", "Nov", "Dez",
}

// labelDia formata "2 Jan" (dia + mês abreviado).
func labelDia(t time.Time) string {
	return fmt.Sprintf("%d %s", t.Day(), mesesAbrevPT[int(t.Month())-1])
}

// labelMes formata "Jan 2026" (mês abreviado + ano).
func labelMes(t time.Time) string {
	return fmt.Sprintf("%s %d", mesesAbrevPT[int(t.Month())-1], t.Year())
}

// iniciais extrai até duas iniciais maiúsculas de um nome ("Lucas Bastos" -> "LB").
func iniciais(nome string) string {
	campos := strings.Fields(nome)
	if len(campos) == 0 {
		return "?"
	}
	var b strings.Builder
	for _, c := range campos {
		b.WriteString(strings.ToUpper(c[:1]))
		if b.Len() == 2 {
			break
		}
	}
	return b.String()
}

// labelDiaSemana mapeia o dia da semana (0=Dom..6=Sáb) para o rótulo de uma
// letra usado no gráfico "dias movimentados" (D S T Q Q S S).
var labelDiaSemana = [...]string{"D", "S", "T", "Q", "Q", "S", "S"}

// topLabels converte um mapa nome->contagem em rankings ordenados por contagem
// desc (desempate por rótulo), aplicando transformLabel à chave e limitando a
// limit entradas. limit <= 0 não limita.
func topLabels(counts map[string]int, transformLabel func(string) string, limit int) []domain.LabelTotal {
	out := make([]domain.LabelTotal, 0, len(counts))
	for nome, total := range counts {
		label := nome
		if transformLabel != nil {
			label = transformLabel(nome)
		}
		out = append(out, domain.LabelTotal{Label: label, Total: total})
	}
	sort.Slice(out, func(i, j int) bool {
		if out[i].Total != out[j].Total {
			return out[i].Total > out[j].Total
		}
		return out[i].Label < out[j].Label
	})
	if limit > 0 && len(out) > limit {
		out = out[:limit]
	}
	return out
}
