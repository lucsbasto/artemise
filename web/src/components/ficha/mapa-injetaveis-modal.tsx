"use client";
/**
 * Modal que embute <MapaInjetaveis> vinculado a um registro de procedimento injetável.
 * Edita um rascunho controlado da ficha; `onSave` devolve a ficha p/ o container
 * persistir no registro e aplicar a baixa de estoque (delta vs. baseline).
 * Spec: features/procedimentos-aba (T7).
 */
import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { MapaInjetaveis } from "./mapa-injetaveis";
import { SaldoInsuficienteError } from "@/lib/data/registros";
import { fichaInjetaveisVazia, type FichaInjetaveis } from "@/lib/mock";

interface Props {
  open: boolean;
  onClose: () => void;
  titulo: string;
  /** Estado já salvo do registro (p/ pré-preencher pontos e calcular saldo disponível). */
  valor?: FichaInjetaveis;
  /** Pode ser assíncrono (RPC de estoque). Lança em erro p/ o modal exibir. */
  onSave: (ficha: FichaInjetaveis) => void | Promise<void>;
}

function totaisPorSub(f?: FichaInjetaveis): Record<string, number> {
  const acc: Record<string, number> = {};
  for (const p of f?.pontos ?? []) acc[p.substanciaId] = (acc[p.substanciaId] ?? 0) + p.unidades;
  return acc;
}

export function MapaInjetaveisModal({ open, onClose, titulo, valor, onSave }: Props) {
  const [draft, setDraft] = React.useState<FichaInjetaveis>(valor ?? fichaInjetaveisVazia());
  // ui já baixadas para este registro — somam ao saldo disponível durante a edição.
  const baseline = React.useMemo(() => totaisPorSub(valor), [valor]);
  const [erro, setErro] = React.useState<string | null>(null);
  const [salvando, setSalvando] = React.useState(false);

  async function handleSalvar() {
    setErro(null);
    setSalvando(true);
    try {
      await onSave(draft);
      onClose();
    } catch (e) {
      setErro(
        e instanceof SaldoInsuficienteError
          ? e.message
          : "Não foi possível salvar o mapa. Tente novamente."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={titulo}
      size="xl"
      footer={
        <Button variant="brand" onClick={handleSalvar} disabled={salvando}>
          {salvando ? "Salvando…" : "Salvar mapa"}
        </Button>
      }
    >
      {erro && (
        <p className="mb-4 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
          {erro}
        </p>
      )}
      <MapaInjetaveis value={draft} onChange={setDraft} estoqueBaseline={baseline} />
    </Modal>
  );
}
