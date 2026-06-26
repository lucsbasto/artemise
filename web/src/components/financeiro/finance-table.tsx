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
import { FinanceKpiCards } from "@/components/financeiro/finance-kpi-cards";
import { useListControls } from "@/lib/use-list-controls";
import type { FinanceKpi, FinanceRow } from "@/lib/mock";
import { ResponsiveTable } from "@/components/ui/responsive-table";

interface FinanceTableProps {
  titulo: string;
  breadcrumb: string[];
  periodo: string;
  kpis: FinanceKpi[];
  rows: FinanceRow[];
  liquidacaoLabel: "Recebimento" | "Pagamento";
}

function PagBtn({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
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
  kpis,
  rows,
  liquidacaoLabel,
}: FinanceTableProps) {
  const c = useListControls(rows, {
    searchFields: ["descricao", "categoria", "situacao"],
    perPage: 25,
  });

  // Seleção por referência de objeto para sobreviver à paginação
  const [selected, setSelected] = React.useState<Set<FinanceRow>>(new Set());

  const pageRows = c.rows;
  const allPageSelected =
    pageRows.length > 0 && pageRows.every((row) => selected.has(row));

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        pageRows.forEach((row) => next.delete(row));
      } else {
        pageRows.forEach((row) => next.add(row));
      }
      return next;
    });
  };

  const toggleOne = (row: FinanceRow) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(row)) next.delete(row);
      else next.add(row);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={breadcrumb} />

      <div className="mt-4 rounded-[var(--radius-card)] bg-surface border border-border shadow-sm">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 px-5 pt-5">
          <h2 className="text-base font-semibold text-foreground">{titulo}</h2>
          <span className="text-sm text-muted-2">
            {c.total} {c.total === 1 ? "registro" : "registros"}
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
              value={c.query}
              onChange={(e) => c.setQuery(e.target.value)}
              className="h-9 w-64 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none placeholder:text-muted-2 focus:border-brand"
            />
          </div>
        </div>

        {/* ── KPIs ─────────────────────────────────────────────────────── */}
        <FinanceKpiCards kpis={kpis} />

        {/* ── Tabela ──────────────────────────────────────────────────── */}
        <ResponsiveTable>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-2">
                <th className="w-10 px-5 py-3">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
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
              {pageRows.map((row, i) => (
                <tr
                  key={i}
                  className={cn(
                    "border-b border-border last:border-b-0",
                    row.atrasado && "bg-red-50/30"
                  )}
                >
                  {/* Barra vermelha: left-border on first cell */}
                  <td
                    data-label=""
                    className={cn(
                      "px-5 py-3",
                      row.atrasado
                        ? "border-l-2 border-l-red-500"
                        : "border-l-2 border-l-transparent"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(row)}
                      onChange={() => toggleOne(row)}
                      className="size-4 accent-brand"
                    />
                  </td>
                  <td data-label="Vencimento" className="py-3 pr-4 text-foreground whitespace-nowrap">
                    {row.vencimento}
                  </td>
                  <td data-label={liquidacaoLabel} className="py-3 pr-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-foreground">
                      {row.liquidacao}
                      {row.atrasado && (
                        <Clock className="size-3.5 text-amber-500 shrink-0" />
                      )}
                    </span>
                  </td>
                  <td data-label="Descrição" className="py-3 pr-4 text-foreground max-w-[200px] truncate">
                    {row.descricao}
                  </td>
                  <td data-label="Categoria" className="py-3 pr-4 text-muted max-w-[100px] truncate" title={row.categoria}>
                    {row.categoria}
                  </td>
                  <td data-label="" className="py-3 pr-4">
                    <CreditCard className="size-4 text-muted-2" />
                  </td>
                  <td data-label="Situação" className="py-3 pr-4">
                    <StatusBadge status={row.situacao} />
                  </td>
                  <td data-label="Valor líquido (R$)" className="py-3 pr-4 text-right font-medium text-foreground tabular-nums whitespace-nowrap">
                    {/* Strip currency prefix */}
                    {brl(row.valor).replace(/R\$ ?/, "")}
                  </td>
                  <td data-label="" className="px-2 py-3" />
                  <td data-label="" className="px-2 py-3">
                    <button className="text-muted-2 hover:text-foreground">
                      <MoreVertical className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-5 py-10 text-center text-sm text-muted-2">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </ResponsiveTable>

        {/* ── Rodapé paginação ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <select
              value={c.perPage}
              onChange={(e) => c.setPerPage(Number(e.target.value))}
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-muted"
            >
              <option value={10}>10 por página</option>
              <option value={25}>25 por página</option>
              <option value={50}>50 por página</option>
              <option value={100}>100 por página</option>
            </select>
            <span className="text-sm text-muted-2">
              Mostrando {c.from} a {c.to} de {c.total}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <PagBtn disabled={!c.canPrev} onClick={() => c.setPage(1)}>
              <ChevronsLeft className="size-4" />
            </PagBtn>
            <PagBtn disabled={!c.canPrev} onClick={() => c.setPage(c.page - 1)}>
              <ChevronLeft className="size-4" />
            </PagBtn>
            <button className="grid size-9 place-items-center rounded-lg bg-brand text-sm font-medium text-white">
              {c.page}
            </button>
            <PagBtn disabled={!c.canNext} onClick={() => c.setPage(c.page + 1)}>
              <ChevronRight className="size-4" />
            </PagBtn>
            <PagBtn disabled={!c.canNext} onClick={() => c.setPage(c.pageCount)}>
              <ChevronsRight className="size-4" />
            </PagBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
