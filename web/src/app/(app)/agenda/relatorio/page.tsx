import { AgendaSubmenu } from "@/components/agenda/agenda-submenu";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { RelatorioTable } from "@/components/agenda/relatorio-table";
import { loadServer } from "@/lib/data/server-load";
import type { AgendaRow, AgendaStatus } from "@/lib/mock";

type AgendaRelatorio = {
  rows: AgendaRow[];
  periodo: string;
  statusTabs: { label: AgendaStatus | "Todos"; total: number }[];
};

export default async function AgendaRelatorioPage() {
  const data = await loadServer<AgendaRelatorio>("/agenda/relatorio");
  return (
    <div className="flex h-full flex-col md:flex-row">
      <AgendaSubmenu />
      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1200px] p-5">
          <Breadcrumb items={["Agenda", "Relatório de agendamentos"]} />
          <div className="mt-4">
            <RelatorioTable
              rows={data.rows}
              periodo={data.periodo}
              statusTabs={data.statusTabs}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
