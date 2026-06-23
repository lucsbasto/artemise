"use client";
import * as React from "react";
import { EstoqueTable } from "@/components/estoque/estoque-table";
import { ItemModal } from "@/components/estoque/item-modal";
import { useCollection, nextId } from "@/lib/data/create-collection";
import { estoqueStore } from "@/lib/data/stores";
import type { ItemEstoque } from "@/lib/mock";

export function EstoqueView() {
  const { items, add, update, remove } = useCollection(estoqueStore);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editando, setEditando] = React.useState<ItemEstoque | undefined>(undefined);

  function handleEdit(item: ItemEstoque) {
    setEditando(item);
    setModalOpen(true);
  }
  function handleCreate() {
    setEditando(undefined);
    setModalOpen(true);
  }
  function handleSave(data: Omit<ItemEstoque, "id">) {
    if (editando) update(editando.id, data);
    else add({ id: nextId("est"), ...data });
    setModalOpen(false);
  }

  return (
    <>
      <EstoqueTable
        rows={items}
        onEdit={handleEdit}
        onDelete={(item) => remove(item.id)}
      />

      <button
        type="button"
        onClick={handleCreate}
        aria-label="Adicionar novo item"
        className="fixed bottom-6 right-6 z-30 grid size-14 place-items-center rounded-full bg-brand text-white shadow-lg hover:bg-brand-600 transition-colors"
      >
        <span className="text-2xl leading-none">+</span>
      </button>

      <ItemModal
        key={`${modalOpen}-${editando?.id ?? "new"}`}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        item={editando}
      />
    </>
  );
}
