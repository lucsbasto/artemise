package domain

// Structs de resposta dos endpoints computados (M7). Dashboard e financeiro
// seguem camelCase espelhando os tipos do frontend (design §5.3 autoritativo);
// a agenda visão-geral usa as chaves snake_case nomeadas no spec (por_status,
// horarios_movimentados), por ainda não ter tipo equivalente no frontend.

// --- Dashboard (RF-52, BK-23) ---

// DashboardKPIs — indicadores principais do topo do dashboard.
type DashboardKPIs struct {
	TotalPacientes   int     `json:"totalPacientes"`
	AgendamentosHoje int     `json:"agendamentosHoje"`
	ReceitaMes       float64 `json:"receitaMes"`
	ProcedimentosMes int     `json:"procedimentosMes"`
	TaxaRetorno      float64 `json:"taxaRetorno"`
}

// DashboardBalance — resumo de saldo do período.
type DashboardBalance struct {
	SaldoRealizado     float64 `json:"saldoRealizado"`
	SaldoPrevisto      float64 `json:"saldoPrevisto"`
	EntradasRealizadas float64 `json:"entradasRealizadas"`
	EntradasPrevistas  float64 `json:"entradasPrevistas"`
	SaidasRealizadas   float64 `json:"saidasRealizadas"` // negativo
	SaidasPrevistas    float64 `json:"saidasPrevistas"`  // negativo
	Periodo            string  `json:"periodo"`
}

// AgendamentoResumo — linha de "próximos 24h" no dashboard.
type AgendamentoResumo struct {
	Paciente     string `json:"paciente"`
	Procedimento string `json:"procedimento"`
	Horario      string `json:"horario"`
}

// LabelTotal — par rótulo/contagem (rankings, dias).
type LabelTotal struct {
	Label string `json:"label"`
	Total int    `json:"total"`
}

// DiaTotal — contagem por dia da semana (rótulo de uma letra).
type DiaTotal struct {
	Dia   string `json:"dia"`
	Total int    `json:"total"`
}

// LabelValor — par rótulo/valor monetário (faturamento comparado).
type LabelValor struct {
	Label string  `json:"label"`
	Valor float64 `json:"valor"`
}

// ResumoIndicador — cartão de resumo (total + legenda).
type ResumoIndicador struct {
	Total   int    `json:"total"`
	Label   string `json:"label"`
	Legenda string `json:"legenda"`
}

// DashboardReports — bloco de relatórios do dashboard.
type DashboardReports struct {
	PorProfissional      []LabelTotal    `json:"porProfissional"`
	DiasMovimentados     []DiaTotal      `json:"diasMovimentados"`
	Horarios             []string        `json:"horarios"`
	HeatAtivo            string          `json:"heatAtivo"`
	StatusAgendamento    ResumoIndicador `json:"statusAgendamento"`
	PacientesPorSexo     ResumoIndicador `json:"pacientesPorSexo"`
	FaturamentoComparado []LabelValor    `json:"faturamentoComparado"`
}

// DashboardResponse — payload completo de GET /api/dashboard.
type DashboardResponse struct {
	KPIs          DashboardKPIs       `json:"kpis"`
	Balance       DashboardBalance    `json:"balance"`
	CashflowDaily []CashflowPoint     `json:"cashflowDaily"`
	Next24h       []AgendamentoResumo `json:"next24h"`
	Reports       DashboardReports    `json:"reports"`
}

// --- Agenda (RF-53/54, BK-24) ---

// AgendaPorStatus — contagem por status (5 status do schema).
type AgendaPorStatus struct {
	Agendado      int `json:"agendado"`
	Confirmado    int `json:"confirmado"`
	NaoCompareceu int `json:"nao_compareceu"`
	Concluido     int `json:"concluido"`
	Cancelado     int `json:"cancelado"`
}

// HorarioMovimentado — célula do heatmap de horários (hora 0..23).
type HorarioMovimentado struct {
	Hora  int `json:"hora"`
	Total int `json:"total"`
}

// AgendaVisaoGeral — payload de GET /api/agenda/visao-geral.
type AgendaVisaoGeral struct {
	PorStatus            AgendaPorStatus      `json:"por_status"`
	RankingsProfissional []LabelTotal         `json:"rankings_profissional"`
	RankingsProcedimento []LabelTotal         `json:"rankings_procedimento"`
	HorariosMovimentados []HorarioMovimentado `json:"horarios_movimentados"`
	DiasMovimentados     []DiaTotal           `json:"dias_movimentados"`
}

// --- Financeiro (RF-55..63, BK-25/26) ---

// ExtratoKPIs — indicadores de extrato/competência.
type ExtratoKPIs struct {
	ReceitasAbertas    float64 `json:"receitasAbertas"`
	ReceitasRealizadas float64 `json:"receitasRealizadas"`
	DespesasAbertas    float64 `json:"despesasAbertas"`
	DespesasRealizadas float64 `json:"despesasRealizadas"`
	TotalPeriodo       float64 `json:"totalPeriodo"`
}

// ExtratoResponse — GET /api/financeiro/extrato.
type ExtratoResponse struct {
	KPIs  ExtratoKPIs            `json:"kpis"`
	Items []LancamentoFinanceiro `json:"items"`
}

// CompetenciaTotais — totais bruto/líquido por competência.
type CompetenciaTotais struct {
	Bruto   float64 `json:"bruto"`
	Liquido float64 `json:"liquido"`
}

// CompetenciaResponse — GET /api/financeiro/competencia.
type CompetenciaResponse struct {
	KPIs   ExtratoKPIs            `json:"kpis"`
	Items  []LancamentoFinanceiro `json:"items"`
	Totais CompetenciaTotais      `json:"totais"`
}

// CategoriasResponse — GET /api/financeiro/categorias (duas árvores).
type CategoriasResponse struct {
	Receitas []CategoriaReportNode `json:"receitas"`
	Despesas []CategoriaReportNode `json:"despesas"`
}

// ComissaoItem — comissão consolidada por profissional.
type ComissaoItem struct {
	ProfissionalID string  `json:"profissionalId"`
	Profissional   string  `json:"profissional"`
	Base           float64 `json:"base"`
	Comissao       float64 `json:"comissao"`
	Quantidade     int     `json:"quantidade"`
}
