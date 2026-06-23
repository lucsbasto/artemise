import { Info, Search } from "lucide-react";

/** Empty state "sem dados" — ícone info + "Hmm, está vazio por aqui!" + CTA opcional. */
export function EmptyNoData({
  actionLabel,
  onAction,
}: {
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-brand-100/50 text-brand">
        <Info className="size-6" />
      </span>
      <p className="text-sm font-medium text-foreground">Hmm, está vazio por aqui!</p>
      <p className="text-sm text-muted-2">Nenhum registro encontrado.</p>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="mt-3 inline-flex h-9 items-center rounded-lg bg-brand px-4 text-sm font-medium text-white hover:bg-brand-600"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/** Empty state "sem resultados por filtro" — ícone lupa + "Oops, nada foi encontrado!". */
export function EmptyFilter() {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
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
