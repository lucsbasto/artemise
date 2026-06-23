"use client";
import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { Toggle } from "@/components/ui/toggle";
import type { CategoriaConta } from "@/lib/mock";

export function CategoriaContaModal({
  open,
  onClose,
  onSave,
  categoria,
}: {
  open: boolean;
  onClose: () => void;
  onSave?: (data: Omit<CategoriaConta, "id">) => void;
  categoria?: CategoriaConta | null;
}) {
  const [descricao, setDescricao] = React.useState(() => categoria?.descricao ?? "");
  const [ativo, setAtivo] = React.useState(() => categoria?.ativo ?? true);
  const [erro, setErro] = React.useState(false);

  const salvar = () => {
    if (!descricao.trim()) {
      setErro(true);
      return;
    }
    onSave?.({ descricao: descricao.trim(), ativo, filhos: categoria?.filhos ?? [] });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={categoria ? "Editar categoria" : "Nova categoria"}
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
            placeholder="Ex.: Receitas de serviços"
          />
          {erro && <span className="text-xs text-danger">Informe a descrição.</span>}
        </Field>
        <Field label="Tipo">
          <Select defaultValue="Receita">
            <option>Receita</option>
            <option>Despesa</option>
          </Select>
        </Field>
        <div className="flex items-center gap-2">
          <Toggle checked={ativo} onChange={setAtivo} tone="success" />
          <span className="text-sm font-medium text-foreground">Ativo</span>
        </div>
      </div>
    </Modal>
  );
}
