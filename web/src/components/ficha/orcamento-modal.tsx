"use client";
import * as React from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { cn, brl } from "@/lib/utils";
import {
  itemTotal,
  subtotal as calcSubtotal,
  valorTotal as calcValorTotal,
  type ItemPacoteDraft,
  type DescontoTipo,
} from "@/lib/pacote-calc";
import {
  fichaPaciente,
  currentUser,
  itensOrcamento,
  metodosPagamentoOrcamento,
} from "@/lib/mock";
import { useCollection } from "@/lib/data/create-collection";
import {
  pacotesStore,
  profissionaisStore,
  type Orcamento,
} from "@/lib/data/stores";

type Modo = "personalizado" | "pacote";
// Desconto do orçamento: "none" = "Sem desconto ou uso de saldo" (spec §Desconto).
type DescontoGlobalTipo = "none" | "R$" | "%";

const linhaVazia = (): ItemPacoteDraft => ({
  nome: "",
  qtd: 1,
  valor: 0,
  descontoUn: 0,
  descontoTipo: "R$",
});

type CondicaoDraft = { metodo: string; valor: number };

export function OrcamentoModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave?: (o: Omit<Orcamento, "id">) => void;
}) {
  const { items: pacotes } = useCollection(pacotesStore);
  const { items: profissionais } = useCollection(profissionaisStore);
  const [modo, setModo] = React.useState<Modo>("personalizado");
  const [cliente, setCliente] = React.useState(fichaPaciente.nome);
  const [vendedor, setVendedor] = React.useState(currentUser.nome);
  const [pacoteId, setPacoteId] = React.useState("");
  const [avancado, setAvancado] = React.useState(false);
  // Personalizado abre com 1 linha editável; pacote abre sem linhas (itens vêm do pacote).
  const [itens, setItens] = React.useState<ItemPacoteDraft[]>([linhaVazia()]);
  const [descTipo, setDescTipo] = React.useState<DescontoGlobalTipo>("none");
  const [descValor, setDescValor] = React.useState(0);
  const [condicoes, setCondicoes] = React.useState<CondicaoDraft[]>([]);

  // Itens do pacote selecionado entram no subtotal (preço de tabela do pacote).
  const itemPacote: ItemPacoteDraft[] = React.useMemo(() => {
    if (modo !== "pacote" || !pacoteId) return [];
    const p = pacotes.find((x) => x.id === pacoteId);
    if (!p) return [];
    return [{ nome: p.descricao, qtd: 1, valor: p.valorTotal, descontoUn: 0, descontoTipo: "R$" }];
  }, [modo, pacoteId, pacotes]);

  const itensSomaveis = modo === "pacote" ? [...itemPacote, ...itens] : itens;
  const descTipoCalc: DescontoTipo = descTipo === "%" ? "%" : "R$";
  const subtotal = calcSubtotal(itensSomaveis);
  const total = calcValorTotal(itensSomaveis, descTipo === "none" ? 0 : descValor, descTipoCalc);

  function trocarModo(novo: Modo) {
    setModo(novo);
    // Preserva Cliente/Vendedor; reseta itens conforme o modo (spec §Notas de implementação).
    setItens(novo === "personalizado" ? [linhaVazia()] : []);
  }

  function patchItem(i: number, patch: Partial<ItemPacoteDraft>) {
    setItens((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function selecionarNome(i: number, nome: string) {
    const cat = itensOrcamento.find((x) => x.nome === nome);
    patchItem(i, { nome, valor: cat ? cat.valor : 0 });
  }
  const addLinha = () => setItens((prev) => [...prev, linhaVazia()]);
  const removerLinha = (i: number) => setItens((prev) => prev.filter((_, idx) => idx !== i));

  const addCondicao = () =>
    setCondicoes((prev) => [...prev, { metodo: metodosPagamentoOrcamento[0], valor: 0 }]);
  const removerCondicao = (i: number) =>
    setCondicoes((prev) => prev.filter((_, idx) => idx !== i));

  const titulo = modo === "personalizado" ? "Novo orçamento personalizado" : "Novo orçamento de pacote";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={titulo}
      size="lg"
      footer={
        <button
          onClick={() => {
            onSave?.({
              cliente,
              vendedor,
              itens: itens.length,
              total,
              data: "22/06/2026",
            });
            onClose();
          }}
          className="inline-flex h-9 items-center justify-center rounded-lg bg-brand px-8 text-sm font-medium text-white transition-colors hover:bg-brand/90"
        >
          Salvar
        </button>
      }
    >
      <div className="space-y-5">
        {/* Tipo de orçamento */}
        <div>
          <p className="mb-1.5 text-sm font-medium text-foreground">
            Tipo de orçamento <span className="text-danger">*</span>
          </p>
          <div className="inline-flex rounded-lg border border-border p-0.5">
            {(["personalizado", "pacote"] as Modo[]).map((m) => (
              <button
                key={m}
                onClick={() => trocarModo(m)}
                className={cn(
                  "h-8 rounded-md px-4 text-sm font-medium capitalize transition-colors",
                  modo === m ? "bg-brand text-white" : "text-muted-2 hover:text-foreground"
                )}
              >
                {m === "personalizado" ? "Personalizado" : "Pacote"}
              </button>
            ))}
          </div>
        </div>

        {/* Dados básicos */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {modo === "pacote" && (
            <Field label="Pacote" required className="sm:col-span-2">
              <Select value={pacoteId} onChange={(e) => setPacoteId(e.target.value)}>
                <option value="">Pesquise/Selecione o pacote</option>
                {pacotes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.descricao} — {brl(p.valorTotal)}
                  </option>
                ))}
              </Select>
            </Field>
          )}
          <Field label="Cliente" required>
            <Select value={cliente} onChange={(e) => setCliente(e.target.value)}>
              <option>{fichaPaciente.nome}</option>
            </Select>
          </Field>
          <Field label="Vendedor" required>
            <Select value={vendedor} onChange={(e) => setVendedor(e.target.value)}>
              {profissionais.map((p) => (
                <option key={p.id}>{p.nome}</option>
              ))}
            </Select>
          </Field>
        </div>

        <button
          onClick={() => setAvancado((v) => !v)}
          className="flex items-center gap-1 text-sm font-medium text-brand hover:underline"
        >
          {avancado ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
          Mostrar opções avançadas
        </button>
        {avancado && (
          <div className="grid grid-cols-1 gap-4 rounded-lg border border-border bg-muted/40 p-4 sm:grid-cols-2">
            <Field label="Validade do orçamento">
              <Input type="date" />
            </Field>
            <Field label="Identificador">
              <Input placeholder="Nº do orçamento" />
            </Field>
            <Field label="Observações" className="sm:col-span-2">
              <Input placeholder="Observações internas" />
            </Field>
          </div>
        )}

        {/* Procedimentos/Produtos */}
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Procedimentos/Produtos</p>
          {itens.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-medium text-muted-2">
                    <th className="pb-2 pr-2 font-medium">Nome</th>
                    <th className="pb-2 px-2 font-medium w-16">Qtd.</th>
                    <th className="pb-2 px-2 font-medium w-28">Valor (R$)</th>
                    <th className="pb-2 px-2 font-medium w-32">Desconto un.</th>
                    <th className="pb-2 px-2 font-medium w-28 text-right">Total (R$)</th>
                    <th className="pb-2 pl-2 w-8" />
                  </tr>
                </thead>
                <tbody>
                  {itens.map((it, i) => (
                    <tr key={i} className="align-top">
                      <td className="py-1 pr-2">
                        <Select value={it.nome} onChange={(e) => selecionarNome(i, e.target.value)}>
                          <option value="">Pesquise/Selecione</option>
                          {itensOrcamento.map((c) => (
                            <option key={c.nome} value={c.nome}>
                              {c.nome}
                            </option>
                          ))}
                        </Select>
                      </td>
                      <td className="py-1 px-2">
                        <Input
                          type="number"
                          min={1}
                          value={it.qtd}
                          onChange={(e) => patchItem(i, { qtd: Math.max(1, Number(e.target.value) || 1) })}
                        />
                      </td>
                      <td className="py-1 px-2">
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={it.valor}
                          onChange={(e) => patchItem(i, { valor: Number(e.target.value) || 0 })}
                        />
                      </td>
                      <td className="py-1 px-2">
                        <div className="flex gap-1">
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            value={it.descontoUn}
                            onChange={(e) => patchItem(i, { descontoUn: Number(e.target.value) || 0 })}
                          />
                          <Select
                            value={it.descontoTipo}
                            onChange={(e) => patchItem(i, { descontoTipo: e.target.value as DescontoTipo })}
                            className="w-16"
                          >
                            <option value="R$">R$</option>
                            <option value="%">%</option>
                          </Select>
                        </div>
                      </td>
                      <td className="py-1 px-2 text-right font-medium tabular-nums text-foreground">
                        {brl(itemTotal(it))}
                      </td>
                      <td className="py-1 pl-2">
                        <button
                          onClick={() => removerLinha(i)}
                          aria-label="Remover item"
                          className="text-muted-2 transition-colors hover:text-danger"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <button
            onClick={addLinha}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
          >
            <Plus className="size-4" /> Adicionar Procedimentos/Produtos
          </button>
        </div>

        {/* Desconto */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
          <p className="text-sm font-medium text-foreground">Desconto</p>
          <div className="flex items-center gap-2">
            <Select
              value={descTipo}
              onChange={(e) => setDescTipo(e.target.value as DescontoGlobalTipo)}
              className="w-64"
            >
              <option value="none">Sem desconto ou uso de saldo</option>
              <option value="R$">Desconto em R$</option>
              <option value="%">Desconto em %</option>
            </Select>
            {descTipo !== "none" && (
              <Input
                type="number"
                min={0}
                step="0.01"
                value={descValor}
                onChange={(e) => setDescValor(Number(e.target.value) || 0)}
                className="w-28"
              />
            )}
          </div>
        </div>

        {/* Condições de pagamento */}
        <div className="border-t border-border pt-4">
          <p className="mb-2 text-sm font-medium text-foreground">Condições de pagamento</p>
          {condicoes.map((c, i) => (
            <div key={i} className="mb-2 flex items-center gap-2">
              <Select
                value={c.metodo}
                onChange={(e) =>
                  setCondicoes((prev) =>
                    prev.map((x, idx) => (idx === i ? { ...x, metodo: e.target.value } : x))
                  )
                }
              >
                {metodosPagamentoOrcamento.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </Select>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={c.valor}
                onChange={(e) =>
                  setCondicoes((prev) =>
                    prev.map((x, idx) => (idx === i ? { ...x, valor: Number(e.target.value) || 0 } : x))
                  )
                }
                className="w-32"
              />
              <button
                onClick={() => removerCondicao(i)}
                aria-label="Remover condição"
                className="text-muted-2 transition-colors hover:text-danger"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addCondicao}
            className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
          >
            <Plus className="size-4" /> Adicionar condição
          </button>
        </div>

        {/* Totais */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm text-muted-2">Subtotal {brl(subtotal)}</span>
          <span className="text-base font-semibold text-foreground">
            Valor total <span className="ml-2 tabular-nums">{brl(total)}</span>
          </span>
        </div>
      </div>
    </Modal>
  );
}
