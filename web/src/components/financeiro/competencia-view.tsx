"use client";
import { Search, ChevronDown, Settings, MoreVertical } from "lucide-react";
import { cn, brl } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { FinanceKpiCards } from "@/components/financeiro/finance-kpi-cards";
import { PeriodSelector } from "@/components/financeiro/period-selector";
import type { CompetenciaData } from "@/lib/mock";

function valorCell(v: number, tipo: "receita" | "despesa" | "saldo") {
  const cls =
    tipo === "receita" ? "text-success" : tipo === "despesa" ? "text-danger" : "text-foreground";
  return <span className={cn("font-medium tabular-nums", cls)}>{brl(v).replace(/R\$ ?/, "")}</span>;
}

export function CompetenciaView({ data }: { data: CompetenciaData }) {
  const totalBruto = data.rows.reduce((a, r) => a + r.bruto, 0);
  const totalLiquido = data.rows.reduce((a, r) => a + r.liquido, 0);

  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Financeiro", "Relatório de competência"]} />

      <div className="mt-4 rounded-[var(--radius-card)] bg-surface border border-border shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2 px-5 pt-5">
          <h2 className="text-base font-semibold text-foreground">Relatório de competência</h2>
          <span className="text-sm text-muted-2">{data.total} registros</span>
          <button className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-foreground hover:bg-background">
            Exportar <ChevronDown className="size-4" />
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2 px-5 py-4">
          <PeriodSelector label={data.mes} />
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
        <FinanceKpiCards kpis={data.kpis} />

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-2">
                <th className="py-3 pl-5 pr-4 font-medium whitespace-nowrap">Competência ◆</th>
                <th className="py-3 pr-4 font-medium">Descrição ◆</th>
                <th className="py-3 pr-4 font-medium">Contato ◆</th>
                <th className="py-3 pr-4 font-medium text-right whitespace-nowrap">Valor bruto (R$) ◆</th>
                <th className="py-3 pr-4 font-medium text-right whitespace-nowrap">Valor líquido (R$) ◆</th>
                <th className="w-10 px-2 py-3 text-right">
                  <Settings className="ml-auto size-4" />
                </th>
                <th className="w-10 px-2 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, i) => (
                <tr
                  key={i}
                  className={cn(
                    "border-b border-border last:border-b-0",
                    row.tipo === "despesa" && "bg-red-50/20"
                  )}
                >
                  <td
                    className={cn(
                      "py-3 pl-5 pr-4 text-foreground whitespace-nowrap",
                      row.tipo === "despesa" ? "border-l-2 border-l-red-500" : "border-l-2 border-l-transparent"
                    )}
                  >
                    {row.competencia}
                  </td>
                  <td className="py-3 pr-4 text-foreground max-w-[260px] truncate">{row.descricao}</td>
                  <td className="py-3 pr-4 text-muted max-w-[200px] truncate" title={row.contato}>
                    {row.contato}
                  </td>
                  <td className="py-3 pr-4 text-right tabular-nums text-foreground">
                    {brl(row.bruto).replace(/R\$ ?/, "")}
                  </td>
                  <td className="py-3 pr-4 text-right">{valorCell(row.liquido, row.tipo)}</td>
                  <td className="px-2 py-3" />
                  <td className="px-2 py-3">
                    <button className="text-muted-2 hover:text-foreground">
                      <MoreVertical className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-border font-semibold text-foreground">
                <td className="py-3 pl-5 pr-4" colSpan={3}>Total</td>
                <td className="py-3 pr-4 text-right tabular-nums">{brl(totalBruto).replace(/R\$ ?/, "")}</td>
                <td className="py-3 pr-4 text-right tabular-nums">{brl(totalLiquido).replace(/R\$ ?/, "")}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
