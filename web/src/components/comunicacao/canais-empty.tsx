import { Search } from "lucide-react";

/** Estado vazio por filtro — lupa + "Oops, nada foi encontrado!" + Limpar filtros. */
export function EmptyFilter() {
  return (
    <div className="flex flex-col items-center gap-2 border-t border-border py-16 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-brand-100/50 text-brand">
        <Search className="size-6" />
      </span>
      <p className="text-sm font-medium text-foreground">Oops, nada foi encontrado!</p>
      <p className="text-sm text-muted-2">
        Os filtros selecionados não correspondem a nenhum registro.
      </p>
      <button className="mt-3 inline-flex h-9 items-center rounded-lg border border-brand px-4 text-sm font-medium text-brand hover:bg-brand-100/30">
        Limpar filtros
      </button>
    </div>
  );
}
