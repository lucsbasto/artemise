"use client";
import { Calendar, Clock } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useCollection } from "@/lib/data/create-collection";
import { estoqueStore } from "@/lib/data/stores";

/** Tela 27 — modal "Abrir item". */
export function AbrirItemModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items: itensEstoque } = useCollection(estoqueStore);
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Abrir item"
      size="md"
      footer={
        <Button variant="brand" onClick={onClose}>
          Confirmar
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label="Item" required>
          <Select defaultValue="">
            <option value="" disabled>
              Pesquise/Selecione
            </option>
            {itensEstoque.map((i) => (
              <option key={i.nome} value={i.nome}>
                {i.nome}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Data" required>
          <div className="relative">
            <Input defaultValue="22/06/2026" className="pr-9" />
            <Calendar className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
          </div>
        </Field>

        <Field label="Hora">
          <div className="relative">
            <Input defaultValue="15:36" className="pr-9" />
            <Clock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
          </div>
        </Field>

        <Field label="Quantidade utilizada" required>
          <Input type="number" defaultValue={0} min={0} />
        </Field>

        <Field label="Observações" className="col-span-2">
          <textarea
            rows={3}
            placeholder="Digite"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-2 focus:border-brand"
          />
        </Field>
      </div>
    </Modal>
  );
}
