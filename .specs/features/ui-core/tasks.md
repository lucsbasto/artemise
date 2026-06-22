# Tasks: UI Core  — STATUS: ✅ todas concluídas (build + lint verdes)

Legenda: [P] = paralelizável. Gate de cada task: `npm run build` continua passando ou ao menos `tsc`/import resolve.

- **T1 — Fundação** (sem deps)
  - lib/utils.ts (cn, brl) ✅ feito · lib/mock.ts (todos os mocks tipados) · globals.css tokens ✅ feito
  - Done when: mock.ts exporta todas as estruturas; sem erro de tipo.

- **T2 — UI primitives** [P] (dep: T1)
  - ui/card.tsx, ui/button.tsx, ui/badge.tsx, ui/tabs.tsx, ui/toggle.tsx, ui/empty-state.tsx
  - Done when: cada primitive importável, estilizado shadcn-style.

- **T3 — Charts** [P] (dep: T1)
  - charts/cashflow-chart.tsx, charts/donut.tsx, charts/mini-bars.tsx, charts/heatmap.tsx
  - Done when: renderizam com mock; "use client"; sem warning de SSR.

- **T4 — Shell** (dep: T2)
  - shell/header.tsx, shell/icon-sidebar.tsx, shell/floating-widgets.tsx, shell/app-shell.tsx
  - layout.tsx (lang=pt-BR, fonte, monta AppShell) · metadata título "Clínica Experts"
  - Done when: shell renderiza, sidebar navega, item ativo destaca. R-SHELL-1..4.

- **T5 — Dashboard** (dep: T2,T3,T4)
  - app/page.tsx + components/dashboard/* (fluxo caixa, filtros, balanço, agend. 24h, aniversariantes, relatórios)
  - Done when: tela fiel a 01-inicio. R-DASH-1..5.

- **T6 — Agenda** [P] (dep: T2,T4)
  - app/agenda/page.tsx + components/agenda/week-grid.tsx (submenu, controles, grade semanal, now-line, card evento)
  - Done when: fiel a 02-agenda. R-AGE-1..3.

- **T7 — Pacientes** [P] (dep: T2,T4)
  - app/pacientes/page.tsx + components/pacientes/patients-table.tsx
  - Done when: fiel a 07-pacientes. R-PAC-1..4.

- **T8 — Financeiro** [P] (dep: T2,T3,T4)
  - app/financeiro/page.tsx + components/financeiro/* (filtros, 4 KPIs, fluxo+contas, a receber/a pagar/categorias)
  - Done when: fiel a 12-financeiro. R-FIN-1..4.

- **T9 — Verificação** (dep: T5-T8)
  - `npm run build` + `npm run lint`. Corrigir erros. Smoke nas 4 rotas.
  - Done when: build verde, lint limpo, 4 rotas OK.

## Ordem de execução
T1 → (T2,T3 ∥) → T4 → T5 → (T6,T7,T8 ∥) → T9.
T6/T7/T8 delegáveis a sub-agents em paralelo após T4 pronto.
```
