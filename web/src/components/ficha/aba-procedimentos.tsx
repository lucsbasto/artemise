"use client";
import * as React from "react";
import { useParams } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { brl, cn } from "@/lib/utils";
import { useCollection, nextId } from "@/lib/data/create-collection";
import { registrosProcedimentoStore } from "@/lib/data/stores";
import { excluirRegistroComMapa, salvarRegistroComMapa } from "@/lib/data/registros";
import {
  fichaInjetaveisVazia,
  statusRegistroProcLabel,
  type FichaInjetaveis,
  type RegistroProcedimento,
  type StatusRegistroProc,
} from "@/lib/mock";
import { RowActions } from "@/components/ui/row-actions";
import { EmptyFiltered } from "./ficha-empty";
import { Pagination } from "./pagination";
import { RegistroProcedimentoModal } from "./registro-procedimento-modal";
import { MapaInjetaveisModal } from "./mapa-injetaveis-modal";

// Registros SEM mapa gravam direto na tabela via store (RLS isola tenant).
// Registros COM mapa (`usaMapa`) passam pelas RPCs `registrar_procedimento` /
// `excluir_registro_procedimento`: a baixa/estorno de estoque é delta atômico
// (novo − anterior) no banco, nunca no browser (M6). `SALDO_INSUFICIENTE` da RPC
// vira aviso no modal, sem mudança parcial.

const statusClass: Record<StatusRegistroProc, string> = {
  realizado: "bg-green-50 text-green-600",
  agendado: "bg-brand-100/60 text-brand",
  cancelado: "bg-red-50 text-red-500",
};

export function AbaProcedimentos() {
  const params = useParams<{ id: string }>();
  const pacienteId = params.id;
  const { items, add, update, remove } = useCollection(registrosProcedimentoStore);
  const [query, setQuery] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editando, setEditando] = React.useState<RegistroProcedimento | undefined>(undefined);
  const [mapaRegistro, setMapaRegistro] = React.useState<RegistroProcedimento | null>(null);

  const doPaciente = React.useMemo(
    () => items.filter((r) => r.pacienteId === pacienteId),
    [items, pacienteId]
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return doPaciente;
    return doPaciente.filter(
      (r) =>
        r.procedimento.toLowerCase().includes(q) ||
        r.profissional.toLowerCase().includes(q)
    );
  }, [doPaciente, query]);

  function handleNovo() {
    setEditando(undefined);
    setModalOpen(true);
  }

  function handleEdit(r: RegistroProcedimento) {
    setEditando(r);
    setModalOpen(true);
  }

  // Com mapa (novo ou já injetável na edição): baixa atômica via RPC. Sem mapa:
  // CRUD direto pelo store. Erros propagam p/ o modal exibir (ex.: saldo).
  async function handleSave(data: Omit<RegistroProcedimento, "id" | "pacienteId">) {
    if (data.usaMapa || editando?.usaMapa) {
      await salvarRegistroComMapa({
        pacienteId,
        registro: data,
        mapa: data.mapa ?? fichaInjetaveisVazia(),
        registroId: editando?.id,
      });
      return;
    }
    if (editando) await update(editando.id, data);
    else await add({ id: nextId("rproc"), pacienteId, ...data });
  }

  function handleAbrirMapa(r: RegistroProcedimento) {
    setMapaRegistro(r);
  }

  // Editar o mapa de um registro existente muda o estoque → RPC (delta vs. saldo).
  async function handleSaveMapa(ficha: FichaInjetaveis) {
    if (!mapaRegistro) return;
    await salvarRegistroComMapa({
      pacienteId,
      registro: { ...mapaRegistro, mapa: ficha, usaMapa: true },
      mapa: ficha,
      registroId: mapaRegistro.id,
    });
  }

  // Com mapa estorna o estoque na RPC (nunca falha); sem mapa, delete direto.
  function handleExcluir(r: RegistroProcedimento) {
    if (r.usaMapa) void excluirRegistroComMapa(r.id);
    else void remove(r.id);
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface shadow-sm">
      <div className="flex items-center gap-2 px-5 pt-5">
        <h2 className="text-base font-semibold text-foreground">Procedimentos</h2>
      </div>

      <div className="flex flex-wrap items-center gap-2 px-5 py-4">
        <button
          onClick={handleNovo}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3 text-sm font-medium text-white transition-colors hover:bg-brand/90"
        >
          <Plus className="size-4" /> Registrar procedimento
        </button>
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar"
            className="h-9 w-64 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none placeholder:text-muted-2 focus:border-brand"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyFiltered
          onClearFilters={() => setQuery("")}
          action={{ label: "Registrar procedimento", onClick: handleNovo }}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-medium text-muted-2">
                <th className="px-5 py-3 font-medium">Procedimento</th>
                <th className="py-3 pr-4 font-medium">Profissional</th>
                <th className="py-3 pr-4 font-medium">Data</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-4 font-medium text-right">Valor</th>
                <th className="w-10 py-3 pr-4" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-b-0">
                  <td className="px-5 py-3 text-foreground">{r.procedimento}</td>
                  <td className="py-3 pr-4 text-foreground">{r.profissional || "—"}</td>
                  <td className="py-3 pr-4 text-foreground">{r.data || "—"}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        statusClass[r.status]
                      )}
                    >
                      {statusRegistroProcLabel[r.status]}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right font-medium tabular-nums text-foreground">
                    {brl(r.valor)}
                  </td>
                  <td className="py-3 pr-4">
                    <RowActions
                      actions={[
                        ...(r.usaMapa
                          ? [{ label: "Mapa", onClick: () => handleAbrirMapa(r) }]
                          : []),
                        { label: "Editar", onClick: () => handleEdit(r) },
                        { label: "Excluir", danger: true, onClick: () => handleExcluir(r) },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination perPage={25} />

      <RegistroProcedimentoModal
        key={`${modalOpen}-${editando?.id ?? "new"}`}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        registro={editando}
      />

      {mapaRegistro && (
        <MapaInjetaveisModal
          key={`mapa-${mapaRegistro.id}`}
          open={!!mapaRegistro}
          onClose={() => setMapaRegistro(null)}
          titulo={`Mapa de injetáveis — ${mapaRegistro.procedimento}`}
          valor={mapaRegistro.mapa}
          onSave={handleSaveMapa}
        />
      )}
    </div>
  );
}
