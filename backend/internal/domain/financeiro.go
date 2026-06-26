package domain

import "math"

// CashflowPoint — ponto de fluxo de caixa diário/mensal. Espelha o tipo
// homônimo de web/src/lib/mock.ts (saídas chegam negativas).
type CashflowPoint struct {
	Label             string  `json:"label"`
	Entradas          float64 `json:"entradas"`
	EntradasPrevistas float64 `json:"entradasPrevistas"`
	Saidas            float64 `json:"saidas"` // negativo
	SaidasPrevistas   float64 `json:"saidasPrevistas"`
	Saldo             float64 `json:"saldo"`
	SaldoPrevisto     float64 `json:"saldoPrevisto"`
}

// FluxoRow — linha derivada da tabela de fluxo, com saldo encadeado.
type FluxoRow struct {
	Label        string  `json:"label"`
	SaldoInicial float64 `json:"saldoInicial"`
	Entrada      float64 `json:"entrada"`
	Saida        float64 `json:"saida"`
	Lucro        float64 `json:"lucro"`
	SaldoFinal   float64 `json:"saldoFinal"`
}

// FluxoRows encadeia o saldo de uma série de fluxo de caixa.
// Porta direta de fluxoRows() em web/src/lib/financeiro-calc.ts:
//   - lucro = entrada - saída (saída chega negativa em CashflowPoint)
//   - saldoFinal = saldoInicial + lucro
//   - saldoInicial[n+1] = saldoFinal[n]
func FluxoRows(points []CashflowPoint, saldoInicial float64) []FluxoRow {
	inicial := saldoInicial
	rows := make([]FluxoRow, len(points))
	for i, p := range points {
		entrada := p.Entradas
		saida := math.Abs(p.Saidas)
		lucro := entrada - saida
		saldoFinal := inicial + lucro
		rows[i] = FluxoRow{
			Label:        p.Label,
			SaldoInicial: inicial,
			Entrada:      entrada,
			Saida:        saida,
			Lucro:        lucro,
			SaldoFinal:   saldoFinal,
		}
		inicial = saldoFinal
	}
	return rows
}

// Percentual de uma parte sobre o total. Retorna 0 quando total = 0 (sem NaN).
// Porta de percentual() em financeiro-calc.ts (arredonda para inteiro).
func Percentual(valor, total float64) float64 {
	if total == 0 {
		return 0
	}
	return math.Round((math.Abs(valor) / math.Abs(total)) * 100)
}

// SomaSaldos soma os saldos das contas. Porta de somaSaldos().
func SomaSaldos(contas []ContaFinanceira) float64 {
	var soma float64
	for _, c := range contas {
		soma += c.Saldo
	}
	return soma
}

// CategoriaReportNode — nó da árvore de relatório de categorias (receitas /
// despesas), com percentual sobre o grupo. Espelha CategoriaReportNode do mock.
type CategoriaReportNode struct {
	Nome       string                `json:"nome"`
	Valor      float64               `json:"valor"`
	Percentual float64               `json:"percentual"`
	Cor        string                `json:"cor,omitempty"`
	Filhos     []CategoriaReportNode `json:"filhos,omitempty"`
}

// TotalNode — total de um nó: soma dos filhos quando houver, senão o valor
// próprio. Porta de totalNode() em financeiro-calc.ts.
func TotalNode(node CategoriaReportNode) float64 {
	if len(node.Filhos) > 0 {
		var soma float64
		for _, f := range node.Filhos {
			soma += f.Valor
		}
		return soma
	}
	return node.Valor
}
