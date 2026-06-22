import { ChevronLeft, ChevronRight, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WeekGrid } from "@/components/agenda/week-grid";
import { cn } from "@/lib/utils";

const subMenuItems = [
  { label: "Agenda", ativo: true, href: "/agenda" },
  { label: "Visão geral", ativo: false, href: "/agenda/visao-geral" },
  { label: "Relatório de agendamentos", ativo: false, href: "/agenda/relatorio" },
  { label: "Eventos", ativo: false, href: "/agenda/eventos" },
];

export default function AgendaPage() {
  return (
    <div className="flex h-full">
      {/* Submenu lateral do módulo */}
      <aside className="w-52 shrink-0 border-r border-border bg-surface py-4">
        <nav className="flex flex-col gap-0.5 px-2">
          {subMenuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                item.ativo
                  ? "bg-brand-50 text-brand"
                  : "text-muted hover:bg-background hover:text-foreground"
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Área principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Barra de controles */}
        <div className="flex items-center gap-2 border-b border-border bg-surface px-5 py-3">
          {/* Lado esquerdo: Hoje + setas + rótulo */}
          <Button variant="outline" size="sm">
            Hoje
          </Button>
          <button className="grid size-8 place-items-center rounded-lg border border-border bg-surface text-muted hover:bg-background transition-colors">
            <ChevronLeft className="size-4" />
          </button>
          <button className="grid size-8 place-items-center rounded-lg border border-border bg-surface text-muted hover:bg-background transition-colors">
            <ChevronRight className="size-4" />
          </button>
          <span className="text-sm font-medium text-foreground">
            21 - 27 de jun. de 2026
          </span>

          {/* Lado direito */}
          <div className="ml-auto flex items-center gap-2">
            {/* Seletor de visualização */}
            <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-sm font-medium text-foreground hover:bg-background transition-colors">
              Semana
              <ChevronDown className="size-4 text-muted-2" />
            </button>

            {/* CTA Pedir à Mara */}
            <Button variant="brand" size="md" className="gap-1.5">
              <Sparkles className="size-4" />
              Pedir à Mara
            </Button>
          </div>
        </div>

        {/* Grade semanal */}
        <div className="flex flex-1 flex-col overflow-hidden bg-surface">
          <WeekGrid />
        </div>
      </div>
    </div>
  );
}
