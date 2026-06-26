package domain

import "math"

// Cálculo de pacote/orçamento — porta de web/src/lib/pacote-calc.ts (design §6.4).
// O servidor é a fonte de verdade dos totais: recalcula a cada escrita em vez de
// confiar no valor enviado pelo cliente.

// DescontoReais e DescontoPercentual são os tipos de desconto aceitos. O schema
// persistido de orcamento_itens guarda apenas um desconto plano (R$); os tipos
// existem para manter a porta fiel à lógica do frontend.
const (
	DescontoReais      = "R$"
	DescontoPercentual = "%"
)

// ItemTotal calcula o total de uma linha aplicando o desconto unitário e
// multiplicando pela quantidade (porta de itemTotal). O líquido nunca é negativo.
func ItemTotal(qtd int, valor, descontoUn float64, descontoTipo string) float64 {
	var descEfetivo float64
	if descontoTipo == DescontoPercentual {
		descEfetivo = valor * descontoUn / 100
	} else {
		descEfetivo = descontoUn
	}
	liquido := math.Max(0, valor-descEfetivo)
	return float64(qtd) * liquido
}

// ValorTotal soma os totais dos itens e aplica o desconto global (porta de
// valorTotal). O desconto por item de orcamento_itens é sempre plano (R$); o
// descontoTipo recebido controla apenas o desconto global.
func ValorTotal(itens []OrcamentoItem, descontoGlobal float64, descontoTipo string) float64 {
	var sub float64
	for _, it := range itens {
		sub += ItemTotal(it.Qtd, it.Valor, it.Desconto, DescontoReais)
	}
	var descEfetivo float64
	if descontoTipo == DescontoPercentual {
		descEfetivo = sub * descontoGlobal / 100
	} else {
		descEfetivo = descontoGlobal
	}
	return math.Max(0, sub-descEfetivo)
}
