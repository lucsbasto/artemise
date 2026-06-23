# Financeiro — Relatórios & Cadastros (lote 4) — Specification

## Problem Statement

O módulo Financeiro hoje tem só Visão geral (12), Contas a receber (13) e Contas a pagar (14).
Faltam as telas de **movimentação, relatórios analíticos e cadastros financeiros**: extrato,
competência, fluxos de caixa (diário/mensal), relatório por categorias, contas financeiras,
categorias de contas, métodos de pagamento e comissões em aberto. Sem elas o submenu Financeiro
fica "morto" e a clínica não fecha o ciclo de gestão financeira. Hoje 11/36 telas; este lote leva
a **20/36** (telas 15→23).

## Goals

- [ ] 9 telas fiéis às specs 15–23, montadas no AppShell + submenu Financeiro existentes.
- [ ] 2 relatórios com chart (Recharts): Fluxo de caixa **combo** (barras Entrada/Saída + linha Saldo)
      diário e mensal; Relatório de categorias com **2 donuts** (Receitas/Despesas).
- [ ] 3 modais funcionais de cadastro: **Nova conta financeira**, **Novo método de pagamento**,
      **Nova/editar categoria de contas**.
- [ ] Reuso máximo: `FinanceTable`, `StatusBadge`, `ListShell`, `Modal`, `Field/Input/Select`,
      `EmptyState`, `Card`, KPI-cards do dashboard.
- [ ] Submenu lateral Financeiro com todos os 12 itens navegáveis (3 atuais + 9 novos).
- [ ] Mock estático (D2) com valores exatos dos screenshots; `lib/financeiro-calc.ts` testável
      para encadeamento de saldo e totalizações.
- [ ] build ✅ + lint ✅, smoke nas 9 rotas.

## Out of Scope

| Feature | Razão |
|---|---|
| Persistência / API real | Mock estático (D2). Modais validam mas não salvam. |
| Filtros / busca / ordenação funcionais | Visual apenas (igual lotes 1–3). |
| Date-range picker funcional / navegação de período real | Chips e setas ‹ › visuais; período fixo do mock. |
| Exportar (PDF/Excel/CSV) funcional | Botão/dropdown inerte. |
| Drill-down real nas categorias (expand→fetch) | Hierarquia estática expansível só client. |
| Modal "Pagar comissão" gerando lançamento no extrato | Comissões abre vazia; ação inerte nesta fase. |
| Edição inline de subcategoria via "+ Adicionar subcategoria" | Link visual; criação real fora de escopo. |
| Tooltips ricos de chart com formatação custom além do default Recharts | Default aceitável nesta fase. |

---

## User Stories

### P1: Extrato de movimentação (15) ⭐ MVP

**User Story**: Como gestor, quero ver o extrato de todos os lançamentos do período com KPIs de
receitas/despesas (em aberto e realizadas) para acompanhar a movimentação financeira.

**Why P1**: Tela-base de movimentação; reusa `FinanceTable` + KPI-cards prontos.

**Acceptance Criteria**:

1. WHEN acesso `/financeiro/extrato-de-movimentacao` THEN sistema SHALL exibir breadcrumb
   `Financeiro / Extrato de movimentação` e **5 KPI-cards**: "Receitas em aberto" (verde),
   "Receitas realizadas" (verde), "Despesas em aberto" (vermelho), "Despesas realizadas" (vermelho),
   "Total do período" (azul, ativo) — com os valores do mock.
2. WHEN a tabela renderiza THEN colunas SHALL ser **Vencimento · Execução · Descrição · Categoria ·
   Método · Situação · Valor líquido (R$)**, com Método como ícone e Situação como `StatusBadge`
   ("Pago"/"Recebido" verde, "Em atraso" vermelho).
3. WHEN um lançamento está "Em atraso" THEN a linha SHALL receber realce de borda esquerda vermelha.
4. WHEN a tela carrega THEN SHALL exibir chip "Período de liquidação", "+ Adicionar filtro", busca,
   dropdown "Exportar" (PDF/Excel/CSV) e paginação "25 por página".

**Independent Test**: Abrir a rota, ver 5 KPIs com valores e tabela com linha "Em atraso" realçada.

---

### P1: Relatório de competência (16) ⭐ MVP

**User Story**: Como gestor, quero o relatório por regime de competência (valor bruto e líquido por
lançamento) para análise contábil do mês.

**Why P1**: Reusa o mesmo chrome de listagem + 3 KPI-cards.

**Acceptance Criteria**:

1. WHEN acesso `/financeiro/relatorio-de-competencia` THEN SHALL exibir breadcrumb
   `Financeiro / Relatório de competência`, seletor de mês ‹ Junho de 2026 ›, e **3 KPI-cards**:
   "Receitas" (verde), "Despesas" (vermelho), "Total do período" (azul).
2. WHEN a tabela renderiza THEN colunas SHALL ser **Competência · Descrição · Contato ·
   Valor bruto (R$) · Valor líquido (R$)**; despesas em vermelho com sinal negativo; linhas de
   "saldo inicial" neutras (0,00).
3. WHEN há linha de total THEN o rodapé da tabela SHALL exibir os totais de bruto e líquido.

**Independent Test**: Abrir a rota, ver 3 KPIs e linhas de receita (verde) e despesa (vermelho).

---

### P1: Métodos de pagamento (22) ⭐ MVP

**User Story**: Como gestor, quero ver os métodos de pagamento cadastrados e seu status para
gerenciar formas de recebimento.

**Why P1**: Tabela simples; reusa `ListShell` + toggle.

**Acceptance Criteria**:

1. WHEN acesso `/financeiro/metodos-de-pagamento` THEN SHALL exibir card "Métodos de pagamento" com
   badge "{N} registros" e tabela com colunas **Descrição · Tipo · Marca/Bandeira · Ativo · Ações**.
2. WHEN há métodos no mock THEN SHALL exibir as 8 linhas exatas (Boleto, Cartão de crédito, Cartão de
   débito, Depósito, Dinheiro, Máquina de cartão, PIX, Transferência) com toggle "Ligado" (verde) /
   "Desligado" (cinza).
3. WHEN um método está "Desligado" THEN o menu ⋮ da linha SHALL aparecer esmaecido.

**Independent Test**: Abrir a rota, ver 8 métodos com toggles no estado certo (PIX ligado, Dinheiro desligado).

---

### P1: Contas financeiras (20) ⭐ MVP

**User Story**: Como gestor, quero ver minhas contas financeiras (banco, caixa) com saldo atual e o
saldo total consolidado.

**Why P1**: Card-grid simples; base para o restante do financeiro.

**Acceptance Criteria**:

1. WHEN acesso `/financeiro/contas` THEN SHALL exibir breadcrumb `Financeiro / Contas financeiras`,
   grid de cards de conta e card-resumo "Saldo total".
2. WHEN há contas no mock THEN cada card SHALL exibir ícone, nome (ex.: "Banco padrão"), Tipo
   ("Conta Corrente"/"Caixa"), "Saldo Atual" em BRL e menu ⋮ (Editar/Excluir).
3. WHEN os cards renderizam THEN "Saldo total" SHALL ser a **soma** dos saldos atuais (R$ 2.431,00).

**Independent Test**: Abrir a rota, ver 2 cards (Banco padrão R$ 2.431,00, Caixa R$ 0,00) e Saldo total somando.

---

### P1: Categorias de contas (21) ⭐ MVP

**User Story**: Como gestor, quero ver o plano de categorias de contas em árvore (categoria →
subcategorias) com status, para organizar a classificação financeira.

**Why P1**: Tree-list reusável; alimenta os relatórios por categoria.

**Acceptance Criteria**:

1. WHEN acesso `/financeiro/categorias-de-contas` THEN SHALL exibir card com colunas
   **Descrição · Status · Ações** e filtros ("+ Adicionar filtro", busca).
2. WHEN uma categoria-pai renderiza THEN SHALL ter seta ▾ expansível e, ao expandir, exibir
   subcategorias indentadas + link "+ Adicionar subcategoria".
3. WHEN uma categoria renderiza THEN coluna Status SHALL ser toggle (verde ativo / cinza inativo) e
   Ações o menu ⋮ (Editar/Excluir).
4. WHEN clico ▾/▸ THEN o grupo SHALL expandir/recolher (estado client).

**Independent Test**: Abrir a rota, expandir "Aquisições de imobilizados", ver subcategorias indentadas.

---

### P1: Comissões em aberto (23) ⭐ MVP

**User Story**: Como gestor, quero a tela de comissões em aberto com filtro de período e total, para
acompanhar comissões a pagar.

**Why P1**: Fecha o submenu; estado vazio fiel (print mostra vazio).

**Acceptance Criteria**:

1. WHEN acesso `/financeiro/comissoes-em-aberto` THEN SHALL exibir chip de período
   "Período: 23/05/2026 - 22/06/2026", "+ Adicionar filtro" e dropdown "Exportar".
2. WHEN não há comissões no mock THEN SHALL exibir `EmptyState` "Hmm, está vazio por aqui!" /
   "Nenhum registro encontrado." e linha "Total do período (23/05/2026 - 22/06/2026)" → R$ 0,00.
3. WHEN a estrutura de tabela é definida THEN colunas SHALL ser **Profissional · Procedimento/Venda ·
   Data · Base · % · Valor comissão · Status · Ações** (estrutura pronta, vazia nesta fase).

**Independent Test**: Abrir a rota, ver empty-state, chip de período e "Total do período" R$ 0,00.

---

### P2: Fluxo de caixa diário (17)

**User Story**: Como gestor, quero o fluxo de caixa diário do mês em gráfico (entradas, saídas,
saldo) + tabela detalhada por dia.

**Why P2**: Core financeiro mas exige componente de chart novo (combo).

**Acceptance Criteria**:

1. WHEN acesso `/financeiro/fluxo-de-caixa-diario` THEN SHALL exibir breadcrumb
   `Financeiro / Fluxo de caixa diário`, seletor de mês ‹ Junho de 2026 › e chip de filtros gerais
   "Filtros gerais: Transferência: Sim, Saldo inicial: Sim, Valor padrão: Líquido, Previsão: Não".
2. WHEN o chart renderiza THEN SHALL ser **combo**: barras "Entradas" (verde) / "Saídas" (vermelho)
   + linha "Saldo" (azul), eixo X = dias 1–30 Jun, com tooltip por dia.
3. WHEN a tabela renderiza THEN colunas SHALL ser **Dia · Saldo inicial (R$) · Entrada (R$) ·
   Saída (R$) · Lucro/Prejuizo (R$) · Saldo final (R$)** (grafia "Prejuizo" sem acento, igual spec),
   1 linha por dia do mês.
4. WHEN um dia não tem movimento THEN Entrada/Saída SHALL ser 0,00 e o saldo final encadear o inicial.

**Independent Test**: Abrir a rota, ver combo chart e tabela de 30 dias com encadeamento de saldo.

---

### P2: Fluxo de caixa mensal (18)

**User Story**: Como gestor, quero o fluxo de caixa mensal do ano (mesmo formato do diário) para
visão consolidada.

**Why P2**: Reusa o componente de chart/tabela do diário com granularidade mensal.

**Acceptance Criteria**:

1. WHEN acesso `/financeiro/fluxo-de-caixa-mensal` THEN SHALL exibir breadcrumb
   `Financeiro / Fluxo de caixa mensal`, seletor de ano ‹ 2026 › e o mesmo chip de filtros gerais.
2. WHEN o chart renderiza THEN SHALL ser o mesmo combo, eixo X = Jan…Dez 2026 (12 meses).
3. WHEN a tabela renderiza THEN colunas SHALL ser **Mês · Saldo inicial (R$) · Entrada (R$) ·
   Saída (R$) · Lucro/Prejuizo (R$) · Saldo final (R$)**, 12 linhas.
4. WHEN um mês fecha THEN **Saldo final do mês N SHALL ser o Saldo inicial do mês N+1** (encadeamento),
   calculado em `lib/financeiro-calc.ts`.

**Independent Test**: Abrir a rota, ver 12 meses; Jun com Entrada 6.320,00 / Saída 3.889,00; saldo encadeando Jul→Dez.

---

### P2: Relatório de categorias (19)

**User Story**: Como gestor, quero o relatório de receitas e despesas por categoria com gráficos de
rosca e percentuais, para entender a composição financeira.

**Why P2**: Exige 2 donuts (Recharts) + 2 tabelas hierárquicas com %.

**Acceptance Criteria**:

1. WHEN acesso `/financeiro/relatorio-de-categorias` THEN SHALL exibir breadcrumb
   `Financeiro / Relatório de categorias` e seletor de mês ‹ Junho de 2026 ›.
2. WHEN renderiza THEN SHALL exibir **2 donuts** lado a lado: Receitas (verde, legenda "Receitas de
   serviços") e Despesas (rosa/vermelho, legenda "Outras despesas").
3. WHEN as tabelas renderizam THEN SHALL haver 2 tabelas (Receitas, Despesas) com colunas
   **Categorias · Percentual · Valor**, linhas hierárquicas (pai ▾ expansível → subcategorias
   indentadas) e linha **Total** (Receitas R$ 8.500,00 / Despesas -R$ 7.269,00, 100%).
4. WHEN clico ▾ em uma categoria THEN SHALL expandir/recolher as subcategorias.

**Independent Test**: Abrir a rota, ver 2 donuts e 2 tabelas com totais e percentuais somando 100%.

---

### P3: Modal "Nova/Editar conta financeira" (20)

**User Story**: Como gestor, quero cadastrar/editar uma conta financeira.

**Acceptance Criteria**:

1. WHEN clico no FAB "+" (ou ⋮ → Editar) THEN SHALL abrir modal "Nova conta" / "Editar conta".
2. WHEN o modal abre THEN SHALL exibir campos **Nome\***, **Tipo** (select: Caixa / Conta Corrente /
   Carteira), **Saldo inicial** (moeda); botões "Salvar"/"Cancelar".
3. WHEN fecho (X/Cancelar/Esc/overlay) THEN o modal SHALL fechar sem persistir.
4. WHEN Nome vazio e clico "Salvar" THEN SHALL destacar erro (validação client).

**Independent Test**: Abrir pelo FAB, ver campos, validar Nome obrigatório, cancelar.

---

### P3: Modal "Novo/Editar método de pagamento" (22)

**User Story**: Como gestor, quero cadastrar/editar um método de pagamento.

**Acceptance Criteria**:

1. WHEN clico no FAB "+" (ou ⋮ → Editar) THEN SHALL abrir modal "Novo método" / "Editar método".
2. WHEN o modal abre THEN SHALL exibir campos **Descrição\***, **Tipo**, **Marca/Bandeira**, toggle
   **Ativo**; botões "Salvar"/"Cancelar".
3. WHEN fecho THEN modal SHALL fechar sem persistir.

**Independent Test**: Abrir pelo FAB, ver campos, cancelar.

---

### P3: Modal "Nova/Editar categoria de contas" (21)

**User Story**: Como gestor, quero cadastrar/editar uma categoria de contas.

**Acceptance Criteria**:

1. WHEN clico no FAB "+" (ou ⋮ → Editar, ou "+ Adicionar subcategoria") THEN SHALL abrir modal
   "Nova categoria" / "Editar categoria".
2. WHEN o modal abre THEN SHALL exibir campos **Descrição\***, **Tipo** (Receita / Despesa),
   **Categoria pai** (select opcional), toggle **Ativo**; botões "Salvar"/"Cancelar".
3. WHEN fecho THEN modal SHALL fechar sem persistir.

**Independent Test**: Abrir pelo FAB, ver campos, cancelar.

---

## Edge Cases

- WHEN qualquer listagem sem registros THEN SHALL exibir `EmptyState` "Hmm, está vazio por aqui!" /
  "Nenhum registro encontrado.".
- WHEN um dia/mês de fluxo não tem movimento THEN Entrada/Saída = 0,00 e Saldo final = Saldo inicial.
- WHEN Lucro/Prejuizo é negativo THEN SHALL exibir em vermelho com sinal; positivo em verde.
- WHEN percentual de categoria é calculado THEN a soma das subcategorias SHALL fechar o pai e o total = 100%.
- WHEN Saldo total de contas é calculado THEN SHALL ser soma exata dos saldos atuais (sem arredondar a esmo).
- WHEN valor monetário renderiza THEN SHALL usar formato pt-BR `R$ #.###,##`.
- WHEN data renderiza em tabela THEN `DD/MM`; em chips de período `DD/MM/YYYY`.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|---|---|---|---|
| FIN-01 | P1: Extrato de movimentação (15) | Design | Pending |
| FIN-02 | P1: Relatório de competência (16) | Design | Pending |
| FIN-03 | P1: Métodos de pagamento (22) | Design | Pending |
| FIN-04 | P1: Contas financeiras (20) | Design | Pending |
| FIN-05 | P1: Categorias de contas (21, tree) | Design | Pending |
| FIN-06 | P1: Comissões em aberto (23, vazio) | Design | Pending |
| FIN-07 | P2: Fluxo de caixa diário (17, combo chart) | Design | Pending |
| FIN-08 | P2: Fluxo de caixa mensal (18, combo chart) | Design | Pending |
| FIN-09 | P2: Relatório de categorias (19, 2 donuts) | Design | Pending |
| FIN-10 | P3: Modal Conta financeira | Design | Pending |
| FIN-11 | P3: Modal Método de pagamento | Design | Pending |
| FIN-12 | P3: Modal Categoria de contas | Design | Pending |
| FIN-13 | Submenu Financeiro: 9 rotas novas navegáveis | Design | Pending |
| FIN-14 | Mock data financeiro + `lib/financeiro-calc.ts` (encadeamento/totais) | Design | Pending |
| FIN-15 | Componente combo-chart + donut reutilizáveis | Design | Pending |
| FIN-16 | Componente tree-list reutilizável (categorias) | Design | Pending |
| FIN-17 | build + lint + smoke 9 rotas | - | Pending |

**ID format:** `FIN-[NUMBER]`
**Status values:** Pending → In Design → In Tasks → Implementing → Verified
**Coverage:** 17 total, 0 mapped to tasks, 17 unmapped ⚠️ (mapeados na fase Tasks)

---

## Success Criteria

- [ ] 9 rotas acessíveis e fiéis às specs (textos exatos de colunas, KPIs e títulos).
- [ ] Charts combo (diário/mensal) e donuts (categorias) renderizam com séries/cores corretas.
- [ ] Encadeamento de saldo (mês N→N+1) correto e coberto por teste em `financeiro-calc.ts`.
- [ ] 3 modais abrem/fecham e validam campo obrigatório.
- [ ] Submenu Financeiro destaca item ativo; 12 itens navegáveis.
- [ ] `npm run build` verde, `npm run lint` limpo.
- [ ] 20/36 telas concluídas.
