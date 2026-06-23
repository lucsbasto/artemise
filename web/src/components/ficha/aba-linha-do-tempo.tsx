import { Check, DollarSign } from "lucide-react";
import { brl, cn } from "@/lib/utils";
import { timelineEvents, type TimelineEvent } from "@/lib/mock";

function EventIcon({ tipo }: { tipo: TimelineEvent["tipo"] }) {
  if (tipo === "titulo_criado") {
    return (
      <span className="grid size-8 place-items-center rounded-full bg-brand-100/50 text-brand">
        <DollarSign className="size-4" />
      </span>
    );
  }
  return (
    <span className="grid size-8 place-items-center rounded-full bg-green-50 text-green-600">
      <Check className="size-4" strokeWidth={2.5} />
    </span>
  );
}

export function AbaLinhaDoTempo() {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-sm">
      <h2 className="text-base font-semibold text-foreground">Linha do tempo</h2>

      <button className="mt-1 text-sm font-medium text-brand hover:underline">
        + Adicionar filtro
      </button>

      <ol className="mt-4">
        {timelineEvents.map((ev, i) => (
          <li
            key={ev.id}
            className={cn(
              "flex items-start gap-3 py-3",
              i !== timelineEvents.length - 1 && "border-b border-border"
            )}
          >
            <EventIcon tipo={ev.tipo} />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{ev.titulo}</p>
              <p className="text-xs text-muted-2">{ev.quando}</p>
              {ev.valor != null && (
                <p className="mt-0.5 inline-flex items-center gap-1 text-sm font-medium text-foreground">
                  <DollarSign className="size-3.5 text-green-500" />
                  {brl(ev.valor)}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
