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

// Dados do dashboard (cashflowDaily, balance, next24h, reports) vêm de
// GET /api/dashboard — apenas os tipos permanecem aqui.

export type Balance = {
  saldoRealizado: number;
  saldoPrevisto: number;
  entradasRealizadas: number;
  entradasPrevistas: number;
  saidasRealizadas: number;
  saidasPrevistas: number;
  periodo: string;
};

export type Appointment = {
  paciente: string;
  procedimento: string;
  horario: string;
};

export type Reports = {
  porProfissional: { label: string; total: number }[];
  diasMovimentados: { dia: string; total: number }[];
  horarios: string[];
  heatAtivo: string;
  statusAgendamento: { total: number; label: string; legenda: string };
  pacientesPorSexo: { total: number; label: string; legenda: string };
  faturamentoComparado: { label: string; valor: number }[];
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
  // Informações pessoais (ficha) — opcionais p/ compat com seeds antigos.
  sexo?: string;
  dataNascimento?: string;
  cpf?: string;
  email?: string;
  endereco?: string;
  observacoes?: string;
  recebeNotificacoes?: boolean;
  criadoEm?: string;
};

// Pacientes vêm de GET /api/pacientes (pacientesStore). Tipo `Patient` mantido.

/** Idade em anos a partir de "dd/mm/aaaa". Retorna null se inválida. */
export function idadeFrom(dataNascimento?: string): number | null {
  if (!dataNascimento) return null;
  const [d, m, y] = dataNascimento.split("/").map(Number);
  if (!d || !m || !y) return null;
  // Data de referência fixa do mock (today = 23/06/2026).
  const hoje = { d: 23, m: 6, y: 2026 };
  let idade = hoje.y - y;
  if (hoje.m < m || (hoje.m === m && hoje.d < d)) idade -= 1;
  return idade;
}

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

// Profissionais (contato) vêm de GET /api/profissionais (profissionaisStore).

/* ---------- Profissional (cadastro completo) ---------- */

// Conselhos de classe que atuam em estética no Brasil.
export type Conselho = "CRM" | "CRO" | "CREFITO" | "COREN" | "CRBM" | "CRF" | "Outro";

export type VinculoTrabalho = "CLT" | "PJ" | "Autônomo" | "Sócio";

// Regra de comissão por procedimento ou geral.
export type RegraComissao = {
  procedimentoId: string | null; // null = regra padrão p/ todos
  tipo: "percentual" | "fixo";
  valor: number; // % (0-100) ou R$
};

// Janela de trabalho num dia da semana (0=Dom ... 6=Sáb).
export type HorarioTrabalho = {
  diaSemana: number;
  inicio: string; // "HH:mm"
  fim: string; // "HH:mm"
};

export type Profissional = {
  id: string;
  // identificação
  nome: string;
  avatarTone: "brand" | "green";
  cpf: string;
  dataNascimento: string; // DD/MM/AAAA
  telefone: string;
  email: string;
  ativo: boolean;
  // habilitação
  conselho: Conselho;
  registro: string; // nº do conselho
  ufRegistro: string;
  especialidade: string;
  certificacoes: string[];
  // atuação
  vinculo: VinculoTrabalho;
  procedimentoIds: string[]; // procedimentos que executa
  horarios: HorarioTrabalho[];
  // financeiro
  comissoes: RegraComissao[];
  chavePix: string;
  // acesso
  perfilAcesso: "admin" | "recepção" | "profissional";
};

// Detalhe rico vem de GET /api/profissionais/{id} (profissionaisDetalheStore).
// Fornecedores vêm de GET /api/fornecedores (fornecedoresStore).

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

// contasReceber/contasPagar vêm de GET /api/financeiro/contas-receber|contas-pagar.

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

export type CategoriaProc = "Facial" | "Corporal" | "Injetáveis" | "Estética";

export type Procedimento = {
  id: string;
  nome: string;
  categoria: CategoriaProc | null;
  duracaoMin: number;
  valor: number;
  ativo: boolean;
  usaMapa: boolean; // Injetáveis abrem o MapaInjetaveis (marcação por pontos no rosto).
};

// Procedimentos vêm de GET /api/procedimentos (procedimentosStore).
// Fallback pré-definido: usado no dropdown de agendamento quando a coleção do
// Supabase ainda está vazia (tenant novo/sem catálogo). Garante que o campo
// "Procedimentos/Produtos" nunca fique sem opções para selecionar.
export const procedimentosPredefinidos: Procedimento[] = [
  { id: "pre-1", nome: "Limpeza de Pele Profunda", categoria: "Facial", duracaoMin: 60, valor: 200, ativo: true, usaMapa: false },
  { id: "pre-2", nome: "Microagulhamento", categoria: "Facial", duracaoMin: 60, valor: 500, ativo: true, usaMapa: false },
  { id: "pre-3", nome: "Peeling Químico", categoria: "Facial", duracaoMin: 60, valor: 300, ativo: true, usaMapa: false },
  { id: "pre-4", nome: "Tratamento de Acne", categoria: "Facial", duracaoMin: 60, valor: 250, ativo: true, usaMapa: false },
  { id: "pre-5", nome: "Toxina Botulínica", categoria: "Injetáveis", duracaoMin: 45, valor: 900, ativo: true, usaMapa: true },
  { id: "pre-6", nome: "Preenchimento com Ácido Hialurônico", categoria: "Injetáveis", duracaoMin: 45, valor: 1200, ativo: true, usaMapa: true },
  { id: "pre-7", nome: "Massagem Modeladora", categoria: "Corporal", duracaoMin: 50, valor: 180, ativo: true, usaMapa: false },
  { id: "pre-8", nome: "Drenagem Linfática", categoria: "Corporal", duracaoMin: 50, valor: 160, ativo: true, usaMapa: false },
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

/* ---------- Mapa de injetáveis (estado serializável da ficha) ---------- */
// Tipos do estado controlado de <MapaInjetaveis>. Persistidos no registro do
// paciente quando o procedimento é injetável (usaMapa). Spec: features/mapa-injetaveis.
export type ModoMapa = "mao-livre" | "selecionavel";

export type PontoInjetavel = {
  id: string;
  substanciaId: string; // = id do item de Estoque (categoria "Injetáveis")
  modo: ModoMapa;
  x: number; // 0..1 relativo ao viewBox da imagem
  y: number; // 0..1
  regiaoId?: string;
  unidades: number; // "ui" aplicadas
};

export type RastreioInjetavel = {
  marca: string;
  numeroLote: string;
  dataDiluicao: string;
  volumeDiluicao: string;
  dataValidade: string;
};

export type FichaInjetaveis = {
  pontos: PontoInjetavel[];
  rastreioPorSub: Record<string, RastreioInjetavel>;
  relatorio: string;
};

export const fichaInjetaveisVazia = (): FichaInjetaveis => ({
  pontos: [],
  rastreioPorSub: {},
  relatorio: "",
});

/* ---------- Registro de procedimentos por paciente (ficha) ---------- */
// Procedimento efetivamente lançado na ficha de um paciente (executado/agendado),
// distinto do catálogo `procedimentos` (tipos disponíveis na clínica).
export type StatusRegistroProc = "realizado" | "agendado" | "cancelado";

export type RegistroProcedimento = {
  id: string;
  pacienteId: string;
  procedimento: string;
  profissional: string;
  data: string; // DD/MM/AAAA
  status: StatusRegistroProc;
  valor: number;
  observacoes: string;
  usaMapa?: boolean; // derivado do catálogo no momento do registro
  mapa?: FichaInjetaveis; // estado do mapa quando injetável
};

// Registros vêm de GET /api/pacientes/{id}/registros (registrosProcedimentoStore).

export const statusRegistroProcLabel: Record<StatusRegistroProc, string> = {
  realizado: "Realizado",
  agendado: "Agendado",
  cancelado: "Cancelado",
};

/* ---------- Pacotes (34-config-pacotes.md) ---------- */

export type Pacote = {
  id: string;
  descricao: string;
  valorTotal: number;
  validade: string;
  ativo: boolean;
};

// Pacotes vêm de GET /api/pacotes (pacotesStore).

/* ---------- Fichas de atendimentos (35-config-fichas-atendimento.md) ---------- */

export type FichaAtendimento = { id: string; nome: string; ativo: boolean };

// Fichas vêm de GET /api/fichas-atendimento (fichasAtendimentoStore).

/* ---------- Modelos de atestados e prescrições (36) ---------- */

export type ModeloDocumento = { id: string; nome: string; tipo: string; ativo: boolean };

// Modelos vêm de GET /api/modelos-documento (modelosDocumentoStore).

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

// Itens de estoque vêm de GET /api/itens-estoque (estoqueStore).

export const estoqueValor = (i: ItemEstoque) => i.saldo * i.custo;
export const estoqueBaixo = (i: ItemEstoque) => i.saldo <= i.minimo;

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
  { label: "Procedimentos", slug: "procedimentos" },
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

// Visão geral da agenda vem de GET /api/agenda/visao-geral.
// Relatório de agendamentos vem de GET /api/agenda/relatorio. Só os tipos ficam aqui.

export type AgendaKpi = { label: string; valor: string; delta?: string; deltaUp?: boolean };

// status do enum de agendamento — cor + contagem + %
export type AgendaStatus =
  | "Agendado"
  | "Confirmado"
  | "Não compareceu"
  | "Concluído"
  | "Cancelado";

export type RankItem = { nome: string; total: number; pct: number };

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

// agendaRelatorioRows/agendaStatusTabs vêm de GET /api/agenda/relatorio.

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

// extrato vem de GET /api/financeiro/extrato.

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

// competencia vem de GET /api/financeiro/competencia.

/* ---------- 17/18 — Fluxo de caixa (linha derivada da tabela) ---------- */

export type FluxoRow = {
  label: string;
  saldoInicial: number;
  entrada: number;
  saida: number;
  lucro: number;
  saldoFinal: number;
};

// fluxoDiarioPoints/fluxoMensalPoints vêm de GET /api/financeiro/fluxo?granularidade=dia|mes.

export const fluxoFiltrosGerais =
  "Transferência: Sim, Saldo inicial: Sim, Valor padrão: Líquido, Previsão: Não";

/* ---------- 19 — Relatório de categorias ---------- */

export type CategoriaReportNode = {
  nome: string;
  valor: number;
  cor: string;
  filhos?: { nome: string; valor: number }[];
};

// receitasReport/despesasReport vêm de GET /api/financeiro/categorias.

export const periodoCategorias = "Junho de 2026";

/* ---------- 20 — Contas financeiras ---------- */

export type ContaFinanceira = {
  id: string;
  nome: string;
  tipo: string;
  saldo: number;
  icon: "bank" | "cash" | "wallet";
};

// Contas financeiras vêm de GET /api/contas-financeiras (contasFinanceirasStore).

export const tiposConta = ["Caixa", "Conta Corrente", "Carteira"];

/* ---------- 21 — Categorias de contas (árvore) ---------- */

export type CategoriaConta = {
  id: string;
  descricao: string;
  ativo: boolean;
  filhos?: { id: string; descricao: string; ativo: boolean }[];
};

// Categorias de contas vêm de GET /api/categorias-contas (categoriasContasStore).

/* ---------- 22 — Métodos de pagamento ---------- */

export type MetodoPagamento = {
  id: string;
  descricao: string;
  tipo: string;
  marca: string;
  ativo: boolean;
};

// Métodos de pagamento vêm de GET /api/metodos-pagamento (metodosPagamentoStore).

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

// comissoes/periodo vêm de GET /api/financeiro/comissoes.

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
