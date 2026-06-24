"use client";
import { useParams } from "next/navigation";
import {
  User,
  Cake,
  VenusAndMars,
  Mail,
  Phone,
  Bell,
  MapPin,
  IdCard,
  FileText,
  Clock,
  Pencil,
  MessageCircle,
  CalendarClock,
  CheckCircle2,
} from "lucide-react";
import { idadeFrom } from "@/lib/mock";
import { useCollection } from "@/lib/data/create-collection";
import { pacientesStore, eventosStore } from "@/lib/data/stores";

// Dia de referência do mock (today = 23/06/2026): separa passado x futuro.
const HOJE_DAYNUM = 23;

function horaLabel(h: number) {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-border py-4 last:border-b-0">
      <span className="mt-0.5 text-muted-2">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-muted">{label}</p>
        <div className="mt-0.5 text-sm text-foreground">{children}</div>
      </div>
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

export function AbaInformacoes() {
  const params = useParams<{ id: string }>();
  const { items } = useCollection(pacientesStore);
  const { items: eventos } = useCollection(eventosStore);
  const p = items.find((x) => x.id === params.id) ?? items[0];

  if (!p) {
    return (
      <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5 text-sm text-muted shadow-sm">
        Paciente não encontrado.
      </div>
    );
  }

  const idade = idadeFrom(p.dataNascimento);
  const meus = eventos.filter((e) => e.paciente === p.nome);
  const realizados = meus
    .filter((e) => e.dayNum < HOJE_DAYNUM)
    .sort((a, b) => b.dayNum - a.dayNum || b.start - a.start);
  const futuros = meus
    .filter((e) => e.dayNum >= HOJE_DAYNUM)
    .sort((a, b) => a.dayNum - b.dayNum || a.start - b.start);

  return (
    <div className="flex flex-col gap-4">
      {/* ── Informações pessoais ───────────────────────────── */}
      <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-sm">
        <h2 className="text-base font-semibold text-foreground">Informações</h2>

        <div className="mt-2">
          <Row icon={<User className="size-4" />} label="Nome completo">{p.nome}</Row>
          <Row icon={<Cake className="size-4" />} label="Data de nascimento">
            {p.dataNascimento ? `${p.dataNascimento}${idade != null ? ` (${idade} anos)` : ""}` : "—"}
          </Row>
          <Row icon={<VenusAndMars className="size-4" />} label="Sexo">{p.sexo || "—"}</Row>
          <Row icon={<Mail className="size-4" />} label="Email">{p.email || "—"}</Row>
          <Row icon={<Phone className="size-4" />} label="Telefone">
            <span className="inline-flex items-center gap-1.5">
              {p.identificador}
              <MessageCircle className="size-4 text-green-500" />
            </span>
          </Row>
          <Row icon={<Bell className="size-4" />} label="Notificações">
            {p.recebeNotificacoes ? "Recebe notificações" : "Não recebe notificações"}
          </Row>
          <Row icon={<MapPin className="size-4" />} label="Endereço">{p.endereco || "—"}</Row>
          <Row icon={<IdCard className="size-4" />} label="CPF">{p.cpf || "—"}</Row>
          <Row icon={<FileText className="size-4" />} label="Observações">{p.observacoes || "—"}</Row>
          <Row icon={<Clock className="size-4" />} label="Cadastrado em">{p.criadoEm || "—"}</Row>
        </div>

        <button className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline">
          <Pencil className="size-4" /> Editar informações
        </button>
      </div>

      {/* ── Próximos agendamentos ──────────────────────────── */}
      <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <CalendarClock className="size-4 text-brand" />
          <h2 className="text-base font-semibold text-foreground">Próximos agendamentos</h2>
          <span className="text-sm text-muted">({futuros.length})</span>
        </div>
        {futuros.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Nenhum agendamento futuro.</p>
        ) : (
          <ul className="mt-2">
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
      </div>

      {/* ── Procedimentos realizados ───────────────────────── */}
      <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 text-green-600" />
          <h2 className="text-base font-semibold text-foreground">Procedimentos realizados</h2>
          <span className="text-sm text-muted">({realizados.length})</span>
        </div>
        {realizados.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Nenhum procedimento realizado.</p>
        ) : (
          <ul className="mt-2">
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
      </div>
    </div>
  );
}
