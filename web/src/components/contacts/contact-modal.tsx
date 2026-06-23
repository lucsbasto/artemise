"use client";
import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import type { Contact } from "@/lib/mock";

/** Modal de criação de contato (profissional/fornecedor). */
export function ContactModal({
  open,
  onClose,
  onSave,
  tipo,
  title,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Contact, "id">) => void;
  tipo: string;
  title: string;
}) {
  const [nome, setNome] = React.useState("");
  const [identificador, setIdentificador] = React.useState("");

  function salvar() {
    if (!nome.trim()) return;
    onSave({
      nome: nome.trim(),
      tipo,
      etiquetas: [],
      identificador: identificador.trim() || "-",
      ativo: true,
      avatarTone: "brand",
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <Button variant="brand" className="px-8" onClick={salvar}>
          Salvar
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Nome" required>
          <Input placeholder="Digite o nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        </Field>
        <Field label="Identificador (telefone)">
          <Input
            placeholder="+55 (00) 00000-0000"
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
          />
        </Field>
      </div>
    </Modal>
  );
}
