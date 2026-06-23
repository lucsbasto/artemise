import { ChevronDown, Search } from "lucide-react";
import { EmptyFiltered } from "./ficha-empty";
import { Pagination } from "./pagination";

export function AbaOrcamentos() {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface shadow-sm">
      {/* header */}
      <div className="flex items-center gap-2 px-5 pt-5">
        <h2 className="text-base font-semibold text-foreground">Orçamentos</h2>
        <div className="ml-auto">
          <button
            disabled
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted-2 opacity-50"
          >
            Exportar <ChevronDown className="size-4" />
          </button>
        </div>
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

      <EmptyFiltered />
      <Pagination perPage={25} />
    </div>
  );
}
