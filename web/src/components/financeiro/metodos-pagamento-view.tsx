"use client";
import * as React from "react";
import { MoreVertical, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ListShell } from "@/components/ui/list-shell";
import { Toggle } from "@/components/ui/toggle";
import { MetodoModal } from "@/components/financeiro/metodo-modal";
import type { MetodoPagamento } from "@/lib/mock";

export function MetodosPagamentoView({ metodos }: { metodos: MetodoPagamento[] }) {
  const [modal, setModal] = React.useState(false);
  const [editar, setEditar] = React.useState<MetodoPagamento | null>(null);

  const abrir = (m: MetodoPagamento | null) => {
    setEditar(m);
    setModal(true);
  };

  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Financeiro", "Métodos de pagamento"]} />

      <div className="mt-4">
        <ListShell title="Métodos de pagamento" count={metodos.length} batchActions={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-2">
                  <th className="py-3 pl-5 pr-4 font-medium">Descrição</th>
                  <th className="py-3 pr-4 font-medium">Tipo</th>
                  <th className="py-3 pr-4 font-medium">Marca/Bandeira</th>
                  <th className="py-3 pr-4 font-medium text-center">Ativo</th>
                  <th className="w-16 px-2 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {metodos.map((m) => (
                  <tr key={m.id} className="border-b border-border last:border-b-0">
                    <td className="py-3 pl-5 pr-4 font-medium text-foreground">{m.descricao}</td>
                    <td className="py-3 pr-4 text-muted">{m.tipo}</td>
                    <td className="py-3 pr-4 text-muted">{m.marca}</td>
                    <td className="py-3 pr-4">
                      <div className="flex justify-center">
                        <Toggle defaultOn={m.ativo} tone="success" />
                      </div>
                    </td>
                    <td className="px-2 py-3 text-right">
                      <button
                        onClick={() => abrir(m)}
                        className={cn("text-muted-2 hover:text-foreground", !m.ativo && "opacity-40")}
                      >
                        <MoreVertical className="ml-auto size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ListShell>
      </div>

      {/* FAB */}
      <button
        onClick={() => abrir(null)}
        className="fixed bottom-6 right-6 grid size-12 place-items-center rounded-full bg-brand text-white shadow-lg hover:bg-brand/90"
        aria-label="Novo método"
      >
        <Plus className="size-5" />
      </button>

      <MetodoModal key={`${editar?.id ?? "new"}-${modal}`} open={modal} onClose={() => setModal(false)} metodo={editar} />
    </div>
  );
}
