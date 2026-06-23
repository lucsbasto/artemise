"use client";
import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { coresProcedimento, categoriasProcedimento } from "@/lib/mock";
import type { Procedimento } from "@/lib/mock";

interface ProcedimentoModalProps {
  open: boolean;
  onClose: () => void;
  procedimento?: Procedimento;
}

export function ProcedimentoModal({ open, onClose, procedimento }: ProcedimentoModalProps) {
  const isEdit = !!procedimento;

  const [nome, setNome] = React.useState(procedimento?.nome ?? "");
  const [cor, setCor] = React.useState("");
  const [nomeError, setNomeError] = React.useState(false);
  const [corError, setCorError] = React.useState(false);
  const [infoOpen, setInfoOpen] = React.useState(false);

  function handleSalvar() {
    const hasNomeError = nome.trim() === "";
    const hasCorError = cor === "";
    setNomeError(hasNomeError);
    setCorError(hasCorError);
    if (!hasNomeError && !hasCorError) {
      onClose();
    }
  }

  const selectedCor = coresProcedimento.find((c) => c.nome === cor);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Editar Procedimento" : "Novo Procedimento"}
      size="lg"
      footer={
        <Button variant="brand" onClick={handleSalvar}>
          Salvar
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Nome */}
        <Field label="Nome" required>
          <Input
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              if (e.target.value.trim()) setNomeError(false);
            }}
            placeholder="Digite o nome do procedimento"
            className={cn(nomeError && "border-danger focus:border-danger")}
          />
          {nomeError && <span className="text-xs text-danger">Campo obrigatório</span>}
        </Field>

        {/* Linha 2: Valor de venda | Custo adicional | Cor */}
        <div className="grid grid-cols-3 gap-4">
          <Field label="Valor de venda">
            <div className="flex gap-1">
              <Input placeholder="R$ 0,00" className="flex-1" />
              <Select className="w-24 shrink-0">
                <option value="fixo">Fixo</option>
                <option value="variavel">Variável</option>
              </Select>
            </div>
          </Field>

          <Field label="Custo adicional" hint>
            <Input placeholder="R$ 0,00" />
          </Field>

          <Field label="Cor" required>
            <div className="flex items-center gap-2">
              {selectedCor && (
                <span
                  className="size-5 shrink-0 rounded-full border border-border"
                  style={{ background: selectedCor.hex }}
                />
              )}
              <Select
                value={cor}
                onChange={(e) => {
                  setCor(e.target.value);
                  if (e.target.value) setCorError(false);
                }}
                className={cn("flex-1", corError && "border-danger focus:border-danger")}
              >
                <option value="">Selecione</option>
                {coresProcedimento.map((c) => (
                  <option key={c.nome} value={c.nome}>
                    {c.nome}
                  </option>
                ))}
              </Select>
            </div>
            {corError && <span className="text-xs text-danger">Campo obrigatório</span>}
          </Field>
        </div>

        {/* Linha 3: Duração | Tempo de reconsulta | Categoria */}
        <div className="grid grid-cols-3 gap-4">
          <Field label="Duração">
            <div className="flex items-center gap-2">
              <Input type="number" placeholder="60" className="flex-1" />
              <span className="shrink-0 text-sm text-muted">minutos</span>
            </div>
          </Field>

          <Field label="Tempo de reconsulta">
            <div className="flex items-center gap-2">
              <Input type="number" placeholder="0" className="flex-1" />
              <span className="shrink-0 text-sm text-muted">dias</span>
            </div>
          </Field>

          <Field label="Categoria">
            <Select>
              <option value="">Pesquise/Selecione</option>
              {categoriasProcedimento.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {/* Toggle Ativo */}
        <Field label="Ativo" hint>
          <div className="flex items-center gap-3">
            <Toggle defaultOn={procedimento?.ativo ?? true} tone="success" />
          </div>
        </Field>

        {/* Materiais de atendimento */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-foreground">Materiais de atendimento</p>
          <Field label="Adicionar material">
            <Select>
              <option value="">Pesquise/Selecione</option>
            </Select>
          </Field>
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5">
            <span className="text-sm font-semibold text-foreground">Custo total</span>
            <span className="text-sm text-foreground">R$ 0,00</span>
          </div>
        </div>

        {/* Informações Adicionais (recolhível) */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setInfoOpen((v) => !v)}
            className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-brand"
          >
            {infoOpen ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
            Informações Adicionais
          </button>
          {infoOpen && (
            <div className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-muted">
              Campos adicionais como comissão, profissionais e ficha de atendimento vinculada.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
