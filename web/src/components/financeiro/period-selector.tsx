"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Seletor de período em pílula: ‹ rótulo › (visual; navegação inerte nesta fase). */
export function PeriodSelector({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-1 py-0.5 text-sm text-foreground">
      <button className="grid size-7 place-items-center rounded-full text-muted-2 hover:text-foreground" aria-label="Anterior">
        <ChevronLeft className="size-4" />
      </button>
      <span className="px-1 font-medium">{label}</span>
      <button className="grid size-7 place-items-center rounded-full text-muted-2 hover:text-foreground" aria-label="Próximo">
        <ChevronRight className="size-4" />
      </button>
    </span>
  );
}
