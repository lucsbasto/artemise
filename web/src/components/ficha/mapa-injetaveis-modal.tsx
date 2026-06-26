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
import { fichaInjetaveisVazia, type FichaInjetaveis } from "@/lib/mock";

interface Props {
  open: boolean;
  onClose: () => void;
  titulo: string;
  /** Estado já salvo do registro (p/ pré-preencher pontos e calcular saldo disponível). */
  valor?: FichaInjetaveis;
  onSave: (ficha: FichaInjetaveis) => void;
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

  function handleSalvar() {
    onSave(draft);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={titulo}
      size="xl"
      footer={
        <Button variant="brand" onClick={handleSalvar}>
          Salvar mapa
        </Button>
      }
    >
      <MapaInjetaveis value={draft} onChange={setDraft} estoqueBaseline={baseline} />
    </Modal>
  );
}
