"use client";
import * as React from "react";
import { Landmark, Wallet, Banknote, MoreVertical, Plus } from "lucide-react";
import { brl } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ContaModal } from "@/components/financeiro/conta-modal";
import { somaSaldos } from "@/lib/financeiro-calc";
import type { ContaFinanceira } from "@/lib/mock";

const ICONS = { bank: Landmark, cash: Banknote, wallet: Wallet } as const;

export function ContasFinanceirasView({ contas }: { contas: ContaFinanceira[] }) {
  const [modal, setModal] = React.useState(false);
  const [editar, setEditar] = React.useState<ContaFinanceira | null>(null);
  const total = somaSaldos(contas);

  const abrirNova = () => {
    setEditar(null);
    setModal(true);
  };
  const abrirEditar = (c: ContaFinanceira) => {
    setEditar(c);
    setModal(true);
  };

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
        {contas.map((c) => {
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
                <button onClick={() => abrirEditar(c)} className="text-muted-2 hover:text-foreground">
                  <MoreVertical className="size-4" />
                </button>
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

      <ContaModal key={`${editar?.id ?? "new"}-${modal}`} open={modal} onClose={() => setModal(false)} conta={editar} />
    </div>
  );
}
