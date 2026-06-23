"use client";
import { Settings, MoreVertical, ExternalLink } from "lucide-react";
import { ListShell } from "@/components/ui/list-shell";
import { Toggle } from "@/components/ui/toggle";
import { fichasAtendimento } from "@/lib/mock";

/** Tela 35 — Fichas de atendimentos (catálogo de modelos, 10 registros). */
export function FichasView() {
  return (
    <ListShell
      title="Fichas de atendimentos"
      count={fichasAtendimento.length}
      headerAction={
        <button className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline">
          Editar minhas fichas <ExternalLink className="size-4" />
        </button>
      }
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
            {fichasAtendimento.map((f) => (
              <tr key={f.id} className="border-b border-border last:border-b-0">
                <td className="px-5 py-3">
                  <span className="font-medium text-brand">{f.nome}</span>
                </td>
                <td className="py-3">
                  <Toggle defaultOn={f.ativo} tone="success" />
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
