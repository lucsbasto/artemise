"use client";
import { Settings } from "lucide-react";
import { ListShell } from "@/components/ui/list-shell";
import { RowActions } from "@/components/ui/row-actions";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { useListControls } from "@/lib/use-list-controls";
import { brl, cn } from "@/lib/utils";
import { estoqueValor, estoqueBaixo } from "@/lib/mock";
import type { ItemEstoque } from "@/lib/mock";

interface EstoqueTableProps {
  rows: ItemEstoque[];
  onEdit?: (item: ItemEstoque) => void;
  onDelete?: (item: ItemEstoque) => void;
}

export function EstoqueTable({ rows, onEdit, onDelete }: EstoqueTableProps) {
  const c = useListControls(rows, {
    searchFields: ["nome", "sku", "categoria"],
    perPage: 25,
  });

  return (
    <ListShell
      title="Controle de estoque"
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
      <ResponsiveTable>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-border text-left text-muted-2">
              <th className="px-5 py-3 font-medium">Nome</th>
              <th className="py-3 font-medium">SKU</th>
              <th className="py-3 font-medium">Categoria</th>
              <th className="py-3 font-medium">Unidade</th>
              <th className="py-3 font-medium">Saldo atual</th>
              <th className="py-3 font-medium">Estoque mínimo</th>
              <th className="py-3 font-medium">Custo</th>
              <th className="py-3 font-medium">Valor</th>
              <th className="w-10 px-5 py-3 text-right">
                <Settings className="ml-auto size-4" />
              </th>
            </tr>
          </thead>
          <tbody>
            {c.rows.map((item) => {
              const baixo = estoqueBaixo(item);
              return (
                <tr
                  key={item.id}
                  className={cn(
                    "border-b border-border last:border-b-0",
                    baixo && "bg-red-50/30"
                  )}
                >
                  <td
                    data-label="Nome"
                    className={cn(
                      "px-5 py-3",
                      baixo
                        ? "border-l-2 border-l-red-500"
                        : "border-l-2 border-l-transparent"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => onEdit?.(item)}
                      className="font-medium text-foreground hover:text-brand hover:underline"
                    >
                      {item.nome}
                    </button>
                  </td>
                  <td data-label="SKU" className="py-3 text-muted-2">{item.sku}</td>
                  <td data-label="Categoria" className="py-3 text-muted-2">{item.categoria}</td>
                  <td data-label="Unidade" className="py-3 text-muted-2">{item.unidade}</td>
                  <td
                    data-label="Saldo atual"
                    className={cn(
                      "py-3 font-medium",
                      baixo ? "text-danger" : "text-foreground"
                    )}
                  >
                    {item.saldo}
                  </td>
                  <td data-label="Estoque mínimo" className="py-3 text-muted-2">{item.minimo}</td>
                  <td data-label="Custo" className="py-3 text-muted-2">{brl(item.custo)}</td>
                  <td data-label="Valor" className="py-3 text-foreground">{brl(estoqueValor(item))}</td>
                  <td data-label="" className="px-5 py-3 text-right">
                    <RowActions
                      actions={[
                        { label: "Editar", onClick: () => onEdit?.(item) },
                        { label: "Excluir", onClick: () => onDelete?.(item), danger: true },
                      ]}
                    />
                  </td>
                </tr>
              );
            })}
            {c.rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-5 py-10 text-center text-sm text-muted-2">
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ResponsiveTable>
    </ListShell>
  );
}
