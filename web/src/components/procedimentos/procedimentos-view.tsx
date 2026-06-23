"use client";
import * as React from "react";
import { ProcedimentosTable } from "@/components/procedimentos/procedimentos-table";
import { ProcedimentoModal } from "@/components/procedimentos/procedimento-modal";
import type { Procedimento } from "@/lib/mock";

interface ProcedimentosViewProps {
  procedimentos: Procedimento[];
}

export function ProcedimentosView({ procedimentos }: ProcedimentosViewProps) {
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

  function handleClose() {
    setModalOpen(false);
  }

  return (
    <>
      <ProcedimentosTable rows={procedimentos} onEdit={handleEdit} />

      {/* FAB + */}
      <button
        type="button"
        onClick={handleCreate}
        aria-label="Novo procedimento"
        className="fixed bottom-6 right-6 z-30 grid size-14 place-items-center rounded-full bg-brand text-white shadow-lg hover:bg-brand-600 transition-colors"
      >
        <span className="text-2xl leading-none">+</span>
      </button>

      {/* key remonta o modal a cada abertura → form inicializa limpo (sem setState em effect) */}
      <ProcedimentoModal
        key={`${modalOpen}-${editando?.id ?? "new"}`}
        open={modalOpen}
        onClose={handleClose}
        procedimento={editando}
      />
    </>
  );
}
