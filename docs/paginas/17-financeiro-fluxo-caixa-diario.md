# Financeiro / Fluxo de Caixa Diário

| Metadado | Valor |
|---|---|
| **Página** | Financeiro / Fluxo de caixa diário |
| **Rota** | `/financeiro/fluxo-de-caixa-diario/day` |
| **URL completa (do print)** | `app.clinicaexperts.com.br/financeiro/fluxo-de-caixa-diario/day?generic=transfer%3Atrue&generic=initial_balance%3Atrue&generic=net_a...` |
| **Módulo** | Financeiro |
| **Breadcrumb** | Financeiro / Fluxo de caixa diário |
| **Perfil do usuário (print)** | Lucas Bastos ("LB") |
| **Período exibido** | Junho de 2026 |
| **Idioma** | pt-BR |
| **Ambiente** | app.clinicaexperts.com.br (SaaS de gestão de clínicas) |
| **Referência cruzada** | `docs/04-telas-31-a-40.md` — Tela 33 |
| **Data da captura** | 2026-06-22 |

![](../../images/Captura de tela 2026-06-22 153426.png)

---

## 1. Identificação

- **Nome da tela:** Fluxo de caixa diário
- **Título do card (texto exato):** `Fluxo de caixa diário`
- **Rota base:** `/financeiro/fluxo-de-caixa-diario/day`
- **Sufixo de rota `/day`:** identifica a granularidade **diária** (a tela irmã usa `/month` — ver Tela 34, Fluxo de caixa mensal). (inferido)
- **Breadcrumb (texto exato, em roxo):** `Financeiro` / `Fluxo de caixa diário`
- **Ícone ativo na sidebar:** ícone de cifrão/Financeiro, destacado com fundo roxo arredondado.
- **Query string observada (texto exato, parcial):**
  - `generic=transfer%3Atrue` → `transfer:true` (incluir transferências)
  - `generic=initial_balance%3Atrue` → `initial_balance:true` (incluir saldo inicial)
  - `generic=net_a...` → truncado no print; (inferido) `net_amount:true` ou similar, correspondente a "Valor padrão: Líquido"

---

## 2. Objetivo

Apresentar o **fluxo de caixa dia a dia** dentro de um mês de referência, permitindo ao gestor da clínica avaliar a saúde de caixa diária: quanto entrou, quanto saiu, o resultado (lucro/prejuízo) e o saldo (inicial e final) de cada dia. A informação é apresentada em duas visões complementares e sincronizadas:

1. **Gráfico** combinado de barras (entradas verdes, saídas vermelhas) com linha de saldo (azul) acumulado ao longo do mês.
2. **Tabela** detalhada com uma linha por dia do mês, contendo saldo inicial, entrada, saída, lucro/prejuízo e saldo final.

Diferencia-se do **Extrato de movimentação** (Tela 31, lançamento a lançamento) e do **Relatório de competência** (Tela 32, regime de competência): aqui o foco é o **regime de caixa agregado por dia**. (inferido)

---

## 3. Navegação (toggle diário/mensal)

- **Seletor de período mensal** (centro da barra de filtros): setas `‹` (mês anterior) e `›` (mês seguinte) com rótulo central **`Junho de 2026`**. Ao navegar, recarrega gráfico e tabela para o novo mês mantendo a granularidade diária. (inferido)
- **Toggle diário/mensal:** a granularidade é determinada pelo segmento final da rota:
  - `/financeiro/fluxo-de-caixa-diario/day` → visão **diária** (esta tela).
  - `/financeiro/fluxo-de-caixa-mensal/month` → visão **mensal** (Tela 34).
  No print não há um botão de toggle explícito visível dentro do card; a alternância ocorre via item de menu/rota distinta. (inferido) Caso exista um segmented control diário/mensal, ele deve refletir o sufixo `/day` x `/month` da URL e preservar os filtros gerais. (inferido)
- **Breadcrumb clicável:** `Financeiro` leva ao índice/dashboard do módulo financeiro. (inferido)
- **Persistência de filtros na URL:** os filtros gerais são serializados em query string (`generic=...`), garantindo deep-link e preservação ao compartilhar/recarregar. (inferido)

---

## 4. Layout

Estrutura de cima para baixo, ignorando elementos do navegador (Brave) e do segundo monitor:

1. **Header do app (fundo branco):** hambúrguer `☰` + logo **clínicaexperts** à esquerda; à direita ícone de WhatsApp, ícone de busca, link **`Ajuda`** (com `?`), sino de notificações e avatar **`LB`** com borda verde.
2. **Sidebar vertical esquerda (estreita):** ícones empilhados; ícone Financeiro ativo (fundo roxo).
3. **Breadcrumb:** `Financeiro / Fluxo de caixa diário`.
4. **Card branco principal** (cantos arredondados, sombra leve, sobre fundo cinza claro), contendo:
   - **Cabeçalho do card:** título `Fluxo de caixa diário` à esquerda; botão `Exportar ⌄` à direita.
   - **Barra de filtros:** seletor de mês (`‹ Junho de 2026 ›`) + chip de "Filtros gerais" com `×` + link `+ Adicionar filtro`.
   - **Gráfico** (faixa superior do conteúdo) com legenda no topo direito.
   - **Tabela** por dia (faixa inferior, com rolagem vertical).
5. **Botão flutuante `+`** (canto inferior direito, roxo).
6. **Widget de gamificação/promoção** (canto inferior direito): faixa laranja `Ei, Lucas Bastos! Tô aqui guardando o seu desconto!` + card `0%` `Seu progresso`. (elemento global, não pertence à tela)

Largura: card centralizado com margens laterais generosas; conteúdo responsivo. (inferido)

---

## 5. Componentes

### 5.1 Cabeçalho do card
- **Título (texto exato):** `Fluxo de caixa diário`
- **Botão Exportar:** rótulo `Exportar` com ícone de seta para baixo `⌄` → abre dropdown de formatos. (ver Seção 10)

### 5.2 Barra de filtros
- **Seletor de mês:** `‹` | `Junho de 2026` | `›`
- **Chip "Filtros gerais" (texto exato):** `Filtros gerais:` seguido de `Transferência: Sim, Saldo inicial: Sim, Valor padrão: Líquido, Previsão: Não` e um botão `×` (limpar/remover o chip).
- **Link:** `+ Adicionar filtro` (roxo).

### 5.3 Cards de saldo inicial/final — VALORES EXATOS
**Observação importante:** No print desta tela **não existem cards/KPIs flutuantes separados** de "Saldo inicial" e "Saldo final" no topo do card (diferente das telas 31/32 que têm faixa de indicadores). Os valores de **Saldo inicial** e **Saldo final** aparecem **como colunas da tabela**, por dia.

Valores exatos visíveis nas linhas iniciais (dias 1 a 10), todos zerados:

| Conceito | Valor exato (dias 1–10) |
|---|---|
| Saldo inicial (R$) | `0,00` |
| Entrada (R$) | `0,00` |
| Saída (R$) | `0,00` |
| Lucro/Prejuízo (R$) | `0,00` |
| Saldo final (R$) | `0,00` |

A movimentação concentra-se nos dias **17 a 22** (conforme o gráfico), fora da faixa de linhas visível no print. (inferido)

### 5.4 Gráfico
- **Tipo:** gráfico combinado — barras verticais (entradas/saídas) + linha (saldo). (inferido: biblioteca tipo ECharts/Recharts)
- **Legenda (topo direito, textos exatos):**
  - `Entradas` — marcador **verde**
  - `Saídas` — marcador **vermelho**
  - `Saldo` — **linha azul** (marcador de linha `—`)
- **Eixo Y (rótulos exatos, de cima para baixo):** `R$ 3k`, `R$ 2k`, `R$ 1k`, `R$ 500`, `-R$ 500`, `-R$ 1k`
- **Eixo X (rótulos exatos):** `1 Jun`, `2 Jun`, `3 Jun`, ... `30 Jun` (um tick por dia do mês).
- **Séries:**
  - Barras **verdes** = Entradas do dia.
  - Barras **vermelhas** = Saídas do dia.
  - Linha **azul** contínua = Saldo (acumulado), partindo de patamar próximo de zero e variando conforme entradas/saídas.
- **Comportamento visual no print:** linha de saldo plana próxima de zero entre 1 e 16 Jun; atividade concentrada entre **17 e 22 Jun** com barras altas (pico verde em ~22 Jun chegando perto de `R$ 2k`/`R$ 3k`), retornando a patamar estável após 23 Jun.
- **Tooltip ao passar o mouse:** exibe dia + valores de Entradas/Saídas/Saldo. (inferido)

### 5.5 Botões
- `Exportar ⌄` (cabeçalho).
- `‹` e `›` (navegação de mês).
- `×` (limpar chip de filtros gerais).
- `+ Adicionar filtro`.
- `+` flutuante (global — adicionar lançamento). (inferido)

---

## 6. Tabela (por dia)

### 6.1 Colunas (textos exatos, na ordem do print)

| # | Cabeçalho (texto exato) | Ícone | Alinhamento | Observação |
|---|---|---|---|---|
| 1 | `Dia` | — | esquerda | Número do dia do mês (1, 2, 3, …). No print o `1` aparece em destaque/cor (vermelho), demais em cinza. (inferido: destaque = dia atual ou primeiro) |
| 2 | `Saldo inicial (R$)` | — | direita | Saldo no início do dia (= saldo final do dia anterior). |
| 3 | `Entrada (R$)` | seta verde `↙`/para baixo | direita | Total de entradas (receitas recebidas) no dia. |
| 4 | `Saída (R$)` | seta vermelha `↗`/para cima | direita | Total de saídas (despesas pagas) no dia. |
| 5 | `Lucro/Prejuizo (R$)` | — | direita | **Texto exato do print:** `Lucro/Prejuizo (R$)` (sem acento em "Prejuizo"). = Entrada − Saída. |
| 6 | `Saldo final (R$)` | — | direita | Saldo no fim do dia = Saldo inicial + Lucro/Prejuízo. |

> **Nota textual (load-bearing):** o cabeçalho da coluna 5 está grafado **`Lucro/Prejuizo (R$)`** (sem acento agudo no "i"). Reproduzir exatamente como no produto, mesmo sendo provável erro de digitação.

### 6.2 Dados de exemplo (linhas visíveis no print — dias 1 a 10)

| Dia | Saldo inicial (R$) | Entrada (R$) | Saída (R$) | Lucro/Prejuizo (R$) | Saldo final (R$) |
|---|---|---|---|---|---|
| 1 | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 |
| 2 | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 |
| 3 | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 |
| 4 | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 |
| 5 | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 |
| 6 | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 |
| 7 | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 |
| 8 | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 |
| 9 | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 |
| 10 | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 |

(Os dias 11 a 30 seguem por rolagem; dias 17–22 contêm os valores não nulos refletidos no gráfico.) (inferido)

### 6.3 Totais
- No print não há uma **linha de total** visível dentro da viewport. (inferido) Espera-se uma linha de rodapé `Total` somando Entrada e Saída do mês e exibindo o Saldo final do último dia. Formatação: mesmas casas decimais (`#.##0,00`), receitas em verde e despesas em vermelho. (inferido)

### 6.4 Formatação de células
- **Moeda:** padrão brasileiro `#.##0,00`, com cabeçalho indicando `(R$)` (sem repetir o símbolo em cada célula — as células mostram apenas `0,00`).
- **Cores:** valores de Entrada em verde; Saída em vermelho; Lucro/Prejuízo positivo em verde e negativo em vermelho (com sinal `-`); Saldo final neutro/preto, negativo em vermelho. (inferido)

---

## 7. Formulários

Esta tela é **somente leitura** (relatório). Não há formulários de cadastro/edição na própria tela. (inferido)

- O único "formulário" é o **construtor de filtros** acionado por `+ Adicionar filtro` (ver Seção 8) e o conteúdo editável do chip **Filtros gerais**.
- Novos lançamentos que afetam o fluxo são criados em outras telas (Extrato, contas a pagar/receber) ou pelo botão flutuante `+`. (inferido)

---

## 8. Filtros

### 8.1 Filtro de período (mês)
- Controle `‹ Junho de 2026 ›`. Define o mês de referência; granularidade diária fixa pela rota `/day`.

### 8.2 Filtros gerais (chip — textos e valores exatos do print)
Chip único rotulado `Filtros gerais:` com os parâmetros:

| Parâmetro (texto exato) | Valor no print | Efeito (inferido) | Query string (inferida) |
|---|---|---|---|
| `Transferência` | `Sim` | Incluir transferências entre contas no cálculo | `transfer:true` |
| `Saldo inicial` | `Sim` | Considerar o saldo inicial das contas | `initial_balance:true` |
| `Valor padrão` | `Líquido` | Usar valor **líquido** (x bruto) | `net_amount:true` / `default_value:net` |
| `Previsão` | `Não` | **Não** incluir lançamentos previstos (apenas realizados) | `forecast:false` |

- Botão `×` no chip → remove/limpa os filtros gerais (volta ao padrão). (inferido)

### 8.3 Adicionar filtro
- `+ Adicionar filtro` abre um menu/popover para adicionar critérios extras. (inferido) Critérios prováveis: **Conta** (filtrar por conta financeira — Banco padrão, Caixa), **Categoria**, **Método de pagamento**, **Intervalo de datas customizado**. (inferido)

### 8.4 Filtro por conta (inferido)
- Embora não visível como chip dedicado no print, a presença de múltiplas contas (Tela 36: Banco padrão, Caixa) sugere um filtro de **conta** disponível via `+ Adicionar filtro`, permitindo restringir o fluxo a uma conta específica ou consolidar todas. (inferido)

---

## 9. Estados

- **Estado populado parcial (print atual):** mês com dados; muitos dias com `0,00` e poucos dias (17–22) com movimentação. Tabela rolável; gráfico mostra barras apenas nos dias com lançamento.
- **Estado vazio (mês sem movimentação):** tabela exibiria todas as linhas com `0,00`; gráfico com linha de saldo plana em zero e sem barras. (inferido) Pode exibir mensagem padrão do app `Hmm, está vazio por aqui!` / `Nenhum registro encontrado.` caso o backend retorne lista vazia, embora em fluxo de caixa o mais provável seja mostrar os dias zerados. (inferido)
- **Estado de carregamento:** skeleton/placeholder no gráfico e na tabela enquanto carrega o mês. (inferido)
- **Estado de erro:** mensagem de falha ao carregar com opção de tentar novamente. (inferido)
- **Destaque do dia atual:** dia `1` aparece em cor diferenciada no print; (inferido) destaque do dia corrente/selecionado.

---

## 10. Modais

- **Dropdown Exportar** (acionado por `Exportar ⌄`): menu com formatos de exportação. Opções prováveis: `PDF`, `Excel`, `CSV`. (inferido) Pode gerar download direto ou abrir modal de confirmação de período/colunas. (inferido)
- **Popover "Adicionar filtro"** (acionado por `+ Adicionar filtro`): seletor de critérios (conta, categoria, datas, método). (inferido)
- **Editor de Filtros gerais** (ao clicar no chip): popover/modal para alternar `Transferência`, `Saldo inicial`, `Valor padrão` (Líquido/Bruto) e `Previsão` (Sim/Não). (inferido)
- **Tooltip do gráfico:** ao passar o mouse sobre um dia, exibe Entradas/Saídas/Saldo daquele dia. (inferido)
- Não há modais de criação/edição de registros nesta tela. (inferido)

---

## 11. Modelo de dados inferido

```jsonc
// Item da série diária (uma entrada por dia do mês de referência)
DailyCashFlowEntry {
  "date": "2026-06-17",        // ISO date (string)
  "day": 17,                   // número do dia (1..31)
  "opening_balance": 500.00,   // Saldo inicial (R$) = closing do dia anterior
  "income": 1800.00,           // Entrada (R$) — total de entradas do dia
  "expense": 1200.00,          // Saída (R$) — total de saídas do dia
  "net": 600.00,               // Lucro/Prejuízo (R$) = income - expense
  "closing_balance": 1100.00   // Saldo final (R$) = opening_balance + net
}

// Resposta do relatório
DailyCashFlowReport {
  "period": { "year": 2026, "month": 6, "label": "Junho de 2026" },
  "granularity": "day",
  "filters": {
    "transfer": true,
    "initial_balance": true,
    "value_mode": "net",       // "net" (Líquido) | "gross" (Bruto)
    "forecast": false,
    "account_id": null         // (inferido) filtro por conta, null = todas
  },
  "series": [ /* DailyCashFlowEntry[] — 30 itens p/ junho */ ],
  "totals": {
    "income": 6320.00,         // (inferido, base Tela 34)
    "expense": 3889.00,
    "net": 2431.00,
    "closing_balance": 2431.00
  },
  "chart": {
    "y_axis_ticks": [3000, 2000, 1000, 500, -500, -1000],
    "series": ["income", "expense", "balance"]
  }
}

// Conta financeira (para filtro por conta — ref. Tela 36)
Account {
  "id": "...",
  "name": "Banco padrão",      // | "Caixa"
  "type": "checking",          // "checking" (Conta Corrente) | "cash" (Caixa)
  "current_balance": 2431.00
}
```

(Todos os nomes de campos são inferidos a partir da UI e das telas relacionadas 31–36.)

---

## 12. Endpoints API inferidos

> Todos inferidos a partir da rota, da query string e do comportamento da tela.

| Método | Endpoint (inferido) | Descrição |
|---|---|---|
| `GET` | `/api/financeiro/fluxo-de-caixa-diario` | Retorna a série diária + totais do mês. Query: `?year=2026&month=6&transfer=true&initial_balance=true&value_mode=net&forecast=false&account_id=` |
| `GET` | `/api/financeiro/fluxo-de-caixa-diario/day` | Variante alinhada à rota com sufixo `/day` (granularidade diária). |
| `GET` | `/api/financeiro/contas` | Lista de contas para o filtro de conta (ref. Tela 36 `/financeiro/contas/`). |
| `GET` | `/api/financeiro/fluxo-de-caixa-diario/export` | Exportação (PDF/Excel/CSV). Query: `?format=pdf|xlsx|csv&year=2026&month=6&...` |
| `GET` | `/api/financeiro/categorias-de-contas` | Categorias, caso filtro por categoria seja oferecido em "Adicionar filtro". |

Parâmetros de query observados na URL real (mapeamento inferido):
- `generic=transfer:true` → `transfer=true`
- `generic=initial_balance:true` → `initial_balance=true`
- `generic=net_a...` (truncado) → (inferido) `net_amount=true` / `value_mode=net`

---

## 13. Regras / cálculos

### 13.1 Cálculos por dia
1. **Entrada (R$)** = soma dos lançamentos de **entrada** (receitas) com data de caixa no dia.
   - Modo `Líquido`: usa o valor líquido; modo `Bruto`: usa o valor bruto. (controlado por "Valor padrão")
2. **Saída (R$)** = soma dos lançamentos de **saída** (despesas) com data de caixa no dia.
3. **Lucro/Prejuízo (R$)** = `Entrada − Saída` (positivo = lucro/verde; negativo = prejuízo/vermelho com sinal `-`).
4. **Saldo inicial (R$)** do dia `d` = **Saldo final** do dia `d-1`.
   - Para o primeiro dia do mês: saldo final do último dia do mês anterior (ou saldo de abertura das contas, se "Saldo inicial: Sim"). (inferido)
5. **Saldo final (R$)** do dia `d` = `Saldo inicial(d) + Lucro/Prejuízo(d)`.

### 13.2 Saldo acumulado diário (encadeamento)
- A linha azul **Saldo** do gráfico representa o **saldo acumulado**: começa no saldo inicial do mês e, a cada dia, soma o lucro/prejuízo do dia.
  - `Saldo(d) = Saldo(d-1) + Entrada(d) − Saída(d)`
- O **Saldo final** de cada linha da tabela é exatamente esse acumulado no fim do dia. O encadeamento é contínuo: o saldo final de um dia é o saldo inicial do dia seguinte (mesma regra que encadeia meses na Tela 34).

### 13.3 Efeito dos filtros gerais nos cálculos
- **Transferência = Sim:** transferências entre contas entram nas entradas/saídas (quando consolidando contas, podem se anular; quando filtrado por uma conta, aparecem). (inferido)
- **Saldo inicial = Sim:** considera o saldo de abertura das contas no ponto de partida do acumulado.
- **Valor padrão = Líquido:** usa valor líquido (descontadas taxas/retenções) em vez do bruto.
- **Previsão = Não:** considera apenas lançamentos **realizados** (pagos/recebidos); previstos/em aberto são excluídos. (inferido)

### 13.4 Formatação/arredondamento
- Moeda BRL com 2 casas decimais, separador de milhar `.` e decimal `,` (`#.##0,00`).
- Valores zero exibidos como `0,00`. (inferido) Não há símbolo `R$` repetido por célula — apenas no cabeçalho `(R$)`.

---

## 14. Fluxos

1. **Consultar fluxo do mês corrente:** usuário acessa a tela → sistema carrega mês atual (`Junho de 2026`) com filtros gerais padrão → renderiza gráfico + tabela.
2. **Trocar de mês:** clicar `‹`/`›` → recarrega série do mês selecionado, preservando filtros gerais → atualiza gráfico e tabela. (inferido)
3. **Ajustar filtros gerais:** clicar no chip `Filtros gerais` (ou em `+ Adicionar filtro`) → alternar Transferência/Saldo inicial/Valor padrão/Previsão → recalcula série e acumulado → atualiza URL (`generic=...`). (inferido)
4. **Limpar filtros:** clicar `×` no chip → volta ao conjunto padrão. (inferido)
5. **Filtrar por conta:** `+ Adicionar filtro` → escolher conta (Banco padrão/Caixa) → série recalculada para a conta. (inferido)
6. **Inspecionar um dia:** hover no gráfico → tooltip com Entradas/Saídas/Saldo do dia; rolar a tabela até o dia correspondente. (inferido)
7. **Exportar:** clicar `Exportar ⌄` → escolher formato → download do relatório do mês com filtros aplicados. (inferido)
8. **Drill-down (inferido):** clicar em um dia/linha pode levar ao Extrato de movimentação filtrado por aquele dia. (inferido — não confirmado no print)

---

## 15. Notas de implementação

- **Reproduzir textos exatos**, incluindo a grafia **`Lucro/Prejuizo (R$)`** sem acento (provável typo do produto — manter para fidelidade).
- **Sincronização gráfico ↔ tabela:** ambos consomem a mesma série `DailyCashFlowEntry[]`. O gráfico plota `income` (barra verde), `expense` (barra vermelha) e `closing_balance`/acumulado (linha azul).
- **Eixo Y do gráfico** deve acomodar valores negativos (até `-R$ 1k` no print); ticks observados: `R$ 3k, R$ 2k, R$ 1k, R$ 500, -R$ 500, -R$ 1k`. Escala dinâmica conforme amplitude do mês. (inferido)
- **Eixo X:** um tick por dia (`1 Jun` … `30 Jun`); rótulos rotacionados para caber. Ajustar para meses de 28/29/30/31 dias.
- **Persistência de filtros via query string** (`generic=chave%3Avalor`): manter deep-link e estado ao recarregar/compartilhar.
- **Granularidade pela rota:** `/day` (esta tela) x `/month` (Tela 34) — reaproveitar o mesmo componente de relatório parametrizando granularidade e período.
- **Performance:** série de até 31 itens — leve; gráfico e tabela podem renderizar client-side após uma única chamada GET. (inferido)
- **Acessibilidade:** cores verde/vermelho/azul precisam de rótulos textuais (legenda já presente) e valores na tabela para usuários daltônicos. (inferido)
- **Localização:** pt-BR; meses por extenso (`Junho de 2026`), dias abreviados (`1 Jun`), moeda BRL.
- **Elementos globais a ignorar na implementação da tela:** widget de gamificação laranja, botão flutuante `+`, header/sidebar (componentes compartilhados).
- **Coerência contábil:** garantir que `Saldo final(d) == Saldo inicial(d+1)` e que `Saldo final` do último dia do mês == `Saldo inicial` do primeiro dia do mês seguinte (Tela 34 confirma o encadeamento: Junho fecha em `2.431,00`, Julho abre em `2.431,00`).
