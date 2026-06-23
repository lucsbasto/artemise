"use client";
import * as React from "react";
import { ProcedimentosTable } from "@/components/procedimentos/procedimentos-table";
import { ProcedimentoModal } from "@/components/procedimentos/procedimento-modal";
import { useCollection, nextId } from "@/lib/data/create-collection";
import { procedimentosStore } from "@/lib/data/stores";
import type { Procedimento } from "@/lib/mock";

export function ProcedimentosView() {
  const { items, add, update, remove, toggle } = useCollection(procedimentosStore);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editando, setEditando] = React.useState<Procedimento | undefined>(undefined);

  function handleEdit(p: Procedimento) {
    setEditando(p);
    setModalOpen(true);
  }
  function handleCreate() {
    setEditando(undefined);
    setModalOpen(true);
  }
  function handleSave(data: Omit<Procedimento, "id">) {
    if (editando) update(editando.id, data);
    else add({ id: nextId("proc"), ...data });
    setModalOpen(false);
  }

  return (
    <>
      <ProcedimentosTable
        rows={items}
        onEdit={handleEdit}
        onDelete={(p) => remove(p.id)}
        onToggle={(p) => toggle(p.id, "ativo")}
      />

      <button
        type="button"
        onClick={handleCreate}
        aria-label="Novo procedimento"
        className="fixed bottom-6 right-6 z-30 grid size-14 place-items-center rounded-full bg-brand text-white shadow-lg hover:bg-brand-600 transition-colors"
      >
        <span className="text-2xl leading-none">+</span>
      </button>

      <ProcedimentoModal
        key={`${modalOpen}-${editando?.id ?? "new"}`}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        procedimento={editando}
      />
    </>
  );
}
