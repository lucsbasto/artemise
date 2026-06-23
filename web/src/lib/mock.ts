// Mock estático — valores exatos extraídos dos screenshots/specs em docs/paginas/.
// Rastreabilidade: cada bloco aponta o spec de origem.

/* ---------- Dashboard (01-inicio-dashboard.md) ---------- */

export type CashflowPoint = {
  label: string;
  entradas: number;
  entradasPrevistas: number;
  saidas: number; // negativo
  saidasPrevistas: number; // negativo
  saldo: number;
  saldoPrevisto: number;
};

// período 18–22 Jun; saldo sobe terminando alto em 22 Jun
export const cashflowDaily: CashflowPoint[] = [
  { label: "18 Jun", entradas: 1200, entradasPrevistas: 1500, saidas: -300, saidasPrevistas: -700, saldo: 900, saldoPrevisto: 800 },
  { label: "19 Jun", entradas: 900, entradasPrevistas: 1300, saidas: -1100, saidasPrevistas: -1400, saldo: 700, saldoPrevisto: 650 },
  { label: "20 Jun", entradas: 400, entradasPrevistas: 900, saidas: -200, saidasPrevistas: -800, saldo: 900, saldoPrevisto: 500 },
  { label: "21 Jun", entradas: 700, entradasPrevistas: 1000, saidas: -639, saidasPrevistas: -900, saldo: 960, saldoPrevisto: 600 },
  { label: "22 Jun", entradas: 4370, entradasPrevistas: 6200, saidas: -300, saidasPrevistas: -700, saldo: 1831, saldoPrevisto: 781 },
];

export const balance = {
  saldoRealizado: 1831,
  saldoPrevisto: 781,
  entradasRealizadas: 4370,
  entradasPrevistas: 6200,
  saidasRealizadas: -2539,
  saidasPrevistas: -5419,
  periodo: "18/06/2026 - 22/06/2026",
};

export type Appointment = {
  paciente: string;
  procedimento: string;
  horario: string;
};

export const next24h: Appointment[] = [
  {
    paciente: "Clara Ribeiro (Paciente de exemplo)",
    procedimento: "Limpeza de Pele Profunda",
    horario: "14:00 - 15:00",
  },
];

export const reports = {
  porProfissional: [{ label: "LB", total: 1 }],
  // D S T Q Q S S  — pico (1) numa segunda
  diasMovimentados: [
    { dia: "D", total: 0 },
    { dia: "S", total: 1 },
    { dia: "T", total: 0 },
    { dia: "Q", total: 0 },
    { dia: "Q", total: 0 },
    { dia: "S", total: 0 },
    { dia: "S", total: 0 },
  ],
  // heatmap: faixas 14h..22h; só 14h ocupada
  horarios: ["14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h", "22h"],
  heatAtivo: "14h",
  statusAgendamento: { total: 1, label: "Agendamentos", legenda: "1 agendamentos no período" },
  pacientesPorSexo: { total: 1, label: "Pacientes", legenda: "1 pacientes no período" },
  faturamentoComparado: [
    { label: "18 Jun", valor: 3800 },
    { label: "19 Jun", valor: 0 },
    { label: "20 Jun", valor: 0 },
    { label: "21 Jun", valor: 0 },
    { label: "22 Jun", valor: 0 },
  ],
};

/* ---------- Agenda (02-agenda-calendario.md) ---------- */

export const weekDays = [
  { num: 21, dow: "sáb" },
  { num: 22, dow: "dom", hoje: true },
  { num: 23, dow: "seg" },
  { num: 24, dow: "ter" },
  { num: 25, dow: "qua" },
  { num: 26, dow: "qui" },
  { num: 27, dow: "sex" },
];

// gutter 08:00 -> 22:00
export const dayHours = Array.from({ length: 15 }, (_, i) => 8 + i);

export type WeekEvent = {
  dayNum: number;
  start: number; // hora decimal, ex 14
  end: number; // 15
  paciente: string;
  procedimento: string;
};

export const weekEvents: WeekEvent[] = [
  {
    dayNum: 22,
    start: 14,
    end: 15,
    paciente: "Clara Ribeiro (Paciente de exemplo)",
    procedimento: "Limpeza de Pele Profunda",
  },
];

export const nowLineHour = 15.47; // ~15:28

/* ---------- Pacientes (07-pacientes-listagem.md) ---------- */

export type Patient = {
  id: string;
  nome: string;
  tipo: string;
  etiquetas: string[];
  identificador: string;
  ativo: boolean;
};

export const patients: Patient[] = [
  {
    id: "1",
    nome: "Clara Ribeiro (Paciente de exemplo)",
    tipo: "Paciente",
    etiquetas: [],
    identificador: "+55 (11) 99999-9999",
    ativo: true,
  },
];

/* ---------- Profissionais (10) / Fornecedores (11) — tabela de contatos ---------- */

export type Contact = {
  id: string;
  nome: string;
  tipo: string;
  etiquetas: string[];
  identificador: string;
  ativo: boolean;
  avatarTone: "brand" | "green";
};

export const profissionais: Contact[] = [
  {
    id: "1",
    nome: "Lucas Bastos",
    tipo: "Profissional",
    etiquetas: [],
    identificador: "+55 (63) 98502-1531",
    ativo: false,
    avatarTone: "green",
  },
];

export const fornecedores: Contact[] = [
  {
    id: "1",
    nome: "Fornecedor de exemplo",
    tipo: "Fornecedor",
    etiquetas: [],
    identificador: "+55 (11) 98888-7777",
    ativo: true,
    avatarTone: "brand",
  },
];

/* ---------- Contas a receber (13) / a pagar (14) — tabela financeira ---------- */

export type FinanceStatus = "Recebido" | "Pago" | "Em atraso" | "Em aberto";

export type FinanceRow = {
  vencimento: string;
  liquidacao: string; // Recebimento / Pagamento
  atrasado?: boolean; // ⏱ + barra vermelha
  descricao: string;
  categoria: string;
  situacao: FinanceStatus;
  valor: number;
};

export type FinanceKpi = { label: string; valor: number; tone: "danger" | "warning" | "info" | "success"; ativo?: boolean };

export const contasReceber = {
  periodo: "23/05/2026 - 22/06/2026",
  total: 15,
  kpis: [
    { label: "Vencidos", valor: 780, tone: "danger" },
    { label: "Vencem hoje", valor: 1400, tone: "warning" },
    { label: "A vencer", valor: 0, tone: "info" },
    { label: "A receber", valor: 0, tone: "info" },
    { label: "Recebidos", valor: 6320, tone: "success" },
    { label: "Total do período", valor: 8500, tone: "info", ativo: true },
  ] as FinanceKpi[],
  rows: [
    { vencimento: "17/06", liquidacao: "17/06", descricao: "Massagem Relaxante", categoria: "Receitas d...", situacao: "Recebido", valor: 150 },
    { vencimento: "17/06", liquidacao: "17/06", descricao: "Preenchimento Facial", categoria: "Receitas d...", situacao: "Recebido", valor: 1800 },
    { vencimento: "17/06", liquidacao: "17/06", atrasado: true, descricao: "Venda de Cremes Anti-idade", categoria: "Receitas d...", situacao: "Em atraso", valor: 350 },
    { vencimento: "18/06", liquidacao: "18/06", atrasado: true, descricao: "Drenagem Linfática", categoria: "Receitas d...", situacao: "Em atraso", valor: 180 },
    { vencimento: "18/06", liquidacao: "18/06", descricao: "Microagulhamento", categoria: "Receitas d...", situacao: "Recebido", valor: 600 },
    { vencimento: "19/06", liquidacao: "19/06", descricao: "Limpeza de Pele", categoria: "Receitas d...", situacao: "Recebido", valor: 200 },
    { vencimento: "19/06", liquidacao: "19/06", descricao: "Venda de Produtos Cosméticos", categoria: "Receitas d...", situacao: "Recebido", valor: 120 },
    { vencimento: "19/06", liquidacao: "19/06", descricao: "Peeling Físico", categoria: "Receitas d...", situacao: "Recebido", valor: 300 },
    { vencimento: "19/06", liquidacao: "19/06", atrasado: true, descricao: "Tratamento Acne", categoria: "Receitas d...", situacao: "Em atraso", valor: 250 },
    { vencimento: "22/06", liquidacao: "22/06", descricao: "Peeling Químico", categoria: "Receitas d...", situacao: "Recebido", valor: 350 },
    { vencimento: "22/06", liquidacao: "22/06", descricao: "Toxina Botulínica", categoria: "Receitas d...", situacao: "Recebido", valor: 1300 },
    { vencimento: "22/06", liquidacao: "22/06", atrasado: true, descricao: "Consulta de Avaliações", categoria: "Receitas d...", situacao: "Em aberto", valor: 100 },
    { vencimento: "22/06", liquidacao: "22/06", atrasado: true, descricao: "Laser CO2", categoria: "Receitas d...", situacao: "Em aberto", valor: 900 },
  ] as FinanceRow[],
};

export const contasPagar = {
  periodo: "23/05/2026 - 22/06/2026",
  total: 13,
  kpis: [
    { label: "Vencidos", valor: 500, tone: "danger" },
    { label: "Vencem hoje", valor: 2880, tone: "warning" },
    { label: "A vencer", valor: 0, tone: "info" },
    { label: "Pagos", valor: 3889, tone: "success" },
    { label: "Total do período", valor: 7269, tone: "info", ativo: true },
  ] as FinanceKpi[],
  rows: [
    { vencimento: "17/06", liquidacao: "17/06", descricao: "Aluguel da Clínica", categoria: "Outras de...", situacao: "Pago", valor: 1200 },
    { vencimento: "17/06", liquidacao: "17/06", descricao: "Material de Escritório", categoria: "Outras de...", situacao: "Pago", valor: 150 },
    { vencimento: "17/06", liquidacao: "17/06", atrasado: true, descricao: "Renovação de Licenças", categoria: "Outras de...", situacao: "Em atraso", valor: 500 },
    { vencimento: "18/06", liquidacao: "18/06", descricao: "Água", categoria: "Outras de...", situacao: "Pago", valor: 400 },
    { vencimento: "18/06", liquidacao: "18/06", descricao: "Manutenção de Equipamentos", categoria: "Outras de...", situacao: "Pago", valor: 800 },
    { vencimento: "18/06", liquidacao: "18/06", descricao: "Limpeza", categoria: "Outras de...", situacao: "Pago", valor: 300 },
    { vencimento: "20/06", liquidacao: "20/06", descricao: "Software de Gestão", categoria: "Outras de...", situacao: "Pago", valor: 238 },
    { vencimento: "20/06", liquidacao: "20/06", descricao: "Internet", categoria: "Outras de...", situacao: "Pago", valor: 300 },
    { vencimento: "22/06", liquidacao: "22/06", descricao: "Energia Elétrica", categoria: "Outras de...", situacao: "Pago", valor: 500 },
    { vencimento: "22/06", liquidacao: "22/06", descricao: "Serviços Contábeis", categoria: "Outras de...", situacao: "Em aberto", valor: 750 },
    { vencimento: "22/06", liquidacao: "22/06", descricao: "Telefone Fixo", categoria: "Outras de...", situacao: "Em aberto", valor: 150 },
    { vencimento: "22/06", liquidacao: "22/06", descricao: "Marketing Digital", categoria: "Outras de...", situacao: "Em aberto", valor: 1000 },
    { vencimento: "22/06", liquidacao: "22/06", descricao: "Assessoria Jurídica", categoria: "Outras de...", situacao: "Em aberto", valor: 980 },
  ] as FinanceRow[],
};

/* ---------- Financeiro Visão Geral (12-financeiro-visao-geral.md) ---------- */

export const financeKpis = [
  { label: "Receitas", valor: 6320 },
  { label: "Despesas", valor: -3889 },
  { label: "A receber", valor: 2180 },
  { label: "A pagar", valor: -3380 },
];

// fluxo de caixa financeiro: 23 Mai -> 22 Jun (diário). Movimento concentrado no fim.
export const financeCashflow: CashflowPoint[] = (() => {
  const dias = ["23 Mai", "24 Mai", "25 Mai", "26 Mai", "27 Mai", "28 Mai", "29 Mai", "30 Mai", "31 Mai",
    "1 Jun", "2 Jun", "3 Jun", "4 Jun", "5 Jun", "6 Jun", "7 Jun", "8 Jun", "9 Jun", "10 Jun", "11 Jun",
    "12 Jun", "13 Jun", "14 Jun", "15 Jun", "16 Jun", "17 Jun", "18 Jun", "19 Jun", "20 Jun", "21 Jun", "22 Jun"];
  const movimento: Record<string, Partial<CashflowPoint>> = {
    "17 Jun": { entradas: 800, saidas: -1200 },
    "18 Jun": { entradas: 600, saidas: -900 },
    "19 Jun": { entradas: 1200, saidas: -400 },
    "20 Jun": { entradas: 500, saidas: -700 },
    "21 Jun": { entradas: 900, saidas: -300 },
    "22 Jun": { entradas: 4000, saidas: -3000 },
  };
  let saldo = -480;
  return dias.map((label) => {
    const m = movimento[label] ?? {};
    const entradas = m.entradas ?? 0;
    const saidas = m.saidas ?? 0;
    saldo += entradas + saidas;
    return {
      label,
      entradas,
      entradasPrevistas: 0,
      saidas,
      saidasPrevistas: 0,
      saldo,
      saldoPrevisto: saldo,
    };
  });
})();

export const contasFinanceiras = {
  itens: [
    { nome: "Banco padrão", sub: "Conta Corrente", saldo: 2431, icon: "bank" as const },
    { nome: "Caixa", sub: "Caixa", saldo: 0, icon: "cash" as const },
  ],
  saldoTotal: 2431,
};

export const aReceber = [
  { label: "Inadimplência", valor: 780 },
  { label: "Para hoje", valor: 4550 },
  { label: "Para este mês", valor: 8500 },
  { label: "Para este ano", valor: 8500 },
  { label: "Recebidos no mês", valor: 6320 },
  { label: "Recebidos no ano", valor: 6320 },
];

export const aPagar = [
  { label: "Em atraso", valor: 500 },
  { label: "Para hoje", valor: 3380 },
  { label: "Para este mês", valor: 7269 },
  { label: "Para este ano", valor: 7269 },
  { label: "Pagos no mês", valor: 3889 },
  { label: "Pagos no ano", valor: 3889 },
];

export const categoriasReceita = [
  { nome: "Receitas de serviços", valor: 6000, cor: "#16a34a" },
  { nome: "Outros", valor: 320, cor: "#86efac" },
];

export const periodoFinanceiro = "23/05/2026 - 22/06/2026";

/* ---------- Procedimentos (32-config-procedimentos.md) ---------- */

export type Procedimento = {
  id: string;
  nome: string;
  categoria: string | null;
  duracaoMin: number;
  valor: number;
  ativo: boolean;
};

export const procedimentos: Procedimento[] = [
  { id: "1", nome: "Limpeza de Pele Profunda", categoria: null, duracaoMin: 60, valor: 200, ativo: true },
  { id: "2", nome: "Microagulhamento", categoria: null, duracaoMin: 60, valor: 500, ativo: true },
  { id: "3", nome: "Peeling Químico", categoria: null, duracaoMin: 60, valor: 300, ativo: true },
  { id: "4", nome: "Tratamento de Acne", categoria: null, duracaoMin: 60, valor: 250, ativo: true },
];

// Paleta nomeada do campo "Cor*" do modal de procedimento.
export type CorOption = { nome: string; hex: string };
export const coresProcedimento: CorOption[] = [
  { nome: "Cinza", hex: "#9ca3af" },
  { nome: "Azul", hex: "#3b82f6" },
  { nome: "Verde", hex: "#16a34a" },
  { nome: "Vermelho", hex: "#ef4444" },
  { nome: "Roxo", hex: "#7c3aed" },
  { nome: "Laranja", hex: "#f59e0b" },
];

// Categorias de procedimento (dropdown estático do modal).
export const categoriasProcedimento = ["Facial", "Corporal", "Estética", "Injetáveis"];

/* ---------- Pacotes (34-config-pacotes.md) ---------- */

export type Pacote = {
  id: string;
  descricao: string;
  valorTotal: number;
  validade: string;
  ativo: boolean;
};

export const pacotes: Pacote[] = [
  { id: "1", descricao: "Pacote Limpeza 10 sessões", valorTotal: 1800, validade: "Ilimitado", ativo: true },
  { id: "2", descricao: "Combo Rejuvenescimento Facial", valorTotal: 2700, validade: "180 dias", ativo: true },
  { id: "3", descricao: "Pacote Acne Control", valorTotal: 1200, validade: "90 dias", ativo: false },
];

/* ---------- Fichas de atendimentos (35-config-fichas-atendimento.md) ---------- */

export type FichaAtendimento = { id: string; nome: string; ativo: boolean };

export const fichasAtendimento: FichaAtendimento[] = [
  { id: "1", nome: "Anamnese", ativo: true },
  { id: "2", nome: "Capilar", ativo: true },
  { id: "3", nome: "Corporal", ativo: true },
  { id: "4", nome: "Epilação", ativo: true },
  { id: "5", nome: "Estética Facial", ativo: true },
  { id: "6", nome: "Facial", ativo: true },
  { id: "7", nome: "Fotos e anexos", ativo: true },
  { id: "8", nome: "Injetáveis", ativo: true },
  { id: "9", nome: "Orçamento", ativo: true },
  { id: "10", nome: "Plano de tratamento", ativo: true },
];

/* ---------- Modelos de atestados e prescrições (36) ---------- */

export type ModeloDocumento = { id: string; nome: string; tipo: string; ativo: boolean };

export const modelosDocumento: ModeloDocumento[] = [
  { id: "1", nome: "Atestado", tipo: "Atestado", ativo: true },
];

export const validadesPacote = ["Ilimitado", "30 dias", "60 dias", "90 dias", "180 dias", "365 dias"];

// Opções do dropdown "Nome" no modal de pacote (procedimentos + produtos).
export const itensVendaveis = [
  "Limpeza de Pele Profunda",
  "Microagulhamento",
  "Peeling Químico",
  "Tratamento de Acne",
  "Creme Anti-idade",
  "Protetor Solar FPS 50",
];

/* ---------- Orçamento (09-paciente-orcamento-modais.md) ---------- */

// Catálogo do campo "Nome" do orçamento: procedimentos + produtos com preço de tabela.
// Selecionar um item preenche "Valor (R$)" com este valor (spec §Procedimentos/Produtos).
export type ItemVendavel = { nome: string; valor: number };
export const itensOrcamento: ItemVendavel[] = [
  { nome: "Limpeza de Pele Profunda", valor: 200 },
  { nome: "Microagulhamento", valor: 500 },
  { nome: "Peeling Químico", valor: 300 },
  { nome: "Tratamento de Acne", valor: 250 },
  { nome: "Creme Anti-idade", valor: 120 },
  { nome: "Protetor Solar FPS 50", valor: 90 },
];

/* ---------- Estoque (24-estoque-itens.md) ---------- */

export type ItemEstoque = {
  id: string;
  nome: string;
  sku: string;
  categoria: string;
  unidade: string;
  saldo: number;
  minimo: number;
  custo: number;
};

export const itensEstoque: ItemEstoque[] = [
  { id: "1", nome: "Ácido Hialurônico 2ml", sku: "AH-002", categoria: "Injetáveis", unidade: "un", saldo: 12, minimo: 5, custo: 180 },
  { id: "2", nome: "Agulha 30G", sku: "AG-030", categoria: "Material de atendimento", unidade: "cx", saldo: 3, minimo: 10, custo: 45 },
  { id: "3", nome: "Creme Anti-idade", sku: "CR-ANT", categoria: "Revenda", unidade: "un", saldo: 28, minimo: 8, custo: 60 },
  { id: "4", nome: "Gel Condutor 1L", sku: "GC-1L", categoria: "Material de atendimento", unidade: "un", saldo: 2, minimo: 4, custo: 22 },
  { id: "5", nome: "Protetor Solar FPS 50", sku: "PS-050", categoria: "Revenda", unidade: "un", saldo: 40, minimo: 10, custo: 35 },
];

export const estoqueValor = (i: ItemEstoque) => i.saldo * i.custo;
export const estoqueBaixo = (i: ItemEstoque) => i.saldo <= i.minimo;

export const estoqueSummary = {
  baixo: itensEstoque.filter(estoqueBaixo).length,
  alto: 0,
  todos: itensEstoque.length,
};

export const categoriasEstoque = ["Injetáveis", "Material de atendimento", "Revenda"];
export const unidadesEstoque = ["un", "ml", "g", "cx", "L"];

/* ---------- Ficha do Paciente (08-paciente-ficha.md) ---------- */

export type FichaPaciente = {
  id: string;
  nome: string;
  sexo: string;
  idade: number;
  dataNascimento: string;
  telefone: string;
  cpf: string;
  email: string;
  recebeNotificacoes: boolean;
  endereco: string[]; // 4 linhas
  observacoes: string;
  criadoEm: string;
  status: "Ativo" | "Inativo";
  isExemplo: boolean;
};

export const fichaPaciente: FichaPaciente = {
  id: "10318910",
  nome: "Clara Ribeiro (Paciente de exemplo)",
  sexo: "Feminino",
  idade: 34,
  dataNascimento: "02/12/1991",
  telefone: "+55 (11) 99999-9999",
  cpf: "315.772.070-84",
  email: "clara.ribeiro@exemplo.com",
  recebeNotificacoes: false,
  endereco: ["Av. Pedro Álvares Cabral, SN", "Vila Mariana, São Paulo, SP", "04094-050", "Brasil"],
  observacoes: "Esse paciente é um paciente de exemplo.",
  criadoEm: "22/06/2026 15:00:43",
  status: "Ativo",
  isExemplo: true,
};

// As 6 abas da ficha (slug ≠ label em "Pacotes"→creditos).
export const fichaAbas = [
  { label: "Informações", slug: "informacoes" },
  { label: "Linha do tempo", slug: "linha-do-tempo" },
  { label: "Carteira", slug: "carteira" },
  { label: "Pacotes", slug: "creditos" },
  { label: "Financeiro", slug: "financeiro" },
  { label: "Orçamentos", slug: "orcamentos" },
];

// ── Linha do tempo ──────────────────────────────────────────────
export type TimelineEvent = {
  id: string;
  tipo: "agendamento_concluido" | "parcela_recebida" | "titulo_criado";
  titulo: string;
  quando: string; // ex "seg. 22/06/2026 15:10"
  valor?: number;
};

export const timelineEvents: TimelineEvent[] = [
  { id: "1", tipo: "agendamento_concluido", titulo: "Agendamento concluído", quando: "seg. 22/06/2026 15:10" },
  { id: "2", tipo: "parcela_recebida", titulo: "Parcela a receber recebida", quando: "seg. 22/06/2026 15:00" },
  { id: "3", tipo: "titulo_criado", titulo: "Título criado", quando: "seg. 22/06/2026 15:00", valor: 250 },
  { id: "4", tipo: "titulo_criado", titulo: "Título criado", quando: "seg. 22/06/2026 15:00", valor: 1800 },
  { id: "5", tipo: "parcela_recebida", titulo: "Parcela a receber recebida", quando: "seg. 22/06/2026 15:00" },
  { id: "6", tipo: "titulo_criado", titulo: "Título criado", quando: "seg. 22/06/2026 15:00", valor: 350 },
  { id: "7", tipo: "titulo_criado", titulo: "Título criado", quando: "seg. 22/06/2026 15:00", valor: 400 },
  { id: "8", tipo: "titulo_criado", titulo: "Título criado", quando: "seg. 22/06/2026 15:00", valor: 120 },
  { id: "9", tipo: "parcela_recebida", titulo: "Parcela a receber recebida", quando: "seg. 22/06/2026 15:00" },
  { id: "10", tipo: "titulo_criado", titulo: "Título criado", quando: "seg. 22/06/2026 15:00", valor: 180 },
];

// ── Carteira ────────────────────────────────────────────────────
export const carteira = {
  saldo: 0,
  cashback: 0,
  total: 0,
  numeroMascarado: "•••• •••• •••• 0000",
};

// ── Financeiro do paciente ──────────────────────────────────────
export type FichaFinKpi = { label: string; valor: number; tone: "success" | "info" | "warning" | "danger"; ativo?: boolean };

export const fichaFinanceiroKpis: FichaFinKpi[] = [
  { label: "Realizado", valor: 2431, tone: "success" },
  { label: "A receber", valor: 0, tone: "info" },
  { label: "Em aberto", valor: -1480, tone: "warning" },
  { label: "Em atraso", valor: 280, tone: "danger" },
  { label: "Total do período", valor: 1231, tone: "info", ativo: true },
];

export type FichaFinRow = {
  vencimento: string;
  execucao: string | null;
  descricao: string;
  situacao: FinanceStatus;
  valor: number; // negativo = despesa
};

export const fichaFinanceiroTotal = 28;

export const fichaFinanceiroRows: FichaFinRow[] = [
  { vencimento: "17/06", execucao: "17/06", descricao: "Aluguel da Clínica", situacao: "Pago", valor: -1200 },
  { vencimento: "17/06", execucao: "17/06", descricao: "Material de Escritório", situacao: "Pago", valor: -150 },
  { vencimento: "17/06", execucao: null, descricao: "Renovação de Licenças", situacao: "Em atraso", valor: -500 },
  { vencimento: "17/06", execucao: "17/06", descricao: "Massagem Relaxante", situacao: "Recebido", valor: 150 },
  { vencimento: "17/06", execucao: "17/06", descricao: "Preenchimento Facial", situacao: "Recebido", valor: 1800 },
  { vencimento: "17/06", execucao: null, descricao: "Venda de Cremes Anti-idade", situacao: "Em atraso", valor: 350 },
  { vencimento: "18/06", execucao: null, descricao: "Drenagem Linfática", situacao: "Em atraso", valor: 180 },
  { vencimento: "18/06", execucao: "18/06", descricao: "Microagulhamento", situacao: "Recebido", valor: 600 },
];

/* ---------- Usuário / app ---------- */
export const currentUser = { nome: "Lucas Bastos", iniciais: "LB" };

/* ---------- Agenda / Visão geral (03-agenda-visao-geral.md) ---------- */

export const agendaPeriodo = "21/06/2026 - 27/06/2026";

export type AgendaKpi = { label: string; valor: string; delta?: string; deltaUp?: boolean };
export const agendaKpis: AgendaKpi[] = [
  { label: "Total de agendamentos", valor: "1" },
  { label: "Ociosidade", valor: "98 %", delta: "-2%", deltaUp: false },
  { label: "Pacientes na lista de espera", valor: "0" },
];

// "Agendamentos por período" — barras (1 em 22 Jun) + linha de média
export const agendaPorPeriodo = [
  { label: "21 Jun", valor: 0 },
  { label: "22 Jun", valor: 1 },
  { label: "23 Jun", valor: 0 },
  { label: "24 Jun", valor: 0 },
  { label: "25 Jun", valor: 0 },
  { label: "26 Jun", valor: 0 },
  { label: "27 Jun", valor: 0 },
];
export const agendaMedia = 1;

// status do enum de agendamento — cor + contagem + %
export type AgendaStatus =
  | "Agendado"
  | "Confirmado"
  | "Não compareceu"
  | "Concluído"
  | "Cancelado";

export const agendaPorStatus: { status: AgendaStatus; total: number; pct: number }[] = [
  { status: "Agendado", total: 0, pct: 0 },
  { status: "Confirmado", total: 0, pct: 0 },
  { status: "Não compareceu", total: 0, pct: 0 },
  { status: "Concluído", total: 1, pct: 100 },
  { status: "Cancelado", total: 0, pct: 0 },
];

export type RankItem = { nome: string; total: number; pct: number };
export const agendaPacientesFreq: RankItem[] = [
  { nome: "Clara Ribeiro (Paciente de exemplo)", total: 1, pct: 100 },
];
export const agendaProcedimentosFreq: RankItem[] = [
  { nome: "Limpeza de Pele Profunda", total: 1, pct: 100 },
];
// ociosidade por sala / profissional → estado vazio
export const agendaOciosidadeSala: RankItem[] = [];
export const agendaOciosidadeProf: RankItem[] = [];

// "Dias mais movimentados" — D S T Q Q S S, pico (1) na segunda (2ª col)
export const agendaDiasMovimentados = [
  { label: "D", valor: 0 },
  { label: "S", valor: 1 },
  { label: "T", valor: 0 },
  { label: "Q", valor: 0 },
  { label: "Q", valor: 0 },
  { label: "S", valor: 0 },
  { label: "S", valor: 0 },
];
// "Horários mais movimentados" — heatmap; só 14h ativo
export const agendaHorarios = ["14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h", "22h"];
export const agendaHorarioAtivo = "14h";

/* ---------- Agenda / Relatório de agendamentos (04-...) ---------- */

export type AgendaRow = {
  procedimento: string;
  paciente: string;
  profissional: string;
  iniciais: string;
  duracaoMin: number;
  agendadoPara: string; // DD/MM/AAAA HH:mm
  status: AgendaStatus;
};

export const agendaRelatorioRows: AgendaRow[] = [
  {
    procedimento: "Limpeza de Pele Profunda",
    paciente: "Clara Ribeiro (Paciente de exemplo)",
    profissional: "Lucas Bastos",
    iniciais: "LB",
    duracaoMin: 60,
    agendadoPara: "22/06/2026 14:00",
    status: "Concluído",
  },
];

// abas-resumo (contagem por status + Todos)
export const agendaStatusTabs: { label: AgendaStatus | "Todos"; total: number }[] = [
  { label: "Agendado", total: 0 },
  { label: "Confirmado", total: 0 },
  { label: "Não compareceu", total: 0 },
  { label: "Concluído", total: 1 },
  { label: "Cancelado", total: 0 },
  { label: "Todos", total: 1 },
];

/* ---------- Agenda / Eventos — Sala de espera (05-...) ---------- */

export const eventosPeriodo = "23/05/2026 - 22/06/2026";
// estado capturado: lista vazia ("Oops, nada foi encontrado!")
export const eventosRows: AgendaRow[] = [];

// Detalhes do evento (drawer — 06-agenda-modais-evento.md)
export const eventoDetalhe = {
  tipo: "Agendamento",
  dataHora: "Seg, 22 de jun de 2026 • 14:00 - 15:00",
  profissional: "Lucas Bastos",
  iniciais: "LB",
  paciente: "Clara Ribeiro (Paciente de exemplo)",
  status: "Concluído" as AgendaStatus,
  procedimento: "1x Limpeza de Pele Profunda",
  valor: 200,
  recebimento: "Sem previsão de recebimento",
  observacao: "Esse agendamento é uma consulta de exemplo.",
};

/* ====================================================================== */
/* Financeiro — Relatórios & Cadastros (lote 7, telas 15-23)             */
/* ====================================================================== */

/* ---------- 15 — Extrato de movimentação ---------- */

export type MetodoPgto = "pix" | "dinheiro" | "cartao" | "boleto" | "transferencia";

export type ExtratoRow = {
  vencimento: string;
  execucao: string | null;
  descricao: string;
  categoria: string;
  metodo: MetodoPgto;
  situacao: FinanceStatus;
  valor: number;
  tipo: "receita" | "despesa";
  atrasado?: boolean;
};

export type ExtratoData = {
  periodo: string;
  total: number;
  kpis: FinanceKpi[];
  rows: ExtratoRow[];
};

export const extrato: ExtratoData = {
  periodo: "23/05/2026 - 22/06/2026",
  total: 30,
  kpis: [
    { label: "Receitas em aberto", valor: 2180, tone: "success" },
    { label: "Receitas realizadas", valor: 6320, tone: "success" },
    { label: "Despesas em aberto", valor: 3380, tone: "danger" },
    { label: "Despesas realizadas", valor: 3889, tone: "danger" },
    { label: "Total do período", valor: 1231, tone: "info", ativo: true },
  ],
  rows: [
    { vencimento: "17/06", execucao: "17/06", descricao: "Aluguel de Clínica", categoria: "Outras des...", metodo: "transferencia", situacao: "Pago", valor: 1200, tipo: "despesa" },
    { vencimento: "17/06", execucao: "17/06", descricao: "Material de Escritório", categoria: "Outras des...", metodo: "dinheiro", situacao: "Pago", valor: 150, tipo: "despesa" },
    { vencimento: "17/06", execucao: null, descricao: "Renovação de Licenças", categoria: "Outras des...", metodo: "boleto", situacao: "Em atraso", valor: 500, tipo: "despesa", atrasado: true },
    { vencimento: "17/06", execucao: "17/06", descricao: "Massagem Relaxante", categoria: "Receitas d...", metodo: "pix", situacao: "Recebido", valor: 150, tipo: "receita" },
    { vencimento: "17/06", execucao: "17/06", descricao: "Preenchimento Facial", categoria: "Receitas d...", metodo: "cartao", situacao: "Recebido", valor: 1800, tipo: "receita" },
    { vencimento: "18/06", execucao: null, descricao: "Venda de Cremes Anti-idade", categoria: "Receitas d...", metodo: "pix", situacao: "Em atraso", valor: 350, tipo: "receita", atrasado: true },
    { vencimento: "18/06", execucao: null, descricao: "Drenagem Linfática", categoria: "Receitas d...", metodo: "pix", situacao: "Em atraso", valor: 180, tipo: "receita", atrasado: true },
    { vencimento: "18/06", execucao: "18/06", descricao: "Microagulhamento", categoria: "Receitas d...", metodo: "cartao", situacao: "Recebido", valor: 600, tipo: "receita" },
    { vencimento: "18/06", execucao: "18/06", descricao: "Água", categoria: "Outras des...", metodo: "boleto", situacao: "Pago", valor: 400, tipo: "despesa" },
    { vencimento: "19/06", execucao: "19/06", descricao: "Manutenção de Equipamentos", categoria: "Outras des...", metodo: "transferencia", situacao: "Pago", valor: 800, tipo: "despesa" },
    { vencimento: "19/06", execucao: "19/06", descricao: "Limpeza", categoria: "Outras des...", metodo: "dinheiro", situacao: "Pago", valor: 300, tipo: "despesa" },
    { vencimento: "19/06", execucao: "19/06", descricao: "Limpeza de Pele", categoria: "Receitas d...", metodo: "pix", situacao: "Recebido", valor: 200, tipo: "receita" },
    { vencimento: "19/06", execucao: "19/06", descricao: "Venda de Produtos Cosméticos", categoria: "Receitas d...", metodo: "cartao", situacao: "Recebido", valor: 120, tipo: "receita" },
  ],
};

/* ---------- 16 — Relatório de competência ---------- */

export type CompetenciaRow = {
  competencia: string;
  descricao: string;
  contato: string;
  bruto: number;
  liquido: number;
  tipo: "receita" | "despesa" | "saldo";
};

export type CompetenciaData = {
  mes: string;
  total: number;
  kpis: FinanceKpi[];
  rows: CompetenciaRow[];
};

export const competencia: CompetenciaData = {
  mes: "Junho de 2026",
  total: 30,
  kpis: [
    { label: "Receitas", valor: 8500, tone: "success" },
    { label: "Despesas", valor: 7269, tone: "danger" },
    { label: "Total do período", valor: 1231, tone: "info", ativo: true },
  ],
  rows: [
    { competencia: "22/06", descricao: "Tratamento de Manchas", contato: "Clara Ribeiro (Paciente de ...", bruto: 400, liquido: 400, tipo: "receita" },
    { competencia: "22/06", descricao: "Bioplastia", contato: "Clara Ribeiro (Paciente de ...", bruto: 1500, liquido: 1500, tipo: "receita" },
    { competencia: "22/06", descricao: "Laser CO2", contato: "Clara Ribeiro (Paciente de ...", bruto: 900, liquido: 900, tipo: "receita" },
    { competencia: "22/06", descricao: "Consulta de Avaliações", contato: "Clara Ribeiro (Paciente de ...", bruto: 100, liquido: 100, tipo: "receita" },
    { competencia: "22/06", descricao: "Toxina Botulínica", contato: "Clara Ribeiro (Paciente de ...", bruto: 1300, liquido: 1300, tipo: "receita" },
    { competencia: "22/06", descricao: "Peeling Químico", contato: "Clara Ribeiro (Paciente de ...", bruto: 350, liquido: 350, tipo: "receita" },
    { competencia: "22/06", descricao: "Assessoria Jurídica", contato: "Clara Ribeiro (Paciente de ...", bruto: 980, liquido: -980, tipo: "despesa" },
    { competencia: "22/06", descricao: "Marketing Digital", contato: "Clara Ribeiro (Paciente de ...", bruto: 1000, liquido: -1000, tipo: "despesa" },
    { competencia: "22/06", descricao: "Telefone Fixo", contato: "Clara Ribeiro (Paciente de ...", bruto: 150, liquido: -150, tipo: "despesa" },
    { competencia: "22/06", descricao: "Serviços Contábeis", contato: "Clara Ribeiro (Paciente de ...", bruto: 750, liquido: -750, tipo: "despesa" },
    { competencia: "22/06", descricao: "Energia Elétrica", contato: "Clara Ribeiro (Paciente de ...", bruto: 500, liquido: -500, tipo: "despesa" },
    { competencia: "22/06", descricao: "Saldo inicial da conta Banco padrão", contato: "Lucas Bastos", bruto: 0, liquido: 0, tipo: "saldo" },
    { competencia: "22/06", descricao: "Saldo inicial da conta Caixa", contato: "Lucas Bastos", bruto: 0, liquido: 0, tipo: "saldo" },
  ],
};

/* ---------- 17/18 — Fluxo de caixa (linha derivada da tabela) ---------- */

export type FluxoRow = {
  label: string;
  saldoInicial: number;
  entrada: number;
  saida: number;
  lucro: number;
  saldoFinal: number;
};

// 17 — diário: dias 1-30 Jun; movimento 17-22 somando entrada 6.320 / saída 3.889
export const fluxoDiarioPoints: CashflowPoint[] = (() => {
  const movimento: Record<number, { entradas: number; saidas: number }> = {
    17: { entradas: 1950, saidas: -1850 },
    18: { entradas: 1130, saidas: -400 },
    19: { entradas: 320, saidas: -1100 },
    22: { entradas: 2920, saidas: -539 },
  };
  let saldo = 0;
  return Array.from({ length: 30 }, (_, i) => {
    const dia = i + 1;
    const m = movimento[dia] ?? { entradas: 0, saidas: 0 };
    saldo += m.entradas + m.saidas;
    return {
      label: `${dia} Jun`,
      entradas: m.entradas,
      entradasPrevistas: 0,
      saidas: m.saidas,
      saidasPrevistas: 0,
      saldo,
      saldoPrevisto: saldo,
    };
  });
})();

// 18 — mensal: Jan-Dez 2026; só Junho com movimento (entrada 6.320 / saída 3.889)
export const fluxoMensalPoints: CashflowPoint[] = (() => {
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  let saldo = 0;
  return meses.map((m, i) => {
    const entradas = i === 5 ? 6320 : 0;
    const saidas = i === 5 ? -3889 : 0;
    saldo += entradas + saidas;
    return {
      label: `${m} 2026`,
      entradas,
      entradasPrevistas: 0,
      saidas,
      saidasPrevistas: 0,
      saldo,
      saldoPrevisto: saldo,
    };
  });
})();

export const fluxoFiltrosGerais =
  "Transferência: Sim, Saldo inicial: Sim, Valor padrão: Líquido, Previsão: Não";

/* ---------- 19 — Relatório de categorias ---------- */

export type CategoriaReportNode = {
  nome: string;
  valor: number;
  cor: string;
  filhos?: { nome: string; valor: number }[];
};

export const receitasReport: CategoriaReportNode[] = [
  {
    nome: "Receitas",
    valor: 8500,
    cor: "#84cc16",
    filhos: [{ nome: "Receitas de serviços", valor: 8500 }],
  },
];

export const despesasReport: CategoriaReportNode[] = [
  {
    nome: "Outras despesas",
    valor: 7269,
    cor: "#f43f5e",
    filhos: [{ nome: "Outras despesas", valor: 7269 }],
  },
];

export const periodoCategorias = "Junho de 2026";

/* ---------- 20 — Contas financeiras ---------- */

export type ContaFinanceira = {
  id: string;
  nome: string;
  tipo: string;
  saldo: number;
  icon: "bank" | "cash" | "wallet";
};

export const contasFinanceirasList: ContaFinanceira[] = [
  { id: "1", nome: "Banco padrão", tipo: "Conta Corrente", saldo: 2431, icon: "bank" },
  { id: "2", nome: "Caixa", tipo: "Caixa", saldo: 0, icon: "cash" },
];

export const tiposConta = ["Caixa", "Conta Corrente", "Carteira"];

/* ---------- 21 — Categorias de contas (árvore) ---------- */

export type CategoriaConta = {
  id: string;
  descricao: string;
  ativo: boolean;
  filhos?: { id: string; descricao: string; ativo: boolean }[];
};

export const categoriasContas: CategoriaConta[] = [
  {
    id: "1",
    descricao: "Receitas de serviços",
    ativo: true,
    filhos: [
      { id: "1-1", descricao: "Procedimentos estéticos", ativo: true },
      { id: "1-2", descricao: "Consultas", ativo: true },
    ],
  },
  {
    id: "2",
    descricao: "Vendas de produtos",
    ativo: true,
    filhos: [{ id: "2-1", descricao: "Cosméticos", ativo: true }],
  },
  {
    id: "3",
    descricao: "Aquisições de imobilizados",
    ativo: true,
    filhos: [
      { id: "3-1", descricao: "Equipamentos", ativo: true },
      { id: "3-2", descricao: "Móveis e utensílios", ativo: false },
    ],
  },
  {
    id: "4",
    descricao: "Outras despesas",
    ativo: true,
    filhos: [
      { id: "4-1", descricao: "Aluguel", ativo: true },
      { id: "4-2", descricao: "Energia elétrica", ativo: true },
      { id: "4-3", descricao: "Marketing", ativo: true },
    ],
  },
  { id: "5", descricao: "Impostos e taxas", ativo: false, filhos: [] },
];

/* ---------- 22 — Métodos de pagamento ---------- */

export type MetodoPagamento = {
  id: string;
  descricao: string;
  tipo: string;
  marca: string;
  ativo: boolean;
};

export const metodosPagamento: MetodoPagamento[] = [
  { id: "1", descricao: "Boleto", tipo: "Boleto", marca: "—", ativo: true },
  { id: "2", descricao: "Cartão de crédito", tipo: "Cartão", marca: "Outra", ativo: true },
  { id: "3", descricao: "Cartão de débito", tipo: "Cartão", marca: "Outra", ativo: true },
  { id: "4", descricao: "Depósito", tipo: "Transferência", marca: "—", ativo: true },
  { id: "5", descricao: "Dinheiro", tipo: "Dinheiro", marca: "—", ativo: false },
  { id: "6", descricao: "Máquina de cartão", tipo: "Cartão", marca: "—", ativo: true },
  { id: "7", descricao: "PIX", tipo: "PIX", marca: "—", ativo: true },
  { id: "8", descricao: "Transferência", tipo: "Transferência", marca: "—", ativo: true },
];

export const tiposMetodo = ["Dinheiro", "PIX", "Cartão", "Boleto", "Transferência"];

/* ---------- 23 — Comissões em aberto (vazio nesta fase) ---------- */

export type Comissao = {
  profissional: string;
  referencia: string;
  data: string;
  base: number;
  percentual: number;
  valor: number;
  status: FinanceStatus;
};

export const comissoes: Comissao[] = [];
export const periodoComissoes = "23/05/2026 - 22/06/2026";

/* ---------- 29 — Comunicação / Modelos de mensagens (sistema) ---------- */

export type CanalMensagem = "WhatsApp Lite" | "E-mail" | "SMS" | "WhatsApp Business";

export type ModeloMensagem = {
  id: string;
  /** id de ícone lucide resolvido no card */
  icone: "gift" | "heart" | "calendar-plus" | "calendar" | "calendar-x" | "clipboard-question" | "clock" | "check-circle" | "file-text";
  titulo: string;
  descricao: string;
  canais: CanalMensagem[];
};

const TODOS_CANAIS: CanalMensagem[] = ["WhatsApp Lite", "E-mail", "SMS", "WhatsApp Business"];

/** Catálogo de mensagens do sistema. 6 primeiros = textos exatos da captura; demais inferidos. */
export const modelosMensagens: ModeloMensagem[] = [
  {
    id: "aniversario",
    icone: "gift",
    titulo: "Aniversário",
    descricao:
      "Programe o envio de uma mensagem de felicitações no aniversário dos seus pacientes. Escolha um modelo padrão e personalize como preferir.",
    canais: TODOS_CANAIS,
  },
  {
    id: "boas-vindas",
    icone: "heart",
    titulo: "Boas-vindas",
    descricao:
      "Envie uma mensagem recepcionando os pacientes após a realização do cadastro e sinalize o canal de comunicação que você usará para enviar notificações.",
    canais: TODOS_CANAIS,
  },
  {
    id: "agendamento-criado",
    icone: "calendar-plus",
    titulo: "Agendamento criado",
    descricao:
      "Notifique seu paciente assim que um agendamento for criado na sua agenda, enviando as informações da consulta.",
    canais: TODOS_CANAIS,
  },
  {
    id: "agendamento-alterado",
    icone: "calendar",
    titulo: "Agendamento alterado",
    descricao:
      "Notifique os pacientes quando um agendamento tiver data, hora, duração, procedimentos ou profissional alterados.",
    canais: TODOS_CANAIS,
  },
  {
    id: "agendamento-cancelado",
    icone: "calendar-x",
    titulo: "Agendamento cancelado",
    descricao:
      'Notifique automaticamente os pacientes quando o status do agendamento for alterado para "Cancelado" ou "Excluido".',
    canais: TODOS_CANAIS,
  },
  {
    id: "formulario-pre-atendimento",
    icone: "clipboard-question",
    titulo: "Formulário de pré-atendimento",
    descricao: "Solicite aos pacientes o preenchimento de formulários de pré atendimento",
    canais: ["WhatsApp Lite", "E-mail", "SMS"],
  },
  {
    id: "lembrete-agendamento",
    icone: "clock",
    titulo: "Lembrete de agendamento",
    descricao:
      "Lembre o paciente de um agendamento próximo, definindo a antecedência de envio em horas ou dias.",
    canais: TODOS_CANAIS,
  },
  {
    id: "confirmacao-agendamento",
    icone: "check-circle",
    titulo: "Confirmação de agendamento",
    descricao:
      "Solicite ao paciente que confirme a presença na consulta, com resposta direto pela mensagem.",
    canais: TODOS_CANAIS,
  },
  {
    id: "lembrete-fatura",
    icone: "file-text",
    titulo: "Lembrete de fatura",
    descricao:
      "Lembre o paciente de uma fatura ou parcela a vencer, informando valor e data de vencimento.",
    canais: ["WhatsApp Lite", "E-mail", "SMS"],
  },
];

/* ---------- Opções de formulário (selects/filtros) ----------
   Listas de domínio usadas em <Select>/filtros. Centralizadas aqui para
   troca trivial pelo backend (substituir o array pela resposta da API). */

// Métodos no select "Condições de pagamento" do modal de orçamento (spec 09).
export const metodosPagamentoOrcamento = [
  "Cartão de crédito",
  "Cartão de débito",
  "Pix",
  "Dinheiro",
  "Boleto",
];

// Opções de recorrência do modal Novo evento (spec 06).
export const recorrenciasEvento = [
  "Não se repete",
  "Diariamente",
  "Semanalmente",
  "Mensalmente",
  "Anualmente",
  "Personalizado",
];

// Status de agendamento/evento da agenda (spec 06/07).
export const statusEventoOpcoes = [
  "Agendado",
  "Confirmado",
  "Não compareceu",
  "Concluído",
  "Cancelado",
];

// Filtro "Uso" da aba Pacotes da ficha do paciente (spec 08).
export const usoPacoteOpcoes = ["Não utilizados", "Em andamento", "Concluídos"];
