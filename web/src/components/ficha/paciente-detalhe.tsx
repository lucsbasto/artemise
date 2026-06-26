"use client";
import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Pencil,
  MessageCircle,
  CalendarClock,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { idadeFrom } from "@/lib/mock";
import { useCollection } from "@/lib/data/create-collection";
import { pacientesStore, eventosStore } from "@/lib/data/stores";
import { PacienteModal, type NovoPaciente } from "@/components/pacientes/paciente-modal";

// Dia de referência do mock (today = 23/06/2026): separa passado x futuro.
const HOJE_DAYNUM = 23;

function horaLabel(h: number) {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

/** Par rótulo/valor numa grade de informações. `—` quando vazio. */
function Linha({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-2">{label}</span>
      <span className="text-sm text-foreground">{value || "—"}</span>
    </div>
  );
}

function EventoLinha({
  procedimento,
  dia,
  inicio,
  fim,
  tone,
}: {
  procedimento: string;
  dia: number;
  inicio: number;
  fim: number;
  tone: "done" | "upcoming";
}) {
  return (
    <li className="flex items-center gap-3 border-b border-border py-3 last:border-b-0">
      <span
        className={
          tone === "done"
            ? "grid size-8 shrink-0 place-items-center rounded-full bg-green-50 text-green-600"
            : "grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand"
        }
      >
        {tone === "done" ? (
          <CheckCircle2 className="size-4" />
        ) : (
          <CalendarClock className="size-4" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{procedimento}</p>
        <p className="text-xs text-muted">
          {String(dia).padStart(2, "0")}/06/2026 • {horaLabel(inicio)}–{horaLabel(fim)}
        </p>
      </div>
    </li>
  );
}

export function PacienteDetalhe() {
  const params = useParams<{ id: string }>();
  const { items, update } = useCollection(pacientesStore);
  const { items: eventos } = useCollection(eventosStore);
  const [editOpen, setEditOpen] = React.useState(false);

  const p = items.find((x) => x.id === params.id) ?? items[0];

  if (!p) {
    return (
      <div className="py-10 text-center text-sm text-muted-2">
        Paciente não encontrado.{" "}
        <Link href="/pacientes" className="text-brand hover:underline">
          Voltar
        </Link>
      </div>
    );
  }

  const idade = idadeFrom(p.dataNascimento);
  const nascimento = p.dataNascimento
    ? `${p.dataNascimento}${idade != null ? ` (${idade} anos)` : ""}`
    : "";

  const meus = eventos.filter((e) => e.paciente === p.nome);
  const realizados = meus
    .filter((e) => e.dayNum < HOJE_DAYNUM)
    .sort((a, b) => b.dayNum - a.dayNum || b.start - a.start);
  const futuros = meus
    .filter((e) => e.dayNum >= HOJE_DAYNUM)
    .sort((a, b) => a.dayNum - b.dayNum || a.start - b.start);

  function salvar(data: NovoPaciente) {
    update(p!.id, data);
    setEditOpen(false);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Informações pessoais ───────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Informações pessoais</CardTitle>
          <button
            onClick={() => setEditOpen(true)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
          >
            <Pencil className="size-4" /> Editar informações
          </button>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Linha label="Nome completo" value={p.nome} />
          <Linha label="Nascimento" value={nascimento} />
          <Linha label="Sexo" value={p.sexo} />
          <Linha label="CPF" value={p.cpf} />
          <Linha label="Cadastrado em" value={p.criadoEm} />
          <Linha label="Observações" value={p.observacoes} />
        </CardContent>
      </Card>

      {/* ── Contato ────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Contato</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Linha
            label="Telefone"
            value={
              <span className="inline-flex items-center gap-1.5">
                {p.identificador}
                <MessageCircle className="size-4 text-green-500" />
              </span>
            }
          />
          <Linha label="Email" value={p.email} />
          <Linha
            label="Notificações"
            value={p.recebeNotificacoes ? "Recebe notificações" : "Não recebe notificações"}
          />
        </CardContent>
      </Card>

      {/* ── Endereço ───────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Endereço</CardTitle>
        </CardHeader>
        <CardContent>
          <Linha label="Endereço completo" value={p.endereco} />
        </CardContent>
      </Card>

      {/* ── Próximos agendamentos ──────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="gap-2">
            <CalendarClock className="size-4 text-brand" />
            Próximos agendamentos
            <span className="font-normal text-muted">({futuros.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          {futuros.length === 0 ? (
            <p className="text-sm text-muted">Nenhum agendamento futuro.</p>
          ) : (
            <ul>
              {futuros.map((e) => (
                <EventoLinha
                  key={e.id}
                  procedimento={e.procedimento}
                  dia={e.dayNum}
                  inicio={e.start}
                  fim={e.end}
                  tone="upcoming"
                />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* ── Procedimentos realizados ───────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="gap-2">
            <CheckCircle2 className="size-4 text-green-600" />
            Procedimentos realizados
            <span className="font-normal text-muted">({realizados.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          {realizados.length === 0 ? (
            <p className="text-sm text-muted">Nenhum procedimento realizado.</p>
          ) : (
            <ul>
              {realizados.map((e) => (
                <EventoLinha
                  key={e.id}
                  procedimento={e.procedimento}
                  dia={e.dayNum}
                  inicio={e.start}
                  fim={e.end}
                  tone="done"
                />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <PacienteModal
        key={`${p.id}-${editOpen}`}
        open={editOpen}
        paciente={p}
        onClose={() => setEditOpen(false)}
        onSave={salvar}
      />
    </div>
  );
}
