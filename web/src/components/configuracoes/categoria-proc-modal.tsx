"use client";
import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Field, Input } from "@/components/ui/field";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Tela 33 — modal "Nova categoria". Spec: somente Nome* + Ativo (sem campo de cor). */
export function CategoriaProcModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [nome, setNome] = React.useState("");
  const [error, setError] = React.useState(false);

  function handleCadastrar() {
    if (!nome.trim()) {
      setError(true);
      return;
    }
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nova categoria"
      size="md"
      footer={
        <Button variant="brand" onClick={handleCadastrar}>
          Cadastrar
        </Button>
      }
    >
      <div className="flex items-start gap-4">
        <Field label="Nome" required className="flex-1">
          <Input
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              if (e.target.value.trim()) setError(false);
            }}
            placeholder="Digite"
            className={cn(error && "border-danger focus:border-danger")}
          />
          {error && <span className="text-xs text-danger">Campo obrigatório</span>}
        </Field>
        <Field label="Ativo" hint className="shrink-0">
          <Toggle defaultOn tone="success" />
        </Field>
      </div>
    </Modal>
  );
}
