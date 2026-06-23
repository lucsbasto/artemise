"use client";
import * as React from "react";
import { Settings, MoreVertical } from "lucide-react";
import { ListShell } from "@/components/ui/list-shell";
import { Toggle } from "@/components/ui/toggle";
import { ModeloAtestadoModal } from "@/components/configuracoes/modelo-atestado-modal";
import { modelosDocumento } from "@/lib/mock";
import type { ModeloDocumento } from "@/lib/mock";

/** Tela 36 — Modelos de atestados e prescrições (lista + modal editor). */
export function ModelosView() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editando, setEditando] = React.useState<ModeloDocumento | undefined>(undefined);

  function abrir(m?: ModeloDocumento) {
    setEditando(m);
    setModalOpen(true);
  }

  return (
    <>
      <ListShell title="Modelos de atestados e prescrições" count={modelosDocumento.length}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-border text-left text-muted-2">
                <th className="px-5 py-3 font-medium">Nome</th>
                <th className="py-3 font-medium">Tipo</th>
                <th className="py-3 font-medium">Ativo</th>
                <th className="w-10 px-5 py-3 text-right">
                  <Settings className="ml-auto size-4" />
                </th>
              </tr>
            </thead>
            <tbody>
              {modelosDocumento.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-b-0">
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      onClick={() => abrir(m)}
                      className="font-medium text-brand hover:underline"
                    >
                      {m.nome}
                    </button>
                  </td>
                  <td className="py-3 text-muted-2">{m.tipo}</td>
                  <td className="py-3">
                    <Toggle defaultOn={m.ativo} tone="success" />
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

      <button
        type="button"
        onClick={() => abrir(undefined)}
        aria-label="Novo modelo"
        className="fixed bottom-6 right-6 z-30 grid size-14 place-items-center rounded-full bg-brand text-white shadow-lg transition-colors hover:bg-brand-600"
      >
        <span className="text-2xl leading-none">+</span>
      </button>

      <ModeloAtestadoModal
        key={`${modalOpen}-${editando?.id ?? "new"}`}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        modelo={editando}
      />
    </>
  );
}
