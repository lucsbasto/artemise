"use client";
import * as React from "react";
import { Settings, ExternalLink } from "lucide-react";
import { ListShell } from "@/components/ui/list-shell";
import { Toggle } from "@/components/ui/toggle";
import { RowActions } from "@/components/ui/row-actions";
import { useListControls } from "@/lib/use-list-controls";
import { useCollection } from "@/lib/data/create-collection";
import { fichasAtendimentoStore } from "@/lib/data/stores";

/** Tela 35 — Fichas de atendimentos (catálogo de modelos, funcional). */
export function FichasView() {
  const { items, remove, toggle } = useCollection(fichasAtendimentoStore);
  const c = useListControls(items, { searchFields: ["nome"], perPage: 25 });

  return (
    <ListShell
      title="Fichas de atendimentos"
      count={c.total}
      batchActions={false}
      headerAction={
        <button className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline">
          Editar minhas fichas <ExternalLink className="size-4" />
        </button>
      }
      query={c.query}
      onQueryChange={c.setQuery}
      page={c.page}
      pageCount={c.pageCount}
      onPageChange={c.setPage}
      perPage={c.perPage}
      onPerPageChange={c.setPerPage}
      total={c.total}
      from={c.from}
      to={c.to}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-border text-left text-muted-2">
              <th className="px-5 py-3 font-medium">Nome</th>
              <th className="py-3 font-medium">Ativo</th>
              <th className="w-10 px-5 py-3 text-right">
                <Settings className="ml-auto size-4" />
              </th>
            </tr>
          </thead>
          <tbody>
            {c.rows.map((f) => (
              <tr key={f.id} className="border-b border-border last:border-b-0">
                <td className="px-5 py-3">
                  <span className="font-medium text-brand">{f.nome}</span>
                </td>
                <td className="py-3">
                  <Toggle checked={f.ativo} onChange={() => toggle(f.id, "ativo")} tone="success" />
                </td>
                <td className="px-5 py-3 text-right">
                  <RowActions
                    actions={[
                      { label: "Excluir", onClick: () => remove(f.id), danger: true },
                    ]}
                  />
                </td>
              </tr>
            ))}
            {c.rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-sm text-muted-2">
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </ListShell>
  );
}
