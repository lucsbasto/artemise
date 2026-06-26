"use client";
import * as React from "react";
import { ChevronDown, Search } from "lucide-react";
import { brl } from "@/lib/utils";
import { useCollection, nextId } from "@/lib/data/create-collection";
import { orcamentosStore, type Orcamento } from "@/lib/data/stores";
import { RowActions } from "@/components/ui/row-actions";
import { EmptyFiltered } from "./ficha-empty";
import { Pagination } from "./pagination";
import { OrcamentoButton } from "./orcamento-button";
import { OrcamentoModal } from "./orcamento-modal";

export function AbaOrcamentos() {
  const { items, add, remove } = useCollection(orcamentosStore);
  const [query, setQuery] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);

  function handleSave(data: Omit<Orcamento, "id">) {
    add({ id: nextId("orc"), ...data });
  }

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (o) =>
        o.cliente.toLowerCase().includes(q) ||
        o.vendedor.toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface shadow-sm">
      {/* header */}
      <div className="flex items-center gap-2 px-5 pt-5">
        <h2 className="text-base font-semibold text-foreground">Orçamentos</h2>
        <div className="ml-auto">
          <button
            disabled
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted-2 opacity-50"
          >
            Exportar <ChevronDown className="size-4" />
          </button>
        </div>
      </div>

      {/* ações */}
      <div className="flex flex-wrap items-center gap-2 px-5 py-4">
        <button className="text-sm font-medium text-brand hover:underline">+ Adicionar filtro</button>
        <OrcamentoButton onClick={() => setModalOpen(true)} />
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar"
            className="h-9 w-64 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none placeholder:text-muted-2 focus:border-brand"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyFiltered
          onClearFilters={() => setQuery("")}
          action={{ label: "Adicionar novo orçamento", onClick: () => setModalOpen(true) }}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-medium text-muted-2">
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="py-3 pr-4 font-medium">Vendedor</th>
                <th className="py-3 pr-4 font-medium">Itens</th>
                <th className="py-3 pr-4 font-medium text-right">Valor total</th>
                <th className="py-3 pr-4 font-medium">Data</th>
                <th className="w-10 py-3 pr-4" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-b-0">
                  <td className="px-5 py-3 text-foreground">{o.cliente}</td>
                  <td className="py-3 pr-4 text-foreground">{o.vendedor}</td>
                  <td className="py-3 pr-4 text-foreground">{o.itens}</td>
                  <td className="py-3 pr-4 text-right font-medium tabular-nums text-foreground">
                    {brl(o.total)}
                  </td>
                  <td className="py-3 pr-4 text-foreground">{o.data}</td>
                  <td className="py-3 pr-4">
                    <RowActions
                      actions={[
                        { label: "Excluir", danger: true, onClick: () => remove(o.id) },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination perPage={25} />

      <OrcamentoModal
        key={modalOpen ? "open" : "closed"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
