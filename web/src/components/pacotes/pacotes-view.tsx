"use client";
import * as React from "react";
import { PacotesTable } from "@/components/pacotes/pacotes-table";
import { PacoteModal } from "@/components/pacotes/pacote-modal";
import { useCollection, nextId } from "@/lib/data/create-collection";
import { pacotesStore } from "@/lib/data/stores";
import type { Pacote } from "@/lib/mock";

export function PacotesView() {
  const { items, add, update, remove, toggle } = useCollection(pacotesStore);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editando, setEditando] = React.useState<Pacote | undefined>(undefined);

  function handleEdit(p: Pacote) {
    setEditando(p);
    setModalOpen(true);
  }
  function handleCreate() {
    setEditando(undefined);
    setModalOpen(true);
  }
  function handleSave(data: Omit<Pacote, "id">) {
    if (editando) update(editando.id, data);
    else add({ id: nextId("pac"), ...data });
    setModalOpen(false);
  }

  return (
    <>
      <PacotesTable
        rows={items}
        onEdit={handleEdit}
        onDelete={(p) => remove(p.id)}
        onToggle={(p) => toggle(p.id, "ativo")}
      />

      <button
        type="button"
        onClick={handleCreate}
        aria-label="Novo pacote"
        className="fixed bottom-6 right-6 z-30 grid size-14 place-items-center rounded-full bg-brand text-white shadow-lg hover:bg-brand-600 transition-colors"
      >
        <span className="text-2xl leading-none">+</span>
      </button>

      <PacoteModal
        key={`${modalOpen}-${editando?.id ?? "new"}`}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        pacote={editando}
      />
    </>
  );
}
