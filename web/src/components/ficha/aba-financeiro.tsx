import { Search, Info, Settings, MoreVertical } from "lucide-react";
import { brl, cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  fichaFinanceiroKpis,
  fichaFinanceiroRows,
  fichaFinanceiroTotal,
  type FichaFinKpi,
} from "@/lib/mock";
import { Pagination } from "./pagination";

const TONE_DOT: Record<FichaFinKpi["tone"], string> = {
  danger: "bg-red-500",
  warning: "bg-amber-400",
  info: "bg-blue-500",
  success: "bg-green-500",
};

function valorClass(v: number) {
  return v < 0 ? "text-danger" : "text-success";
}

export function AbaFinanceiro() {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface shadow-sm">
      {/* header */}
      <div className="flex items-center gap-2 px-5 pt-5">
        <h2 className="text-base font-semibold text-foreground">Financeiro</h2>
        <span className="text-sm text-muted-2">{fichaFinanceiroTotal} registros</span>
      </div>

      {/* ações */}
      <div className="flex flex-wrap items-center gap-2 px-5 py-4">
        <button className="text-sm font-medium text-brand hover:underline">+ Adicionar filtro</button>
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
          <input
            placeholder="Buscar"
            className="h-9 w-64 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none placeholder:text-muted-2 focus:border-brand"
          />
        </div>
      </div>

      {/* KPIs */}
      <div className="flex flex-wrap items-start divide-x divide-border border-y border-border">
        {fichaFinanceiroKpis.map((kpi) => (
          <div
            key={kpi.label}
            className={cn(
              "flex min-w-[120px] flex-1 cursor-pointer flex-col gap-1 px-5 py-3",
              kpi.ativo && "border-b-2 border-b-brand"
            )}
          >
            <div className="flex items-center gap-1.5">
              <span className={cn("inline-block size-2 shrink-0 rounded-full", TONE_DOT[kpi.tone])} />
              <span className="text-xs text-muted">{kpi.label}</span>
              <Info className="size-3 shrink-0 text-muted-2" />
            </div>
            <span className={cn("text-base font-semibold", kpi.ativo ? "text-brand" : "text-foreground")}>
              {brl(kpi.valor)}
            </span>
          </div>
        ))}
      </div>

      {/* tabela */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-2">
              <th className="px-5 py-3 font-medium whitespace-nowrap">Vencimento ◆</th>
              <th className="py-3 pr-4 font-medium whitespace-nowrap">Execução ◆</th>
              <th className="py-3 pr-4 font-medium">Descrição ◆</th>
              <th className="py-3 pr-4 font-medium">Situação</th>
              <th className="py-3 pr-4 text-right font-medium whitespace-nowrap">
                <span className="inline-flex items-center gap-1">
                  Valor líq. (R$) <Info className="size-3 text-muted-2" />
                </span>
              </th>
              <th className="w-10 px-2 py-3 text-right">
                <Settings className="ml-auto size-4" />
              </th>
              <th className="w-10 px-2 py-3" />
            </tr>
          </thead>
          <tbody>
            {fichaFinanceiroRows.map((row, i) => (
              <tr
                key={i}
                className={cn(
                  "border-b border-border last:border-b-0",
                  row.situacao === "Em atraso" && "bg-red-50/30"
                )}
              >
                <td
                  className={cn(
                    "px-5 py-3 text-foreground whitespace-nowrap",
                    row.situacao === "Em atraso" ? "border-l-2 border-l-red-500" : "border-l-2 border-l-transparent"
                  )}
                >
                  {row.vencimento}
                </td>
                <td className="py-3 pr-4 text-foreground whitespace-nowrap">{row.execucao ?? "—"}</td>
                <td className="max-w-[220px] truncate py-3 pr-4 text-foreground">{row.descricao}</td>
                <td className="py-3 pr-4"><StatusBadge status={row.situacao} /></td>
                <td className={cn("py-3 pr-4 text-right font-medium tabular-nums whitespace-nowrap", valorClass(row.valor))}>
                  {brl(row.valor).replace(/R\$ ?/, "")}
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

      <Pagination perPage={10} />
    </div>
  );
}
