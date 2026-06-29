import { redirect } from "next/navigation";
import { AgendaSubmenu } from "@/components/agenda/agenda-submenu";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { RelatorioTable } from "@/components/agenda/relatorio-table";
import { createClient } from "@/lib/supabase/server";
import type { AgendaRow, AgendaStatus } from "@/lib/mock";

type AgendaRelatorio = {
  rows: AgendaRow[];
  periodo: string;
  statusTabs: { label: AgendaStatus | "Todos"; total: number }[];
};

export default async function AgendaRelatorioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // TODO(M7): listar/filtrar eventos_agenda no front (paginação client-side).
  const data: AgendaRelatorio = { rows: [], periodo: "", statusTabs: [] };
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
