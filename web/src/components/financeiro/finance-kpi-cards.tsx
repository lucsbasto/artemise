"use client";
import { Info } from "lucide-react";
import { cn, brl } from "@/lib/utils";
import type { FinanceKpi } from "@/lib/mock";

const TONE_DOT: Record<FinanceKpi["tone"], string> = {
  danger: "bg-red-500",
  warning: "bg-amber-400",
  info: "bg-blue-500",
  success: "bg-green-500",
};

function KpiDot({ tone }: { tone: FinanceKpi["tone"] }) {
  return (
    <span className={cn("inline-block size-2 shrink-0 rounded-full", TONE_DOT[tone])} />
  );
}

/** Faixa de KPI-cards clicáveis do módulo Financeiro (extrato, competência, contas a receber/pagar). */
export function FinanceKpiCards({ kpis }: { kpis: FinanceKpi[] }) {
  return (
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
  );
}
