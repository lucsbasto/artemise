"use client";
import * as React from "react";
import { HelpCircle } from "lucide-react";
import { ListShell } from "@/components/ui/list-shell";
import { EmptyFilter } from "@/components/estoque/estoque-empty";
import { cn } from "@/lib/utils";

type TipoKey = "entradas" | "saidas" | "todos";

const CARDS: { key: TipoKey; label: string; dot: string; qtd: number; valor: string }[] = [
  { key: "entradas", label: "Entradas", dot: "bg-success", qtd: 0, valor: "R$ 0,00" },
  { key: "saidas", label: "Saídas", dot: "bg-danger", qtd: 0, valor: "R$ 0,00" },
  { key: "todos", label: "Todos", dot: "bg-blue-500", qtd: 0, valor: "R$ 0,00" },
];

/** Tela 25 — Giro de estoque. Cards-resumo funcionam como abas (Entradas/Saídas/Todos). */
export function GiroView() {
  const [tipo, setTipo] = React.useState<TipoKey>("todos");

  return (
    <ListShell
      title="Giro de estoque"
      count={0}
      showCount={false}
      batchActions={false}
      filtersExtra={
        <span className="inline-flex h-7 items-center rounded-full bg-brand-100/40 px-3 text-xs font-medium text-brand">
          Período: 23/05/2026 - 22/06/2026
        </span>
      }
    >
      {/* cards-resumo / abas */}
      <div className="grid grid-cols-1 gap-3 px-5 pb-2 sm:grid-cols-3">
        {CARDS.map((c) => {
          const active = tipo === c.key;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setTipo(c.key)}
              className={cn(
                "flex flex-col gap-1 rounded-xl border bg-surface px-4 py-3 text-left transition-colors",
                active ? "border-brand bg-brand-50/40" : "border-border hover:bg-background"
              )}
            >
              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <span className={cn("size-2 rounded-full", c.dot)} />
                {c.label}
                <HelpCircle className="size-3.5 text-muted-2" />
              </span>
              <span className="text-sm text-muted">
                {c.qtd} <span className="text-muted-2">·</span> {c.valor}
              </span>
            </button>
          );
        })}
      </div>

      <EmptyFilter />
    </ListShell>
  );
}
