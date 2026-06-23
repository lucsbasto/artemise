"use client";
import * as React from "react";
import { ListShell } from "@/components/ui/list-shell";
import { EmptyNoData } from "@/components/estoque/estoque-empty";
import { ContagemModal } from "@/components/estoque/contagem-modal";

/** Tela 26 — Contagem de estoque (listagem vazia + modal). */
export function ContagemView() {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <>
      <ListShell
        title="Contagem de estoque"
        count={0}
        showCount={false}
        batchActions={false}
        hideSearch
      >
        <EmptyNoData
          actionLabel="+ Criar nova contagem de estoque"
          onAction={() => setModalOpen(true)}
        />
      </ListShell>

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        aria-label="Nova contagem de estoque"
        className="fixed bottom-6 right-6 z-30 grid size-14 place-items-center rounded-full bg-brand text-white shadow-lg transition-colors hover:bg-brand-600"
      >
        <span className="text-2xl leading-none">+</span>
      </button>

      <ContagemModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
