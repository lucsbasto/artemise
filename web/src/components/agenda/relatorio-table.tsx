"use client";
import * as React from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings,
  MoreVertical,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AgendaStatusBadge, statusDot } from "@/components/agenda/status-badge";
import { EventoDrawer } from "@/components/agenda/evento-drawer";
import { useListControls } from "@/lib/use-list-controls";
import type { AgendaRow, AgendaStatus } from "@/lib/mock";

const COLUNAS = [
  "Procedimentos",
  "Paciente",
  "Profissional",
  "Duração",
  "Agendado para",
  "Status",
] as const;

export function RelatorioTable({
  rows,
  periodo,
  statusTabs,
}: {
  rows: AgendaRow[];
  periodo: string;
  statusTabs: { label: AgendaStatus | "Todos"; total: number }[];
}) {
  const [tab, setTab] = React.useState<AgendaStatus | "Todos">("Todos");
  const [drawer, setDrawer] = React.useState(false);

  const filtroTab = React.useMemo(
    () => (tab === "Todos" ? [] : [(r: AgendaRow) => r.status === tab]),
    [tab]
  );

  const c = useListControls(rows, {
    searchFields: ["paciente", "profissional", "procedimento"],
    filters: filtroTab,
    perPage: 25,
  });

  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface shadow-sm">
      {/* header */}
      <div className="flex items-center gap-2 px-5 pt-5">
        <h2 className="text-base font-semibold text-foreground">Relatório de agendamentos</h2>
        <span className="text-sm text-muted-2">
          {c.total} {c.total === 1 ? "registro" : "registros"}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            disabled
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-background px-3 text-sm font-medium text-muted disabled:opacity-50"
          >
            Ações em lote <ChevronDown className="size-4" />
          </button>
          <button className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-foreground hover:bg-background">
            Exportar <ChevronDown className="size-4" />
          </button>
        </div>
      </div>

      {/* filtros */}
      <div className="flex flex-wrap items-center gap-2 px-5 py-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-sm text-foreground">
          Período: {periodo}
          <X className="size-3.5 text-muted-2" />
        </span>
        <button className="text-sm font-medium text-brand hover:underline">+ Adicionar filtro</button>
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
          <input
            value={c.query}
            onChange={(e) => c.setQuery(e.target.value)}
            placeholder="Buscar paciente, profissional, procedimento…"
            className="h-9 w-72 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none placeholder:text-muted-2 focus:border-brand"
          />
        </div>
      </div>

      {/* abas-resumo de status */}
      <div className="flex flex-wrap gap-6 border-b border-border px-5">
        {statusTabs.map((s) => {
          const ativo = tab === s.label;
          return (
            <button
              key={s.label}
              onClick={() => { setTab(s.label); c.setPage(1); }}
              className="flex flex-col items-start gap-1 pb-3 pt-1 transition-colors"
            >
              <span className="flex items-center gap-1.5 text-xs text-muted">
                {s.label !== "Todos" && (
                  <span className={cn("size-2 rounded-full", statusDot(s.label))} />
                )}
                {s.label}
              </span>
              <span
                className={cn(
                  "text-lg font-semibold",
                  ativo ? "text-brand" : "text-foreground"
                )}
              >
                {s.total}
              </span>
              <span
                className={cn(
                  "h-0.5 w-full rounded-full",
                  ativo ? "bg-brand" : "bg-transparent"
                )}
              />
            </button>
          );
        })}
      </div>

      {/* tabela */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-2">
              <th className="w-10 px-5 py-3">
                <input type="checkbox" className="size-4 rounded border-border" />
              </th>
              {COLUNAS.map((col) => (
                <th key={col} className="px-3 py-3 font-medium">
                  {col}
                </th>
              ))}
              <th className="px-3 py-3">
                <Settings className="size-4 text-muted-2" />
              </th>
              <th className="w-10 px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {c.rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-5 py-12 text-center text-sm text-muted-2">
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              c.rows.map((r, i) => (
                <tr
                  key={i}
                  onClick={() => setDrawer(true)}
                  className="cursor-pointer border-b border-border last:border-0 hover:bg-background"
                >
                  <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="size-4 rounded border-border" />
                  </td>
                  <td className="px-3 py-3 text-foreground">{r.procedimento}</td>
                  <td className="px-3 py-3">
                    <span className="flex items-center gap-2">
                      <Avatar />
                      <span className="max-w-[180px] truncate text-foreground">{r.paciente}</span>
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="flex items-center gap-2">
                      <Avatar iniciais={r.iniciais} />
                      <span className="text-foreground">{r.profissional}</span>
                    </span>
                  </td>
                  <td className="px-3 py-3 text-muted">{r.duracaoMin} min</td>
                  <td className="px-3 py-3 text-muted">{r.agendadoPara}</td>
                  <td className="px-3 py-3">
                    <AgendaStatusBadge status={r.status} />
                  </td>
                  <td className="px-3 py-3" />
                  <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <button className="grid size-7 place-items-center rounded-lg text-muted-2 hover:bg-background">
                      <MoreVertical className="size-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* rodapé paginação */}
      <div className="flex items-center justify-between px-5 py-4">
        <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted">
          25 por página <ChevronDown className="size-4" />
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-2">
            Mostrando {c.from} a {c.to} de {c.total}
          </span>
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

      <EventoDrawer open={drawer} onClose={() => setDrawer(false)} />
    </div>
  );
}

function Avatar({ iniciais }: { iniciais?: string }) {
  return (
    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-50 text-[10px] font-semibold text-brand">
      {iniciais ?? ""}
    </span>
  );
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
