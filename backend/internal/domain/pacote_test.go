package domain

import "testing"

func TestItemTotal(t *testing.T) {
	cases := []struct {
		nome       string
		qtd        int
		valor      float64
		descontoUn float64
		tipo       string
		want       float64
	}{
		{"sem desconto", 2, 100, 0, DescontoReais, 200},
		{"desconto reais", 2, 100, 10, DescontoReais, 180},
		{"desconto percentual", 2, 100, 10, DescontoPercentual, 180},
		{"desconto maior que valor zera", 1, 50, 80, DescontoReais, 0},
		{"percentual total zera", 3, 100, 100, DescontoPercentual, 0},
	}
	for _, c := range cases {
		t.Run(c.nome, func(t *testing.T) {
			got := ItemTotal(c.qtd, c.valor, c.descontoUn, c.tipo)
			if got != c.want {
				t.Errorf("ItemTotal(%d, %.2f, %.2f, %q) = %.2f; want %.2f",
					c.qtd, c.valor, c.descontoUn, c.tipo, got, c.want)
			}
		})
	}
}

func TestTotalOrcamento(t *testing.T) {
	itens := []OrcamentoItem{
		{Nome: "Botox", Qtd: 2, Valor: 500, Desconto: 50}, // (500-50)*2 = 900
		{Nome: "Limpeza", Qtd: 1, Valor: 200, Desconto: 0}, // 200
	}
	cases := []struct {
		nome           string
		descontoGlobal float64
		tipo           string
		want           float64
	}{
		{"soma sem desconto global", 0, DescontoReais, 1100},
		{"desconto global reais", 100, DescontoReais, 1000},
		{"desconto global percentual", 10, DescontoPercentual, 990},
		{"desconto global maior que subtotal zera", 2000, DescontoReais, 0},
	}
	for _, c := range cases {
		t.Run(c.nome, func(t *testing.T) {
			got := ValorTotal(itens, c.descontoGlobal, c.tipo)
			if got != c.want {
				t.Errorf("ValorTotal(itens, %.2f, %q) = %.2f; want %.2f",
					c.descontoGlobal, c.tipo, got, c.want)
			}
		})
	}
}
