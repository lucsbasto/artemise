"use client";
import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { Toggle } from "@/components/ui/toggle";
import { tiposMetodo, type MetodoPagamento } from "@/lib/mock";

export function MetodoModal({
  open,
  onClose,
  onSave,
  metodo,
}: {
  open: boolean;
  onClose: () => void;
  onSave?: (data: Omit<MetodoPagamento, "id">) => void;
  metodo?: MetodoPagamento | null;
}) {
  const [descricao, setDescricao] = React.useState(() => metodo?.descricao ?? "");
  const [tipo, setTipo] = React.useState(() => metodo?.tipo ?? tiposMetodo[0]);
  const [marca, setMarca] = React.useState(() => (metodo?.marca === "—" ? "" : metodo?.marca ?? ""));
  const [ativo, setAtivo] = React.useState(() => metodo?.ativo ?? true);
  const [erro, setErro] = React.useState(false);

  const salvar = () => {
    if (!descricao.trim()) {
      setErro(true);
      return;
    }
    onSave?.({ descricao: descricao.trim(), tipo, marca: marca.trim() || "—", ativo });
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
          <Input
            value={descricao}
            onChange={(e) => {
              setDescricao(e.target.value);
              if (e.target.value.trim()) setErro(false);
            }}
            placeholder="Ex.: PIX"
          />
          {erro && <span className="text-xs text-danger">Informe a descrição.</span>}
        </Field>
        <Field label="Tipo">
          <Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {tiposMetodo.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </Field>
        <Field label="Marca/Bandeira">
          <Input
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            placeholder="Ex.: Visa, Master, Outra"
          />
        </Field>
        <div className="flex items-center gap-2">
          <Toggle checked={ativo} onChange={setAtivo} tone="success" />
          <span className="text-sm font-medium text-foreground">Ativo</span>
        </div>
      </div>
    </Modal>
  );
}
