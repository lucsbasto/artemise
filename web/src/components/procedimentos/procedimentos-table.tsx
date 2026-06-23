"use client";
import { Settings } from "lucide-react";
import { ListShell } from "@/components/ui/list-shell";
import { Toggle } from "@/components/ui/toggle";
import { RowActions } from "@/components/ui/row-actions";
import { useListControls } from "@/lib/use-list-controls";
import { brl } from "@/lib/utils";
import type { Procedimento } from "@/lib/mock";

interface ProcedimentosTableProps {
  rows: Procedimento[];
  onEdit?: (p: Procedimento) => void;
  onDelete?: (p: Procedimento) => void;
  onToggle?: (p: Procedimento) => void;
}

export function ProcedimentosTable({ rows, onEdit, onDelete, onToggle }: ProcedimentosTableProps) {
  const c = useListControls(rows, { searchFields: ["nome", "categoria"], perPage: 25 });

  return (
    <ListShell
      title="Procedimentos"
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
              <th className="py-3 font-medium">Categoria</th>
              <th className="py-3 font-medium">Duração</th>
              <th className="py-3 font-medium">Valor</th>
              <th className="py-3 font-medium">Ativo</th>
              <th className="w-10 px-5 py-3 text-right">
                <Settings className="ml-auto size-4" />
              </th>
            </tr>
          </thead>
          <tbody>
            {c.rows.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-b-0">
                <td className="px-5 py-3">
                  <button
                    type="button"
                    onClick={() => onEdit?.(p)}
                    className="font-medium text-foreground hover:text-brand hover:underline"
                  >
                    {p.nome}
                  </button>
                </td>
                <td className="py-3 text-muted-2">{p.categoria ?? "-"}</td>
                <td className="py-3 text-foreground">{p.duracaoMin}</td>
                <td className="py-3 text-foreground">{brl(p.valor)}</td>
                <td className="py-3">
                  <Toggle checked={p.ativo} onChange={() => onToggle?.(p)} tone="success" />
                </td>
                <td className="px-5 py-3 text-right">
                  <RowActions
                    actions={[
                      { label: "Editar", onClick: () => onEdit?.(p) },
                      { label: "Excluir", onClick: () => onDelete?.(p), danger: true },
                    ]}
                  />
                </td>
              </tr>
            ))}
            {c.rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-2">
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
