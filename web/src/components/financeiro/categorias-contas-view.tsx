"use client";
import * as React from "react";
import { ChevronDown, ChevronRight, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ListShell } from "@/components/ui/list-shell";
import { Toggle } from "@/components/ui/toggle";
import { RowActions } from "@/components/ui/row-actions";
import { CategoriaContaModal } from "@/components/financeiro/categoria-conta-modal";
import { useCollection, nextId } from "@/lib/data/create-collection";
import { categoriasContasStore } from "@/lib/data/stores";
import { useListControls } from "@/lib/use-list-controls";
import type { CategoriaConta } from "@/lib/mock";

export function CategoriasContasView() {
  const { items, add, update, remove, toggle } = useCollection(categoriasContasStore);
  const [expandidos, setExpandidos] = React.useState<Set<string>>(new Set());
  const [modal, setModal] = React.useState(false);
  const [editar, setEditar] = React.useState<CategoriaConta | null>(null);

  const c = useListControls(items, { searchFields: ["descricao"], perPage: 25 });

  const toggleExpandido = (id: string) =>
    setExpandidos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const abrirNova = () => {
    setEditar(null);
    setModal(true);
  };

  const abrirEditar = (cat: CategoriaConta) => {
    setEditar(cat);
    setModal(true);
  };

  function handleSave(data: Omit<CategoriaConta, "id">) {
    if (editar) update(editar.id, data);
    else add({ id: nextId("cat"), ...data });
    setModal(false);
  }

  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Financeiro", "Categorias de contas"]} />

      <div className="mt-4">
        <ListShell
          title="Categorias de contas"
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
                <tr className="border-b border-border text-left text-muted-2">
                  <th className="py-3 pl-5 pr-4 font-medium">Descrição</th>
                  <th className="py-3 pr-4 font-medium text-center w-24">Status</th>
                  <th className="w-10 px-5 py-3 text-right">
                    <Settings className="ml-auto size-4" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {c.rows.map((cat) => {
                  const isOpen = expandidos.has(cat.id);
                  const temFilhos = !!cat.filhos?.length;
                  return (
                    <React.Fragment key={cat.id}>
                      <tr className="border-b border-border">
                        <td className="py-3 pl-5 pr-4">
                          <button
                            type="button"
                            onClick={() => temFilhos && toggleExpandido(cat.id)}
                            className={cn("inline-flex items-center gap-1.5 font-medium text-foreground", !temFilhos && "cursor-default")}
                          >
                            {temFilhos ? (
                              isOpen ? <ChevronDown className="size-4 text-muted-2" /> : <ChevronRight className="size-4 text-muted-2" />
                            ) : (
                              <span className="inline-block size-4" />
                            )}
                            {cat.descricao}
                          </button>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex justify-center">
                            <Toggle checked={cat.ativo} onChange={() => toggle(cat.id, "ativo")} tone="success" />
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <RowActions
                            actions={[
                              { label: "Editar", onClick: () => abrirEditar(cat) },
                              { label: "Excluir", onClick: () => remove(cat.id), danger: true },
                            ]}
                          />
                        </td>
                      </tr>
                      {isOpen &&
                        cat.filhos?.map((f) => (
                          <tr key={f.id} className="border-b border-border bg-background/40">
                            <td className="py-2.5 pl-12 pr-4 text-muted">{f.descricao}</td>
                            <td className="py-2.5 pr-4">
                              <div className="flex justify-center">
                                <Toggle defaultOn={f.ativo} tone="success" />
                              </div>
                            </td>
                            <td className="px-5 py-2.5 text-right">
                              <RowActions
                                actions={[
                                  { label: "Excluir", onClick: () => {}, danger: true },
                                ]}
                              />
                            </td>
                          </tr>
                        ))}
                      {isOpen && (
                        <tr className="border-b border-border">
                          <td className="py-2 pl-12 pr-4" colSpan={3}>
                            <button type="button" onClick={abrirNova} className="text-sm font-medium text-brand hover:underline">
                              + Adicionar subcategoria
                            </button>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
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
      </div>

      <button
        type="button"
        onClick={abrirNova}
        className="fixed bottom-6 right-6 grid size-12 place-items-center rounded-full bg-brand text-white shadow-lg hover:bg-brand/90"
        aria-label="Nova categoria"
      >
        <Plus className="size-5" />
      </button>

      <CategoriaContaModal
        key={`${editar?.id ?? "new"}-${modal}`}
        open={modal}
        onClose={() => setModal(false)}
        onSave={handleSave}
        categoria={editar}
      />
    </div>
  );
}
