import {
  Gift,
  Heart,
  CalendarPlus,
  Calendar,
  CalendarX,
  ClipboardList,
  Clock,
  CheckCircle,
  FileText,
} from "lucide-react";
import type { ModeloMensagem } from "@/lib/mock";

const ICONS: Record<ModeloMensagem["icone"], React.ElementType> = {
  gift: Gift,
  heart: Heart,
  "calendar-plus": CalendarPlus,
  calendar: Calendar,
  "calendar-x": CalendarX,
  "clipboard-question": ClipboardList,
  clock: Clock,
  "check-circle": CheckCircle,
  "file-text": FileText,
};

export function CardModeloMensagem({ modelo }: { modelo: ModeloMensagem }) {
  const Icon = ICONS[modelo.icone];
  return (
    <article
      aria-label={modelo.titulo}
      className="flex flex-col items-center rounded-[var(--radius-card)] border border-border bg-surface p-6 text-center shadow-sm"
    >
      <span className="grid size-14 place-items-center rounded-full border border-brand-100 text-brand">
        <Icon className="size-7" strokeWidth={1.75} />
      </span>
      <h3 className="mt-4 text-base font-semibold text-foreground">{modelo.titulo}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-2">{modelo.descricao}</p>

      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {modelo.canais.map((c) => (
          <span
            key={c}
            className="rounded-full bg-background px-2.5 py-0.5 text-xs font-medium text-muted"
          >
            {c}
          </span>
        ))}
      </div>

      <button className="mt-5 inline-flex h-9 w-full items-center justify-center rounded-lg bg-brand px-4 text-sm font-medium text-white hover:bg-brand-600">
        Personalizar
      </button>
    </article>
  );
}
