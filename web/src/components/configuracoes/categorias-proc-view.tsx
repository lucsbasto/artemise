"use client";
import * as React from "react";
import { Settings } from "lucide-react";
import { ListShell } from "@/components/ui/list-shell";
import { Toggle } from "@/components/ui/toggle";
import { RowActions } from "@/components/ui/row-actions";
import { useListControls } from "@/lib/use-list-controls";
import { createCollection, useCollection, nextId } from "@/lib/data/create-collection";
import { CategoriaProcModal } from "@/components/configuracoes/categoria-proc-modal";

type CategoriaProc = { id: string; nome: string; ativo: boolean };

/** Store local seedado vazio — não precisa ir no stores.ts central. */
const categoriasProcStore = createCollection<CategoriaProc>([]);

/** Tela 33 — Categorias de procedimentos (lista + modal, funcional). */
export function CategoriasProcView() {
  const { items, add, remove, toggle } = useCollection(categoriasProcStore);
  const c = useListControls(items, { searchFields: ["nome"], perPage: 25 });

  const [modalOpen, setModalOpen] = React.useState(false);

  function handleSave(nome: string, ativo: boolean) {
    add({ id: nextId("cat"), nome, ativo });
    setModalOpen(false);
  }

  return (
    <>
      <ListShell
        title="Categorias de procedimentos"
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
                <th className="py-3 font-medium">Ativo</th>
                <th className="w-10 px-5 py-3 text-right">
                  <Settings className="ml-auto size-4" />
                </th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map((cat) => (
                <tr key={cat.id} className="border-b border-border last:border-b-0">
                  <td className="px-5 py-3">
                    <span className="font-medium text-foreground">{cat.nome}</span>
                  </td>
                  <td className="py-3">
                    <Toggle
                      checked={cat.ativo}
                      onChange={() => toggle(cat.id, "ativo")}
                      tone="success"
                    />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <RowActions
                      actions={[
                        { label: "Excluir", onClick: () => remove(cat.id), danger: true },
                      ]}
                    />
                  </td>
                </tr>
              ))}
              {c.rows.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-10 text-center text-sm text-muted-2">
                    Nenhuma categoria cadastrada.{" "}
                    <button
                      type="button"
                      onClick={() => setModalOpen(true)}
                      className="text-brand hover:underline"
                    >
                      Adicionar nova categoria
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ListShell>

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        aria-label="Nova categoria"
        className="fixed bottom-6 right-6 z-30 grid size-14 place-items-center rounded-full bg-brand text-white shadow-lg transition-colors hover:bg-brand-600"
      >
        <span className="text-2xl leading-none">+</span>
      </button>

      <CategoriaProcModal
        key={String(modalOpen)}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}
