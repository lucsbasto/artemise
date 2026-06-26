import { ArrowDown, X } from "lucide-react";
import { AgendaSubmenu } from "@/components/agenda/agenda-submenu";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { TextTabs } from "@/components/ui/tabs";
import { MiniBars } from "@/components/charts/mini-bars";
import { Heatmap } from "@/components/charts/heatmap";
import { PeriodChart, PeriodLegend } from "@/components/agenda/period-chart";
import { statusDot } from "@/components/agenda/status-badge";
import { cn } from "@/lib/utils";
import {
  agendaPeriodo,
  agendaKpis,
  agendaPorPeriodo,
  agendaMedia,
  agendaPorStatus,
  agendaPacientesFreq,
  agendaProcedimentosFreq,
  agendaOciosidadeSala,
  agendaOciosidadeProf,
  agendaDiasMovimentados,
  agendaHorarios,
  agendaHorarioAtivo,
  type RankItem,
} from "@/lib/mock";

export default function AgendaVisaoGeralPage() {
  return (
    <div className="flex h-full flex-col md:flex-row">
      <AgendaSubmenu />
      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1200px] p-5">
          <Breadcrumb items={["Agenda", "Visão geral"]} />

          {/* Filtros */}
          <Card className="mt-4">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold text-foreground">Filtros</span>
                <span className="text-sm text-muted">1 filtro aplicado</span>
                <button className="ml-auto text-sm text-brand hover:underline">
                  Limpar filtros
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-sm text-foreground">
                  Período: {agendaPeriodo}
                  <X className="size-3.5 text-muted-2" />
                </span>
                <button className="text-sm font-medium text-brand hover:underline">
                  + Adicionar filtro
                </button>
              </div>
            </CardContent>
          </Card>

          {/* KPIs */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {agendaKpis.map((kpi) => (
              <Card key={kpi.label}>
                <CardContent className="pt-5">
                  <p className="text-sm text-muted">{kpi.label}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-2xl font-semibold text-foreground">{kpi.valor}</span>
                    {kpi.delta && (
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
                          kpi.deltaUp ? "bg-red-50 text-danger" : "bg-green-50 text-success"
                        )}
                      >
                        <ArrowDown className={cn("size-3", kpi.deltaUp && "rotate-180")} />
                        {kpi.delta}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gráfico por período + por status */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Agendamentos por período</CardTitle>
                <TextTabs tabs={["Diária", "Semanal", "Mensal", "Anual"]} />
              </CardHeader>
              <CardContent>
                <PeriodChart data={agendaPorPeriodo} media={agendaMedia} />
                <PeriodLegend />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agendamentos por status</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {agendaPorStatus.map((s) => (
                  <div key={s.status} className="flex items-center gap-2 text-sm">
                    <span className={cn("size-2.5 shrink-0 rounded-full", statusDot(s.status))} />
                    <span className="text-foreground">{s.status}</span>
                    <span className="ml-auto text-muted-2">{s.total}</span>
                    <span className="w-10 text-right font-medium text-foreground">{s.pct}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Rankings */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <RankCard title="Pacientes mais frequentes" items={agendaPacientesFreq} />
            <RankCard title="Ociosidade por sala" items={agendaOciosidadeSala} />
            <RankCard title="Ociosidade por profissional" items={agendaOciosidadeProf} />
            <RankCard title="Procedimentos mais frequentes" items={agendaProcedimentosFreq} />
          </div>

          {/* Gráficos inferiores */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Agendamentos por profissional</CardTitle>
              </CardHeader>
              <CardContent>
                <MiniBars data={[{ label: "LB", valor: 1 }]} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle info>Dias mais movimentados</CardTitle>
              </CardHeader>
              <CardContent>
                <MiniBars data={agendaDiasMovimentados} showY />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle info>Horários mais movimentados</CardTitle>
              </CardHeader>
              <CardContent>
                <Heatmap rows={agendaHorarios} active={agendaHorarioAtivo} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function RankCard({ title, items }: { title: string; items: RankItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
        <button className="text-xs text-brand hover:underline">ver mais</button>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState subtitle="Nenhuma venda encontrada para os filtros selecionados" />
        ) : (
          <ul className="flex flex-col gap-2.5">
            {items.map((it, i) => (
              <li key={it.nome} className="flex items-center gap-2 text-sm">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-semibold text-brand">
                  {i + 1}
                </span>
                <span className="truncate text-foreground">{it.nome}</span>
                <span className="ml-auto shrink-0 text-muted-2">{it.total}</span>
                <span className="w-10 shrink-0 text-right font-medium text-foreground">
                  {it.pct}%
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
