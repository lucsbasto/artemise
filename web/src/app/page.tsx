import { ChevronLeft, ChevronRight, EyeOff, ExternalLink, User, ClipboardList, Clock, LayoutGrid } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, InfoDot } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { TextTabs, IconTabs } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { CashflowChart, CashflowLegend } from "@/components/charts/cashflow-chart";
import { Donut } from "@/components/charts/donut";
import { MiniBars, SingleBar } from "@/components/charts/mini-bars";
import { Heatmap } from "@/components/charts/heatmap";
import { brl } from "@/lib/utils";
import { cashflowDaily, balance, next24h, reports } from "@/lib/mock";

export default function DashboardPage() {
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

          <Card>
            <CardHeader>
              <CardTitle info>Balanço</CardTitle>
              <EyeOff className="size-4 text-brand" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xl font-semibold text-success">{brl(balance.saldoRealizado)}</p>
                <p className="text-xs text-muted-2">de {brl(balance.saldoPrevisto)} previstos</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="flex items-center gap-1 text-sm text-muted">
                    Entradas: <ExternalLink className="size-3 text-brand" />
                  </p>
                  <p className="font-semibold text-success">{brl(balance.entradasRealizadas)}</p>
                  <p className="text-xs text-muted-2">de {brl(balance.entradasPrevistas)} previsto</p>
                </div>
                <div>
                  <p className="flex items-center gap-1 text-sm text-muted">
                    Saídas: <ExternalLink className="size-3 text-brand" />
                  </p>
                  <p className="font-semibold text-danger">{brl(balance.saidasRealizadas)}</p>
                  <p className="text-xs text-muted-2">de {brl(balance.saidasPrevistas)} previsto</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Meio: agendamentos 24h + aniversariantes */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Agendamentos das próximas 24h</CardTitle>
          </CardHeader>
          <CardContent>
            {next24h.map((a) => (
              <div key={a.paciente} className="rounded-lg border-l-4 border-brand bg-brand-50/50 px-3 py-2">
                <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <span className="size-1.5 rounded-full bg-brand" />
                  {a.paciente}
                </p>
                <p className="text-sm text-muted">{a.procedimento}</p>
                <p className="text-xs text-muted-2">{a.horario}</p>
              </div>
            ))}
          </CardContent>
        </Card>

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
                yFormatter={(v) => (v >= 1000 ? `R$ ${v / 1000}k` : `R$ ${v}`)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
