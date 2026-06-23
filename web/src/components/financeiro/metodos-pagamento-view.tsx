"use client";
import * as React from "react";
import { Plus, Settings } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ListShell } from "@/components/ui/list-shell";
import { Toggle } from "@/components/ui/toggle";
import { RowActions } from "@/components/ui/row-actions";
import { MetodoModal } from "@/components/financeiro/metodo-modal";
import { useCollection, nextId } from "@/lib/data/create-collection";
import { metodosPagamentoStore } from "@/lib/data/stores";
import { useListControls } from "@/lib/use-list-controls";
import type { MetodoPagamento } from "@/lib/mock";

export function MetodosPagamentoView() {
  const { items, add, update, remove, toggle } = useCollection(metodosPagamentoStore);
  const [modal, setModal] = React.useState(false);
  const [editar, setEditar] = React.useState<MetodoPagamento | null>(null);

  const c = useListControls(items, { searchFields: ["descricao", "tipo", "marca"], perPage: 25 });

  const abrir = (m: MetodoPagamento | null) => {
    setEditar(m);
    setModal(true);
  };

  function handleSave(data: Omit<MetodoPagamento, "id">) {
    if (editar) update(editar.id, data);
    else add({ id: nextId("met"), ...data });
    setModal(false);
  }

  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Financeiro", "Métodos de pagamento"]} />

      <div className="mt-4">
        <ListShell
          title="Métodos de pagamento"
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
                  <th className="py-3 pr-4 font-medium">Tipo</th>
                  <th className="py-3 pr-4 font-medium">Marca/Bandeira</th>
                  <th className="py-3 pr-4 font-medium text-center">Ativo</th>
                  <th className="w-10 px-5 py-3 text-right">
                    <Settings className="ml-auto size-4" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {c.rows.map((m) => (
                  <tr key={m.id} className="border-b border-border last:border-b-0">
                    <td className="py-3 pl-5 pr-4 font-medium text-foreground">
                      <button
                        type="button"
                        onClick={() => abrir(m)}
                        className="font-medium text-foreground hover:text-brand hover:underline"
                      >
                        {m.descricao}
                      </button>
                    </td>
                    <td className="py-3 pr-4 text-muted">{m.tipo}</td>
                    <td className="py-3 pr-4 text-muted">{m.marca}</td>
                    <td className="py-3 pr-4">
                      <div className="flex justify-center">
                        <Toggle checked={m.ativo} onChange={() => toggle(m.id, "ativo")} tone="success" />
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <RowActions
                        actions={[
                          { label: "Editar", onClick: () => abrir(m) },
                          { label: "Excluir", onClick: () => remove(m.id), danger: true },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
                {c.rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-2">
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
        onClick={() => abrir(null)}
        className="fixed bottom-6 right-6 grid size-12 place-items-center rounded-full bg-brand text-white shadow-lg hover:bg-brand/90"
        aria-label="Novo método"
      >
        <Plus className="size-5" />
      </button>

      <MetodoModal
        key={`${editar?.id ?? "new"}-${modal}`}
        open={modal}
        onClose={() => setModal(false)}
        onSave={handleSave}
        metodo={editar}
      />
    </div>
  );
}
