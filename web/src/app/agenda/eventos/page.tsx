import { AgendaSubmenu } from "@/components/agenda/agenda-submenu";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { EventosCard } from "@/components/agenda/eventos-card";

export default function AgendaEventosPage() {
  return (
    <div className="flex h-full">
      <AgendaSubmenu />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1200px] p-5">
          <Breadcrumb items={["Agenda", "Sala de espera"]} />
          <div className="mt-4">
            <EventosCard />
          </div>
        </div>
      </div>
    </div>
  );
}
