"use client";
import * as React from "react";
import { PacotesTable } from "@/components/pacotes/pacotes-table";
import { PacoteModal } from "@/components/pacotes/pacote-modal";
import type { Pacote } from "@/lib/mock";

export function PacotesView({ pacotes }: { pacotes: Pacote[] }) {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <div className="relative">
      <PacotesTable pacotes={pacotes} onNovo={() => setModalOpen(true)} />

      {/* FAB roxo */}
      <button
        onClick={() => setModalOpen(true)}
        aria-label="Novo pacote"
        className="fixed bottom-6 right-6 z-30 grid size-14 place-items-center rounded-full bg-brand text-white shadow-lg hover:bg-brand-600 transition-colors"
      >
        <span className="text-2xl leading-none">+</span>
      </button>

      <PacoteModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
