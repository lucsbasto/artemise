"use client";
import * as React from "react";
import { MapPin } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCollection } from "@/lib/data/create-collection";
import { procedimentosStore, profissionaisDetalheStore } from "@/lib/data/stores";
import { SaldoInsuficienteError } from "@/lib/data/registros";
import {
  statusRegistroProcLabel,
  type FichaInjetaveis,
  type RegistroProcedimento,
  type StatusRegistroProc,
} from "@/lib/mock";
import { MapaInjetaveisModal } from "./mapa-injetaveis-modal";

type RegistroData = Omit<RegistroProcedimento, "id" | "pacienteId">;

interface Props {
  open: boolean;
  onClose: () => void;
  /** Pode ser assíncrono (RPC de estoque). Lança em erro p/ o modal exibir. */
  onSave: (data: RegistroData) => void | Promise<void>;
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
  const [mapa, setMapa] = React.useState<FichaInjetaveis | undefined>(registro?.mapa);
  const [mapaOpen, setMapaOpen] = React.useState(false);
  const [erro, setErro] = React.useState<string | null>(null);
  const [salvando, setSalvando] = React.useState(false);

  // Procedimento injetável (catálogo) → habilita o caminho do mapa.
  const usaMapa = !!ativos.find((p) => p.nome === procedimento)?.usaMapa;

  // Ao escolher procedimento do catálogo, sugere o valor de venda.
  function handleProcedimento(nome: string) {
    setProcedimento(nome);
    if (nome) setProcError(false);
    const match = ativos.find((p) => p.nome === nome);
    if (match && valor === "") setValor(String(match.valor));
  }

  async function handleSalvar() {
    const hasProcError = procedimento.trim() === "";
    setProcError(hasProcError);
    if (hasProcError) return;
    setErro(null);
    setSalvando(true);
    try {
      await onSave({
        procedimento: procedimento.trim(),
        profissional: profissional.trim(),
        data: data.trim(),
        status,
        valor: Number(valor) || 0,
        observacoes: observacoes.trim(),
        usaMapa,
        mapa: usaMapa ? mapa : undefined,
      });
      onClose();
    } catch (e) {
      setErro(
        e instanceof SaldoInsuficienteError
          ? e.message
          : "Não foi possível salvar o procedimento. Tente novamente."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Editar Procedimento" : "Registrar Procedimento"}
      size="lg"
      footer={
        <Button variant="brand" onClick={handleSalvar} disabled={salvando}>
          {salvando ? "Salvando…" : "Salvar"}
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        {erro && (
          <p className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
            {erro}
          </p>
        )}

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

        {usaMapa && (
          <div className="flex items-center justify-between rounded-lg border border-brand/30 bg-brand-50/50 px-4 py-3">
            <div className="text-sm">
              <p className="font-medium text-foreground">Mapa de injetáveis</p>
              <p className="text-xs text-muted-2">
                {mapa?.pontos.length
                  ? `${mapa.pontos.length} aplicação(ões) marcada(s).`
                  : "Marque produto e local da aplicação no rosto."}
              </p>
            </div>
            <Button variant="outline" onClick={() => setMapaOpen(true)}>
              <MapPin className="size-4" /> Abrir mapa
            </Button>
          </div>
        )}

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

        {usaMapa && mapaOpen && (
          <MapaInjetaveisModal
            key={`mapa-${registro?.id ?? "new"}`}
            open={mapaOpen}
            onClose={() => setMapaOpen(false)}
            titulo={`Mapa de injetáveis — ${procedimento || "Novo procedimento"}`}
            valor={mapa}
            onSave={setMapa}
          />
        )}
      </div>
    </Modal>
  );
}
