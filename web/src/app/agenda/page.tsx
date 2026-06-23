"use client";
import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WeekGrid } from "@/components/agenda/week-grid";
import { AgendaSubmenu } from "@/components/agenda/agenda-submenu";
import { NovoEventoModal } from "@/components/agenda/novo-evento-modal";
import { EventoDrawer } from "@/components/agenda/evento-drawer";

export default function AgendaPage() {
  const [modalAberto, setModalAberto] = React.useState(false);
  const [drawerAberto, setDrawerAberto] = React.useState(false);

  return (
    <div className="flex h-full">
      <AgendaSubmenu />

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
            {/* Novo agendamento */}
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setModalAberto(true)}>
              <Plus className="size-4" />
              Novo agendamento
            </Button>

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
          <WeekGrid onEventClick={() => setDrawerAberto(true)} />
        </div>
      </div>

      <NovoEventoModal open={modalAberto} onClose={() => setModalAberto(false)} />
      <EventoDrawer open={drawerAberto} onClose={() => setDrawerAberto(false)} />
    </div>
  );
}
