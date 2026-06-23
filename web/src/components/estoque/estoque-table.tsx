"use client";
import * as React from "react";
import { Settings, MoreVertical } from "lucide-react";
import { cn, brl } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { estoqueValor, estoqueBaixo } from "@/lib/mock";
import type { ItemEstoque } from "@/lib/mock";

const HEADERS = [
  "Nome",
  "SKU",
  "Categoria",
  "Unidade",
  "Saldo atual",
  "Estoque mínimo",
  "Custo",
  "Valor",
];

export function EstoqueTable({ rows }: { rows: ItemEstoque[] }) {
  if (rows.length === 0) {
    return (
      <div className="px-5">
        <EmptyState
          title="Hmm, está vazio por aqui!"
          subtitle="Nenhum registro encontrado."
        />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-2">
            <th className="w-10 px-5 py-3">
              <input type="checkbox" className="size-4 accent-brand" />
            </th>
            {HEADERS.map((h) => (
              <th key={h} className="whitespace-nowrap py-3 pr-4 font-medium">
                {h}
              </th>
            ))}
            <th className="w-10 px-2 py-3 text-right">
              <Settings className="ml-auto size-4" />
            </th>
            <th className="w-10 px-2 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => {
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
                  className={cn(
                    "px-5 py-3",
                    baixo
                      ? "border-l-2 border-l-red-500"
                      : "border-l-2 border-l-transparent"
                  )}
                >
                  <input type="checkbox" className="size-4 accent-brand" />
                </td>
                <td className="py-3 pr-4 font-medium text-foreground">
                  {item.nome}
                </td>
                <td className="py-3 pr-4 text-muted-2">{item.sku}</td>
                <td className="py-3 pr-4 text-muted-2">{item.categoria}</td>
                <td className="py-3 pr-4 text-muted-2">{item.unidade}</td>
                <td
                  className={cn(
                    "py-3 pr-4 font-medium",
                    baixo ? "text-danger" : "text-foreground"
                  )}
                >
                  {item.saldo}
                </td>
                <td className="py-3 pr-4 text-muted-2">{item.minimo}</td>
                <td className="py-3 pr-4 text-muted-2">{brl(item.custo)}</td>
                <td className="py-3 pr-4 text-foreground">
                  {brl(estoqueValor(item))}
                </td>
                <td className="px-2 py-3" />
                <td className="px-2 py-3 text-right">
                  <button className="text-muted-2 hover:text-foreground">
                    <MoreVertical className="size-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
