"use client";
import { Plus } from "lucide-react";

/** Botão "+ Adicionar novo orçamento". Estado do modal vive no container (AbaOrcamentos). */
export function OrcamentoButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3 text-sm font-medium text-white transition-colors hover:bg-brand/90"
    >
      <Plus className="size-4" /> Adicionar novo orçamento
    </button>
  );
}
