"use client";
import * as React from "react";
import { ListShell } from "@/components/ui/list-shell";
import { EmptyNoData } from "@/components/estoque/estoque-empty";
import { CategoriaProcModal } from "@/components/configuracoes/categoria-proc-modal";

/** Tela 33 — Categorias de procedimentos (lista vazia + modal). */
export function CategoriasProcView() {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <>
      <ListShell title="Categorias de procedimentos" count={0} showCount={false}>
        <EmptyNoData
          actionLabel="+ Adicionar nova categoria de procedimento"
          onAction={() => setModalOpen(true)}
        />
      </ListShell>

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        aria-label="Nova categoria"
        className="fixed bottom-6 right-6 z-30 grid size-14 place-items-center rounded-full bg-brand text-white shadow-lg transition-colors hover:bg-brand-600"
      >
        <span className="text-2xl leading-none">+</span>
      </button>

      {/* key remonta o modal a cada abertura → form limpo (sem state stale) */}
      <CategoriaProcModal
        key={String(modalOpen)}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
