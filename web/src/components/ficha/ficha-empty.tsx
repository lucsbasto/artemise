import { Info, Search } from "lucide-react";

/** Empty state "sem dados" — Carteira/Pacotes. */
export function EmptyData() {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-brand-100/50 text-brand">
        <Info className="size-6" />
      </span>
      <p className="text-sm font-medium text-foreground">Hmm, está vazio por aqui!</p>
      <p className="text-sm text-muted-2">Nenhum registro encontrado.</p>
    </div>
  );
}

/** Empty state "sem resultados por filtro". CTA opcional via `action`. */
export function EmptyFiltered({
  action,
  onClearFilters,
}: {
  action?: { label: string; onClick: () => void };
  onClearFilters?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-brand-100/50 text-brand">
        <Search className="size-6" />
      </span>
      <p className="text-sm font-medium text-foreground">Oops, nada foi encontrado!</p>
      <p className="text-sm text-muted-2">
        Os filtros selecionados não correspondem a nenhum registro.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={onClearFilters}
          className="inline-flex h-9 items-center rounded-lg border border-brand px-4 text-sm font-medium text-brand hover:bg-brand-100/30"
        >
          Limpar filtros
        </button>
        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex h-9 items-center rounded-lg bg-brand px-4 text-sm font-medium text-white hover:bg-brand/90"
          >
            + {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
