"use client";
import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { categoriasEstoque, unidadesEstoque } from "@/lib/mock";
import type { ItemEstoque } from "@/lib/mock";

interface ItemModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: Omit<ItemEstoque, "id">) => void;
  item?: ItemEstoque;
}

export function ItemModal({ open, onClose, onSave, item }: ItemModalProps) {
  const isEdit = !!item;

  const [nome, setNome] = React.useState(item?.nome ?? "");
  const [sku, setSku] = React.useState(item?.sku ?? "");
  const [categoria, setCategoria] = React.useState(item?.categoria ?? "");
  const [unidade, setUnidade] = React.useState(item?.unidade ?? "");
  const [saldo, setSaldo] = React.useState(item ? String(item.saldo) : "");
  const [minimo, setMinimo] = React.useState(item ? String(item.minimo) : "");
  const [custo, setCusto] = React.useState(item ? String(item.custo) : "");
  const [nomeError, setNomeError] = React.useState(false);

  function handleSalvar() {
    if (!nome.trim()) {
      setNomeError(true);
      return;
    }
    onSave?.({
      nome: nome.trim(),
      sku: sku.trim(),
      categoria,
      unidade,
      saldo: Number(saldo) || 0,
      minimo: Number(minimo) || 0,
      custo: Number(custo) || 0,
    });
    onClose();
  }

  function handleClose() {
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? "Editar item" : "Novo item"}
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
              if (e.target.value.trim()) setNomeError(false);
            }}
            placeholder="Nome do item"
            className={cn(nomeError && "border-danger focus:border-danger")}
          />
          {nomeError && (
            <span className="text-xs text-danger">Nome é obrigatório.</span>
          )}
        </Field>

        <Field label="SKU">
          <Input
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="Código SKU"
          />
        </Field>

        <Field label="Categoria">
          <Select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Selecione</option>
            {categoriasEstoque.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Unidade">
          <Select
            value={unidade}
            onChange={(e) => setUnidade(e.target.value)}
          >
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
            <Input
              type="number"
              value={saldo}
              onChange={(e) => setSaldo(e.target.value)}
              placeholder="0"
              min={0}
            />
          </Field>
          <Field label="Estoque mínimo">
            <Input
              type="number"
              value={minimo}
              onChange={(e) => setMinimo(e.target.value)}
              placeholder="0"
              min={0}
            />
          </Field>
        </div>

        <Field label="Custo">
          <Input
            type="number"
            value={custo}
            onChange={(e) => setCusto(e.target.value)}
            placeholder="0,00"
            min={0}
            step={0.01}
          />
        </Field>
      </div>
    </Modal>
  );
}
