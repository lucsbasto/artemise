import { ChevronLeft, ChevronRight, User, ClipboardList, Clock, LayoutGrid } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, InfoDot } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { TextTabs, IconTabs } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { CashflowChart, CashflowLegend } from "@/components/charts/cashflow-chart";
import { Donut } from "@/components/charts/donut";
import { MiniBars, SingleBar } from "@/components/charts/mini-bars";
import { Heatmap } from "@/components/charts/heatmap";
import { BalancoCard } from "@/components/inicio/balanco-card";
import { Next24hCard } from "@/components/inicio/next24h-card";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  dashboardBalance,
  dashboardCashflow,
  dashboardNext24h,
  dashboardReports,
  dashboardKPIs,
  type EventoSource,
  type RegistroSource,
} from "@/lib/dashboard-calc";
import {
  startOfMonth,
  endOfMonth,
  toISODate,
  type LancamentoSource,
} from "@/lib/financeiro-calc";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const now = new Date();
  const inicio = startOfMonth(now);
  const fim = endOfMonth(now);
  const hojeInicio = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const hojeFim = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
  const em24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const [lancRes, eventosMesRes, next24hRes, registrosRes, pacientesRes, eventosHojeRes] =
    await Promise.all([
      supabase
        .from("lancamentos_financeiros")
        .select("tipo, situacao, valor, vencimento")
        .gte("vencimento", toISODate(inicio))
        .lte("vencimento", toISODate(fim)),
      supabase
        .from("eventos_agenda")
        .select("profissional, procedimento, inicio, status")
        .gte("inicio", inicio.toISOString())
        .lte("inicio", fim.toISOString()),
      supabase
        .from("eventos_agenda")
        .select("paciente, procedimento, inicio, fim, status")
        .gte("inicio", now.toISOString())
        .lte("inicio", em24h.toISOString())
        .neq("status", "Cancelado")
        .order("inicio", { ascending: true })
        .limit(10),
      supabase
        .from("registros_procedimento")
        .select("pacienteId:paciente_id, status, data")
        .gte("data", toISODate(inicio))
        .lte("data", toISODate(fim)),
      supabase.from("pacientes").select("id", { count: "exact", head: true }),
      supabase
        .from("eventos_agenda")
        .select("id", { count: "exact", head: true })
        .gte("inicio", hojeInicio.toISOString())
        .lte("inicio", hojeFim.toISOString()),
    ]);

  const lancamentosMes = (lancRes.data ?? []) as LancamentoSource[];
  const eventosMes = (eventosMesRes.data ?? []) as EventoSource[];
  const registrosMes = (registrosRes.data ?? []) as RegistroSource[];
  const totalPacientes = pacientesRes.count ?? 0;

  const balance = dashboardBalance(lancamentosMes, inicio, fim);
  const cashflowDaily = dashboardCashflow(lancamentosMes);
  const next24h = dashboardNext24h((next24hRes.data ?? []) as EventoSource[]);
  const kpis = dashboardKPIs({
    totalPacientes,
    eventosHoje: eventosHojeRes.count ?? 0,
    lancamentosMes,
    registrosMes,
  });
  const reports = dashboardReports(eventosMes, cashflowDaily, kpis.totalPacientes);
  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Clínica", "Início"]} />

      {/* Topo: fluxo de caixa + filtros/balanço */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle info>Fluxo de caixa</CardTitle>
            <TextTabs tabs={["Diária", "Semanal", "Mensal", "Anual"]} />
          </CardHeader>
          <CardContent>
            <CashflowChart data={cashflowDaily} />
            <CashflowLegend />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-1 text-xs text-muted-2">Período</p>
              <div className="flex items-center justify-between rounded-lg border border-border px-2 py-2">
                <button className="grid size-6 place-items-center rounded text-muted hover:bg-background">
                  <ChevronLeft className="size-4" />
                </button>
                <span className="text-sm text-foreground">{balance.periodo}</span>
                <button className="grid size-6 place-items-center rounded text-muted hover:bg-background">
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </CardContent>
          </Card>

          <BalancoCard balance={balance} />
        </div>
      </div>

      {/* Meio: agendamentos 24h + aniversariantes */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Next24hCard items={next24h} />

        <Card>
          <CardHeader>
            <CardTitle>Próximos aniversariantes</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState subtitle="Nenhum aniversariante em junho" />
          </CardContent>
        </Card>
      </div>

      {/* Relatórios */}
      <div className="mt-6">
        <div className="mb-3 flex items-center gap-6">
          <h2 className="flex items-center gap-1.5 text-base font-semibold text-foreground">
            Relatórios <InfoDot />
          </h2>
          <IconTabs
            icons={[
              <User key="u" className="size-[18px]" />,
              <ClipboardList key="c" className="size-[18px]" />,
              <Clock key="t" className="size-[18px]" />,
              <LayoutGrid key="g" className="size-[18px]" />,
            ]}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader><CardTitle info>Agendamentos por profissional</CardTitle></CardHeader>
            <CardContent><SingleBar label="LB" value={1} /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle info>Dias mais movimentados</CardTitle></CardHeader>
            <CardContent>
              <MiniBars data={reports.diasMovimentados.map((d) => ({ label: d.dia, valor: d.total }))} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle info>Horários mais movimentados</CardTitle></CardHeader>
            <CardContent><Heatmap rows={reports.horarios} active={reports.heatAtivo} /></CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle info>Status por agendamento</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center">
              <Donut color="#4ade80" centerValue={reports.statusAgendamento.total} centerLabel={reports.statusAgendamento.label} />
              <p className="mt-2 text-xs text-muted-2">{reports.statusAgendamento.legenda}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle info>Pacientes por sexo</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center">
              <Donut color="#fbbf24" centerValue={reports.pacientesPorSexo.total} centerLabel={reports.pacientesPorSexo.label} />
              <p className="mt-2 text-xs text-muted-2">{reports.pacientesPorSexo.legenda}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle info>Faturamento comparado</CardTitle></CardHeader>
            <CardContent>
              <MiniBars
                data={reports.faturamentoComparado.map((f) => ({ label: f.label, valor: f.valor }))}
                showY
                highlightLast
                yFormat="currency-k"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
