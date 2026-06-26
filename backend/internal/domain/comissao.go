package domain

// CalcComissao retorna o valor de comissão para um lançamento.
// Prioridade: regra específica do procedimento > regra padrão (ProcedimentoID
// nil). Sem regra aplicável, retorna 0. Ver design §6.3.
func CalcComissao(base float64, regras []RegraComissao, procedimentoID string) float64 {
	var padrao *RegraComissao
	for i := range regras {
		r := &regras[i]
		if r.ProcedimentoID != nil && *r.ProcedimentoID == procedimentoID {
			return aplicarComissao(base, r)
		}
		if r.ProcedimentoID == nil {
			padrao = r
		}
	}
	if padrao != nil {
		return aplicarComissao(base, padrao)
	}
	return 0
}

// aplicarComissao aplica uma regra: percentual sobre a base ou valor fixo.
func aplicarComissao(base float64, r *RegraComissao) float64 {
	if r.Tipo == "percentual" {
		return base * r.Valor / 100
	}
	return r.Valor
}
