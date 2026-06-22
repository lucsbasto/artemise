# Design: UI Core

## Estrutura de arquivos (`web/src`)

```
app/
  layout.tsx                 # html lang=pt-BR, fonte, monta <AppShell>
  page.tsx                   # Dashboard (/)
  agenda/page.tsx
  pacientes/page.tsx
  financeiro/page.tsx
lib/
  utils.ts                   # cn(), brl()  [pronto]
  mock.ts                    # TODA a mock data, tipada, valores exatos dos screenshots
components/
  ui/                        # primitives shadcn-style
    card.tsx                 # Card, CardHeader, CardTitle, CardContent + InfoDot (ⓘ)
    button.tsx               # cva variants: brand|ghost|outline
    badge.tsx
    tabs.tsx                 # tabs controladas simples (client)
    toggle.tsx               # switch on/off
    empty-state.tsx          # ícone alerta + "Não há nada aqui!"
  shell/
    app-shell.tsx            # client: estado sidebar colapsada; grid header+sidebar+main
    header.tsx
    icon-sidebar.tsx         # NAV_ITEMS[] com lucide icons + rota ativa via usePathname
    floating-widgets.tsx     # banner desconto + card progresso + FABs
  charts/
    cashflow-chart.tsx       # ComposedChart: Bar empilhado x2 + Line x2  (client)
    donut.tsx                # PieChart donut com número central
    mini-bars.tsx            # BarChart vertical simples
    heatmap.tsx              # grid CSS hora×dia (sem recharts)
  dashboard/                 # blocos compostos da tela inicial
    balance-card.tsx, next-appointments.tsx, reports-section.tsx ...
  agenda/week-grid.tsx
  pacientes/patients-table.tsx
  financeiro/*.tsx
```

## Decisões

- **Cores** via tokens CSS em `globals.css` (`--brand #7c3aed`, success/danger, etc.) [pronto]. Componentes usam classes `text-brand`, `bg-brand`, `text-success`...
- **Recharts client-only**: cada componente de gráfico tem `"use client"`. `<ResponsiveContainer>` para fluidez. Páginas permanecem Server Components; importam os charts diretamente (client boundary no próprio chart).
- **AppShell client** (precisa estado de colapso + usePathname). Páginas são Server Components renderizadas como children.
- **Sidebar ativa**: `usePathname()` casa prefixo da rota → destaque roxo.
- **Mock tipado** em `lib/mock.ts`: `cashflowDaily[]`, `balance`, `next24h[]`, `reports{...}`, `weekAppointments[]`, `patients[]`, `finance{kpis, contas, aReceber, aPagar, categorias}`. Valores idênticos aos screenshots (rastreabilidade com os spec docs).
- **Sem dark mode** nesta entrega (screenshots são light). Remover bloco prefers-color-scheme herdado.
- **Heatmap** = grid puro CSS/Tailwind (mais fiel e leve que recharts p/ esse caso).

## Reuso
`<Card>` genérico usado por todos os blocos. `<InfoDot>` (ⓘ) no header de cada card. `<EmptyState>` em aniversariantes. `brl()` em todo valor monetário.

## Mapa requisito → arquivo
| Req | Arquivo principal |
|---|---|
| R-SHELL-* | components/shell/* |
| R-DASH-* | app/page.tsx + components/dashboard/* + charts/* |
| R-AGE-* | app/agenda/page.tsx + components/agenda/week-grid.tsx |
| R-PAC-* | app/pacientes/page.tsx + components/pacientes/patients-table.tsx |
| R-FIN-* | app/financeiro/page.tsx + components/financeiro/* |
