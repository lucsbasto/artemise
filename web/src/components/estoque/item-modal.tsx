"use client";
import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { categoriasEstoque, unidadesEstoque } from "@/lib/mock";

export function ItemModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [nome, setNome] = React.useState("");
  const [error, setError] = React.useState(false);

  const handleSalvar = () => {
    if (!nome.trim()) {
      setError(true);
      return;
    }
    setError(false);
    onClose();
  };

  const handleClose = () => {
    setNome("");
    setError(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Novo item"
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="brand" onClick={handleSalvar}>
            Salvar
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Nome" required>
          <Input
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              if (e.target.value.trim()) setError(false);
            }}
            placeholder="Nome do item"
            className={error ? "border-danger" : undefined}
          />
          {error && (
            <span className="text-xs text-danger">Nome é obrigatório.</span>
          )}
        </Field>

        <Field label="SKU">
          <Input placeholder="Código SKU" />
        </Field>

        <Field label="Categoria">
          <Select>
            <option value="">Selecione</option>
            {categoriasEstoque.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Unidade">
          <Select>
            <option value="">Selecione</option>
            {unidadesEstoque.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </Select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Saldo inicial">
            <Input type="number" placeholder="0" min={0} />
          </Field>
          <Field label="Estoque mínimo">
            <Input type="number" placeholder="0" min={0} />
          </Field>
        </div>

        <Field label="Custo">
          <Input type="number" placeholder="0,00" min={0} step={0.01} />
        </Field>

        <Field label="Marca/Fornecedor">
          <Input placeholder="Nome da marca ou fornecedor" />
        </Field>
      </div>
    </Modal>
  );
}
