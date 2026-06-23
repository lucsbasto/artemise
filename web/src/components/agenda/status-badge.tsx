import {
  Calendar,
  CalendarCheck,
  CircleCheck,
  CircleX,
  UserX,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgendaStatus } from "@/lib/mock";

// Paleta semântica do enum de status (spec §5.7 / §11.2):
// Agendado=roxo, Confirmado=azul, Não compareceu=cinza, Concluído=verde, Cancelado=vermelho.
const STATUS: Record<AgendaStatus, { dot: string; badge: string; icon: LucideIcon }> = {
  Agendado: { dot: "bg-brand", badge: "bg-brand-50 text-brand", icon: Calendar },
  Confirmado: { dot: "bg-blue-500", badge: "bg-blue-50 text-blue-600", icon: CalendarCheck },
  "Não compareceu": { dot: "bg-gray-400", badge: "bg-gray-100 text-gray-500", icon: UserX },
  Concluído: { dot: "bg-green-500", badge: "bg-green-50 text-success", icon: CircleCheck },
  Cancelado: { dot: "bg-red-500", badge: "bg-red-50 text-danger", icon: CircleX },
};

export function statusDot(status: AgendaStatus) {
  return STATUS[status].dot;
}

export function statusIcon(status: AgendaStatus) {
  return STATUS[status].icon;
}

/** Pílula colorida ícone + texto (relatório, drawer). */
export function AgendaStatusBadge({ status }: { status: AgendaStatus }) {
  const { badge, icon: Icon } = STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        badge
      )}
    >
      <Icon className="size-3.5" strokeWidth={2} />
      {status}
    </span>
  );
}
