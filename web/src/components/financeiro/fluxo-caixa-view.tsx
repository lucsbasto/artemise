"use client";
import { ChevronDown, X } from "lucide-react";
import { brl, cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CashflowChart } from "@/components/charts/cashflow-chart";
import { PeriodSelector } from "@/components/financeiro/period-selector";
import { fluxoRows } from "@/lib/financeiro-calc";
import { fluxoFiltrosGerais, type CashflowPoint } from "@/lib/mock";

const LEGEND = [
  { label: "Entradas", color: "#22c55e" },
  { label: "Saídas", color: "#ef4444" },
  { label: "Saldo", color: "#3b82f6", line: true },
];

function num(v: number) {
  return brl(v).replace(/R\$ ?/, "");
}

export function FluxoCaixaView({
  granularidade,
  titulo,
  periodoLabel,
  points,
}: {
  granularidade: "dia" | "mes";
  titulo: string;
  periodoLabel: string;
  points: CashflowPoint[];
}) {
  const rows = fluxoRows(points, 0);
  const colLabel = granularidade === "dia" ? "Dia" : "Mês";

  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Financeiro", titulo]} />

      <div className="mt-4 rounded-[var(--radius-card)] bg-surface border border-border shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2 px-5 pt-5">
          <h2 className="text-base font-semibold text-foreground">{titulo}</h2>
          <button className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-foreground hover:bg-background">
            Exportar <ChevronDown className="size-4" />
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2 px-5 py-4">
          <PeriodSelector label={periodoLabel} />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-sm text-foreground">
            <span className="text-muted">Filtros gerais:</span>
            {fluxoFiltrosGerais}
            <button className="text-muted-2 hover:text-foreground" aria-label="Limpar filtros">
              <X className="size-3.5" />
            </button>
          </span>
          <button className="text-sm font-medium text-brand hover:underline">+ Adicionar filtro</button>
        </div>

        {/* Gráfico */}
        <div className="px-5 pb-2">
          <div className="mb-2 flex items-center justify-end gap-4 text-xs text-muted">
            {LEGEND.map((s) => (
              <span key={s.label} className="flex items-center gap-1.5">
                {s.line ? (
                  <span className="inline-block h-0.5 w-4 rounded-full" style={{ background: s.color }} />
                ) : (
                  <span className="inline-block size-2.5 rounded-sm" style={{ background: s.color }} />
                )}
                {s.label}
              </span>
            ))}
          </div>
          <CashflowChart data={points} height={260} />
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto border-t border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-2">
                <th className="py-3 pl-5 pr-4 text-left font-medium">{colLabel}</th>
                <th className="py-3 pr-4 text-right font-medium whitespace-nowrap">Saldo inicial (R$)</th>
                <th className="py-3 pr-4 text-right font-medium whitespace-nowrap">Entrada (R$)</th>
                <th className="py-3 pr-4 text-right font-medium whitespace-nowrap">Saída (R$)</th>
                <th className="py-3 pr-4 text-right font-medium whitespace-nowrap">Lucro/Prejuizo (R$)</th>
                <th className="py-3 pr-5 text-right font-medium whitespace-nowrap">Saldo final (R$)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-border last:border-b-0">
                  <td className="py-2.5 pl-5 pr-4 text-foreground">{granularidade === "dia" ? i + 1 : r.label.replace(" 2026", "")}</td>
                  <td className="py-2.5 pr-4 text-right tabular-nums text-foreground">{num(r.saldoInicial)}</td>
                  <td className="py-2.5 pr-4 text-right tabular-nums text-success">{num(r.entrada)}</td>
                  <td className="py-2.5 pr-4 text-right tabular-nums text-danger">{num(r.saida)}</td>
                  <td className={cn("py-2.5 pr-4 text-right tabular-nums", r.lucro < 0 ? "text-danger" : r.lucro > 0 ? "text-success" : "text-foreground")}>
                    {num(r.lucro)}
                  </td>
                  <td className={cn("py-2.5 pr-5 text-right tabular-nums font-medium", r.saldoFinal < 0 ? "text-danger" : "text-foreground")}>
                    {num(r.saldoFinal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
