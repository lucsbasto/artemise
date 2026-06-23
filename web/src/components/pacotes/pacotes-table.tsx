"use client";
import * as React from "react";
import { Settings, MoreVertical } from "lucide-react";
import { ListShell } from "@/components/ui/list-shell";
import { Toggle } from "@/components/ui/toggle";
import { brl } from "@/lib/utils";
import type { Pacote } from "@/lib/mock";

export function PacotesTable({
  pacotes,
  onNovo,
}: {
  pacotes: Pacote[];
  onNovo: () => void;
}) {
  return (
    <ListShell title="Pacotes" count={pacotes.length}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-border text-left text-muted-2">
              <th className="py-3 pl-5 font-medium">Descrição</th>
              <th className="py-3 font-medium">Valor total</th>
              <th className="py-3 font-medium">Validade</th>
              <th className="py-3 font-medium">Ativo</th>
              <th className="w-10 px-5 py-3 text-right">
                <Settings className="ml-auto size-4" />
              </th>
            </tr>
          </thead>
          <tbody>
            {pacotes.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-muted-2">
                  Nenhum pacote cadastrado.{" "}
                  <button
                    onClick={onNovo}
                    className="text-brand hover:underline"
                  >
                    + Adicionar
                  </button>
                </td>
              </tr>
            )}
            {pacotes.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-b-0">
                <td className="py-3 pl-5 font-medium text-foreground">
                  {p.descricao}
                </td>
                <td className="py-3 text-foreground">{brl(p.valorTotal)}</td>
                <td className="py-3 text-muted-2">{p.validade}</td>
                <td className="py-3">
                  <Toggle defaultOn={p.ativo} tone="success" />
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="text-muted-2 hover:text-foreground">
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
