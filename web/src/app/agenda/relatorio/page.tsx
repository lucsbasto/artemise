import { AgendaSubmenu } from "@/components/agenda/agenda-submenu";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { RelatorioTable } from "@/components/agenda/relatorio-table";
import { agendaRelatorioRows, agendaStatusTabs, agendaPeriodo } from "@/lib/mock";

export default function AgendaRelatorioPage() {
  return (
    <div className="flex h-full">
      <AgendaSubmenu />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1200px] p-5">
          <Breadcrumb items={["Agenda", "Relatório de agendamentos"]} />
          <div className="mt-4">
            <RelatorioTable
              rows={agendaRelatorioRows}
              periodo={agendaPeriodo}
              statusTabs={agendaStatusTabs}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
