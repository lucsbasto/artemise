// Agregação do dashboard — porta de backend/internal/store/dashboard.go +
// domain/types_computados.go. Funções puras sobre as linhas-fonte trazidas do
// Supabase (lancamentos, eventos, registros, contagem de pacientes).
import type { Balance, CashflowPoint, Reports, Appointment } from "@/lib/mock";
import { num, parseDateOnly, labelDia, periodoLabel, type LancamentoSource } from "@/lib/financeiro-calc";

const REALIZADAS = new Set(["Recebido", "Pago"]);
// Rótulo de uma letra por dia da semana (0=Dom..6=Sáb): D S T Q Q S S.
const LABEL_DIA_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"] as const;

/** Linha-fonte de `eventos_agenda` (camelCase via alias PostgREST). */
export type EventoSource = {
  paciente?: string | null;
  profissional?: string | null;
  procedimento?: string | null;
  inicio: string; // ISO timestamptz
  fim?: string; // ISO timestamptz
  status: string;
};

/** Linha-fonte de `registros_procedimento` (subset p/ KPIs do dashboard). */
export type RegistroSource = {
  pacienteId?: string | null;
  status: string;
  data: string; // "YYYY-MM-DD"
  valor?: number | string;
};

/* ---------- KPIs (porta de dashboardKPIs) ---------- */

export type DashboardKPIs = {
  totalPacientes: number;
  agendamentosHoje: number;
  receitaMes: number;
  procedimentosMes: number;
  taxaRetorno: number;
};

// Arredonda para 1 casa decimal (porta de arredonda1).
function arredonda1(x: number): number {
  return Math.round(x * 10) / 10;
}

/**
 * KPIs do topo do dashboard. `lancamentosMes`/`registrosMes` já vêm filtrados
 * no mês corrente; `eventosHoje` é a contagem de eventos com início hoje.
 */
export function dashboardKPIs(args: {
  totalPacientes: number;
  eventosHoje: number;
  lancamentosMes: LancamentoSource[];
  registrosMes: RegistroSource[];
}): DashboardKPIs {
  let receitaMes = 0;
  for (const l of args.lancamentosMes) {
    if (l.tipo === "receita" && REALIZADAS.has(l.situacao)) receitaMes += num(l.valor);
  }

  let procedimentosMes = 0;
  const porPaciente: Record<string, number> = {};
  for (const r of args.registrosMes) {
    if (r.status === "realizado") procedimentosMes++;
    const pid = r.pacienteId ?? "";
    porPaciente[pid] = (porPaciente[pid] ?? 0) + 1;
  }
  // taxa_retorno: % de pacientes com >= 2 registros no mês.
  const pacientes = Object.values(porPaciente);
  const comRetorno = pacientes.filter((c) => c >= 2).length;
  const taxaRetorno = pacientes.length === 0 ? 0 : arredonda1((comRetorno / pacientes.length) * 100);

  return {
    totalPacientes: args.totalPacientes,
    agendamentosHoje: args.eventosHoje,
    receitaMes,
    procedimentosMes,
    taxaRetorno,
  };
}

/* ---------- Balanço (porta de dashboardBalance) ---------- */

export function dashboardBalance(lancs: LancamentoSource[], inicio: Date, fim: Date): Balance {
  let entradasReal = 0, saidasRealPos = 0, entradasPrev = 0, saidasPrevPos = 0;
  for (const l of lancs) {
    const v = num(l.valor);
    const realizada = REALIZADAS.has(l.situacao);
    if (l.tipo === "receita") {
      entradasPrev += v;
      if (realizada) entradasReal += v;
    } else {
      saidasPrevPos += v;
      if (realizada) saidasRealPos += v;
    }
  }
  return {
    saldoRealizado: entradasReal - saidasRealPos,
    saldoPrevisto: entradasPrev - saidasPrevPos,
    entradasRealizadas: entradasReal,
    entradasPrevistas: entradasPrev,
    saidasRealizadas: -saidasRealPos,
    saidasPrevistas: -saidasPrevPos,
    periodo: periodoLabel(inicio, fim),
  };
}

/* ---------- Cashflow diário (porta de dashboardCashflow) ---------- */

type CashAgg = { ent: number; entP: number; saiPos: number; saiPPos: number };

/**
 * Fluxo diário com saldo encadeado, apenas dias com movimento (ordenados).
 * Saídas chegam negativas no ponto. Realizado = Recebido/Pago; previsto = tudo.
 */
export function dashboardCashflow(lancs: LancamentoSource[]): CashflowPoint[] {
  const byDay = new Map<string, CashAgg>();
  for (const l of lancs) {
    const key = l.vencimento.slice(0, 10);
    let agg = byDay.get(key);
    if (!agg) {
      agg = { ent: 0, entP: 0, saiPos: 0, saiPPos: 0 };
      byDay.set(key, agg);
    }
    const v = num(l.valor);
    const realizada = REALIZADAS.has(l.situacao);
    if (l.tipo === "receita") {
      agg.entP += v;
      if (realizada) agg.ent += v;
    } else {
      agg.saiPPos += v;
      if (realizada) agg.saiPos += v;
    }
  }

  const keys = [...byDay.keys()].sort();
  const points: CashflowPoint[] = [];
  let saldo = 0, saldoPrev = 0;
  for (const key of keys) {
    const a = byDay.get(key)!;
    saldo += a.ent - a.saiPos;
    saldoPrev += a.entP - a.saiPPos;
    points.push({
      label: labelDia(parseDateOnly(key)),
      entradas: a.ent,
      entradasPrevistas: a.entP,
      saidas: -a.saiPos,
      saidasPrevistas: -a.saiPPos,
      saldo,
      saldoPrevisto: saldoPrev,
    });
  }
  return points;
}

/* ---------- Próximas 24h (porta de dashboardNext24h) ---------- */

function hhmm(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

/** Eventos já filtrados (próximas 24h, sem cancelados, ordenados) → cartões. */
export function dashboardNext24h(eventos: EventoSource[]): Appointment[] {
  return eventos.map((e) => ({
    paciente: e.paciente ?? "",
    procedimento: e.procedimento ?? "",
    horario: `${hhmm(e.inicio)} - ${hhmm(e.fim)}`,
  }));
}

/* ---------- Relatórios (porta de dashboardReports) ---------- */

// Iniciais maiúsculas de um nome ("Lucas Bastos" -> "LB"). Porta de iniciais().
function iniciais(nome: string): string {
  const campos = nome.trim().split(/\s+/).filter(Boolean);
  if (campos.length === 0) return "?";
  let out = "";
  for (const c of campos) {
    out += c[0].toUpperCase();
    if (out.length === 2) break;
  }
  return out;
}

/**
 * Ranking nome→contagem ordenado por total desc (desempate por rótulo),
 * aplicando `transform` ao rótulo e limitando a `limit` (<=0 não limita).
 * Porta de topLabels.
 */
export function topLabels(
  counts: Record<string, number>,
  transform: ((s: string) => string) | null,
  limit: number,
): { label: string; total: number }[] {
  const out = Object.entries(counts).map(([nome, total]) => ({
    label: transform ? transform(nome) : nome,
    total,
  }));
  out.sort((a, b) => (b.total !== a.total ? b.total - a.total : a.label < b.label ? -1 : a.label > b.label ? 1 : 0));
  return limit > 0 ? out.slice(0, limit) : out;
}

/**
 * Bloco de relatórios do dashboard. `eventos` é o conjunto do período (todos os
 * status); cancelados são descartados aqui (como a query do Go).
 */
export function dashboardReports(
  eventos: EventoSource[],
  cashflow: CashflowPoint[],
  totalPacientes: number,
): Reports {
  const evs = eventos.filter((e) => e.status !== "Cancelado");

  const profCount: Record<string, number> = {};
  const buckets = new Array(7).fill(0);
  const horaCount: Record<number, number> = {};
  for (const e of evs) {
    const nome = e.profissional ?? "";
    if (nome) profCount[nome] = (profCount[nome] ?? 0) + 1;
    const d = new Date(e.inicio);
    buckets[d.getUTCDay()]++;
    const h = d.getUTCHours();
    horaCount[h] = (horaCount[h] ?? 0) + 1;
  }

  const porProfissional = topLabels(profCount, iniciais, 6);
  const diasMovimentados = buckets.map((total: number, i: number) => ({ dia: LABEL_DIA_SEMANA[i], total }));
  const { horarios, heatAtivo } = horariosMovimentados(horaCount);

  const total = evs.length;
  return {
    porProfissional,
    diasMovimentados,
    horarios,
    heatAtivo,
    statusAgendamento: {
      total,
      label: "Agendamentos",
      legenda: `${total} agendamentos no período`,
    },
    pacientesPorSexo: {
      total: totalPacientes,
      label: "Pacientes",
      legenda: `${totalPacientes} pacientes no período`,
    },
    faturamentoComparado: cashflow.map((p) => ({ label: p.label, valor: p.entradas })),
  };
}

/**
 * Rótulos "HH:00" das horas com agendamento (ordenadas) e a hora de pico.
 * Porta de horariosMovimentados. Slice nunca-nil ([] sem eventos).
 */
export function horariosMovimentados(counts: Record<number, number>): { horarios: string[]; heatAtivo: string } {
  const horas = Object.keys(counts).map(Number).sort((a, b) => a - b);
  const horarios: string[] = [];
  let heatAtivo = "";
  let melhor = -1;
  for (const h of horas) {
    const lbl = `${String(h).padStart(2, "0")}:00`;
    horarios.push(lbl);
    if (counts[h] > melhor) {
      melhor = counts[h];
      heatAtivo = lbl;
    }
  }
  return { horarios, heatAtivo };
}
