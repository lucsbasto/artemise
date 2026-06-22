import { Landmark, Wallet, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { TextTabs } from "@/components/ui/tabs";
import { CashflowChart, CashflowLegend } from "@/components/charts/cashflow-chart";
import { CategoriasCard } from "@/components/financeiro/categorias-card";
import { brl } from "@/lib/utils";
import {
  financeKpis,
  financeCashflow,
  contasFinanceiras,
  aReceber,
  aPagar,
  periodoFinanceiro,
} from "@/lib/mock";

export default function FinanceiroPage() {
  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Financeiro", "Visão geral"]} />

      {/* ── Bloco de Filtros ─────────────────────────────────────────── */}
      <Card className="mt-4">
        <CardContent className="pt-5">
          {/* Header linha: título + indicador + limpar */}
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-semibold text-foreground">Filtros</span>
            <span className="text-sm text-muted">1 filtro aplicado</span>
            <button className="ml-auto text-sm text-brand hover:underline">
              Limpar filtros
            </button>
          </div>
          {/* Chips linha */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {/* Chip pílula */}
            <span className="flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm text-foreground">
              <span className="mr-1 text-muted">Período:</span>
              {periodoFinanceiro}
            </span>
            {/* Adicionar filtro */}
            <button className="flex items-center gap-1 text-sm text-brand hover:underline">
              <Plus className="size-3.5" />
              Adicionar filtro
            </button>
          </div>
        </CardContent>
      </Card>

      {/* ── 4 KPIs em linha ─────────────────────────────────────────── */}
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {financeKpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-5">
              <p className="text-sm text-muted">{kpi.label}</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {brl(kpi.valor, { decimals: false })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Grid 2 colunas: Fluxo de caixa + Contas financeiras ─────── */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr]">
        {/* Fluxo de caixa */}
        <Card>
          <CardHeader>
            <CardTitle info>Fluxo de caixa</CardTitle>
            <TextTabs tabs={["Diária", "Semanal", "Mensal", "Anual"]} initial="Diária" />
          </CardHeader>
          <CardContent>
            <CashflowChart data={financeCashflow} />
            <CashflowLegend />
          </CardContent>
        </Card>

        {/* Contas financeiras */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Contas financeiras</CardTitle>
            <button className="text-sm text-brand hover:underline">Ver todas</button>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <ul className="flex-1 divide-y divide-border">
              {contasFinanceiras.itens.map((item) => (
                <li key={item.nome} className="flex items-center gap-3 py-3">
                  {/* Ícone */}
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-background text-muted">
                    {item.icon === "bank" ? (
                      <Landmark className="size-4" />
                    ) : (
                      <Wallet className="size-4" />
                    )}
                  </span>
                  {/* Nome + subtipo */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{item.nome}</p>
                    <p className="truncate text-xs text-muted">{item.sub}</p>
                  </div>
                  {/* Saldo */}
                  <span className="shrink-0 text-sm font-medium text-foreground">
                    {brl(item.saldo)}
                  </span>
                </li>
              ))}
            </ul>
            {/* Saldo total */}
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm text-muted">Saldo total:</span>
              <span className="text-sm font-bold text-foreground">
                {brl(contasFinanceiras.saldoTotal)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Grid 3 colunas: A receber + A pagar + Categorias ─────────── */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* A receber */}
        <Card>
          <CardHeader>
            <CardTitle>A receber</CardTitle>
            <button className="text-sm text-brand hover:underline">Ver todas</button>
          </CardHeader>
          <CardContent className="pt-2">
            <ul className="space-y-2.5">
              {aReceber.map((item) => (
                <li key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted">{item.label}</span>
                  <span className="font-medium text-success">{brl(item.valor)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* A pagar */}
        <Card>
          <CardHeader>
            <CardTitle>A pagar</CardTitle>
            <button className="text-sm text-brand hover:underline">Ver todas</button>
          </CardHeader>
          <CardContent className="pt-2">
            <ul className="space-y-2.5">
              {aPagar.map((item) => (
                <li key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted">{item.label}</span>
                  <span className="font-medium text-danger">{brl(item.valor)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Categorias — client component (toggle Receita/Despesa) */}
        <CategoriasCard />
      </div>
    </div>
  );
}
