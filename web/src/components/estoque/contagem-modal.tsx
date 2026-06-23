"use client";
import * as React from "react";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { EmptyNoData, EmptyFilter } from "@/components/estoque/estoque-empty";
import { itensEstoque } from "@/lib/mock";
import { cn } from "@/lib/utils";

type Variante = "parcial" | "geral";

/** Tela 26 — modal "Nova contagem de estoque" (Parcial | Geral). */
export function ContagemModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [variante, setVariante] = React.useState<Variante>("parcial");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nova contagem de estoque"
      size="lg"
      footer={
        <Button variant="brand" disabled>
          Salvar
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        {/* segmented control */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg bg-background p-1">
            {(["parcial", "geral"] as Variante[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVariante(v)}
                className={cn(
                  "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                  variante === v ? "bg-brand text-white" : "text-muted-2 hover:text-foreground"
                )}
              >
                {v === "parcial" ? "Contagem parcial" : "Contagem geral"}
              </button>
            ))}
          </div>
          <HelpCircle className="size-4 text-muted-2" />
        </div>

        {variante === "parcial" ? <Parcial /> : <Geral />}
      </div>
    </Modal>
  );
}

function Parcial() {
  return (
    <div className="flex flex-col gap-4">
      {/* linha de adição */}
      <div className="flex items-end gap-3">
        <Field label="Item" required className="flex-1">
          <Select defaultValue="">
            <option value="" disabled>
              Pesquise/Selecione
            </option>
            {itensEstoque.map((i) => (
              <option key={i.nome} value={i.nome}>
                {i.nome}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Contado (itens)" required className="w-40">
          <Input type="number" defaultValue={0} min={0} />
        </Field>
        <Button variant="soft" className="mb-px h-9 shrink-0">
          + Adicionar à contagem
        </Button>
      </div>

      {/* lista adicionada (vazia) */}
      <div className="rounded-xl border border-border">
        <EmptyNoData />
      </div>
    </div>
  );
}

function Geral() {
  return (
    <div className="flex flex-col gap-4">
      {/* filtros */}
      <div className="flex items-center gap-2">
        <button className="text-sm font-medium text-brand hover:underline">+ Adicionar filtro</button>
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
          <input
            placeholder="Buscar"
            className="h-9 w-56 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none placeholder:text-muted-2 focus:border-brand"
          />
        </div>
      </div>

      {/* tabela (vazia por filtro) */}
      <div className="rounded-xl border border-border">
        <EmptyFilter />
      </div>

      {/* rodapé interno */}
      <div className="flex items-center justify-between text-sm text-muted-2">
        <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-muted">
          25 por página <ChevronDown className="size-4" />
        </button>
        <span>Mostrando 0 a 0 de 0</span>
        <div className="flex items-center gap-1">
          {[ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight].map((Ic, i) => (
            <button
              key={i}
              disabled
              className="grid size-9 place-items-center rounded-lg bg-background text-muted-2 disabled:opacity-40"
            >
              <Ic className="size-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
