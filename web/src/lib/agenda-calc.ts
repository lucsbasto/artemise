// Agregação da agenda — porta de backend/internal/store/agenda.go
// (AgendaVisaoGeral + AgendaRelatorio). Funções puras sobre `eventos_agenda`.
import type { AgendaKpi, AgendaStatus, AgendaRow, RankItem } from "@/lib/mock";
import { periodoLabel } from "@/lib/financeiro-calc";
import { topLabels, type EventoSource } from "@/lib/dashboard-calc";

export type { EventoSource };

const STATUS_ORDEM: AgendaStatus[] = [
  "Agendado", "Confirmado", "Não compareceu", "Concluído", "Cancelado",
];

function pct(parte: number, total: number): number {
  return total === 0 ? 0 : Math.round((parte / total) * 100);
}

/* ---------- Visão geral (porta de AgendaVisaoGeral) ---------- */

// Shape esperado pela página /agenda/visao-geral (tipo local da página).
export type AgendaVisaoGeralData = {
  periodo: string;
  kpis: AgendaKpi[];
  porPeriodo: { label: string; valor: number }[];
  media: number;
  porStatus: { status: AgendaStatus; total: number; pct: number }[];
  pacientesFreq: RankItem[];
  procedimentosFreq: RankItem[];
  ociosidadeSala: RankItem[];
  ociosidadeProf: RankItem[];
  diasMovimentados: { label: string; valor: number }[];
  horarios: string[];
  horarioAtivo: string;
};

const LABEL_DIA_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"] as const;

function ranking(counts: Record<string, number>, total: number, limit: number): RankItem[] {
  return topLabels(counts, null, limit).map((r) => ({
    nome: r.label,
    total: r.total,
    pct: pct(r.total, total),
  }));
}

export function agendaVisaoGeral(eventos: EventoSource[], inicio: Date, fim: Date): AgendaVisaoGeralData {
  const statusCount: Record<string, number> = {};
  const profCount: Record<string, number> = {};
  const procCount: Record<string, number> = {};
  const pacCount: Record<string, number> = {};
  const horas = new Array(24).fill(0);
  const dias = new Array(7).fill(0);
  const porDia: Record<string, number> = {};

  for (const e of eventos) {
    statusCount[e.status] = (statusCount[e.status] ?? 0) + 1;
    if (e.profissional) profCount[e.profissional] = (profCount[e.profissional] ?? 0) + 1;
    if (e.procedimento) procCount[e.procedimento] = (procCount[e.procedimento] ?? 0) + 1;
    if (e.paciente) pacCount[e.paciente] = (pacCount[e.paciente] ?? 0) + 1;
    const d = new Date(e.inicio);
    horas[d.getUTCHours()]++;
    dias[d.getUTCDay()]++;
    const key = `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    porDia[key] = (porDia[key] ?? 0) + 1;
  }

  const total = eventos.length;

  const porStatus = STATUS_ORDEM.map((status) => ({
    status,
    total: statusCount[status] ?? 0,
    pct: pct(statusCount[status] ?? 0, total),
  }));

  // Heatmap de horários: rótulos das horas com evento + hora de pico.
  const horarios: string[] = [];
  let horarioAtivo = "";
  let melhor = -1;
  for (let h = 0; h < 24; h++) {
    if (horas[h] === 0) continue;
    const lbl = `${String(h).padStart(2, "0")}:00`;
    horarios.push(lbl);
    if (horas[h] > melhor) {
      melhor = horas[h];
      horarioAtivo = lbl;
    }
  }

  const diasMovimentados = dias.map((valor: number, i: number) => ({ label: LABEL_DIA_SEMANA[i], valor }));

  // Série por período (dias com evento, em ordem cronológica de chave DD/MM).
  const porPeriodo = Object.entries(porDia)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([label, valor]) => ({ label, valor }));
  const media = porPeriodo.length === 0 ? 0 : Math.round(total / porPeriodo.length);

  const kpis: AgendaKpi[] = [
    { label: "Total de agendamentos", valor: String(total) },
    { label: "Confirmados", valor: String(statusCount["Confirmado"] ?? 0) },
    { label: "Concluídos", valor: String(statusCount["Concluído"] ?? 0) },
  ];

  return {
    periodo: periodoLabel(inicio, fim),
    kpis,
    porPeriodo,
    media,
    porStatus,
    pacientesFreq: ranking(pacCount, total, 10),
    procedimentosFreq: ranking(procCount, total, 10),
    // Sem fonte de dados (não há conceito de sala/ociosidade no schema atual).
    ociosidadeSala: [],
    ociosidadeProf: [],
    diasMovimentados,
    horarios,
    horarioAtivo,
  };
}

/* ---------- Relatório paginado (porta de AgendaRelatorio) ---------- */

export type AgendaRelatorioData = {
  rows: AgendaRow[];
  periodo: string;
  statusTabs: { label: AgendaStatus | "Todos"; total: number }[];
};

function iniciais(nome: string): string {
  const campos = nome.trim().split(/\s+/).filter(Boolean);
  if (campos.length === 0) return "";
  let out = "";
  for (const c of campos) {
    out += c[0].toUpperCase();
    if (out.length === 2) break;
  }
  return out;
}

function dataHoraBR(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mi = String(d.getUTCMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${d.getUTCFullYear()} ${hh}:${mi}`;
}

function duracaoMin(e: EventoSource): number {
  if (!e.fim) return 0;
  const ms = new Date(e.fim).getTime() - new Date(e.inicio).getTime();
  return ms > 0 ? Math.round(ms / 60000) : 0;
}

/**
 * Eventos → linhas do relatório (paginação/filtro são client-side na tabela).
 * `statusTabs` traz "Todos" + os 5 status com suas contagens.
 */
export function agendaRelatorio(eventos: EventoSource[], inicio: Date, fim: Date): AgendaRelatorioData {
  const rows: AgendaRow[] = eventos.map((e) => ({
    procedimento: e.procedimento ?? "",
    paciente: e.paciente ?? "",
    profissional: e.profissional ?? "",
    iniciais: iniciais(e.profissional ?? ""),
    duracaoMin: duracaoMin(e),
    agendadoPara: dataHoraBR(e.inicio),
    status: e.status as AgendaStatus,
  }));

  const statusCount: Record<string, number> = {};
  for (const e of eventos) statusCount[e.status] = (statusCount[e.status] ?? 0) + 1;

  const statusTabs: { label: AgendaStatus | "Todos"; total: number }[] = [
    { label: "Todos", total: eventos.length },
    ...STATUS_ORDEM.map((s) => ({ label: s, total: statusCount[s] ?? 0 })),
  ];

  return { rows, periodo: periodoLabel(inicio, fim), statusTabs };
}
