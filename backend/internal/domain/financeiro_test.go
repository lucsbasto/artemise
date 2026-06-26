package domain

import "testing"

// TestFluxoRows valida o encadeamento de saldo: saldoFinal[N] == saldoInicial[N+1].
func TestFluxoRows(t *testing.T) {
	points := []CashflowPoint{
		{Label: "1 Jun", Entradas: 1000, Saidas: -400},
		{Label: "2 Jun", Entradas: 500, Saidas: -200},
		{Label: "3 Jun", Entradas: 0, Saidas: -100},
	}
	rows := FluxoRows(points, 0)

	if len(rows) != len(points) {
		t.Fatalf("esperava %d linhas, obteve %d", len(points), len(rows))
	}

	// Encadeamento: saldoFinal de cada linha = saldoInicial da próxima.
	for i := 0; i < len(rows)-1; i++ {
		if rows[i].SaldoFinal != rows[i+1].SaldoInicial {
			t.Errorf("encadeamento quebrado em %d: saldoFinal=%.2f != saldoInicial[%d]=%.2f",
				i, rows[i].SaldoFinal, i+1, rows[i+1].SaldoInicial)
		}
	}

	// Valores concretos: lucro = entrada - |saida|; saldoFinal acumula.
	want := []struct{ saldoInicial, entrada, saida, lucro, saldoFinal float64 }{
		{0, 1000, 400, 600, 600},
		{600, 500, 200, 300, 900},
		{900, 0, 100, -100, 800},
	}
	for i, w := range want {
		r := rows[i]
		if r.SaldoInicial != w.saldoInicial || r.Entrada != w.entrada ||
			r.Saida != w.saida || r.Lucro != w.lucro || r.SaldoFinal != w.saldoFinal {
			t.Errorf("linha %d = %+v; quer %+v", i, r, w)
		}
	}
}

// TestFluxoRowsSaldoInicial confirma que o saldo inicial propaga na primeira linha.
func TestFluxoRowsSaldoInicial(t *testing.T) {
	rows := FluxoRows([]CashflowPoint{{Label: "x", Entradas: 100, Saidas: 0}}, 250)
	if rows[0].SaldoInicial != 250 {
		t.Errorf("saldoInicial = %.2f; quer 250", rows[0].SaldoInicial)
	}
	if rows[0].SaldoFinal != 350 {
		t.Errorf("saldoFinal = %.2f; quer 350", rows[0].SaldoFinal)
	}
}

func TestPercentual(t *testing.T) {
	cases := []struct {
		valor, total, want float64
	}{
		{50, 200, 25},
		{0, 0, 0},   // sem divisão por zero
		{100, 0, 0}, // total zero -> 0
		{-30, 100, 30},
	}
	for _, c := range cases {
		if got := Percentual(c.valor, c.total); got != c.want {
			t.Errorf("Percentual(%.0f, %.0f) = %.0f; quer %.0f", c.valor, c.total, got, c.want)
		}
	}
}

func TestTotalNode(t *testing.T) {
	// Com filhos: soma dos filhos.
	pai := CategoriaReportNode{
		Nome:  "Receitas",
		Valor: 999, // ignorado quando há filhos
		Filhos: []CategoriaReportNode{
			{Nome: "Serviços", Valor: 800},
			{Nome: "Produtos", Valor: 200},
		},
	}
	if got := TotalNode(pai); got != 1000 {
		t.Errorf("TotalNode(pai) = %.0f; quer 1000", got)
	}
	// Sem filhos: o valor próprio.
	folha := CategoriaReportNode{Nome: "Avulso", Valor: 350}
	if got := TotalNode(folha); got != 350 {
		t.Errorf("TotalNode(folha) = %.0f; quer 350", got)
	}
}
