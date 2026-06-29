import { redirect } from "next/navigation";
import { AgendaSubmenu } from "@/components/agenda/agenda-submenu";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { RelatorioTable } from "@/components/agenda/relatorio-table";
import { createClient } from "@/lib/supabase/server";
import { agendaRelatorio, type EventoSource } from "@/lib/agenda-calc";
import { startOfMonth, endOfMonth } from "@/lib/financeiro-calc";

export default async function AgendaRelatorioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const now = new Date();
  const inicio = startOfMonth(now);
  const fim = endOfMonth(now);

  const { data: eventos } = await supabase
    .from("eventos_agenda")
    .select("paciente, profissional, procedimento, inicio, fim, status")
    .gte("inicio", inicio.toISOString())
    .lte("inicio", fim.toISOString())
    .order("inicio", { ascending: false });

  const data = agendaRelatorio((eventos ?? []) as EventoSource[], inicio, fim);
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
