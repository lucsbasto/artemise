// Funções puras de cálculo financeiro (testáveis em isolado, sem React).
// Padrão de lib/pacote-calc.ts.
//
// M7 (SUP-07/SUP-11): porta de backend/internal/domain/financeiro.go +
// backend/internal/store/financeiro.go. As queries agregadas do Go viram
// agregação em memória sobre as linhas-fonte trazidas pelo Supabase. Campos
// monetários (`numeric` no Postgres) podem chegar como string no PostgREST —
// `num()` força para number antes de somar (design §7).
import type {
  CashflowPoint,
  FluxoRow,
  ContaFinanceira,
  CategoriaReportNode,
  FinanceKpi,
  FinanceRow,
  FinanceStatus,
  ExtratoRow,
  CompetenciaRow,
  MetodoPgto,
} from "@/lib/mock";

/**
 * Encadeia o saldo de uma série de fluxo de caixa.
 * - lucro = entrada - saída (saída chega negativa em CashflowPoint)
 * - saldoFinal = saldoInicial + lucro
 * - saldoInicial[n+1] = saldoFinal[n]
 */
export function fluxoRows(points: CashflowPoint[], saldoInicial = 0): FluxoRow[] {
  let inicial = saldoInicial;
  return points.map((p) => {
    const entrada = p.entradas;
    const saida = Math.abs(p.saidas);
    const lucro = entrada - saida;
    const saldoFinal = inicial + lucro;
    const row: FluxoRow = {
      label: p.label,
      saldoInicial: inicial,
      entrada,
      saida,
      lucro,
      saldoFinal,
    };
    inicial = saldoFinal;
    return row;
  });
}

/** Percentual de uma parte sobre o total. Retorna 0 quando total = 0 (sem NaN). */
export function percentual(valor: number, total: number): number {
  if (!total) return 0;
  return Math.round((Math.abs(valor) / Math.abs(total)) * 100);
}

/** Soma dos saldos das contas. */
export function somaSaldos(contas: ContaFinanceira[]): number {
  return contas.reduce((acc, c) => acc + c.saldo, 0);
}

/** Total de um nó: soma dos filhos quando houver, senão o valor próprio. */
export function totalNode(node: CategoriaReportNode): number {
  if (node.filhos && node.filhos.length) {
    return node.filhos.reduce((acc, f) => acc + f.valor, 0);
  }
  return node.valor;
}

/** Total de um grupo de nós (ex.: todas as receitas). */
export function totalGrupo(nodes: CategoriaReportNode[]): number {
  return nodes.reduce((acc, n) => acc + totalNode(n), 0);
}

/* ====================================================================== */
/* M7 — agregação financeira (porta de store/financeiro.go)               */
/* ====================================================================== */

/**
 * Coerção `numeric`→number. PostgREST devolve `numeric` como string em algumas
 * configs; sem isso a soma vira concatenação. `null`/`undefined`/NaN viram 0.
 */
export function num(v: unknown): number {
  const n = typeof v === "string" ? parseFloat(v) : Number(v);
  return Number.isFinite(n) ? n : 0;
}

const MESES_ABREV = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
] as const;
const MESES_NOME = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
] as const;

const SITUACOES_REALIZADAS: FinanceStatus[] = ["Recebido", "Pago"];
const SITUACOES_ABERTAS: FinanceStatus[] = ["Em aberto", "Em atraso"];

const isRealizada = (s: FinanceStatus) => SITUACOES_REALIZADAS.includes(s);
const isAberta = (s: FinanceStatus) => SITUACOES_ABERTAS.includes(s);

// Paleta de cores das raízes do relatório de categorias (donut Pie100).
const CATEGORIA_CORES = [
  "#16a34a", "#3b82f6", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#84cc16",
];

/**
 * Linha-fonte de `lancamentos_financeiros` (camelCase via alias PostgREST).
 * `valor` pode chegar string; demais ids podem ser null.
 */
export type LancamentoSource = {
  id?: string;
  tipo: "receita" | "despesa";
  situacao: FinanceStatus;
  valor: number | string;
  vencimento: string; // "YYYY-MM-DD"
  liquidacao?: string | null; // "YYYY-MM-DD" | null
  descricao?: string | null;
  categoriaId?: string | null;
  metodoId?: string | null;
  pacienteId?: string | null;
  fornecedorId?: string | null;
};

/** Categoria-fonte de `categorias_contas` (árvore via parent_id). */
export type CategoriaSource = {
  id: string;
  descricao: string;
  parentId?: string | null;
};

/** Mapa id→nome usado para resolver categoria/método/contato nas linhas. */
export type Lookup = Record<string, string>;

/* ---------- Datas (UTC, espelhando o Go) ---------- */

/** Parse "YYYY-MM-DD" em UTC à meia-noite, evitando shift de fuso. */
export function parseDateOnly(s: string): Date {
  const [y, m, d] = s.slice(0, 10).split("-").map(Number);
  return new Date(Date.UTC(y, (m || 1) - 1, d || 1));
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/** "2 Jan" — dia + mês abreviado (porta de labelDia). */
export function labelDia(d: Date): string {
  return `${d.getUTCDate()} ${MESES_ABREV[d.getUTCMonth()]}`;
}

/** "Jan 2026" — mês abreviado + ano (porta de labelMes). */
export function labelMes(d: Date): string {
  return `${MESES_ABREV[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** "Junho de 2026" — mês por extenso + ano. */
export function mesNomeAno(d: Date): string {
  return `${MESES_NOME[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}

/** "DD/MM/YYYY" a partir de uma date-only; null preserva ausência. */
export function formatDateBR(s?: string | null): string | null {
  if (!s) return null;
  const d = parseDateOnly(s);
  return `${pad2(d.getUTCDate())}/${pad2(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;
}

export function startOfMonth(ref: Date): Date {
  return new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), 1));
}
export function endOfMonth(ref: Date): Date {
  return new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth() + 1, 0, 23, 59, 59, 999));
}
export function startOfYear(ref: Date): Date {
  return new Date(Date.UTC(ref.getUTCFullYear(), 0, 1));
}
export function endOfYear(ref: Date): Date {
  return new Date(Date.UTC(ref.getUTCFullYear(), 11, 31, 23, 59, 59, 999));
}

/** ISO date-only "YYYY-MM-DD" para passar a filtros `.gte/.lte` do PostgREST. */
export function toISODate(d: Date): string {
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

/** "DD/MM/YYYY - DD/MM/YYYY" (porta do periodo do dashboard/extrato). */
export function periodoLabel(inicio: Date, fim: Date): string {
  const f = (d: Date) => `${pad2(d.getUTCDate())}/${pad2(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;
  return `${f(inicio)} - ${f(fim)}`;
}

/* ---------- KPIs de extrato/competência (porta de extratoKPIs) ---------- */

export type ExtratoKPIs = {
  receitasAbertas: number;
  receitasRealizadas: number;
  despesasAbertas: number;
  despesasRealizadas: number;
  totalPeriodo: number;
};

/** Indicadores aberto×realizado sobre os lançamentos já filtrados no período. */
export function extratoKPIs(lancs: LancamentoSource[]): ExtratoKPIs {
  let ra = 0, rr = 0, da = 0, dr = 0;
  for (const l of lancs) {
    const v = num(l.valor);
    if (l.tipo === "receita") {
      if (isRealizada(l.situacao)) rr += v;
      else if (isAberta(l.situacao)) ra += v;
    } else {
      if (isRealizada(l.situacao)) dr += v;
      else if (isAberta(l.situacao)) da += v;
    }
  }
  return {
    receitasAbertas: ra,
    receitasRealizadas: rr,
    despesasAbertas: da,
    despesasRealizadas: dr,
    totalPeriodo: rr - dr,
  };
}

/** KPIs → cards do extrato/competência (Receitas/Despesas/A receber/A pagar). */
export function extratoFinanceKpis(k: ExtratoKPIs): FinanceKpi[] {
  return [
    { label: "Receitas", valor: k.receitasRealizadas, tone: "success" },
    { label: "Despesas", valor: -k.despesasRealizadas, tone: "danger" },
    { label: "A receber", valor: k.receitasAbertas, tone: "info" },
    { label: "A pagar", valor: -k.despesasAbertas, tone: "warning" },
  ];
}

/** KPIs das telas de contas a receber / contas a pagar (sem golden no Go). */
export function contasFinanceKpis(lancs: LancamentoSource[], tipo: "receita" | "despesa"): FinanceKpi[] {
  let abertas = 0, realizadas = 0, atraso = 0;
  for (const l of lancs) {
    const v = num(l.valor);
    if (isRealizada(l.situacao)) realizadas += v;
    else {
      abertas += v;
      if (l.situacao === "Em atraso") atraso += v;
    }
  }
  if (tipo === "receita") {
    return [
      { label: "A receber", valor: abertas, tone: "info" },
      { label: "Recebido", valor: realizadas, tone: "success" },
      { label: "Em atraso", valor: atraso, tone: "danger" },
    ];
  }
  return [
    { label: "A pagar", valor: -abertas, tone: "warning" },
    { label: "Pago", valor: -realizadas, tone: "danger" },
    { label: "Em atraso", valor: -atraso, tone: "danger" },
  ];
}

/* ---------- Fluxo de caixa (porta de FluxoDiario/FluxoMensal) ---------- */

// CashflowPoint só com entradas/saídas preenchidas (resto 0). O encadeamento de
// saldo é feito por fluxoRows() na própria view de fluxo.
function cashPoint(label: string, entradas: number, saidas: number): CashflowPoint {
  return {
    label,
    entradas,
    entradasPrevistas: 0,
    saidas, // negativo
    saidasPrevistas: 0,
    saldo: 0,
    saldoPrevisto: 0,
  };
}

/** Pontos diários do mês de `ref` (todos os dias, zero-fill). Saídas negativas. */
export function cashflowPorDia(lancs: LancamentoSource[], ref: Date): CashflowPoint[] {
  const year = ref.getUTCFullYear();
  const month = ref.getUTCMonth();
  const diasNoMes = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const ent = new Array(diasNoMes + 1).fill(0);
  const sai = new Array(diasNoMes + 1).fill(0);
  for (const l of lancs) {
    const d = parseDateOnly(l.vencimento);
    if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month) continue;
    const dia = d.getUTCDate();
    if (l.tipo === "receita") ent[dia] += num(l.valor);
    else sai[dia] += num(l.valor);
  }
  const points: CashflowPoint[] = [];
  for (let dia = 1; dia <= diasNoMes; dia++) {
    points.push(cashPoint(labelDia(new Date(Date.UTC(year, month, dia))), ent[dia], -sai[dia]));
  }
  return points;
}

/** Pontos mensais (Jan..Dez) do ano de `ref` (zero-fill). Saídas negativas. */
export function cashflowPorMes(lancs: LancamentoSource[], ref: Date): CashflowPoint[] {
  const year = ref.getUTCFullYear();
  const ent = new Array(12).fill(0);
  const sai = new Array(12).fill(0);
  for (const l of lancs) {
    const d = parseDateOnly(l.vencimento);
    if (d.getUTCFullYear() !== year) continue;
    const m = d.getUTCMonth();
    if (l.tipo === "receita") ent[m] += num(l.valor);
    else sai[m] += num(l.valor);
  }
  const points: CashflowPoint[] = [];
  for (let m = 0; m < 12; m++) {
    points.push(cashPoint(labelMes(new Date(Date.UTC(year, m, 1))), ent[m], -sai[m]));
  }
  return points;
}

/* ---------- Árvore de categorias (porta de buildCategoriaTree) ---------- */

/**
 * Monta a árvore pai→filhos (totaliza pais pelos filhos), descarta nós zerados
 * e atribui cor às raízes (consumida pelo donut). O percentual é recalculado
 * pela própria view (percentual()), por isso não vai no nó.
 */
export function categoriasTree(
  cats: CategoriaSource[],
  lancs: LancamentoSource[],
  tipo: "receita" | "despesa",
): CategoriaReportNode[] {
  const own: Record<string, number> = {};
  const desc: Record<string, string> = {};
  const childrenOf: Record<string, string[]> = {};
  const rootIds: string[] = [];

  for (const c of cats) {
    own[c.id] = 0;
    desc[c.id] = c.descricao;
    if (c.parentId) (childrenOf[c.parentId] ??= []).push(c.id);
    else rootIds.push(c.id);
  }
  for (const l of lancs) {
    if (l.tipo !== tipo || !l.categoriaId) continue;
    own[l.categoriaId] = (own[l.categoriaId] ?? 0) + num(l.valor);
  }

  const build = (id: string): CategoriaReportNode => {
    const filhos: { nome: string; valor: number }[] = [];
    let childTotal = 0;
    for (const cid of childrenOf[id] ?? []) {
      const child = build(cid);
      if (child.valor === 0) continue; // descarta filhos zerados
      childTotal += child.valor;
      filhos.push({ nome: child.nome, valor: child.valor });
    }
    return {
      nome: desc[id],
      valor: (own[id] ?? 0) + childTotal,
      cor: "",
      filhos: filhos.length ? filhos : undefined,
    };
  };

  const roots: CategoriaReportNode[] = [];
  let colorIdx = 0;
  for (const id of rootIds) {
    const n = build(id);
    if (n.valor === 0) continue; // descarta raízes zeradas
    n.cor = CATEGORIA_CORES[colorIdx % CATEGORIA_CORES.length];
    colorIdx++;
    roots.push(n);
  }
  return roots;
}

/* ---------- Mappers de linha (lançamento → shape de tabela) ---------- */

/** Normaliza `metodos_pagamento.tipo` para o enum de ícone do extrato. */
export function metodoEnum(tipo?: string | null): MetodoPgto {
  const t = (tipo ?? "").toLowerCase();
  if (t.includes("pix")) return "pix";
  if (t.includes("dinh")) return "dinheiro";
  if (t.includes("cart") || t.includes("créd") || t.includes("cred") || t.includes("déb") || t.includes("deb")) return "cartao";
  if (t.includes("bol")) return "boleto";
  if (t.includes("transf")) return "transferencia";
  return "pix";
}

/** Lançamento → linha do extrato de movimentação. */
export function toExtratoRow(l: LancamentoSource, categorias: Lookup, metodos: Lookup): ExtratoRow {
  return {
    vencimento: formatDateBR(l.vencimento) ?? "",
    execucao: formatDateBR(l.liquidacao),
    descricao: l.descricao ?? "",
    categoria: (l.categoriaId && categorias[l.categoriaId]) || "—",
    metodo: metodoEnum(l.metodoId ? metodos[l.metodoId] : undefined),
    situacao: l.situacao,
    valor: num(l.valor),
    tipo: l.tipo,
    atrasado: l.situacao === "Em atraso",
  };
}

/** Lançamento → linha de contas a receber/pagar. */
export function toFinanceRow(l: LancamentoSource, categorias: Lookup): FinanceRow {
  return {
    vencimento: formatDateBR(l.vencimento) ?? "",
    liquidacao: formatDateBR(l.liquidacao) ?? "Sem previsão",
    atrasado: l.situacao === "Em atraso",
    descricao: l.descricao ?? "",
    categoria: (l.categoriaId && categorias[l.categoriaId]) || "—",
    situacao: l.situacao,
    valor: num(l.valor),
  };
}

/** Lançamento → linha do relatório de competência (bruto=líquido sem taxas). */
export function toCompetenciaRow(l: LancamentoSource, contatos: Lookup): CompetenciaRow {
  const v = num(l.valor);
  return {
    competencia: labelMes(parseDateOnly(l.vencimento)),
    descricao: l.descricao ?? "",
    contato: (l.pacienteId && contatos[l.pacienteId]) || (l.fornecedorId && contatos[l.fornecedorId]) || "",
    bruto: v,
    liquido: v,
    tipo: l.tipo,
  };
}
