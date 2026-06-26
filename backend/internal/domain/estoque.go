package domain

// DeltaEstoque mapeia substanciaId → variação de unidades a aplicar no saldo do
// item de estoque correspondente. Positivo debita (baixa), negativo credita
// (estorno parcial ou total).
type DeltaEstoque map[string]float64

// CalcularDelta calcula, por substância, a diferença de unidades entre o mapa
// anterior e o novo: delta[sub] = unidadesNovas − unidadesAnteriores. Cada
// FichaInjetaveis soma as unidades de todos os pontos de uma mesma substância.
//
// anterior == nil ⇒ criação (apenas débito do novo mapa); novo == nil ⇒ exclusão
// (apenas estorno do mapa anterior). Entradas com delta zero são omitidas para
// não emitir UPDATEs inócuos.
func CalcularDelta(anterior, novo *FichaInjetaveis) DeltaEstoque {
	delta := DeltaEstoque{}
	somar := func(f *FichaInjetaveis, sinal float64) {
		if f == nil {
			return
		}
		for _, p := range f.Pontos {
			delta[p.SubstanciaID] += sinal * p.Unidades
		}
	}
	somar(anterior, -1)
	somar(novo, +1)
	for sub, d := range delta {
		if d == 0 {
			delete(delta, sub)
		}
	}
	return delta
}
