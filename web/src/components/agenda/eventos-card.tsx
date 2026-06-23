"use client";
import * as React from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NovoEventoModal } from "@/components/agenda/novo-evento-modal";
import { eventosPeriodo, eventosRows } from "@/lib/mock";

// Eventos / Sala de espera (spec 05) — estado vazio capturado ("Oops, nada foi encontrado!").
export function EventosCard() {
  const [modal, setModal] = React.useState(false);
  const [busca, setBusca] = React.useState("");
  const [periodoAtivo, setPeriodoAtivo] = React.useState(true);
  const vazio = eventosRows.length === 0;

  function limparFiltros() {
    setBusca("");
    setPeriodoAtivo(false);
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface shadow-sm">
      {/* header */}
      <div className="px-5 pt-5">
        <h2 className="text-base font-semibold text-foreground">Eventos</h2>
      </div>

      {/* filtros + busca */}
      <div className="flex flex-wrap items-center gap-2 px-5 py-4">
        {periodoAtivo && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-sm text-foreground">
            Período: {eventosPeriodo}
            <button aria-label="Remover filtro de período" onClick={() => setPeriodoAtivo(false)}>
              <X className="size-3.5 text-muted-2" />
            </button>
          </span>
        )}
        <button className="text-sm font-medium text-brand hover:underline">+ Adicionar filtro</button>
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
          <input
            placeholder="Buscar"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="h-9 w-64 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none placeholder:text-muted-2 focus:border-brand"
          />
        </div>
      </div>

      {/* corpo */}
      {vazio && (
        <div className="flex flex-col items-center gap-3 px-5 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-brand-50">
            <Search className="size-6 text-brand" />
          </span>
          <p className="text-base font-semibold text-foreground">Oops, nada foi encontrado!</p>
          <p className="text-sm text-muted-2">
            Os filtros selecionados não correspondem a nenhum registro.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Button variant="soft" onClick={limparFiltros}>Limpar filtros</Button>
            <Button variant="brand" className="gap-1.5" onClick={() => setModal(true)}>
              <Plus className="size-4" /> Novo evento
            </Button>
          </div>
        </div>
      )}

      {/* rodapé paginação */}
      <div className="flex items-center justify-between px-5 py-4">
        <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted">
          25 por página <ChevronDown className="size-4" />
        </button>
        <div className="flex items-center gap-1">
          {[ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight].map((Icon, i) => (
            <button
              key={i}
              disabled
              className="grid size-9 place-items-center rounded-lg bg-background text-muted-2 disabled:opacity-40"
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>
      </div>

      <NovoEventoModal open={modal} onClose={() => setModal(false)} />
    </div>
  );
}
