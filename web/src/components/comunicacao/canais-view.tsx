"use client";
import * as React from "react";
import {
  Info,
  MessageCircle,
  Search,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { EmptyFilter } from "@/components/comunicacao/canais-empty";

/** Tela 28 — Canais de atendimento. Estado capturado: filtro Status: Ativo, lista vazia. */
export function CanaisView() {
  const [busca, setBusca] = React.useState("");
  const [chipAtivo, setChipAtivo] = React.useState(true);

  function limparFiltros() {
    setBusca("");
    setChipAtivo(false);
  }

  return (
    <div className="mx-auto max-w-[1100px] p-5">
      <h1 className="text-lg font-semibold text-foreground">Canais de Atendimento</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-2">
        Gerencie e integre todos os canais de atendimento que você utiliza para se comunicar com
        seus clientes.
      </p>

      {/* banner migração WhatsApp Business */}
      <div className="mt-5 flex items-center gap-3 rounded-[var(--radius-card)] border-l-4 border-green-500 bg-green-50 px-4 py-3">
        <MessageCircle className="size-5 shrink-0 text-green-600" />
        <p className="text-sm text-foreground">
          Confira os benefícios e valores para migrar seus canais WhatsApp Lite para{" "}
          <span className="font-semibold">WhatsApp Business</span>
        </p>
        <button className="ml-auto inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-green-700 hover:underline">
          <Info className="size-4" /> Mais informações
        </button>
      </div>

      {/* card "Seus canais" */}
      <div className="mt-5 rounded-[var(--radius-card)] border border-border bg-surface shadow-sm">
        <div className="px-5 pt-5">
          <h2 className="text-base font-semibold text-foreground">Seus canais</h2>
        </div>

        {/* filtros */}
        <div className="flex flex-wrap items-center gap-2 px-5 py-4">
          {chipAtivo && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-sm font-medium text-brand">
              Status: Ativo
              <button
                aria-label="Remover filtro"
                className="text-brand/70 hover:text-brand"
                onClick={() => setChipAtivo(false)}
              >
                <X className="size-3.5" />
              </button>
            </span>
          )}
          <button className="text-sm font-medium text-brand hover:underline">
            + Adicionar filtro
          </button>
          {(busca || chipAtivo) && (
            <button
              onClick={limparFiltros}
              className="text-sm font-medium text-muted-2 hover:text-foreground hover:underline"
            >
              Limpar filtros
            </button>
          )}
          <div className="relative ml-auto">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar"
              className="h-9 w-64 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none placeholder:text-muted-2 focus:border-brand"
            />
          </div>
        </div>

        {/* corpo — estado vazio por filtro */}
        <EmptyFilter />

        {/* rodapé paginação — 10 por página */}
        <div className="flex items-center justify-between px-5 py-4">
          <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted">
            10 por página <ChevronDown className="size-4" />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-2">Mostrando 0 a 0 de 0</span>
            <div className="flex items-center gap-1">
              <PagBtn>
                <ChevronsLeft className="size-4" />
              </PagBtn>
              <PagBtn>
                <ChevronLeft className="size-4" />
              </PagBtn>
              <PagBtn>
                <ChevronRight className="size-4" />
              </PagBtn>
              <PagBtn>
                <ChevronsRight className="size-4" />
              </PagBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PagBtn({ children }: { children: React.ReactNode }) {
  return (
    <button
      disabled
      className="grid size-9 place-items-center rounded-lg bg-background text-muted-2 disabled:opacity-40"
    >
      {children}
    </button>
  );
}
