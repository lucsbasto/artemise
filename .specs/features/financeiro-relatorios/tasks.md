# Financeiro — Relatórios & Cadastros (lote 4) — Tasks

**Design**: `.specs/features/financeiro-relatorios/design.md`
**Status**: Draft

**Test posture**: projeto sem test runner (sem `test` script, zero `*.test.*`) — igual lotes 1–3.
`Tests: none` em todas as tasks. **Gate** padrão: `cd web && npm run build && npm run lint`.
`financeiro-calc.ts` é puro (testável em isolado), mas sem suíte nesta fase.

---

## Execution Plan

### Phase 1 — Foundation (Sequential)

```
T1 (mock) ─┬─ T2 (calc)
           ├─ T3 (FinanceKpiCards refactor)
           └─ T4 (submenu + layout + sidebar match)
```
T1 primeiro (todos consomem o mock). T2/T3/T4 podem começar assim que T1 fechar
(arquivos distintos), mas trato como foundation sequencial leve.

### Phase 2 — Telas (Parallel após Foundation)

```
            ┌── T5  Extrato            (dep T1,T3)
            ├── T6  Competência        (dep T1,T3)
            ├── T7  Métodos pagto      (dep T1)
Foundation ─┼── T8  Contas financeiras (dep T1,T2)
            ├── T9  Categorias contas  (dep T1)
            ├── T10 Comissões          (dep T1)
            ├── T11 FluxoCaixaView+Table(dep T1,T2) ──► T12 páginas fluxo (dia+mês)
            └── T14 Relatório categorias(dep T1,T2)
```

### Phase 3 — Integração (Sequential)

```
T5…T14 ──► T15 (build+lint+smoke 9 rotas + STATE)
```

---

## Task Breakdown

### T1: Mock data + types financeiro
**What**: Adicionar tipos e consts de mock das 9 telas em `lib/mock.ts` (valores exatos dos screenshots).
**Where**: `web/src/lib/mock.ts` (modify)
**Depends on**: None
**Reuses**: `FinanceKpi`, `FinanceStatus`, `CashflowPoint`, `contasFinanceiras`, `categoriasReceita`, `financeCashflow`, `cashflowDaily` já existentes.
**Requirement**: FIN-14 (+ dados de FIN-01…09)
**Tools**: MCP NONE · Skill NONE
**Done when**:
- [ ] Tipos: `ExtratoRow/ExtratoData`, `CompetenciaRow/CompetenciaData`, `FluxoRow`, `CategoriaReportNode`, `ContaFinanceira`, `CategoriaConta`, `MetodoPagamento`, `Comissao` (conforme design).
- [ ] Consts: `extrato`, `competencia`, `fluxoCaixaMensal`, `receitasReport`, `despesasReport`, `categoriasContas`, `metodosPagamento` (8 linhas exatas), `comissoes` (vazio), `periodoComissoes`.
- [ ] Métodos de pagamento = 8 linhas exatas (Boleto…Transferência) com `ativo` correto.
- [ ] Gate: `npm run build && npm run lint` limpo.
**Tests**: none · **Gate**: build
**Commit**: `feat(mock): dados financeiro lote 4 (extrato, competência, fluxo, categorias, métodos)`

---

### T2: lib/financeiro-calc.ts (funções puras)
**What**: Criar funções de cálculo puras p/ encadeamento de saldo, percentual e somas.
**Where**: `web/src/lib/financeiro-calc.ts` (new)
**Depends on**: T1
**Reuses**: padrão de `lib/pacote-calc.ts`; tipos `CashflowPoint`, `FluxoRow`, `ContaFinanceira`, `CategoriaReportNode`.
**Requirement**: FIN-14
**Tools**: MCP NONE · Skill NONE
**Done when**:
- [ ] `fluxoRows(points, saldoInicial): FluxoRow[]` — final = inicial+entrada−saída; inicial[n+1]=final[n]; lucro=entrada−saída.
- [ ] `percentual(valor, total): number` — retorna 0 quando total=0.
- [ ] `somaSaldos(contas): number`.
- [ ] `totalNode(node): number` — soma filhos ou valor próprio.
- [ ] Funções puras (sem side-effect / sem import de React).
- [ ] Gate limpo.
**Tests**: none (puro; sem runner) · **Gate**: build
**Commit**: `feat(lib): financeiro-calc — encadeamento de saldo, percentual, somas`

---

### T3: Extrair FinanceKpiCards de FinanceTable
**What**: Mover a faixa de KPI-cards p/ `finance-kpi-cards.tsx`; `FinanceTable` importa o novo componente (API pública inalterada).
**Where**: `web/src/components/financeiro/finance-kpi-cards.tsx` (new) + `finance-table.tsx` (modify)
**Depends on**: T1
**Reuses**: markup de KPI atual em `finance-table.tsx`.
**Requirement**: FIN-15 (parcial)
**Tools**: MCP NONE · Skill NONE
**Done when**:
- [ ] `FinanceKpiCards({ kpis, total? })` renderiza a faixa idêntica à atual.
- [ ] `FinanceTable` usa `FinanceKpiCards`; props de `FinanceTable` inalteradas.
- [ ] **Regressão**: `/contas-a-receber` e `/contas-a-pagar` renderizam iguais (smoke visual).
- [ ] Gate limpo.
**Tests**: none · **Gate**: build
**Commit**: `refactor(financeiro): extrai FinanceKpiCards de FinanceTable`

---

### T4: Submenu Financeiro + layout + sidebar match
**What**: Criar `FinanceiroSubmenu` (12 itens) e `app/financeiro/layout.tsx`; ajustar `IconSidebar` p/ `match:"/financeiro"`.
**Where**: `web/src/components/financeiro/financeiro-submenu.tsx` (new), `web/src/app/financeiro/layout.tsx` (new), `web/src/components/shell/icon-sidebar.tsx` (modify)
**Depends on**: T1
**Reuses**: `EstoqueSubmenu`, `app/estoque/layout.tsx`.
**Requirement**: FIN-13
**Tools**: MCP NONE · Skill NONE
**Done when**:
- [ ] Submenu lista 12 itens na ordem do design; rota ativa destacada (`usePathname` + startsWith).
- [ ] `/financeiro` (Visão geral, tela 12) renderiza dentro do layout c/ submenu, sem regressão.
- [ ] Sidebar destaca Financeiro em qualquer `/financeiro/*`.
- [ ] Gate limpo.
**Tests**: none · **Gate**: build
**Commit**: `feat(financeiro): submenu lateral + layout do módulo`

---

### T5: Tela Extrato de movimentação (15) [P]
**What**: `ExtratoView` + `ExtratoTable` + página.
**Where**: `components/financeiro/extrato-view.tsx`, `extrato-table.tsx`, `app/financeiro/extrato-de-movimentacao/page.tsx` (new)
**Depends on**: T1, T3
**Reuses**: `FinanceKpiCards`, `StatusBadge`, `ListShell`, `brl`, lucide (ícone método).
**Requirement**: FIN-01
**Tools**: MCP NONE · Skill NONE
**Done when**:
- [ ] 5 KPI-cards com valores do mock; "Total do período" azul ativo.
- [ ] Colunas Vencimento·Execução·Descrição·Categoria·Método(ícone)·Situação(`StatusBadge`)·Valor líquido.
- [ ] Linha "Em atraso" com realce de borda esquerda vermelha.
- [ ] Breadcrumb `Financeiro / Extrato de movimentação`; rota abre.
- [ ] Gate limpo.
**Tests**: none · **Gate**: build
**Commit**: `feat(financeiro): tela extrato de movimentação (15)`

---

### T6: Tela Relatório de competência (16) [P]
**What**: `CompetenciaView` + `CompetenciaTable` + página.
**Where**: `components/financeiro/competencia-view.tsx`, `competencia-table.tsx`, `app/financeiro/relatorio-de-competencia/page.tsx` (new)
**Depends on**: T1, T3
**Reuses**: `FinanceKpiCards`, `ListShell`, `brl`.
**Requirement**: FIN-02
**Tools**: MCP NONE · Skill NONE
**Done when**:
- [ ] 3 KPI-cards (Receitas/Despesas/Total).
- [ ] Colunas Competência·Descrição·Contato·Valor bruto·Valor líquido; despesa vermelha c/ sinal; rodapé total.
- [ ] Seletor de mês ‹ Junho de 2026 › (visual); breadcrumb correto.
- [ ] Gate limpo.
**Tests**: none · **Gate**: build
**Commit**: `feat(financeiro): tela relatório de competência (16)`

---

### T7: Tela Métodos de pagamento (22) + modal [P]
**What**: `MetodosPagamentoView` + `MetodoModal` + página.
**Where**: `components/financeiro/metodos-pagamento-view.tsx`, `metodo-modal.tsx`, `app/financeiro/metodos-de-pagamento/page.tsx` (new)
**Depends on**: T1
**Reuses**: `ListShell`, `Toggle`, `Modal`, `Field/Input/Select`.
**Requirement**: FIN-03, FIN-11
**Tools**: MCP NONE · Skill NONE
**Done when**:
- [ ] Tabela 8 linhas, colunas Descrição·Tipo·Marca/Bandeira·Ativo(toggle)·Ações; ⋮ esmaecido quando inativo.
- [ ] FAB/⋮ abre `MetodoModal` (Descrição\*/Tipo/Marca/Ativo); fecha sem persistir; valida Descrição.
- [ ] Gate limpo.
**Tests**: none · **Gate**: build
**Commit**: `feat(financeiro): métodos de pagamento + modal (22)`

---

### T8: Tela Contas financeiras (20) + modal [P]
**What**: `ContasFinanceirasView` + `ContaModal` + página.
**Where**: `components/financeiro/contas-financeiras-view.tsx`, `conta-modal.tsx`, `app/financeiro/contas/page.tsx` (new)
**Depends on**: T1, T2
**Reuses**: `Card*`, `Modal`, `Field`, `brl`, `financeiro-calc.somaSaldos`, mock `contasFinanceiras`.
**Requirement**: FIN-04, FIN-10
**Tools**: MCP NONE · Skill NONE
**Done when**:
- [ ] Grid de cards (ícone·nome·Tipo·Saldo Atual·⋮) + card "Saldo total" = `somaSaldos` (R$ 2.431,00).
- [ ] FAB/⋮ abre `ContaModal` (Nome\*/Tipo/Saldo inicial); fecha sem persistir; valida Nome.
- [ ] Gate limpo.
**Tests**: none · **Gate**: build
**Commit**: `feat(financeiro): contas financeiras + modal (20)`

---

### T9: Tela Categorias de contas (21) + modal [P]
**What**: `CategoriasContasView` (tree) + `CategoriaContaModal` + página.
**Where**: `components/financeiro/categorias-contas-view.tsx`, `categoria-conta-modal.tsx`, `app/financeiro/categorias-de-contas/page.tsx` (new)
**Depends on**: T1
**Reuses**: `ListShell`, `Toggle`, `Modal`, `Field/Select`.
**Requirement**: FIN-05, FIN-12, FIN-16
**Tools**: MCP NONE · Skill NONE
**Done when**:
- [ ] Colunas Descrição·Status(toggle)·Ações; pai ▾ expansível → subcategorias indentadas + "+ Adicionar subcategoria".
- [ ] Expand/collapse via `useState<Set>`.
- [ ] FAB/⋮ abre `CategoriaContaModal` (Descrição\*/Tipo/Categoria pai/Ativo); fecha sem persistir.
- [ ] Gate limpo.
**Tests**: none · **Gate**: build
**Commit**: `feat(financeiro): categorias de contas (tree) + modal (21)`

---

### T10: Tela Comissões em aberto (23) [P]
**What**: `ComissoesView` + página (estado vazio fiel).
**Where**: `components/financeiro/comissoes-view.tsx`, `app/financeiro/comissoes-em-aberto/page.tsx` (new)
**Depends on**: T1
**Reuses**: `ListShell`, `EmptyState`, `brl`.
**Requirement**: FIN-06
**Tools**: MCP NONE · Skill NONE
**Done when**:
- [ ] Chip "Período: 23/05/2026 - 22/06/2026"; estrutura de colunas definida (vazia).
- [ ] `EmptyState` "Hmm, está vazio por aqui!" + linha "Total do período (…)" R$ 0,00.
- [ ] Gate limpo.
**Tests**: none · **Gate**: build
**Commit**: `feat(financeiro): comissões em aberto (23, estado vazio)`

---

### T11: FluxoCaixaView + FluxoCaixaTable (componente 17/18) [P]
**What**: Componente compartilhado parametrizado por granularidade (chart + tabela).
**Where**: `components/financeiro/fluxo-caixa-view.tsx`, `fluxo-caixa-table.tsx` (new)
**Depends on**: T1, T2
**Reuses**: `charts/CashflowChart`, `CashflowLegend`, `brl`, `financeiro-calc.fluxoRows`.
**Requirement**: FIN-07, FIN-08, FIN-15
**Tools**: MCP NONE · Skill NONE
**Done when**:
- [ ] `FluxoCaixaView({ granularidade, points, rows })` renderiza `CashflowChart` + tabela.
- [ ] Colunas {Dia|Mês}·Saldo inicial·Entrada·Saída·Lucro/Prejuizo·Saldo final (grafia "Prejuizo").
- [ ] Lucro negativo vermelho / positivo verde; saldo encadeado via `fluxoRows`.
- [ ] Gate limpo.
**Tests**: none · **Gate**: build
**Commit**: `feat(financeiro): FluxoCaixaView+Table (chart combo + encadeamento)`

---

### T12: Páginas Fluxo de caixa diário + mensal (17, 18)
**What**: 2 páginas finas consumindo `FluxoCaixaView` (dia: `cashflowDaily`; mês: `fluxoCaixaMensal`).
**Where**: `app/financeiro/fluxo-de-caixa-diario/page.tsx`, `app/financeiro/fluxo-de-caixa-mensal/page.tsx` (new)
**Depends on**: T11
**Reuses**: `FluxoCaixaView`, `Breadcrumb`, mock.
**Requirement**: FIN-07, FIN-08
**Tools**: MCP NONE · Skill NONE
**Done when**:
- [ ] Diário: eixo X dias 1–30 Jun; tabela 30 linhas; Jun encadeando.
- [ ] Mensal: eixo X Jan–Dez; tabela 12 linhas; Jun Entrada 6.320 / Saída 3.889; Jul→Dez encadeado.
- [ ] Breadcrumbs corretos; rotas abrem.
- [ ] Gate limpo.
**Tests**: none · **Gate**: build
**Commit**: `feat(financeiro): páginas fluxo de caixa diário e mensal (17, 18)`

---

### T14: Tela Relatório de categorias (19) [P]
**What**: `RelatorioCategoriasView` + `CategoriaReportTable` (tree + %) + página; 2 donuts.
**Where**: `components/financeiro/relatorio-categorias-view.tsx`, `categoria-report-table.tsx`, `app/financeiro/relatorio-de-categorias/page.tsx` (new)
**Depends on**: T1, T2
**Reuses**: `charts/Pie100`, `brl`, `financeiro-calc.percentual`/`totalNode`.
**Requirement**: FIN-09, FIN-16
**Tools**: MCP NONE · Skill NONE
**Done when**:
- [ ] 2 donuts (Receitas verde / Despesas rosa) com legendas.
- [ ] 2 tabelas Categorias·Percentual·Valor; pai ▾ → subcategorias; linha Total (Receitas R$ 8.500 / Despesas −R$ 7.269, 100%).
- [ ] Percentuais somam 100% (via `percentual`/`totalNode`); expand via `useState<Set>`.
- [ ] Gate limpo.
**Tests**: none · **Gate**: build
**Commit**: `feat(financeiro): relatório de categorias (2 donuts + tree) (19)`

---

### T15: Integração — smoke + STATE
**What**: Build+lint final, smoke das 9 rotas, atualizar `STATE.md` (20/36, deferidos).
**Where**: `.specs/project/STATE.md` (modify)
**Depends on**: T5, T6, T7, T8, T9, T10, T12, T14
**Reuses**: —
**Requirement**: FIN-17
**Tools**: MCP NONE · Skill NONE
**Done when**:
- [ ] `cd web && npm run build && npm run lint` verde.
- [ ] 9 rotas `/financeiro/*` abrem sem erro (smoke `next dev`).
- [ ] Regressão: telas 12/13/14 ok.
- [ ] STATE atualizado: 20/36, branch `feat/financeiro-relatorios`, deferidos (mover contas-a-receber/pagar p/ submenu, filtros funcionais).
**Tests**: none · **Gate**: build
**Commit**: `chore(state): financeiro lote 4 concluído (20/36)`

---

## Parallel Execution Map

```
Phase 1 (Sequential):
  T1 ──► T2, T3, T4

Phase 2 (Parallel após Foundation):
  ├── T5  [P]   (T1,T3)
  ├── T6  [P]   (T1,T3)
  ├── T7  [P]   (T1)
  ├── T8  [P]   (T1,T2)
  ├── T9  [P]   (T1)
  ├── T10 [P]   (T1)
  ├── T11 [P]   (T1,T2) ──► T12 (páginas fluxo)
  └── T14 [P]   (T1,T2)

Phase 3 (Sequential):
  T5,T6,T7,T8,T9,T10,T12,T14 ──► T15
```

---

## Validation — Check 1: Granularity

| Task | Escopo | Status |
|---|---|---|
| T1 | dados mock (1 arquivo) | ✅ |
| T2 | 4 funções puras (1 arquivo) | ✅ |
| T3 | 1 componente extraído + 1 modify | ✅ |
| T4 | submenu+layout+match (coeso: navegação) | ✅ |
| T5 | 1 tela (view+table+page) | ✅ |
| T6 | 1 tela | ✅ |
| T7 | 1 tela + modal | ✅ |
| T8 | 1 tela + modal | ✅ |
| T9 | 1 tela (tree) + modal | ✅ |
| T10 | 1 tela | ✅ |
| T11 | 1 componente (view+table) | ✅ |
| T12 | 2 páginas finas (mesmo componente) | ✅ |
| T14 | 1 tela (2 donuts + tree) | ✅ |
| T15 | integração+STATE | ✅ |

## Validation — Check 2: Diagram ↔ Definition

| Task | Depends on (body) | Diagrama | Status |
|---|---|---|---|
| T2 | T1 | T1→T2 | ✅ |
| T3 | T1 | T1→T3 | ✅ |
| T4 | T1 | T1→T4 | ✅ |
| T5 | T1,T3 | Foundation→T5 | ✅ |
| T6 | T1,T3 | Foundation→T6 | ✅ |
| T7 | T1 | Foundation→T7 | ✅ |
| T8 | T1,T2 | Foundation→T8 | ✅ |
| T9 | T1 | Foundation→T9 | ✅ |
| T10 | T1 | Foundation→T10 | ✅ |
| T11 | T1,T2 | Foundation→T11 | ✅ |
| T12 | T11 | T11→T12 | ✅ |
| T14 | T1,T2 | Foundation→T14 | ✅ |
| T15 | T5,T6,T7,T8,T9,T10,T12,T14 | …→T15 | ✅ |

Nenhum task `[P]` depende de outro `[P]` do mesmo phase (T12 não é `[P]`; depende de T11). ✅

## Validation — Check 3: Test Co-location

Sem TESTING.md / sem test runner no projeto (igual lotes 1–3). Matriz exige `none` em todas as camadas.
Todas as tasks `Tests: none`, `Gate: build`. ✅ Nenhuma violação.

---

## Coverage (traceability)

| FIN | Task(s) |
|---|---|
| FIN-01 | T5 | FIN-02 | T6 | FIN-03 | T7 | FIN-04 | T8 | FIN-05 | T9 |
| FIN-06 | T10 | FIN-07 | T11,T12 | FIN-08 | T11,T12 | FIN-09 | T14 |
| FIN-10 | T8 | FIN-11 | T7 | FIN-12 | T9 | FIN-13 | T4 |
| FIN-14 | T1,T2 | FIN-15 | T3,T11 | FIN-16 | T9,T14 | FIN-17 | T15 |

17/17 requisitos mapeados. ✅
