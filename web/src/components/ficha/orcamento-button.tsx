"use client";
import * as React from "react";
import { Plus } from "lucide-react";
import { OrcamentoModal } from "./orcamento-modal";
import { orcamentosStore, type Orcamento } from "@/lib/data/stores";
import { nextId } from "@/lib/data/create-collection";

/** Botão "+ Adicionar novo orçamento" + modal de criação (spec §Contexto de origem). */
export function OrcamentoButton() {
  const [open, setOpen] = React.useState(false);

  function handleSave(data: Omit<Orcamento, "id">) {
    orcamentosStore.add({ id: nextId("orc"), ...data });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3 text-sm font-medium text-white transition-colors hover:bg-brand/90"
      >
        <Plus className="size-4" /> Adicionar novo orçamento
      </button>
      <OrcamentoModal open={open} onClose={() => setOpen(false)} onSave={handleSave} />
    </>
  );
}
