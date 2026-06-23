"use client";
import * as React from "react";
import { Landmark, Wallet, Banknote, Plus } from "lucide-react";
import { brl } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { RowActions } from "@/components/ui/row-actions";
import { ContaModal } from "@/components/financeiro/conta-modal";
import { useCollection, nextId } from "@/lib/data/create-collection";
import { contasFinanceirasStore } from "@/lib/data/stores";
import { somaSaldos } from "@/lib/financeiro-calc";
import type { ContaFinanceira } from "@/lib/mock";

const ICONS = { bank: Landmark, cash: Banknote, wallet: Wallet } as const;

export function ContasFinanceirasView() {
  const { items, add, update, remove } = useCollection(contasFinanceirasStore);
  const [modal, setModal] = React.useState(false);
  const [editar, setEditar] = React.useState<ContaFinanceira | null>(null);

  const total = somaSaldos(items);

  const abrirNova = () => {
    setEditar(null);
    setModal(true);
  };
  const abrirEditar = (c: ContaFinanceira) => {
    setEditar(c);
    setModal(true);
  };

  function handleSave(data: Omit<ContaFinanceira, "id">) {
    if (editar) update(editar.id, data);
    else add({ id: nextId("cta"), ...data });
    setModal(false);
  }

  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Financeiro", "Contas financeiras"]} />

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Contas financeiras</h1>
        <button
          onClick={abrirNova}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3 text-sm font-medium text-white hover:bg-brand/90"
        >
          <Plus className="size-4" /> Nova conta
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => {
          const Icon = ICONS[c.icon];
          return (
            <div key={c.id} className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-background text-muted">
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{c.nome}</p>
                  <p className="text-xs text-muted">{c.tipo}</p>
                </div>
                <RowActions
                  actions={[
                    { label: "Editar", onClick: () => abrirEditar(c) },
                    { label: "Excluir", onClick: () => remove(c.id), danger: true },
                  ]}
                />
              </div>
              <div className="mt-4">
                <p className="text-xs text-muted">Saldo Atual</p>
                <p className="text-xl font-semibold text-foreground">{brl(c.saldo)}</p>
              </div>
            </div>
          );
        })}

        {/* Card Saldo total */}
        <div className="rounded-[var(--radius-card)] border border-brand/30 bg-brand-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-brand">Saldo total</p>
          <p className="mt-4 text-xs text-muted">Soma das contas</p>
          <p className="text-xl font-bold text-foreground">{brl(total)}</p>
        </div>
      </div>

      <ContaModal
        key={`${editar?.id ?? "new"}-${modal}`}
        open={modal}
        onClose={() => setModal(false)}
        onSave={handleSave}
        conta={editar}
      />
    </div>
  );
}
