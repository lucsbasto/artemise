"use client";
import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { Toggle } from "@/components/ui/toggle";
import { tiposMetodo, type MetodoPagamento } from "@/lib/mock";

export function MetodoModal({
  open,
  onClose,
  metodo,
}: {
  open: boolean;
  onClose: () => void;
  metodo?: MetodoPagamento | null;
}) {
  const [descricao, setDescricao] = React.useState(() => metodo?.descricao ?? "");
  const [erro, setErro] = React.useState(false);

  const salvar = () => {
    if (!descricao.trim()) {
      setErro(true);
      return;
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={metodo ? "Editar método" : "Novo método"}
      footer={
        <>
          <button onClick={onClose} className="h-9 rounded-lg border border-border px-4 text-sm font-medium text-muted hover:bg-background">
            Cancelar
          </button>
          <button onClick={salvar} className="h-9 rounded-lg bg-brand px-4 text-sm font-medium text-white hover:bg-brand/90">
            Salvar
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Descrição" required>
          <Input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex.: PIX" />
          {erro && <span className="text-xs text-danger">Informe a descrição.</span>}
        </Field>
        <Field label="Tipo">
          <Select defaultValue={metodo?.tipo ?? tiposMetodo[0]}>
            {tiposMetodo.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </Field>
        <Field label="Marca/Bandeira">
          <Input defaultValue={metodo?.marca === "—" ? "" : metodo?.marca ?? ""} placeholder="Ex.: Visa, Master, Outra" />
        </Field>
        <div className="flex items-center gap-2">
          <Toggle defaultOn={metodo?.ativo ?? true} tone="success" />
          <span className="text-sm font-medium text-foreground">Ativo</span>
        </div>
      </div>
    </Modal>
  );
}
