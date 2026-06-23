"use client";
import { ChevronDown } from "lucide-react";
import { brl } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { EmptyState } from "@/components/ui/empty-state";
import type { Comissao } from "@/lib/mock";

const COLS = ["Profissional", "Procedimento/Venda", "Data", "Base", "%", "Valor comissão", "Status", "Ações"];

export function ComissoesView({ comissoes, periodo }: { comissoes: Comissao[]; periodo: string }) {
  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Financeiro", "Comissões em aberto"]} />

      <div className="mt-4 rounded-[var(--radius-card)] bg-surface border border-border shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2 px-5 pt-5">
          <h2 className="text-base font-semibold text-foreground">Comissões em aberto</h2>
          <span className="text-sm text-muted-2">{comissoes.length} registros</span>
          <button className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-foreground hover:bg-background">
            Exportar <ChevronDown className="size-4" />
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2 px-5 py-4">
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-sm text-foreground">
            <span className="text-muted">Período:</span>&nbsp;{periodo}
          </span>
          <button className="text-sm font-medium text-brand hover:underline">+ Adicionar filtro</button>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-2">
                {COLS.map((c) => (
                  <th key={c} className="py-3 pr-4 font-medium first:pl-5 last:text-right">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comissoes.length === 0 ? (
                <tr>
                  <td colSpan={COLS.length} className="px-5">
                    <EmptyState title="Hmm, está vazio por aqui!" subtitle="Nenhum registro encontrado." />
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-4 text-sm">
          <span className="text-muted">Total do período ({periodo})</span>
          <span className="font-semibold text-foreground">{brl(0)}</span>
        </div>
      </div>
    </div>
  );
}
