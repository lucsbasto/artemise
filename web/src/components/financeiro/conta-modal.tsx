"use client";
import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { tiposConta, type ContaFinanceira } from "@/lib/mock";

export function ContaModal({
  open,
  onClose,
  conta,
}: {
  open: boolean;
  onClose: () => void;
  conta?: ContaFinanceira | null;
}) {
  const [nome, setNome] = React.useState(() => conta?.nome ?? "");
  const [erro, setErro] = React.useState(false);

  const salvar = () => {
    if (!nome.trim()) {
      setErro(true);
      return;
    }
    onClose(); // mock: não persiste
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={conta ? "Editar conta" : "Nova conta"}
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
        <Field label="Nome" required>
          <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Banco padrão" />
          {erro && <span className="text-xs text-danger">Informe o nome da conta.</span>}
        </Field>
        <Field label="Tipo">
          <Select defaultValue={conta?.tipo ?? tiposConta[0]}>
            {tiposConta.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </Field>
        <Field label="Saldo inicial">
          <Input type="text" inputMode="decimal" defaultValue="0,00" placeholder="0,00" />
        </Field>
      </div>
    </Modal>
  );
}
