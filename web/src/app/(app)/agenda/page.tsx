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

  // Abre o drawer de detalhe quando chega de /dashboard com ?detalhe=... (leitura única da URL no mount).
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura única de sistema externo (URL) no mount
    if (params.get("detalhe")) setDrawerAberto(true);
  }, []);

  // FAB global (canto inferior direito) dispara a criação de evento.
  React.useEffect(() => {
    const onCreate = () => setModalAberto(true);
    window.addEventListener("artemise:criar", onCreate);
    return () => window.removeEventListener("artemise:criar", onCreate);
  }, []);

  return (
    <div className="flex h-full flex-col md:flex-row">
      <AgendaSubmenu />

      {/* Área principal */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
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
          <WeekGrid
            onEventClick={() => setDrawerAberto(true)}
            onSlotClick={() => setModalAberto(true)}
          />
        </div>
      </div>

      <NovoEventoModal open={modalAberto} onClose={() => setModalAberto(false)} />
      <EventoDrawer open={drawerAberto} onClose={() => setDrawerAberto(false)} />
    </div>
  );
}
