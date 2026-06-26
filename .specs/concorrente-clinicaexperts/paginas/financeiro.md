# Financeiro — Visão geral (dashboard)

**Rota:** `/financeiro/inicio` (alias `/financeiro` → redireciona p/ `/financeiro/inicio`)
**Tipo:** Dashboard
**Screenshot:** `financeiro.png`

## Propósito

Painel central do módulo financeiro: visão consolidada de receitas, despesas, a receber, a pagar, fluxo de caixa, saldo de contas e categorias, com filtro de período.

## Mapa do módulo (sub-rotas que existem de fato)

| Rota | Página | Doc |
|---|---|---|
| `/financeiro/inicio` | Dashboard / Visão geral | este arquivo |
| `/financeiro/contas-a-receber` | Contas a receber (listagem + form Nova receita) | `financeiro-contas-receber.md` |
| `/financeiro/contas-a-pagar` | Contas a pagar (listagem + form Nova despesa) | `financeiro-contas-pagar.md` |
| `/financeiro/contas/` | Contas financeiras (bancos/caixa/cofre) | `financeiro-contas.md` |
| `/financeiro/dre` | DRE — Demonstrativo de Resultado do Exercício | `financeiro-dre.md` |

> **Não existem** páginas standalone de Fluxo de caixa, Lançamentos, Categorias, Conciliação, Transferências, Plano de contas, Centro de custo. Rotas inventadas (`/financeiro/fluxo`, `/financeiro/transferencias`, `/financeiro/conciliacao`, etc.) redirecionam para `/clinica/inicio`. Fluxo de caixa e Categorias aparecem apenas como **widgets** dentro do dashboard.

## Layout do dashboard

Filtro no topo: **Período** (default últimos 30 dias, ex.: 26/05/2026–25/06/2026) · **Adicionar filtro** (+) · **Limpar filtros**. O período propaga via query `?interval=<ini>&interval=<fim>`.

### Cards de resumo (topo)
- **Receitas** (verde, valor positivo) · **Despesas** (negativo) · **A receber** · **A pagar** (negativo).

### Widget "Fluxo de caixa"
- Gráfico de barras + linha. Abas de granularidade: **Diária · Semanal · Mensal · Anual**.
- Séries: **Entradas · Entradas previstas · Saídas · Saídas previstas · Saldo · Saldo previsto** (realizado vs. previsto).

### Widget "Contas financeiras"
- Lista de contas (ex.: *Banco padrão / Conta Corrente* R$ 2.431,00; *Caixa / Caixa* R$ 0,00) + **Saldo total**. Link **Ver todas** → `/financeiro/contas/`.

### Widget "A receber"
- Atalhos com valores: **Inadimplência**, **Para hoje**, **Para este mês**, **Para este ano**, **Recebidos no mês**, **Recebidos no ano**. Cada um deep-linka para `/financeiro/contas-a-receber?status=<late|all|received>&interval=...`. **Ver todas** → contas-a-receber.

### Widget "A pagar"
- Atalhos: **Em atraso**, **Para hoje**, **Para este mês/ano**, **Pagos no mês/ano** → `/financeiro/contas-a-pagar?status=<late|all|paid>&interval=...`.

### Widget "Categorias"
- Toggle **Receita / Despesa**; breakdown de valores por categoria no período (gráfico/lista).

## Observações para o Artemise
- Dashboard financeiro orientado a **realizado vs. previsto** (entradas/saídas previstas no fluxo) — bom para projeção de caixa.
- Status como query param (`status=late|all|received|paid`) torna cada KPI um link navegável já filtrado — ótimo padrão de UX (KPI clicável → lista filtrada).
- Período único propagado por todo o módulo via `?interval=` (2 valores: início e fim).
