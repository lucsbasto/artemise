"use client";
import * as React from "react";
import { ChevronDown, Search, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { usoPacoteOpcoes } from "@/lib/mock";
import { EmptyData } from "./ficha-empty";
import { Pagination } from "./pagination";

const CATEGORIAS = [
  { label: "Uso", icon: <Search className="size-4" /> },
  { label: "Validade", icon: <Calendar className="size-4" /> },
  { label: "Pacote", icon: null },
  { label: "Procedimento/Produto", icon: null },
  { label: "Data de compra", icon: <Calendar className="size-4" /> },
];

export function AbaPacotes() {
  const [open, setOpen] = React.useState(false);
  const [cat, setCat] = React.useState("Uso");

  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface shadow-sm">
      {/* header */}
      <div className="flex items-center gap-2 px-5 pt-5">
        <h2 className="text-base font-semibold text-foreground">Pacotes</h2>
        <div className="ml-auto">
          <button
            disabled
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted-2 opacity-50"
          >
            Exportar <ChevronDown className="size-4" />
          </button>
        </div>
      </div>

      {/* filtro */}
      <div className="relative px-5 py-4">
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-sm font-medium text-brand hover:underline"
        >
          + Adicionar filtro
        </button>

        {open && (
          <div className="absolute left-5 top-12 z-10 flex w-[440px] overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
            {/* coluna categorias */}
            <ul className="w-1/2 border-r border-border p-2">
              {CATEGORIAS.map((c) => (
                <li key={c.label}>
                  <button
                    onClick={() => setCat(c.label)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      cat === c.label ? "bg-brand-100/50 font-medium text-brand" : "text-foreground hover:bg-background"
                    )}
                  >
                    {c.icon ?? <span className="size-4" />}
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
            {/* coluna opções */}
            <div className="w-1/2 p-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
                  <input
                    placeholder="Digite"
                    className="h-9 w-full rounded-lg border border-border bg-surface pl-8 pr-2 text-sm outline-none focus:border-brand"
                  />
                </div>
                <button className="text-xs font-medium text-brand hover:underline">Limpar</button>
              </div>
              {cat === "Uso" && (
                <ul className="mt-2 flex flex-col gap-1">
                  {usoPacoteOpcoes.map((o) => (
                    <li key={o}>
                      <label className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground hover:bg-background">
                        <input type="checkbox" className="size-4 accent-brand" />
                        {o}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      <EmptyData />
      <Pagination perPage={10} />
    </div>
  );
}
