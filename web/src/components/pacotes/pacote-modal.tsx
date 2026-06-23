"use client";
import * as React from "react";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { brl } from "@/lib/utils";
import {
  itemTotal,
  valorTotal,
  type ItemPacoteDraft,
  type DescontoTipo,
} from "@/lib/pacote-calc";
import { validadesPacote, itensVendaveis } from "@/lib/mock";
import type { Pacote } from "@/lib/mock";

const itemVazio = (): ItemPacoteDraft => ({
  nome: "",
  qtd: 1,
  valor: 0,
  descontoUn: 0,
  descontoTipo: "R$",
});

interface PacoteModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: Omit<Pacote, "id">) => void;
  pacote?: Pacote;
}

export function PacoteModal({ open, onClose, onSave, pacote }: PacoteModalProps) {
  const isEdit = !!pacote;

  const [descricao, setDescricao] = React.useState(pacote?.descricao ?? "");
  const [validade, setValidade] = React.useState(pacote?.validade ?? "Ilimitado");
  const [ativo, setAtivo] = React.useState(pacote?.ativo ?? true);
  const [descricaoError, setDescricaoError] = React.useState(false);

  const [itens, setItens] = React.useState<ItemPacoteDraft[]>([itemVazio()]);
  const [descontoGlobal, setDescontoGlobal] = React.useState(0);
  const [descontoGlobalTipo, setDescontoGlobalTipo] = React.useState<DescontoTipo>("R$");
  const [descontoExpanded, setDescontoExpanded] = React.useState(false);

  function updateItem(index: number, patch: Partial<ItemPacoteDraft>) {
    setItens((prev) =>
      prev.map((it, i) => (i === index ? { ...it, ...patch } : it))
    );
  }

  function removeItem(index: number) {
    setItens((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length === 0 ? [itemVazio()] : next;
    });
  }

  function addItem() {
    setItens((prev) => [...prev, itemVazio()]);
  }

  const total = valorTotal(itens, descontoGlobal, descontoGlobalTipo);
  const semDesconto = descontoGlobal === 0;

  function handleSalvar() {
    const hasDescricaoError = descricao.trim() === "";
    setDescricaoError(hasDescricaoError);
    if (!hasDescricaoError) {
      onSave?.({
        descricao: descricao.trim(),
        valorTotal: total,
        validade,
        ativo,
      });
      onClose();
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Editar Pacote" : "Novo pacote"}
      size="lg"
      footer={
        <Button variant="brand" onClick={handleSalvar}>
          Salvar
        </Button>
      }
    >
      {/* Linha cabeçalho: Descrição, Validade, Ativo */}
      <div className="grid grid-cols-3 gap-4">
        <Field label="Descrição" required className="col-span-1">
          <Input
            value={descricao}
            onChange={(e) => {
              setDescricao(e.target.value);
              if (e.target.value.trim()) setDescricaoError(false);
            }}
            placeholder="Digite"
          />
          {descricaoError && <span className="text-xs text-danger">Campo obrigatório</span>}
        </Field>
        <Field label="Validade" required className="col-span-1">
          <Select
            value={validade}
            onChange={(e) => setValidade(e.target.value)}
          >
            {validadesPacote.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Ativo" hint className="col-span-1">
          <div className="flex h-9 items-center">
            <Toggle checked={ativo} onChange={setAtivo} tone="success" />
          </div>
        </Field>
      </div>

      {/* Observações */}
      <div className="mt-4">
        <Field label="Observações" hint>
          <Input placeholder="Digite" />
        </Field>
      </div>

      {/* Seção Procedimentos/Produtos */}
      <div className="mt-6">
        <p className="mb-3 text-sm font-semibold text-foreground">
          Procedimentos/Produtos
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-border text-left text-muted-2">
                <th className="py-2 pr-2 font-medium">Nome</th>
                <th className="w-20 py-2 pr-2 font-medium">Qtd.</th>
                <th className="w-28 py-2 pr-2 font-medium">Valor (R$)</th>
                <th className="w-48 py-2 pr-2 font-medium">Desconto un.</th>
                <th className="w-28 py-2 pr-2 font-medium">Total (R$)</th>
                <th className="w-8 py-2" />
              </tr>
            </thead>
            <tbody>
              {itens.map((item, idx) => (
                <tr key={idx} className="border-b border-border last:border-b-0">
                  <td className="py-2 pr-2">
                    <Select
                      value={item.nome}
                      onChange={(e) =>
                        updateItem(idx, { nome: e.target.value })
                      }
                    >
                      <option value="" disabled>
                        Pesquise/Selecione
                      </option>
                      {itensVendaveis.map((iv) => (
                        <option key={iv} value={iv}>
                          {iv}
                        </option>
                      ))}
                    </Select>
                  </td>
                  <td className="py-2 pr-2">
                    <Input
                      type="number"
                      min={1}
                      value={item.qtd}
                      onChange={(e) =>
                        updateItem(idx, {
                          qtd: Number(e.target.value) || 1,
                        })
                      }
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.valor}
                      onChange={(e) =>
                        updateItem(idx, {
                          valor: Number(e.target.value) || 0,
                        })
                      }
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <div className="flex gap-1">
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={item.descontoUn}
                        onChange={(e) =>
                          updateItem(idx, {
                            descontoUn: Number(e.target.value) || 0,
                          })
                        }
                        className="flex-1"
                      />
                      <Select
                        value={item.descontoTipo}
                        onChange={(e) =>
                          updateItem(idx, {
                            descontoTipo: e.target.value as DescontoTipo,
                          })
                        }
                        className="w-16"
                      >
                        <option value="R$">R$</option>
                        <option value="%">%</option>
                      </Select>
                    </div>
                  </td>
                  <td className="py-2 pr-2">
                    <Input
                      readOnly
                      value={brl(itemTotal(item))}
                      className="bg-background text-muted cursor-default"
                      tabIndex={-1}
                    />
                  </td>
                  <td className="py-2">
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="text-muted-2 hover:text-danger transition-colors"
                      aria-label="Remover item"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="mt-2 text-sm font-medium text-brand hover:underline"
        >
          + Adicionar Procedimentos/Produtos
        </button>
      </div>

      {/* Seção Desconto (recolhível) */}
      <div className="mt-6 rounded-lg border border-border">
        <button
          type="button"
          onClick={() => setDescontoExpanded((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-foreground"
        >
          <span>Desconto</span>
          <span className="flex items-center gap-2 text-muted-2 font-normal">
            {!descontoExpanded && (
              <span className="text-xs">{semDesconto ? "Sem desconto" : brl(descontoGlobal)}</span>
            )}
            {descontoExpanded ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </span>
        </button>
        {descontoExpanded && (
          <div className="border-t border-border px-4 py-3">
            <Field label="Desconto">
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={descontoGlobal}
                  onChange={(e) =>
                    setDescontoGlobal(Number(e.target.value) || 0)
                  }
                  className="flex-1"
                />
                <Select
                  value={descontoGlobalTipo}
                  onChange={(e) =>
                    setDescontoGlobalTipo(e.target.value as DescontoTipo)
                  }
                  className="w-16"
                >
                  <option value="R$">R$</option>
                  <option value="%">%</option>
                </Select>
              </div>
            </Field>
          </div>
        )}
      </div>

      {/* Valor total */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm font-semibold text-foreground">Valor total</span>
        <span className="text-sm font-semibold text-foreground">{brl(total)}</span>
      </div>
    </Modal>
  );
}
