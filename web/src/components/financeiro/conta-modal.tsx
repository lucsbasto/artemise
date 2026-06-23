"use client";
import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { tiposConta, type ContaFinanceira } from "@/lib/mock";

const ICON_OPTIONS: { value: ContaFinanceira["icon"]; label: string }[] = [
  { value: "bank", label: "Banco" },
  { value: "cash", label: "Caixa" },
  { value: "wallet", label: "Carteira" },
];

export function ContaModal({
  open,
  onClose,
  onSave,
  conta,
}: {
  open: boolean;
  onClose: () => void;
  onSave?: (data: Omit<ContaFinanceira, "id">) => void;
  conta?: ContaFinanceira | null;
}) {
  const [nome, setNome] = React.useState(() => conta?.nome ?? "");
  const [tipo, setTipo] = React.useState(() => conta?.tipo ?? tiposConta[0]);
  const [saldo, setSaldo] = React.useState(() => (conta ? String(conta.saldo) : "0"));
  const [icon, setIcon] = React.useState<ContaFinanceira["icon"]>(() => conta?.icon ?? "bank");
  const [erro, setErro] = React.useState(false);

  const salvar = () => {
    if (!nome.trim()) {
      setErro(true);
      return;
    }
    onSave?.({ nome: nome.trim(), tipo, saldo: Number(saldo) || 0, icon });
    onClose();
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
          <Input
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              if (e.target.value.trim()) setErro(false);
            }}
            placeholder="Ex.: Banco padrão"
          />
          {erro && <span className="text-xs text-danger">Informe o nome da conta.</span>}
        </Field>
        <Field label="Tipo">
          <Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {tiposConta.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </Field>
        <Field label="Ícone">
          <Select value={icon} onChange={(e) => setIcon(e.target.value as ContaFinanceira["icon"])}>
            {ICON_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </Field>
        <Field label="Saldo inicial">
          <Input
            type="text"
            inputMode="decimal"
            value={saldo}
            onChange={(e) => setSaldo(e.target.value)}
            placeholder="0,00"
          />
        </Field>
      </div>
    </Modal>
  );
}
