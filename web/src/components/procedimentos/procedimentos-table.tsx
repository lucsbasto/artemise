"use client";
import * as React from "react";
import { Settings, MoreVertical } from "lucide-react";
import { ListShell } from "@/components/ui/list-shell";
import { Toggle } from "@/components/ui/toggle";
import { brl } from "@/lib/utils";
import type { Procedimento } from "@/lib/mock";

interface ProcedimentosTableProps {
  rows: Procedimento[];
  onEdit?: (p: Procedimento) => void;
}

export function ProcedimentosTable({ rows, onEdit }: ProcedimentosTableProps) {
  return (
    <ListShell title="Procedimentos" count={rows.length} batchActions={false}>
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
            {rows.map((p) => (
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
                  <Toggle defaultOn={p.ativo} tone="success" />
                </td>
                <td className="px-5 py-3 text-right">
                  <button type="button" className="text-muted-2 hover:text-foreground">
                    <MoreVertical className="ml-auto size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ListShell>
  );
}
