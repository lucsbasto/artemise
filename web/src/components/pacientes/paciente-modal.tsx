"use client";
import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import type { Patient } from "@/lib/mock";

export type NovoPaciente = Omit<Patient, "id">;

/** Modal de cadastro de paciente com informações pessoais. */
export function PacienteModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: NovoPaciente) => void;
}) {
  const [nome, setNome] = React.useState("");
  const [telefone, setTelefone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [cpf, setCpf] = React.useState("");
  const [sexo, setSexo] = React.useState("");
  const [dataNascimento, setDataNascimento] = React.useState("");
  const [endereco, setEndereco] = React.useState("");
  const [observacoes, setObservacoes] = React.useState("");
  const [recebeNotificacoes, setRecebeNotificacoes] = React.useState(false);

  function salvar() {
    if (!nome.trim()) return;
    onSave({
      nome: nome.trim(),
      tipo: "Paciente",
      etiquetas: [],
      identificador: telefone.trim() || "-",
      ativo: true,
      sexo: sexo || undefined,
      dataNascimento: dataNascimento.trim() || undefined,
      cpf: cpf.trim() || undefined,
      email: email.trim() || undefined,
      endereco: endereco.trim() || undefined,
      observacoes: observacoes.trim() || undefined,
      recebeNotificacoes,
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Novo paciente"
      size="lg"
      footer={
        <Button variant="brand" className="px-8" onClick={salvar}>
          Salvar
        </Button>
      }
    >
      <span className="text-sm font-semibold text-foreground">Informações pessoais</span>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nome completo" required className="sm:col-span-2">
          <Input placeholder="Digite o nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        </Field>
        <Field label="Telefone">
          <Input
            placeholder="+55 (00) 00000-0000"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            placeholder="email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label="CPF">
          <Input placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} />
        </Field>
        <Field label="Data de nascimento">
          <Input
            placeholder="dd/mm/aaaa"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
          />
        </Field>
        <Field label="Sexo">
          <Select value={sexo} onChange={(e) => setSexo(e.target.value)}>
            <option value="">Selecione</option>
            <option>Feminino</option>
            <option>Masculino</option>
            <option>Outro</option>
          </Select>
        </Field>
        <Field label="Endereço" className="sm:col-span-2">
          <Input
            placeholder="Rua, número, bairro, cidade, UF, CEP"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
        </Field>
        <Field label="Observações" className="sm:col-span-2">
          <textarea
            placeholder="Digite"
            rows={3}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none placeholder:text-muted-2 focus:border-brand"
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-foreground sm:col-span-2">
          <input
            type="checkbox"
            checked={recebeNotificacoes}
            onChange={(e) => setRecebeNotificacoes(e.target.checked)}
            className="size-4 rounded border-border accent-brand"
          />
          Recebe notificações
        </label>
      </div>
    </Modal>
  );
}
