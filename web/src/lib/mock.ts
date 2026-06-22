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

/* ---------- Usuário / app ---------- */
export const currentUser = { nome: "Lucas Bastos", iniciais: "LB" };
