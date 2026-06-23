"use client";
import * as React from "react";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  Plus,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import {
  procedimentos,
  currentUser,
  recorrenciasEvento,
  statusEventoOpcoes,
  weekDays,
} from "@/lib/mock";
import { useCollection, nextId } from "@/lib/data/create-collection";
import { eventosStore } from "@/lib/data/stores";

function parseHora(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 9) + (m ?? 0) / 60;
}

// Modal único compartilhado parametrizado por tipo (spec 06 §Visão geral da arquitetura).
type TipoEvento = "consultation" | "lock" | "reminder" | "promotion";

const TIPOS: { key: TipoEvento; label: string; titulo: string }[] = [
  { key: "consultation", label: "Agendamento", titulo: "Novo agendamento" },
  { key: "lock", label: "Bloqueio de horário", titulo: "Novo bloqueio de horário" },
  { key: "reminder", label: "Lembrete", titulo: "Novo lembrete" },
  { key: "promotion", label: "Evento", titulo: "Novo evento" },
];

type ItemLinha = { nome: string; qtd: number };

export function NovoEventoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tipo, setTipo] = React.useState<TipoEvento>("consultation");
  const [dataAberta, setDataAberta] = React.useState(true);
  const [financeiroAberto, setFinanceiroAberto] = React.useState(false);
  const [itens, setItens] = React.useState<ItemLinha[]>([{ nome: "", qtd: 1 }]);

  // Campos do formulário de agendamento
  const [paciente, setPaciente] = React.useState("");
  const [horaInicio, setHoraInicio] = React.useState("15:29");
  const [horaFim, setHoraFim] = React.useState("15:59");

  const { add } = useCollection(eventosStore);
  const meta = TIPOS.find((t) => t.key === tipo)!;

  function addItem() {
    setItens((prev) => [...prev, { nome: "", qtd: 1 }]);
  }
  function removeItem(i: number) {
    setItens((prev) => prev.filter((_, idx) => idx !== i));
  }
  function patchItem(i: number, patch: Partial<ItemLinha>) {
    setItens((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  function handleSalvar() {
    if (tipo === "consultation") {
      const hoje = weekDays.find((d) => d.hoje) ?? weekDays[0];
      const procedimento = itens[0]?.nome || "Consulta";
      add({
        id: nextId("ev"),
        dayNum: hoje.num,
        start: parseHora(horaInicio),
        end: parseHora(horaFim),
        paciente: paciente.trim() || "Novo agendamento",
        procedimento,
      });
    }
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={meta.titulo}
      size="lg"
      footer={
        <Button variant="brand" className="px-8" onClick={handleSalvar}>
          Salvar
        </Button>
      }
    >
      {/* Seletor de tipo (segmented) */}
      <Field label="Tipo" required>
        <div className="flex flex-wrap gap-2">
          {TIPOS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTipo(t.key)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                tipo === t.key
                  ? "border-brand bg-brand text-white"
                  : "border-border bg-surface text-muted hover:bg-background"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Field>

      <div className="mt-5 flex flex-col gap-4">
        {tipo === "consultation" && (
          <FormAgendamento
            itens={itens}
            addItem={addItem}
            removeItem={removeItem}
            patchItem={patchItem}
            dataAberta={dataAberta}
            setDataAberta={setDataAberta}
            financeiroAberto={financeiroAberto}
            setFinanceiroAberto={setFinanceiroAberto}
            paciente={paciente}
            setPaciente={setPaciente}
            horaInicio={horaInicio}
            setHoraInicio={setHoraInicio}
            horaFim={horaFim}
            setHoraFim={setHoraFim}
          />
        )}
        {tipo === "lock" && <FormBloqueio />}
        {tipo === "reminder" && <FormLembrete />}
        {tipo === "promotion" && <FormEvento />}
      </div>
    </Modal>
  );
}

/* ---------- Agendamento ---------- */
function FormAgendamento({
  itens,
  addItem,
  removeItem,
  patchItem,
  dataAberta,
  setDataAberta,
  financeiroAberto,
  setFinanceiroAberto,
  paciente,
  setPaciente,
  horaInicio,
  setHoraInicio,
  horaFim,
  setHoraFim,
}: {
  itens: ItemLinha[];
  addItem: () => void;
  removeItem: (i: number) => void;
  patchItem: (i: number, patch: Partial<ItemLinha>) => void;
  dataAberta: boolean;
  setDataAberta: (v: boolean) => void;
  financeiroAberto: boolean;
  setFinanceiroAberto: (v: boolean) => void;
  paciente: string;
  setPaciente: (v: string) => void;
  horaInicio: string;
  setHoraInicio: (v: string) => void;
  horaFim: string;
  setHoraFim: (v: string) => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">Dados básicos</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Paciente">
          <Input
            placeholder="Pesquise/Selecione"
            value={paciente}
            onChange={(e) => setPaciente(e.target.value)}
          />
        </Field>
        <Field label="Profissional" required>
          <Select defaultValue={currentUser.nome}>
            <option>{currentUser.nome}</option>
          </Select>
        </Field>
        <Field label="Status" required>
          <Select defaultValue="Agendado">
            {statusEventoOpcoes.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </Field>
        <Field label="Cor">
          <div className="flex h-9 items-center gap-2 rounded-lg border border-border px-3">
            <span className="size-4 rounded-full bg-brand" />
            <ChevronDown className="ml-auto size-4 text-muted-2" />
          </div>
        </Field>
      </div>
      <Field label="Observações">
        <Input placeholder="Digite" />
      </Field>

      {/* Procedimentos/Produtos */}
      <span className="mt-2 text-sm font-semibold text-foreground">Procedimentos/Produtos</span>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-[1fr_80px_36px] gap-2 text-xs font-medium text-muted-2">
          <span>Nome</span>
          <span>Qtd.</span>
          <span />
        </div>
        {itens.map((it, i) => (
          <div key={i} className="grid grid-cols-[1fr_80px_36px] items-center gap-2">
            <Select value={it.nome} onChange={(e) => patchItem(i, { nome: e.target.value })}>
              <option value="">Pesquise/Selecione</option>
              {procedimentos.map((p) => (
                <option key={p.id} value={p.nome}>
                  {p.nome}
                </option>
              ))}
            </Select>
            <Input
              type="number"
              min={1}
              value={it.qtd}
              onChange={(e) => patchItem(i, { qtd: Number(e.target.value) })}
            />
            <button
              onClick={() => removeItem(i)}
              className="grid size-9 place-items-center rounded-lg text-muted-2 hover:bg-background hover:text-danger"
              aria-label="Remover"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        <button
          onClick={addItem}
          className="inline-flex w-fit items-center gap-1 text-sm font-medium text-brand hover:underline"
        >
          <Plus className="size-4" /> Adicionar Procedimentos/Produtos
        </button>
      </div>

      {/* Data */}
      <Collapsible title="Data" open={dataAberta} onToggle={() => setDataAberta(!dataAberta)}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DataField />
          <Field label="Recorrência" required>
            <Select defaultValue="Não se repete">
              {recorrenciasEvento.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </Select>
          </Field>
          <TimeField label="Início" value={horaInicio} onChange={setHoraInicio} />
          <TimeField label="Fim" value={horaFim} onChange={setHoraFim} />
        </div>
        <Banner />
      </Collapsible>

      {/* Financeiro */}
      <Collapsible
        title="Financeiro"
        open={financeiroAberto}
        onToggle={() => setFinanceiroAberto(!financeiroAberto)}
        aside={<span className="text-sm text-muted">Comanda desabilitada</span>}
      >
        <p className="text-sm text-muted-2">
          Habilite a comanda para gerar lançamentos financeiros a partir dos itens.
        </p>
      </Collapsible>
    </>
  );
}

/* ---------- Bloqueio de horário ---------- */
function FormBloqueio() {
  return (
    <>
      <span className="text-sm font-semibold text-foreground">Dados básicos</span>
      <Field label="Título" required>
        <Input defaultValue="Bloqueio de horário" />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <Field label="Profissionais" required>
          <ChipMulti />
        </Field>
        <label className="flex items-center gap-2 pb-2 text-sm text-foreground">
          <Toggle /> Clínica toda
        </label>
      </div>
      <Field label="Observações">
        <textarea
          placeholder="Digite"
          rows={3}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none placeholder:text-muted-2 focus:border-brand"
        />
      </Field>
      <SecaoDataIntervalo comDiaInteiro />
    </>
  );
}

/* ---------- Lembrete ---------- */
function FormLembrete() {
  return (
    <>
      <span className="text-sm font-semibold text-foreground">Dados básicos</span>
      <Field label="Título" required>
        <Input placeholder="Lembrete" />
      </Field>
      <Field label="Participantes" required>
        <ChipMulti />
      </Field>
      <Field label="Observações">
        <textarea
          placeholder="Digite"
          rows={3}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none placeholder:text-muted-2 focus:border-brand"
        />
      </Field>
      {/* Data — lembrete tem só "Hora" (instante único) */}
      <div className="mt-2 border-t border-border pt-4">
        <span className="text-sm font-semibold text-foreground">Data</span>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DataField />
          <TimeField label="Hora" defaultValue="15:29" />
          <Field label="Recorrência" required>
            <Select defaultValue="Não se repete">
              {recorrenciasEvento.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </Select>
          </Field>
          <label className="flex items-center gap-2 pb-2 text-sm text-foreground sm:self-end">
            <Toggle /> Dia inteiro
          </label>
        </div>
      </div>
    </>
  );
}

/* ---------- Evento / promoção ---------- */
function FormEvento() {
  return (
    <>
      <span className="text-sm font-semibold text-foreground">Dados básicos</span>
      <Field label="Título do evento" required>
        <Input placeholder="Digite" />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DataField label="Data de início" />
        <TimeField label="Hora de início" defaultValue="15:29" />
        <DataField label="Data de fim" />
        <TimeField label="Hora de fim" defaultValue="15:59" />
      </div>
      <Field label="Profissionais">
        <ChipMulti />
      </Field>
      <Field label="Procedimentos">
        <Select defaultValue="">
          <option value="">Pesquise/Selecione</option>
          {procedimentos.map((p) => (
            <option key={p.id} value={p.nome}>
              {p.nome}
            </option>
          ))}
        </Select>
      </Field>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <Toggle /> Permitir agendamentos de outros procedimentos nesta data
      </label>
    </>
  );
}

/* ---------- helpers ---------- */
function DataField({ label = "Dia" }: { label?: string }) {
  return (
    <Field label={label} required>
      <div className="relative">
        <Input defaultValue="22/06/2026" />
        <Calendar className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
      </div>
    </Field>
  );
}

function TimeField({
  label,
  defaultValue,
  value,
  onChange,
}: {
  label: string;
  defaultValue?: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <Field label={label} required>
      <div className="relative">
        {value !== undefined ? (
          <Input value={value} onChange={(e) => onChange?.(e.target.value)} />
        ) : (
          <Input defaultValue={defaultValue} />
        )}
        <Clock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
      </div>
    </Field>
  );
}

function ChipMulti() {
  return (
    <div className="flex h-9 items-center gap-2 rounded-lg border border-border px-2">
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand">
        {currentUser.nome}
        <X className="size-3" />
      </span>
      <ChevronDown className="ml-auto size-4 text-muted-2" />
    </div>
  );
}

function Banner() {
  return (
    <div className="mt-3 flex gap-2 rounded-lg border-l-4 border-warning bg-amber-50 px-3 py-2 text-xs text-amber-700">
      <AlertTriangle className="size-4 shrink-0" />
      <span>
        A notificação de <strong>Lembrete de agendamento (E-mail)</strong> não será enviada pois o
        tempo de antecedência configurado é maior que o tempo disponível até o agendamento.
      </span>
    </div>
  );
}

function Collapsible({
  title,
  open,
  onToggle,
  aside,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-2 border-t border-border pt-4">
      <div className="flex items-center justify-between">
        <button onClick={onToggle} className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          {title}
          {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>
        {aside}
      </div>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

function SecaoDataIntervalo({ comDiaInteiro }: { comDiaInteiro?: boolean }) {
  return (
    <div className="mt-2 border-t border-border pt-4">
      <span className="text-sm font-semibold text-foreground">Data</span>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DataField />
        <Field label="Recorrência" required>
          <Select defaultValue="Não se repete">
            {recorrenciasEvento.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </Select>
        </Field>
        <TimeField label="Início" defaultValue="15:29" />
        <TimeField label="Fim" defaultValue="15:59" />
      </div>
      {comDiaInteiro && (
        <label className="mt-3 flex items-center gap-2 text-sm text-foreground">
          <Toggle /> Dia inteiro
        </label>
      )}
    </div>
  );
}
