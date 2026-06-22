# Financeiro / Visão Geral

| Metadado | Valor |
|---|---|
| **Tela** | Financeiro / Visão geral (Dashboard financeiro) |
| **Rota** | `/clinica/financeiro/visao-geral` |
| **URL completa** | `app.clinicaexperts.com.br/clinica/financeiro/visao-geral` |
| **Breadcrumb** | `Financeiro / Visão geral` |
| **Módulo** | Financeiro |
| **Ícone sidebar** | Cifrão "$" (destacado em roxo) |
| **Produto** | Clínica Experts (SaaS de gestão de clínicas) |
| **Idioma** | pt-BR |
| **Tipo de página** | Dashboard / Painel de indicadores (somente leitura, com filtros e navegação) |
| **Referência cruzada** | `docs/03-telas-21-a-30.md` — Tela 27 |
| **Captura** | `Captura de tela 2026-06-22 153334.png` |
| **Período capturado** | 23/05/2026 – 22/06/2026 |
| **Data do documento** | 2026-06-22 |

![](../../images/Captura de tela 2026-06-22 153334.png)

---

## 1. Identificação

- **Nome da página:** Financeiro / Visão geral.
- **Rota:** `/clinica/financeiro/visao-geral`.
- **Breadcrumb (texto exato):** `Financeiro / Visão geral` (segmento "Financeiro" em roxo/link, "Visão geral" em cinza).
- **Posição na navegação:** Primeiro item do submenu do módulo **Financeiro** (ver §3).
- **Header global (padrão do app):** logo **clínicaexperts** à esquerda; botão hambúrguer (☰) para colapsar/expandir sidebar; à direita: ícone WhatsApp (fundo rosa claro), ícone de busca/atalhos (lupa com "+"), link **Ajuda** (ícone "?"), sino de notificações (com badge), avatar **LB** (círculo verde — Lucas Bastos).
- **Sidebar de ícones (esquerda):** ícone **"$" (Financeiro) destacado em roxo** indicando módulo ativo.
- **Elementos globais presentes:** botão flutuante "+" (canto inferior direito), banner de onboarding laranja **"Ei, Lucas Bastos! Tô aqui guardando o seu desconto!"** e card **"Seu progresso 0%"** (gamificação).

---

## 2. Objetivo

Painel-resumo (dashboard) da saúde financeira da clínica para o período selecionado. Consolida em uma única tela:

- Resultado do período (Receitas, Despesas) e expectativa de curto prazo (A receber, A pagar).
- Evolução temporal de entradas/saídas e saldo via gráfico de **Fluxo de caixa** (com granularidade ajustável).
- Saldo das **contas financeiras** (bancos/caixa).
- Detalhamento de **contas a receber** e **contas a pagar** por horizonte temporal (hoje, mês, ano) e por status (inadimplência/atraso).
- Distribuição de receitas/despesas por **categoria** (gráfico de pizza).

A página é primariamente de **leitura/consulta**; as ações são: filtrar por período, alternar granularidade do fluxo de caixa, alternar receita/despesa nas categorias e navegar via links "Ver todas" para as telas de detalhe.

---

## 3. Navegação — Submenu Financeiro

O módulo Financeiro expõe um submenu lateral (painel de rótulos expansível, observado expandido na Tela 29). Itens, na ordem exata observada:

| Ordem | Item (texto exato) | Rota (inferida) | Observação |
|---|---|---|---|
| 1 | **Visão geral** | `/clinica/financeiro/visao-geral` | **Página atual / ativa** |
| 2 | **Contas a receber** | `/clinica/financeiro/contas-a-receber` | Recebíveis (Tela 28/29) |
| 3 | **Contas a pagar** | `/clinica/financeiro/contas-a-pagar` | Despesas (Tela 30) |
| 4 | **Extrato de movimentações** | `/clinica/financeiro/extrato` (inferido) | Extrato consolidado |
| 5 | **Relatório de competência** | `/clinica/financeiro/competencia` (inferido) | Regime de competência |
| 6 | **Fluxo de caixa diário** | `/clinica/financeiro/fluxo-de-caixa-diario` (inferido) | Fluxo de caixa (visão diária) |
| 7 | **Fluxo de caixa mensal** | `/clinica/financeiro/fluxo-de-caixa-mensal` (inferido) | Fluxo de caixa (visão mensal) |
| 8 | **Relatório de categorias** | `/clinica/financeiro/relatorio-categorias` (inferido) | Receitas/despesas por categoria |
| 9 | **Contas financeiras** | `/clinica/financeiro/contas-financeiras` (inferido) | Bancos/caixas |
| 10 | **Categorias de contas** | `/clinica/financeiro/categorias` (inferido) | Cadastro de categorias |
| 11 | **Métodos de pagamento** | `/clinica/financeiro/metodos-de-pagamento` (inferido) | Formas de pagamento |
| 12 | **Integração maquininha** | `/clinica/financeiro/integracao-maquininha` (inferido) | Conciliação de adquirente |

> **Nota (inferido):** O briefing também menciona "**Comissões**" e "**Fluxo de caixa**" como itens do submenu. Na captura/Tela 29 não há item textual "Comissões"; possivelmente é uma sub-rota adicional (`/clinica/financeiro/comissoes` — **inferido**) ou um item exibido em outra resolução/permissão. Os itens 6 e 7 ("Fluxo de caixa diário" e "...mensal") cobrem a função "Fluxo de caixa". Registrar como itens candidatos do submenu: **Comissões (inferido)** e **Fluxo de caixa (inferido, desdobrado em diário/mensal)**.

**Links internos de navegação na própria página (cross-links):**
- Card **Contas financeiras → "Ver todas"** → `/clinica/financeiro/contas-financeiras` (inferido).
- Card **A receber → "Ver todas"** → `/clinica/financeiro/contas-a-receber` (inferido).
- Card **A pagar → "Ver todas"** → `/clinica/financeiro/contas-a-pagar` (inferido).

---

## 4. Layout

Estrutura em **coluna central larga** sobre fundo cinza-claro, organizada em blocos verticais empilhados (cards brancos com cantos arredondados e sombra leve). De cima para baixo:

1. **Bloco de Filtros** (largura total da coluna).
2. **Faixa de 4 KPIs** em linha (4 colunas de igual largura): Receitas | Despesas | A receber | A pagar.
3. **Linha de dois cards (grid 2 colunas, ~2/3 + 1/3):**
   - Esquerda (largo): **Fluxo de caixa** (gráfico + abas de granularidade).
   - Direita (estreito): **Contas financeiras** (lista + saldo total).
4. **Linha de três cards (grid 3 colunas):**
   - **A receber** (lista de métricas).
   - **A pagar** (lista de métricas).
   - **Categorias** (toggle Receita/Despesa + gráfico de pizza).

Responsividade (inferido): em telas estreitas os grids colapsam para 1 coluna; KPIs reflowam em 2x2.

```
┌──────────────────────────────────────────────────────────────┐
│ FILTROS: 1 filtro aplicado | Limpar filtros                  │
│ [Período: 23/05/2026 – 22/06/2026]  + Adicionar filtro       │
├──────────┬──────────┬──────────┬──────────────────────────────┤
│ Receitas │ Despesas │ A receber│ A pagar                      │
│ R$6.320  │ -R$3.889 │ R$2.180  │ -R$3.380                     │
├──────────────────────────────────┬───────────────────────────┤
│ Fluxo de caixa  [D|S|M|A]        │ Contas financeiras  Ver todas│
│  ▮▮ gráfico barras + linha       │  🏦 Banco padrão  R$2.431,00 │
│  legenda                          │  🗄 Caixa          R$0,00    │
│                                   │  Saldo total:     R$2.431,00 │
├──────────────────┬────────────────┴────────────┬──────────────┤
│ A receber        │ A pagar                       │ Categorias   │
│  Inadimplência…  │  Em atraso…                   │ [Rec][Desp]  │
│  Para hoje…      │  Para hoje…                   │  ◔ pizza     │
│  …               │  …                            │  legenda     │
└──────────────────┴───────────────────────────────┴──────────────┘
```

---

## 5. Componentes (valores exatos)

### 5.1 Bloco de Filtros
- Título: **Filtros**.
- Indicador: **1 filtro aplicado** (texto cinza ao lado do título).
- Link: **Limpar filtros** (roxo, à direita do indicador).
- **Chip de filtro:** **Período: 23/05/2026 – 22/06/2026** (pílula cinza-clara).
- Link: **+ Adicionar filtro** (roxo, com ícone "+").

### 5.2 Cards-KPI (4, em linha) — VALORES EXATOS
| KPI | Rótulo (exato) | Valor (exato) | Cor do valor | Sinal |
|---|---|---|---|---|
| 1 | **Receitas** | **R$ 6.320** | neutro/escuro | positivo |
| 2 | **Despesas** | **-R$ 3.889** | neutro/escuro | negativo (prefixo "-") |
| 3 | **A receber** | **R$ 2.180** | neutro/escuro | positivo |
| 4 | **A pagar** | **-R$ 3.380** | neutro/escuro | negativo (prefixo "-") |

> Observação: nos cards de topo os valores aparecem **sem casas decimais** (ex.: `R$ 6.320`), enquanto nos cards de detalhe (§5.4/§5.5) e contas financeiras (§5.3) aparecem **com duas casas** (ex.: `R$ 8.500,00`). Manter essa formatação por contexto (inferido: KPIs de topo arredondam para inteiro; demais usam centavos).

### 5.3 Card "Contas financeiras"
- Título: **Contas financeiras**; link **Ver todas** (roxo, à direita).
- Linhas (ícone + nome + subtipo + saldo à direita):
  | Ícone | Nome (exato) | Subtipo (exato) | Saldo (exato) |
  |---|---|---|---|
  | 🏦 banco | **Banco padrão** | Conta Corrente | **R$ 2.431,00** |
  | 🗄 caixa | **Caixa** | Caixa | **R$ 0,00** |
- Rodapé: **Saldo total: R$ 2.431,00** (rótulo "Saldo total:" + valor em negrito à direita).

### 5.4 Card "A receber" (detalhe) — valores em **verde**
| Métrica (texto exato) | Valor (exato) |
|---|---|
| Inadimplência | **R$ 780,00** |
| Para hoje | **R$ 4.550,00** |
| Para este mês | **R$ 8.500,00** |
| Para este ano | **R$ 8.500,00** |
| Recebidos no mês | **R$ 6.320,00** |
| Recebidos no ano | **R$ 6.320,00** |
- Título: **A receber**; link **Ver todas** (roxo).

### 5.5 Card "A pagar" (detalhe) — valores em **vermelho**
| Métrica (texto exato) | Valor (exato) |
|---|---|
| Em atraso | **R$ 500,00** |
| Para hoje | **R$ 3.380,00** |
| Para este mês | **R$ 7.269,00** |
| Para este ano | **R$ 7.269,00** |
| Pagos no mês | **R$ 3.889,00** |
| Pagos no ano | **R$ 3.889,00** |
- Título: **A pagar**; link **Ver todas** (roxo).

### 5.6 Gráfico "Fluxo de caixa"
- Título: **Fluxo de caixa** + ícone **"?"** (tooltip de ajuda).
- **Abas de granularidade (segmented):** **Diária** (ativa, sublinhada/roxo) · **Semanal** · **Mensal** · **Anual**.
- **Tipo de gráfico:** combinado (combo) — **barras verticais empilhadas** (entradas/saídas) + **linha** (saldo). Tipo: *ComposedChart* (inferido — barras + linha sobrepostas).
- **Eixo X (categórico/temporal):** datas diárias de **23.Mai** até **22.Jun** (uma marca por dia: 23.Mai, 24.Mai, 25.Mai, …, 1.Jun, 2.Jun, …, 22.Jun). O domínio do eixo X segue o período do filtro; a densidade de rótulos varia conforme a aba de granularidade.
- **Eixo Y (valor, R$):** escala de **-R$ 4k** a **R$ 4k**. Marcas (ticks) visíveis (exatas): **R$ 4k, R$ 3k, R$ 1k, -R$ 480, -R$ 2k, -R$ 4k**. (Há uma linha de base/zero implícita; o tick "-R$ 480" parece marcar o saldo de referência.)
- **Séries / Legenda (texto e cores exatos):**
  | Série (legenda) | Tipo visual | Cor |
  |---|---|---|
  | **Entradas** | barra | verde (sólido) |
  | **Entradas previstas** | barra | verde claro |
  | **Saídas** | barra | vermelho (sólido) |
  | **Saídas previstas** | barra | rosa |
  | **Saldo** | linha | azul (com marcadores/pontos) |
  | **Saldo previsto** | linha | cinza |
- **Leitura visual:** maior parte do período sem barras (sem movimento) e linha de **Saldo** azul plana próxima a -R$ 480; a partir de ~16/17.Jun surgem barras verdes (entradas) e vermelhas (saídas); no extremo direito (22.Jun) barra verde alta (~R$ 4k) e barra vermelha profunda (~-R$ 4k), com a linha de saldo subindo.

### 5.7 Card "Categorias"
- Título: **Categorias** + ícone **"?"**.
- **Toggle (segmented):** **Receita** (ativo, verde) · **Despesa**.
- **Tipo de gráfico:** **pizza/donut** (no estado capturado, pizza preenchida verde, praticamente 100% em uma fatia).
- **Legenda (texto exato):** **Receitas de serviços** · **Outros** (pontos coloridos verdes/tons).
- Comportamento (inferido): alternar para **Despesa** recarrega o gráfico com as categorias de despesa do período.

### 5.8 Seletor de período (resumo)
- Único "seletor de período" da tela = chip **Período: 23/05/2026 – 22/06/2026** no bloco Filtros. Ao clicar abre um **date range picker** (modal/popover) — ver §10.
- As abas Diária/Semanal/Mensal/Anual do Fluxo de caixa **não** alteram o período; apenas a granularidade de agregação dentro do período filtrado.

---

## 6. Tabelas

A página **não possui tabelas de dados tabulares** (linhas/colunas com paginação). Os cards "A receber", "A pagar" e "Contas financeiras" são **listas de pares rótulo→valor** (key-value lists), não tabelas com cabeçalho ordenável. As tabelas completas estão nas telas de detalhe (Contas a receber — Tela 28/29; Contas a pagar — Tela 30), acessadas via "Ver todas".

---

## 7. Formulários

Não há formulários de entrada de dados nesta página. As únicas entradas de usuário são:
- **Date range picker** do filtro de período (§10).
- Controles segmentados (abas Diária/Semanal/Mensal/Anual; toggle Receita/Despesa) — não são formulários, são seletores de visualização.

A criação de lançamentos ocorre via botão flutuante "+" (abre fluxo de novo lançamento — fora do escopo desta tela) ou nas telas de detalhe.

---

## 8. Filtros

- **Filtro ativo:** **Período** (intervalo de datas), valor **23/05/2026 – 22/06/2026** → equivale aos últimos 30 dias relativos a 22/06/2026 (inferido: default "últimos 30 dias").
- **Indicador:** "1 filtro aplicado".
- **Ações:** **Limpar filtros** (remove/reseta o filtro de período para o default) e **+ Adicionar filtro** (abre menu para adicionar outros critérios — inferido: por conta financeira, categoria, centro de custo, etc.).
- **Parâmetros de URL (inferido, alinhado às Telas 28–30):** o intervalo é transportado como `?interval=2026-05-23&interval=2026-06-22` (par de datas ISO `YYYY-MM-DD`). Esta página provavelmente aceita os mesmos parâmetros.
- **Propagação:** o período filtra todos os blocos (KPIs, fluxo de caixa, categorias). As métricas "Para este mês/ano", "no mês/ano" usam janelas próprias (mês/ano corrente), **independentes** do filtro de período (inferido — ver §13).

---

## 9. Estados

### 9.1 Estado padrão (capturado)
Tudo populado: 1 filtro de período aplicado, aba **Diária** ativa, toggle **Receita** ativo.

### 9.2 Estado de carregamento (inferido)
Skeletons nos KPIs, gráficos com placeholder/spinner enquanto agrega dados.

### 9.3 Estado vazio (inferido)
- **Sem movimentações no período:** KPIs exibem `R$ 0,00`; Fluxo de caixa mostra eixo sem barras e linha de saldo plana (apenas saldo herdado das contas).
- **Sem contas financeiras cadastradas:** card "Contas financeiras" com mensagem de vazio (inferido: "Nenhuma conta financeira cadastrada" + CTA para cadastrar) e **Saldo total: R$ 0,00**.
- **Sem categorias com valor:** gráfico de pizza vazio/placeholder com mensagem "Sem dados para o período" (inferido).
- **Estado padrão de empty do app:** ícone de lupa em círculo roxo, título **"Oops, nada foi encontrado!"**, texto **"Os filtros selecionados não correspondem a nenhum registro."** + botão **Limpar filtros** (padrão observado em outras telas; aplicável se filtros restringirem demais).

### 9.4 Estado de erro (inferido)
Mensagem de falha de carregamento por card, com opção "Tentar novamente".

---

## 10. Modais

- **Date range picker (Período):** popover/modal de calendário duplo (dois meses) com seleção de data inicial e final, atalhos rápidos (inferido: "Hoje", "Últimos 7 dias", "Últimos 30 dias", "Este mês", "Mês passado", "Este ano", "Personalizado") e botões **Aplicar** / **Cancelar**. Acionado ao clicar no chip **Período: 23/05/2026 – 22/06/2026**.
- **Menu "+ Adicionar filtro":** dropdown/popover listando critérios adicionais disponíveis (inferido).
- **Tooltips de ajuda ("?"):** em "Fluxo de caixa" e "Categorias" — exibem explicação ao hover (não são modais, são tooltips).
- Não há modais de criação/edição nesta página (essas ações vivem nas telas de detalhe ou no "+").

---

## 11. Modelo de dados inferido

> Todos os tipos abaixo são **inferidos** a partir da UI.

```ts
// Resposta agregada do dashboard
interface FinanceOverview {
  period: { start: string; end: string }; // ISO date "YYYY-MM-DD"
  kpis: {
    revenue: number;     // Receitas: 6320
    expenses: number;    // Despesas: -3889 (ou 3889 com sign no front)
    toReceive: number;   // A receber: 2180
    toPay: number;       // A pagar: -3380
  };
  cashFlow: CashFlowSeries;
  financialAccounts: {
    accounts: FinancialAccount[];
    totalBalance: number; // 2431.00
  };
  receivables: ReceivableSummary;
  payables: PayableSummary;
  categories: CategoryBreakdown; // por tipo: receita|despesa
}

interface FinancialAccount {
  id: string;
  name: string;        // "Banco padrão", "Caixa"
  type: 'checking' | 'cash' | string; // "Conta Corrente", "Caixa"
  balance: number;     // 2431.00 | 0.00
}

interface ReceivableSummary {
  overdue: number;        // Inadimplência: 780.00
  dueToday: number;       // Para hoje: 4550.00
  dueThisMonth: number;   // Para este mês: 8500.00
  dueThisYear: number;    // Para este ano: 8500.00
  receivedThisMonth: number; // Recebidos no mês: 6320.00
  receivedThisYear: number;  // Recebidos no ano: 6320.00
}

interface PayableSummary {
  overdue: number;        // Em atraso: 500.00
  dueToday: number;       // Para hoje: 3380.00
  dueThisMonth: number;   // Para este mês: 7269.00
  dueThisYear: number;    // Para este ano: 7269.00
  paidThisMonth: number;  // Pagos no mês: 3889.00
  paidThisYear: number;   // Pagos no ano: 3889.00
}

type Granularity = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface CashFlowSeries {
  granularity: Granularity; // default "daily"
  points: CashFlowPoint[];
}

interface CashFlowPoint {
  date: string;            // "2026-05-23"
  label: string;           // "23.Mai"
  inflow: number;          // Entradas (realizado)
  inflowForecast: number;  // Entradas previstas
  outflow: number;         // Saídas (realizado, negativo)
  outflowForecast: number; // Saídas previstas
  balance: number;         // Saldo acumulado (realizado)
  balanceForecast: number; // Saldo previsto
}

interface CategoryBreakdown {
  type: 'revenue' | 'expense'; // toggle "Receita" | "Despesa"
  slices: { categoryId: string; name: string; value: number; color: string }[];
  // ex.: [{name:"Receitas de serviços",...}, {name:"Outros",...}]
}
```

---

## 12. Endpoints de API inferidos

> Todos **inferidos**. Base provável: `/api/clinica/financeiro/...` ou GraphQL.

| Bloco | Método/rota (inferido) | Query params | Retorno |
|---|---|---|---|
| Dashboard completo | `GET /api/financeiro/visao-geral` | `interval=2026-05-23&interval=2026-06-22` | `FinanceOverview` |
| KPIs de topo | `GET /api/financeiro/resumo` | `start`, `end` | `{revenue,expenses,toReceive,toPay}` |
| Fluxo de caixa | `GET /api/financeiro/fluxo-de-caixa` | `start`, `end`, `granularity=daily\|weekly\|monthly\|yearly` | `CashFlowSeries` |
| Contas financeiras | `GET /api/financeiro/contas-financeiras` | `start`, `end` | `{accounts[], totalBalance}` |
| A receber (resumo) | `GET /api/financeiro/contas-a-receber/resumo` | `start`, `end` | `ReceivableSummary` |
| A pagar (resumo) | `GET /api/financeiro/contas-a-pagar/resumo` | `start`, `end` | `PayableSummary` |
| Categorias | `GET /api/financeiro/categorias/resumo` | `start`, `end`, `type=revenue\|expense` | `CategoryBreakdown` |

Observações:
- O front pode fazer **1 chamada agregada** (dashboard) ou **N chamadas por card** (inferido — favorece skeleton por card).
- Trocar a aba do fluxo de caixa dispara `GET /fluxo-de-caixa?granularity=...` (sem recarregar a página).
- Trocar o toggle de Categorias dispara `GET /categorias/resumo?type=expense`.
- Alterar o período recarrega todos os blocos sensíveis ao período e atualiza a URL (`?interval=...`).

---

## 13. Regras e cálculos

> Fórmulas **inferidas** a partir dos rótulos e valores observados.

1. **Despesas/A pagar exibidos como negativo:** os KPIs "Despesas" (`-R$ 3.889`) e "A pagar" (`-R$ 3.380`) recebem prefixo "-" no front; o backend pode retornar valor absoluto.
2. **Saldo (cash flow):** `saldo_acumulado(dia) = saldo_acumulado(dia-1) + entradas(dia) - saídas(dia)`. A linha **Saldo** parte de um saldo inicial (das contas) e evolui. **Saldo previsto** = saldo realizado projetado com **entradas previstas** e **saídas previstas** dos dias futuros (regime de previsão/competência).
3. **Entradas vs. Entradas previstas:** "Entradas" = movimentos **liquidados/recebidos**; "Entradas previstas" = lançamentos **a receber** com vencimento na data (ainda não baixados). Idem para Saídas/Saídas previstas.
4. **Saldo total (Contas financeiras):** `Saldo total = Σ saldo de cada conta` = `2.431,00 (Banco padrão) + 0,00 (Caixa) = R$ 2.431,00`. ✔ confere.
5. **A receber — semântica das métricas:**
   - **Inadimplência** = total vencido e não recebido (R$ 780,00). Coincide com KPI "Vencidos" da Tela 28.
   - **Para hoje** = a receber com vencimento na data de hoje (R$ 4.550,00).
   - **Para este mês / este ano** = a receber com vencimento no mês/ano corrente (R$ 8.500,00 ambos — sugere que tudo do ano está concentrado no mês corrente).
   - **Recebidos no mês / no ano** = já recebido no mês/ano (R$ 6.320,00 ambos — coincide com KPI "Receitas" de topo).
6. **A pagar — semântica das métricas:**
   - **Em atraso** = total vencido e não pago (R$ 500,00).
   - **Para hoje** = a pagar com vencimento hoje (R$ 3.380,00 — coincide com KPI "A pagar" de topo).
   - **Para este mês / este ano** = R$ 7.269,00 ambos (coincide com "Total do período" da Tela 30 — Contas a pagar).
   - **Pagos no mês / no ano** = R$ 3.889,00 ambos (coincide com KPI "Despesas" de topo).
7. **Relação KPIs de topo ↔ cards de detalhe (validação cruzada):**
   - `Receitas (6.320) == A receber.Recebidos no mês (6.320,00)` ✔
   - `Despesas (3.889) == A pagar.Pagos no mês (3.889,00)` ✔
   - `A pagar topo (3.380) == A pagar.Para hoje (3.380,00)` ✔
   - `A receber topo (2.180)` **≠** `A receber.Para hoje (4.550,00)` — o KPI "A receber" de topo (2.180) parece ser **a receber líquido no período do filtro** (não "para hoje"); a diferença é esperada por janelas temporais distintas (inferido).
8. **Janelas temporais independentes do filtro:** métricas "Para este mês/ano" e "no mês/ano" usam **mês/ano-calendário corrente** (jun/2026 e 2026), não o intervalo do filtro de período. Os KPIs de topo e o gráfico de fluxo usam o **intervalo do filtro**.
9. **Categorias (pizza):** soma das fatias = total de receitas (ou despesas) do período; cada fatia = `valor_categoria / total`. Cores fixas por categoria.
10. **Formatação monetária pt-BR:** `R$ ` + milhar com ponto + decimal com vírgula. KPIs de topo arredondam para inteiro (sem centavos); demais blocos exibem 2 casas.

---

## 14. Fluxos

1. **Abrir a página:** usuário clica em "$" (sidebar) → "Visão geral". App carrega com período default (últimos 30 dias = 23/05–22/06/2026) e renderiza todos os blocos.
2. **Alterar período:** clica no chip "Período" → abre date range picker → seleciona intervalo → **Aplicar** → URL atualiza `?interval=...` → todos os blocos sensíveis ao período recarregam.
3. **Limpar filtros:** clica em "Limpar filtros" → reseta para o período default → recarrega.
4. **Mudar granularidade do fluxo de caixa:** clica em Semanal/Mensal/Anual → recarrega apenas o gráfico de Fluxo de caixa com nova agregação.
5. **Alternar Receita/Despesa (Categorias):** clica em "Despesa" → recarrega apenas o gráfico de pizza com categorias de despesa.
6. **Navegar para detalhe:**
   - "Ver todas" (Contas financeiras) → `/clinica/financeiro/contas-financeiras`.
   - "Ver todas" (A receber) → `/clinica/financeiro/contas-a-receber` (com o mesmo `interval`).
   - "Ver todas" (A pagar) → `/clinica/financeiro/contas-a-pagar` (com o mesmo `interval`).
7. **Hover em "?":** exibe tooltip explicativo (Fluxo de caixa / Categorias).
8. **Criar lançamento rápido:** botão flutuante "+" → fluxo de novo lançamento (fora desta tela).

---

## 15. Notas de implementação

- **Biblioteca de gráficos (inferido):** Recharts/Apex ou similar. Fluxo de caixa = *ComposedChart* (BarChart empilhado + LineChart); Categorias = *PieChart/Donut*. Manter paleta exata: Entradas=verde, Entradas previstas=verde claro, Saídas=vermelho, Saídas previstas=rosa, Saldo=azul, Saldo previsto=cinza.
- **Persistência do filtro na URL:** usar query string `interval` (par de datas ISO) para deep-link e refresh — alinhado às Telas 28–30. Propagar o `interval` ao navegar para "Ver todas".
- **Decoupling de janelas temporais:** cuidado para não confundir "período do filtro" (KPIs de topo + fluxo) com "mês/ano corrente" (cards de detalhe). Implementar como agregações separadas no backend.
- **Formatação:** centralizar formatter pt-BR (`Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'})`); aplicar regra de "sem centavos" só nos 4 KPIs de topo.
- **Cores semânticas:** verde para valores a receber/recebidos, vermelho para a pagar/pagos/atraso; prefixo "-" em Despesas e A pagar de topo.
- **Performance:** preferir carregamento por card (skeletons independentes) para o dashboard não bloquear no card mais lento.
- **Acessibilidade:** abas (Diária/Semanal/Mensal/Anual) e toggle (Receita/Despesa) com `role="tablist"`/`aria-pressed`; gráficos com `aria-label`/tabela alternativa de dados; tooltips "?" acessíveis via teclado.
- **Tooltips de gráfico:** ao hover em barra/ponto, exibir data + valor de cada série (Entradas/Saídas/Saldo) formatados em R$.
- **Estados vazios:** reusar o componente de empty state padrão do app ("Oops, nada foi encontrado!") quando aplicável; mensagens específicas para "sem contas financeiras" e "sem categorias".
- **Consistência de submenu:** garantir que o item "Visão geral" fique ativo (roxo) no submenu Financeiro quando nesta rota; validar a existência/permissão dos itens "Comissões" e "Integração maquininha" conforme plano/perfil do usuário.
