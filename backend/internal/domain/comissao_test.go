package domain

import "testing"

func strptr(s string) *string { return &s }

// TestCalcComissaoPercentual — R$ 1000 @ 40% => 400 (caso âncora do design).
func TestCalcComissaoPercentual(t *testing.T) {
	regras := []RegraComissao{
		{ProcedimentoID: nil, Tipo: "percentual", Valor: 40},
	}
	if got := CalcComissao(1000, regras, "qualquer"); got != 400 {
		t.Errorf("CalcComissao(1000, 40%%) = %.2f; quer 400", got)
	}
}

func TestCalcComissaoFixo(t *testing.T) {
	regras := []RegraComissao{
		{ProcedimentoID: nil, Tipo: "fixo", Valor: 150},
	}
	if got := CalcComissao(1000, regras, "x"); got != 150 {
		t.Errorf("CalcComissao fixo = %.2f; quer 150", got)
	}
}

// TestCalcComissaoPrioridade — regra específica do procedimento vence a padrão.
func TestCalcComissaoPrioridade(t *testing.T) {
	regras := []RegraComissao{
		{ProcedimentoID: nil, Tipo: "percentual", Valor: 10},              // padrão
		{ProcedimentoID: strptr("proc-1"), Tipo: "percentual", Valor: 50}, // específica
	}
	if got := CalcComissao(1000, regras, "proc-1"); got != 500 {
		t.Errorf("regra específica = %.2f; quer 500", got)
	}
	// Procedimento sem regra específica cai na padrão.
	if got := CalcComissao(1000, regras, "proc-2"); got != 100 {
		t.Errorf("fallback padrão = %.2f; quer 100", got)
	}
}

func TestCalcComissaoSemRegra(t *testing.T) {
	if got := CalcComissao(1000, nil, "x"); got != 0 {
		t.Errorf("sem regra = %.2f; quer 0", got)
	}
}
