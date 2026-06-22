"use client";
import * as React from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings,
  MoreVertical,
  Clock,
  Info,
  CreditCard,
} from "lucide-react";
import { cn, brl } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import type { FinanceKpi, FinanceRow } from "@/lib/mock";

const TONE_DOT: Record<FinanceKpi["tone"], string> = {
  danger: "bg-red-500",
  warning: "bg-amber-400",
  info: "bg-blue-500",
  success: "bg-green-500",
};

function KpiDot({ tone }: { tone: FinanceKpi["tone"] }) {
  return (
    <span
      className={cn("inline-block size-2 shrink-0 rounded-full", TONE_DOT[tone])}
    />
  );
}

interface FinanceTableProps {
  titulo: string;
  breadcrumb: string[];
  periodo: string;
  total: number;
  kpis: FinanceKpi[];
  rows: FinanceRow[];
  liquidacaoLabel: "Recebimento" | "Pagamento";
}

function PagBtn({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      className="grid size-9 place-items-center rounded-lg bg-background text-muted-2 disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function FinanceTable({
  titulo,
  breadcrumb,
  periodo,
  total,
  kpis,
  rows,
  liquidacaoLabel,
}: FinanceTableProps) {
  const [selected, setSelected] = React.useState<Set<number>>(new Set());
  const allSelected = rows.length > 0 && selected.size === rows.length;

  const toggleAll = () =>
    setSelected(
      allSelected ? new Set() : new Set(rows.map((_, i) => i))
    );
  const toggleOne = (i: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={breadcrumb} />

      <div className="mt-4 rounded-[var(--radius-card)] bg-surface border border-border shadow-sm">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 px-5 pt-5">
          <h2 className="text-base font-semibold text-foreground">{titulo}</h2>
          <span className="text-sm text-muted-2">
            {total} {total === 1 ? "registro" : "registros"}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              disabled={selected.size === 0}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-background px-3 text-sm font-medium text-muted disabled:opacity-50"
            >
              Ações em lote <ChevronDown className="size-4" />
            </button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-foreground hover:bg-background">
              Exportar <ChevronDown className="size-4" />
            </button>
          </div>
        </div>

        {/* ── Filtros ─────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 px-5 py-4">
          {/* Chip período */}
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-sm text-foreground">
            <span className="text-muted">Período de liquidação:</span>
            &nbsp;{periodo}
          </span>
          <button className="text-sm font-medium text-brand hover:underline">
            + Adicionar filtro
          </button>
          {/* Busca */}
          <div className="relative ml-auto">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
            <input
              placeholder="Buscar"
              className="h-9 w-64 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none placeholder:text-muted-2 focus:border-brand"
            />
          </div>
        </div>

        {/* ── KPIs ─────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-start gap-0 border-y border-border divide-x divide-border">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className={cn(
                "flex min-w-[120px] flex-1 flex-col gap-1 px-5 py-3 cursor-pointer",
                kpi.ativo && "border-b-2 border-b-brand"
              )}
            >
              <div className="flex items-center gap-1.5">
                <KpiDot tone={kpi.tone} />
                <span className="text-xs text-muted">{kpi.label}</span>
                <Info className="size-3 text-muted-2 shrink-0" />
              </div>
              <span
                className={cn(
                  "text-base font-semibold",
                  kpi.ativo ? "text-brand" : "text-foreground"
                )}
              >
                {brl(kpi.valor)}
              </span>
            </div>
          ))}
        </div>

        {/* ── Tabela ──────────────────────────────────────────────────── */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-2">
                <th className="w-10 px-5 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="size-4 accent-brand"
                  />
                </th>
                <th className="py-3 pr-4 font-medium whitespace-nowrap">
                  Vencimento ◆
                </th>
                <th className="py-3 pr-4 font-medium whitespace-nowrap">
                  {liquidacaoLabel} ◆
                </th>
                <th className="py-3 pr-4 font-medium">Descrição ◆</th>
                <th className="py-3 pr-4 font-medium">Categoria ◆</th>
                <th className="py-3 pr-4 font-medium">Método ◆</th>
                <th className="py-3 pr-4 font-medium">Situação</th>
                <th className="py-3 pr-4 font-medium text-right whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    Valor líquido (R$)
                    <Info className="size-3 text-muted-2" />
                  </span>
                </th>
                <th className="w-10 px-2 py-3 text-right">
                  <Settings className="ml-auto size-4" />
                </th>
                <th className="w-10 px-2 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className={cn(
                    "border-b border-border last:border-b-0",
                    row.atrasado && "bg-red-50/30"
                  )}
                >
                  {/* Barra vermelha: left-border on first cell */}
                  <td
                    className={cn(
                      "px-5 py-3",
                      row.atrasado
                        ? "border-l-2 border-l-red-500"
                        : "border-l-2 border-l-transparent"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(i)}
                      onChange={() => toggleOne(i)}
                      className="size-4 accent-brand"
                    />
                  </td>
                  <td className="py-3 pr-4 text-foreground whitespace-nowrap">
                    {row.vencimento}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-foreground">
                      {row.liquidacao}
                      {row.atrasado && (
                        <Clock className="size-3.5 text-amber-500 shrink-0" />
                      )}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-foreground max-w-[200px] truncate">
                    {row.descricao}
                  </td>
                  <td className="py-3 pr-4 text-muted max-w-[100px] truncate" title={row.categoria}>
                    {row.categoria}
                  </td>
                  <td className="py-3 pr-4">
                    <CreditCard className="size-4 text-muted-2" />
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={row.situacao} />
                  </td>
                  <td className="py-3 pr-4 text-right font-medium text-foreground tabular-nums whitespace-nowrap">
                    {/* Strip currency prefix */}
                    {brl(row.valor).replace(/R\$ ?/, "")}
                  </td>
                  <td className="px-2 py-3" />
                  <td className="px-2 py-3">
                    <button className="text-muted-2 hover:text-foreground">
                      <MoreVertical className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Rodapé paginação ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4">
          <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted">
            25 por página <ChevronDown className="size-4" />
          </button>
          <div className="flex items-center gap-1">
            <PagBtn disabled>
              <ChevronsLeft className="size-4" />
            </PagBtn>
            <PagBtn disabled>
              <ChevronLeft className="size-4" />
            </PagBtn>
            <button className="grid size-9 place-items-center rounded-lg bg-brand text-sm font-medium text-white">
              1
            </button>
            <PagBtn disabled>
              <ChevronRight className="size-4" />
            </PagBtn>
            <PagBtn disabled>
              <ChevronsRight className="size-4" />
            </PagBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
