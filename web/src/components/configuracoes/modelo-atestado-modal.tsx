"use client";
import * as React from "react";
import {
  ChevronDown,
  Minus,
  Plus,
  Bold,
  Italic,
  Underline,
  Baseline,
  Highlighter,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Braces,
  RemoveFormatting,
  Undo2,
  Redo2,
  Maximize2,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Field, Input } from "@/components/ui/field";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import type { ModeloDocumento } from "@/lib/mock";

/** Chip de variável dinâmica (placeholder lilás) usado no corpo do modelo. */
function Var({ children }: { children: React.ReactNode }) {
  return (
    <span className="mx-0.5 inline-flex items-center rounded bg-brand-100/60 px-1.5 py-0.5 text-xs font-medium text-brand">
      {children}
    </span>
  );
}

const TOOLBAR = [
  Bold,
  Italic,
  Underline,
  Baseline,
  Highlighter,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Braces,
  RemoveFormatting,
  Undo2,
  Redo2,
  Maximize2,
];

/** Tela 36 — modal editor de modelo de atestado (WYSIWYG mock). */
export function ModeloAtestadoModal({
  open,
  onClose,
  modelo,
}: {
  open: boolean;
  onClose: () => void;
  modelo?: ModeloDocumento;
}) {
  const isEdit = !!modelo;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Editar modelo de atestado" : "Novo modelo de atestado"}
      size="lg"
      footer={
        <Button variant="brand" onClick={onClose}>
          {isEdit ? "Salvar" : "Cadastrar"}
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Nome + Ativo */}
        <div className="flex items-start gap-4">
          <Field label="Nome" className="flex-1">
            <Input defaultValue={modelo?.nome ?? ""} placeholder="Digite" />
          </Field>
          <Field label="Ativo" hint className="shrink-0">
            <Toggle defaultOn={modelo?.ativo ?? true} tone="success" />
          </Field>
        </div>

        {/* Modelo* (editor) */}
        <Field label="Modelo" required>
          <div className="rounded-lg border border-border">
            {/* toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b border-border px-2 py-1.5">
              <button
                type="button"
                className="inline-flex h-8 items-center gap-1 rounded px-2 text-sm text-foreground hover:bg-background"
              >
                Texto normal <ChevronDown className="size-3.5" />
              </button>
              <span className="mx-1 h-5 w-px bg-border" />
              <button
                type="button"
                className="grid size-8 place-items-center rounded text-muted-2 hover:bg-background"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-6 text-center text-sm text-foreground">15</span>
              <button
                type="button"
                className="grid size-8 place-items-center rounded text-muted-2 hover:bg-background"
              >
                <Plus className="size-4" />
              </button>
              <span className="mx-1 h-5 w-px bg-border" />
              {TOOLBAR.map((Ic, i) => (
                <button
                  key={i}
                  type="button"
                  className="grid size-8 place-items-center rounded text-muted-2 hover:bg-background"
                >
                  <Ic className="size-4" />
                </button>
              ))}
            </div>
            {/* corpo */}
            <div className="px-4 py-4 text-sm leading-relaxed text-foreground">
              <p className="mb-3 text-base font-bold">ATESTADO MÉDICO</p>
              <p className="mb-2">
                Atesto, para os devidos fins, que o paciente <Var>Nome completo</Var>, esteve sob
                cuidados médicos na <Var>Nome da clínica</Var>.
              </p>
              <p className="mb-2">
                Local: <Var>Endereço da clínica</Var>
              </p>
              <p className="mb-3">
                <Var>Data de hoje</Var>
              </p>
              <p className="mb-1">
                <Var>Nome do profissional</Var>
              </p>
              <p>
                <Var>Conselho do profissional</Var>
              </p>
            </div>
          </div>
        </Field>
      </div>
    </Modal>
  );
}
