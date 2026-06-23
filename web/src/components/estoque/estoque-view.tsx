"use client";
import * as React from "react";
import { ListShell } from "@/components/ui/list-shell";
import { EstoqueIndicators } from "@/components/estoque/estoque-indicators";
import { EstoqueTable } from "@/components/estoque/estoque-table";
import { ItemModal } from "@/components/estoque/item-modal";
import { estoqueBaixo } from "@/lib/mock";
import type { ItemEstoque } from "@/lib/mock";

type FilterKey = "baixo" | "alto" | "todos";

interface EstoqueViewProps {
  rows: ItemEstoque[];
  summary: { baixo: number; alto: number; todos: number };
}

export function EstoqueView({ rows, summary }: EstoqueViewProps) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [filter, setFilter] = React.useState<FilterKey>("todos");

  const filtered = React.useMemo(() => {
    if (filter === "baixo") return rows.filter((r) => estoqueBaixo(r));
    if (filter === "alto") return rows.filter((r) => !estoqueBaixo(r) && r.saldo > r.minimo);
    return rows;
  }, [rows, filter]);

  return (
    <>
      <ListShell title="Controle de estoque" count={rows.length}>
        <EstoqueIndicators
          summary={summary}
          active={filter}
          onFilter={setFilter}
        />
        <EstoqueTable rows={filtered} />
      </ListShell>

      {/* FAB roxo */}
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        aria-label="Adicionar novo item"
        className="fixed bottom-6 right-6 z-30 grid size-14 place-items-center rounded-full bg-brand text-white shadow-lg hover:bg-brand-600 transition-colors"
      >
        <span className="text-2xl leading-none">+</span>
      </button>

      <ItemModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
