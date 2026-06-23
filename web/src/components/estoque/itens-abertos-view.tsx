"use client";
import * as React from "react";
import { ListShell } from "@/components/ui/list-shell";
import { EmptyNoData } from "@/components/estoque/estoque-empty";
import { AbrirItemModal } from "@/components/estoque/abrir-item-modal";

/** Tela 27 — Itens abertos (listagem vazia + modal "Abrir item"). */
export function ItensAbertosView() {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <>
      <ListShell title="Itens abertos" count={0} showCount={false} batchActions={false}>
        <EmptyNoData actionLabel="Abrir um item" onAction={() => setModalOpen(true)} />
      </ListShell>

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        aria-label="Abrir um item"
        className="fixed bottom-6 right-6 z-30 grid size-14 place-items-center rounded-full bg-brand text-white shadow-lg transition-colors hover:bg-brand-600"
      >
        <span className="text-2xl leading-none">+</span>
      </button>

      <AbrirItemModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
