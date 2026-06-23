"use client";
import * as React from "react";
import { Settings } from "lucide-react";
import { ListShell } from "@/components/ui/list-shell";
import { Toggle } from "@/components/ui/toggle";
import { RowActions } from "@/components/ui/row-actions";
import { useListControls } from "@/lib/use-list-controls";
import { useCollection, nextId } from "@/lib/data/create-collection";
import { modelosDocumentoStore } from "@/lib/data/stores";
import { ModeloAtestadoModal } from "@/components/configuracoes/modelo-atestado-modal";
import type { ModeloDocumento } from "@/lib/mock";

/** Tela 36 — Modelos de atestados e prescrições (lista + modal editor, funcional). */
export function ModelosView() {
  const { items, add, update, remove, toggle } = useCollection(modelosDocumentoStore);
  const c = useListControls(items, { searchFields: ["nome", "tipo"], perPage: 25 });

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editando, setEditando] = React.useState<ModeloDocumento | undefined>(undefined);

  function handleEdit(m: ModeloDocumento) {
    setEditando(m);
    setModalOpen(true);
  }
  function handleCreate() {
    setEditando(undefined);
    setModalOpen(true);
  }
  function handleSave(data: Omit<ModeloDocumento, "id">) {
    if (editando) update(editando.id, data);
    else add({ id: nextId("modelo"), ...data });
    setModalOpen(false);
  }

  return (
    <>
      <ListShell
        title="Modelos de atestados e prescrições"
        count={c.total}
        batchActions={false}
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
                <th className="py-3 font-medium">Tipo</th>
                <th className="py-3 font-medium">Ativo</th>
                <th className="w-10 px-5 py-3 text-right">
                  <Settings className="ml-auto size-4" />
                </th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-b-0">
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(m)}
                      className="font-medium text-brand hover:underline"
                    >
                      {m.nome}
                    </button>
                  </td>
                  <td className="py-3 text-muted-2">{m.tipo}</td>
                  <td className="py-3">
                    <Toggle checked={m.ativo} onChange={() => toggle(m.id, "ativo")} tone="success" />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <RowActions
                      actions={[
                        { label: "Editar", onClick: () => handleEdit(m) },
                        { label: "Excluir", onClick: () => remove(m.id), danger: true },
                      ]}
                    />
                  </td>
                </tr>
              ))}
              {c.rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm text-muted-2">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ListShell>

      <button
        type="button"
        onClick={handleCreate}
        aria-label="Novo modelo"
        className="fixed bottom-6 right-6 z-30 grid size-14 place-items-center rounded-full bg-brand text-white shadow-lg transition-colors hover:bg-brand-600"
      >
        <span className="text-2xl leading-none">+</span>
      </button>

      <ModeloAtestadoModal
        key={`${modalOpen}-${editando?.id ?? "new"}`}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        modelo={editando}
      />
    </>
  );
}
