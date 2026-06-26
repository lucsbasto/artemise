package domain

import "testing"

// ponto cria um PontoInjetavel mínimo para os testes de delta (só substância e
// unidades importam para CalcularDelta).
func ponto(sub string, ui float64) PontoInjetavel {
	return PontoInjetavel{SubstanciaID: sub, Unidades: ui}
}

func ficha(pontos ...PontoInjetavel) *FichaInjetaveis {
	return &FichaInjetaveis{Pontos: pontos}
}

func TestCalcularDelta(t *testing.T) {
	cases := []struct {
		nome     string
		anterior *FichaInjetaveis
		novo     *FichaInjetaveis
		want     DeltaEstoque
	}{
		{
			nome:     "criação soma unidades da mesma substância",
			anterior: nil,
			novo:     ficha(ponto("tox", 5), ponto("tox", 3)),
			want:     DeltaEstoque{"tox": 8},
		},
		{
			nome:     "criação com múltiplas substâncias",
			anterior: nil,
			novo:     ficha(ponto("tox", 5), ponto("acido", 2)),
			want:     DeltaEstoque{"tox": 5, "acido": 2},
		},
		{
			nome:     "edição reduz 3→1 debita só o delta",
			anterior: ficha(ponto("tox", 3)),
			novo:     ficha(ponto("tox", 1)),
			want:     DeltaEstoque{"tox": -2},
		},
		{
			nome:     "edição aumenta 1→4 debita mais",
			anterior: ficha(ponto("tox", 1)),
			novo:     ficha(ponto("tox", 4)),
			want:     DeltaEstoque{"tox": 3},
		},
		{
			nome:     "exclusão estorna tudo",
			anterior: ficha(ponto("tox", 8)),
			novo:     nil,
			want:     DeltaEstoque{"tox": -8},
		},
		{
			nome:     "substância inalterada é omitida",
			anterior: ficha(ponto("tox", 5)),
			novo:     ficha(ponto("tox", 5)),
			want:     DeltaEstoque{},
		},
		{
			nome:     "mistura: uma sobe, outra some",
			anterior: ficha(ponto("tox", 2), ponto("acido", 4)),
			novo:     ficha(ponto("tox", 6)),
			want:     DeltaEstoque{"tox": 4, "acido": -4},
		},
	}
	for _, c := range cases {
		t.Run(c.nome, func(t *testing.T) {
			got := CalcularDelta(c.anterior, c.novo)
			if len(got) != len(c.want) {
				t.Fatalf("CalcularDelta = %v; want %v", got, c.want)
			}
			for sub, d := range c.want {
				if got[sub] != d {
					t.Errorf("delta[%q] = %v; want %v", sub, got[sub], d)
				}
			}
		})
	}
}
