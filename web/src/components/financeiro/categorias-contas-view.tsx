"use client";
import * as React from "react";
import { ChevronDown, ChevronRight, MoreVertical, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ListShell } from "@/components/ui/list-shell";
import { Toggle } from "@/components/ui/toggle";
import { CategoriaContaModal } from "@/components/financeiro/categoria-conta-modal";
import type { CategoriaConta } from "@/lib/mock";

export function CategoriasContasView({ categorias }: { categorias: CategoriaConta[] }) {
  const [open, setOpen] = React.useState<Set<string>>(new Set());
  const [modal, setModal] = React.useState(false);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Financeiro", "Categorias de contas"]} />

      <div className="mt-4">
        <ListShell title="Categorias de contas" count={categorias.length} batchActions={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-2">
                  <th className="py-3 pl-5 pr-4 font-medium">Descrição</th>
                  <th className="py-3 pr-4 font-medium text-center w-24">Status</th>
                  <th className="w-16 px-2 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((cat) => {
                  const isOpen = open.has(cat.id);
                  const temFilhos = !!cat.filhos?.length;
                  return (
                    <React.Fragment key={cat.id}>
                      <tr className="border-b border-border">
                        <td className="py-3 pl-5 pr-4">
                          <button
                            onClick={() => temFilhos && toggle(cat.id)}
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
                            <Toggle defaultOn={cat.ativo} tone="success" />
                          </div>
                        </td>
                        <td className="px-2 py-3 text-right">
                          <button className="text-muted-2 hover:text-foreground">
                            <MoreVertical className="ml-auto size-4" />
                          </button>
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
                            <td className="px-2 py-2.5 text-right">
                              <button className="text-muted-2 hover:text-foreground">
                                <MoreVertical className="ml-auto size-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      {isOpen && (
                        <tr className="border-b border-border">
                          <td className="py-2 pl-12 pr-4" colSpan={3}>
                            <button onClick={() => setModal(true)} className="text-sm font-medium text-brand hover:underline">
                              + Adicionar subcategoria
                            </button>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ListShell>
      </div>

      <button
        onClick={() => setModal(true)}
        className="fixed bottom-6 right-6 grid size-12 place-items-center rounded-full bg-brand text-white shadow-lg hover:bg-brand/90"
        aria-label="Nova categoria"
      >
        <Plus className="size-5" />
      </button>

      <CategoriaContaModal key={String(modal)} open={modal} onClose={() => setModal(false)} />
    </div>
  );
}
