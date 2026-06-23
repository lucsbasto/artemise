"use client";
import {
  X,
  Calendar,
  User,
  MessageCircle,
  Stethoscope,
  DollarSign,
  MessageSquare,
  Pencil,
  Copy,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgendaStatusBadge } from "@/components/agenda/status-badge";
import { brl } from "@/lib/utils";
import { eventoDetalhe } from "@/lib/mock";

// Drawer lateral "Detalhes do evento" (spec 06 §Modal — Detalhes do evento).
export function EventoDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  const d = eventoDetalhe;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-md flex-col bg-surface shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Detalhes do evento"
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">Detalhes do evento</h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="text-muted-2 transition-colors hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* corpo */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-4 text-sm">
            <Row icon={<Calendar className="size-4 text-brand" />}>
              <div>
                <p className="font-medium text-foreground">{d.tipo}</p>
                <p className="text-muted-2">{d.dataHora}</p>
              </div>
            </Row>

            <Row icon={<User className="size-4 text-muted-2" />}>
              <span className="inline-flex items-center gap-2">
                <Avatar iniciais={d.iniciais} />
                {d.profissional}
              </span>
            </Row>

            <Row icon={<User className="size-4 text-muted-2" />}>
              <span className="inline-flex items-center gap-2">
                <Avatar />
                {d.paciente}
                <MessageCircle className="size-4 text-green-500" />
              </span>
            </Row>

            <Row icon={<Stethoscope className="size-4 text-muted-2" />}>
              <AgendaStatusBadge status={d.status} />
            </Row>

            <Row icon={<Stethoscope className="size-4 text-muted-2" />}>
              <span className="flex w-full items-center justify-between">
                <span className="text-foreground">{d.procedimento}</span>
                <span className="font-medium text-foreground">{brl(d.valor)}</span>
              </span>
            </Row>

            <Row icon={<DollarSign className="size-4 text-muted-2" />}>
              <span className="text-muted">{d.recebimento}</span>
            </Row>

            <Row icon={<MessageSquare className="size-4 text-muted-2" />}>
              <span className="text-muted">{d.observacao}</span>
            </Row>
          </div>

          {/* ações de texto */}
          <div className="mt-6 flex items-center gap-5 text-sm">
            <TextAction icon={<Pencil className="size-4" />}>Editar</TextAction>
            <TextAction icon={<Copy className="size-4" />}>Duplicar</TextAction>
            <TextAction icon={<Trash2 className="size-4" />}>Excluir</TextAction>
          </div>

          {/* botões largura total */}
          <div className="mt-5 flex flex-col gap-2">
            <button className="h-10 rounded-lg bg-brand-50 text-sm font-medium text-brand hover:brightness-95">
              Editar consumo de material
            </button>
            <button className="h-10 rounded-lg bg-blue-50 text-sm font-medium text-blue-600 hover:brightness-95">
              Enviar formulário de pré atendimento
            </button>
          </div>
        </div>

        {/* rodapé */}
        <div className="flex gap-2 border-t border-border px-6 py-4">
          <Button variant="brand" className="flex-1">
            Iniciar atendimento
          </Button>
          <Button variant="brand" className="flex-1">
            Iniciar comanda
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="flex-1 text-foreground">{children}</div>
    </div>
  );
}

function Avatar({ iniciais }: { iniciais?: string }) {
  return (
    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-50 text-[10px] font-semibold text-brand">
      {iniciais ?? ""}
    </span>
  );
}

function TextAction({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button className="inline-flex items-center gap-1.5 text-muted hover:text-foreground">
      {icon}
      {children}
    </button>
  );
}
