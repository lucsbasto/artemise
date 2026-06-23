import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

function Btn({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid size-9 place-items-center rounded-lg bg-background text-muted-2 opacity-40">
      {children}
    </span>
  );
}

/** Rodapé de paginação estático (todos os controles inertes no mock). */
export function Pagination({ perPage = 10 }: { perPage?: number }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted">
        {perPage} por página <ChevronDown className="size-4" />
      </button>
      <div className="flex items-center gap-1">
        <Btn><ChevronsLeft className="size-4" /></Btn>
        <Btn><ChevronLeft className="size-4" /></Btn>
        <Btn><ChevronRight className="size-4" /></Btn>
        <Btn><ChevronsRight className="size-4" /></Btn>
      </div>
    </div>
  );
}
