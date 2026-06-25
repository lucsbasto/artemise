"use client";
import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCollection } from "@/lib/data/create-collection";
import { procedimentosStore, profissionaisDetalheStore } from "@/lib/data/stores";
import {
  statusRegistroProcLabel,
  type RegistroProcedimento,
  type StatusRegistroProc,
} from "@/lib/mock";

type RegistroData = Omit<RegistroProcedimento, "id" | "pacienteId">;

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: RegistroData) => void;
  registro?: RegistroProcedimento;
}

const STATUS: StatusRegistroProc[] = ["realizado", "agendado", "cancelado"];

export function RegistroProcedimentoModal({ open, onClose, onSave, registro }: Props) {
  const isEdit = !!registro;
  const { items: procedimentos } = useCollection(procedimentosStore);
  const { items: profissionais } = useCollection(profissionaisDetalheStore);
  const ativos = procedimentos.filter((p) => p.ativo);

  const [procedimento, setProcedimento] = React.useState(registro?.procedimento ?? "");
  const [profissional, setProfissional] = React.useState(registro?.profissional ?? "");
  const [data, setData] = React.useState(registro?.data ?? "");
  const [status, setStatus] = React.useState<StatusRegistroProc>(registro?.status ?? "realizado");
  const [valor, setValor] = React.useState(registro ? String(registro.valor) : "");
  const [observacoes, setObservacoes] = React.useState(registro?.observacoes ?? "");
  const [procError, setProcError] = React.useState(false);

  // Ao escolher procedimento do catálogo, sugere o valor de venda.
  function handleProcedimento(nome: string) {
    setProcedimento(nome);
    if (nome) setProcError(false);
    const match = ativos.find((p) => p.nome === nome);
    if (match && valor === "") setValor(String(match.valor));
  }

  function handleSalvar() {
    const hasProcError = procedimento.trim() === "";
    setProcError(hasProcError);
    if (hasProcError) return;
    onSave({
      procedimento: procedimento.trim(),
      profissional: profissional.trim(),
      data: data.trim(),
      status,
      valor: Number(valor) || 0,
      observacoes: observacoes.trim(),
    });
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Editar Procedimento" : "Registrar Procedimento"}
      size="lg"
      footer={
        <Button variant="brand" onClick={handleSalvar}>
          Salvar
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        <Field label="Procedimento" required>
          <Select
            value={procedimento}
            onChange={(e) => handleProcedimento(e.target.value)}
            className={cn(procError && "border-danger focus:border-danger")}
          >
            <option value="">Selecione</option>
            {ativos.map((p) => (
              <option key={p.id} value={p.nome}>
                {p.nome}
              </option>
            ))}
          </Select>
          {procError && <span className="text-xs text-danger">Campo obrigatório</span>}
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Profissional">
            <Select value={profissional} onChange={(e) => setProfissional(e.target.value)}>
              <option value="">Selecione</option>
              {profissionais.map((p) => (
                <option key={p.id} value={p.nome}>
                  {p.nome}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Data">
            <Input
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="DD/MM/AAAA"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Status">
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusRegistroProc)}
            >
              {STATUS.map((s) => (
                <option key={s} value={s}>
                  {statusRegistroProcLabel[s]}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Valor">
            <Input
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="R$ 0,00"
            />
          </Field>
        </div>

        <Field label="Observações">
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            rows={3}
            placeholder="Evolução, materiais usados, intercorrências…"
            className="w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none placeholder:text-muted-2 focus:border-brand"
          />
        </Field>
      </div>
    </Modal>
  );
}
