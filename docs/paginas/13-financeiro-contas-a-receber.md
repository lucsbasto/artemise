# Financeiro / Contas a Receber

| Metadado | Valor |
|---|---|
| **Página** | Financeiro / Contas a receber |
| **Rota** | `/clinica/financeiro/contas-a-receber?interval=2026-05-23&interval=2026-06-22` |
| **URL completa** | `app.clinicaexperts.com.br/clinica/financeiro/contas-a-receber?interval=2026-05-23&interval=2026-06-22` |
| **Breadcrumb** | `Financeiro / Contas a receber` |
| **Módulo** | Financeiro |
| **Idioma** | pt-BR |
| **Telas de referência** | 28 e 29 (`docs/03-telas-21-a-30.md`) |
| **Capturas** | `153343.png` (sidebar colapsada) · `153352.png` (submenu Financeiro expandido) |
| **Tipo de tela** | Listagem com KPIs, filtros, tabela e ações em lote |
| **Permissão (inferido)** | Acesso ao módulo Financeiro da clínica |

![](../../images/Captura de tela 2026-06-22 153343.png)

![](../../images/Captura de tela 2026-06-22 153352.png)

---

## 1. Identificação

- **Nome da página:** Contas a receber.
- **Módulo:** Financeiro.
- **Rota:** `/clinica/financeiro/contas-a-receber`.
- **Query string observada:** `?interval=2026-05-23&interval=2026-06-22` — o parâmetro `interval` aparece **duas vezes** (data inicial e data final do período de liquidação). Formato `YYYY-MM-DD`. Os valores correspondem ao chip "Período de liquidação: 23/05/2026 – 22/06/2026".
- **Breadcrumb:** `Financeiro / Contas a receber` (em roxo, abaixo do header).
- **Título da área de conteúdo:** **Contas a receber** seguido do contador **15 registros**.
- **Subtítulo / contexto:** lista de recebíveis (receitas) da clínica no período selecionado.

---

## 2. Objetivo

Listar e gerenciar todas as **contas a receber** (receitas/recebíveis) da clínica dentro de um período de liquidação, exibindo:

- Indicadores consolidados (KPIs) por status: vencidos, vencem hoje, a vencer, a receber, recebidos e total do período.
- Tabela detalhada de cada lançamento com vencimento, recebimento, descrição, categoria, método, situação e valor líquido.
- Ações de baixa (registrar recebimento), edição e exclusão por lançamento, além de ações em lote, exportação e filtros.

A página é a contraparte de **Contas a pagar** (Tela 30) e é alimentada por vendas/orçamentos do PDV e lançamentos financeiros de pacientes (Tela 21).

---

## 3. Navegação

### 3.1 Sidebar de ícones (esquerda, estreita)

Barra vertical roxa/branca com ícones de módulos (de cima para baixo): coroa (planos/upgrade), foguete/atalho, casa (início), calendário (agenda), pessoas (Contatos), estetoscópio (clínico), carrinho (vendas/PDV), **cifrão "$" — Financeiro (destacado em roxo nesta tela)**, selo/percentual (marketing), caixa/cubo (estoque), balão de chat (mensagens), campanha/automação (badge verde), coração (fidelização), engrenagem (configurações). Seta ">" no rodapé para expandir rótulos.

### 3.2 Submenu lateral "Financeiro" (Tela 29 — expandido)

Ao clicar no ícone "$", abre-se o painel de submenu com o título **Financeiro** e os seguintes itens, na ordem exata:

| # | Item do submenu | Rota inferida |
|---|---|---|
| 1 | **Visão geral** | `/clinica/financeiro/visao-geral` |
| 2 | **Contas a receber** *(ativo, roxo)* | `/clinica/financeiro/contas-a-receber` |
| 3 | **Contas a pagar** | `/clinica/financeiro/contas-a-pagar` |
| 4 | **Extrato de movimentações** | `/clinica/financeiro/extrato-de-movimentacoes` (inferido) |
| 5 | **Relatório de competência** | `/clinica/financeiro/relatorio-de-competencia` (inferido) |
| 6 | **Fluxo de caixa diário** | `/clinica/financeiro/fluxo-de-caixa-diario` (inferido) |
| 7 | **Fluxo de caixa mensal** | `/clinica/financeiro/fluxo-de-caixa-mensal` (inferido) |
| 8 | **Relatório de categorias** | `/clinica/financeiro/relatorio-de-categorias` (inferido) |
| 9 | **Contas financeiras** | `/clinica/financeiro/contas-financeiras` (inferido) |
| 10 | **Categorias de contas** | `/clinica/financeiro/categorias-de-contas` (inferido) |
| 11 | **Métodos de pagamento** | `/clinica/financeiro/metodos-de-pagamento` (inferido) |
| 12 | **Integração maquininha** | `/clinica/financeiro/integracao-maquininha` (inferido) |

> Na Tela 29, ao passar o mouse sobre **Contas a pagar**, o navegador exibe no rodapé o tooltip de link `https://app.clinicaexperts.com.br/clinica/financeiro/contas-a-pagar` — confirmando a rota desse item.

### 3.3 Header (topo)

Logo **clínicaexperts** (símbolo "C" roxo + wordmark) + hambúrguer (☰) à esquerda. À direita: ícone WhatsApp (fundo rosa), ícone busca/atalhos (lupa "+"), link **Ajuda** (?), sino de notificações (com badge), avatar **LB** (círculo verde — Lucas Bastos).

### 3.4 Breadcrumb

`Financeiro / Contas a receber` (roxo).

---

## 4. Layout

Estrutura de três zonas horizontais + conteúdo central:

1. **Sidebar de ícones** (extrema esquerda) — sempre visível. Na Tela 29 há o painel de submenu "Financeiro" adicional logo à direita dela.
2. **Header** (topo) — full width.
3. **Área de conteúdo central** — um **card branco** centralizado (com margens laterais cinza-claro de fundo), contendo, de cima para baixo:
   - **Linha 1 (cabeçalho do card):** título **Contas a receber** + contador **15 registros** à esquerda; botões **Ações em lote ▾** e **Exportar ▾** à direita.
   - **Linha 2 (filtros):** chip **Período de liquidação: 23/05/2026 – 22/06/2026**, link **+ Adicionar filtro**, e campo **Buscar** à direita.
   - **Linha 3 (KPIs):** seis cards-resumo em linha (com ponto colorido + ícone "?"), o último (**Total do período**) selecionado com borda inferior roxa.
   - **Linha 4 em diante (tabela):** cabeçalho de colunas + linhas de lançamentos, com scroll vertical.
   - **Rodapé do card (inferido):** paginação padrão (**25 por página**, controles `« ‹ [1] › »`).

Elementos flutuantes globais: botão **"+"** roxo (canto inferior direito), banner laranja de onboarding **"Ei, Lucas Bastos! Tô aqui guardando o seu desconto!"** e card **"Seu progresso 0%"**.

---

## 5. Componentes

### 5.1 Cabeçalho do card

- **Título:** `Contas a receber`.
- **Contador:** `15 registros` (texto cinza, ao lado do título).
- **Botão "Ações em lote ▾":** cinza/desabilitado por padrão; habilita ao marcar ≥1 checkbox na tabela. Abre dropdown com ações em massa (baixar/conciliar/excluir — inferido).
- **Botão "Exportar ▾":** dropdown de exportação (CSV/Excel/PDF — inferido). Texto exato: **Exportar**.

### 5.2 Cards de totais (KPIs) — VALORES EXATOS

Seis cards em linha, cada um com um ponto colorido, rótulo, ícone de ajuda "?" e o valor em destaque:

| KPI | Cor do ponto | Valor exato |
|---|---|---|
| **Vencidos** | vermelho | **R$ 780,00** |
| **Vencem hoje** | laranja/amarelo | **R$ 1.400,00** |
| **A vencer** | azul | **R$ 0,00** |
| **A receber** | azul | **R$ 0,00** |
| **Recebidos** | verde | **R$ 6.320,00** |
| **Total do período** | azul *(card selecionado, borda inferior roxa)* | **R$ 8.500,00** |

- Cada card é **clicável** e atua como filtro rápido por status (inferido). O **Total do período** está ativo/selecionado na captura.
- Cada rótulo tem um ícone **"?"** (tooltip explicativo do KPI).

### 5.3 Badges de situação (status)

Exibidos na coluna **Situação** da tabela:

| Badge (texto exato) | Cor | Significado |
|---|---|---|
| **Recebido** | verde | lançamento liquidado/recebido |
| **Em atraso** | vermelho/rosa | vencido e não recebido |
| **Em aberto** | laranja/amarelo | pendente, ainda não vencido ou aguardando baixa |

- Linhas **Em atraso** têm uma **barra vermelha vertical** na borda esquerda da linha e um **ícone de relógio (⏱)** na coluna Recebimento.

### 5.4 Botão "Novo lançamento"

- Não há botão textual "Novo lançamento" no cabeçalho. A criação é feita pelo **botão flutuante "+"** roxo (canto inferior direito). Texto exato: nenhum (ícone "+"). *(inferido: abre modal de novo recebimento — ver Seção 10.)*

### 5.5 Campo de busca

- **Buscar** (placeholder), canto direito da linha de filtros. Busca textual sobre descrição/paciente (inferido).

---

## 6. Tabela

### 6.1 Colunas (ordem e textos exatos)

| # | Coluna | Ordenável (◆) | Conteúdo |
|---|---|---|---|
| 0 | *(checkbox)* | — | seleção de linha; cabeçalho com select-all |
| 1 | **Vencimento** | sim | data (formato `DD/MM`, ex. `17/06`) |
| 2 | **Recebimento** | sim | data de recebimento (`DD/MM`); quando atrasado/pendente exibe ícone de relógio ⏱ amarelo |
| 3 | **Descrição** | sim | nome do lançamento (ex. `Massagem Relaxante`) |
| 4 | **Categoria** | sim | categoria (truncado: `Receitas d...` → "Receitas de serviços", inferido) |
| 5 | **Método** | sim | ícone da forma de pagamento (cartão, dinheiro, etc.) |
| 6 | **Situação** | não | badge de status (Recebido / Em atraso / Em aberto) |
| 7 | **Valor líquido (R$)** | sim (com "?") | valor líquido, alinhado à direita (ex. `150,00`) |
| 8 | *(engrenagem)* | — | configurar colunas visíveis |
| 9 | *(⋮)* | — | menu de ações por linha |

> Observação: nesta página de **Contas a receber** a coluna do "cliente/paciente" não aparece como coluna dedicada — o paciente/cliente associado é inferido a partir da descrição ou exibido no detalhe/modal. *(inferido)* A spec mantém "paciente/cliente" como campo do modelo de dados (Seção 11).

### 6.2 Dados de exemplo (linhas exatas — 13 visíveis de 15 registros)

| Vencimento | Recebimento | Descrição | Categoria | Situação | Valor líq (R$) |
|---|---|---|---|---|---|
| 17/06 | 17/06 | Massagem Relaxante | Receitas d... | Recebido | 150,00 |
| 17/06 | 17/06 | Preenchimento Facial | Receitas d... | Recebido | 1.800,00 |
| 17/06 | 17/06 ⏱ | Venda de Cremes Anti-idade | Receitas d... | Em atraso | 350,00 |
| 18/06 | 18/06 ⏱ | Drenagem Linfática | Receitas d... | Em atraso | 180,00 |
| 18/06 | 18/06 | Microagulhamento | Receitas d... | Recebido | 600,00 |
| 19/06 | 19/06 | Limpeza de Pele | Receitas d... | Recebido | 200,00 |
| 19/06 | 19/06 | Venda de Produtos Cosméticos | Receitas d... | Recebido | 120,00 |
| 19/06 | 19/06 | Peeling Físico | Receitas d... | Recebido | 300,00 |
| 19/06 | 19/06 ⏱ | Tratamento Acne | Receitas d... | Em atraso | 250,00 |
| 22/06 | 22/06 | Peeling Químico | Receitas d... | Recebido | 350,00 |
| 22/06 | 22/06 | Toxina Botulínica | Receitas d... | Recebido | 1.300,00 |
| 22/06 | 22/06 ⏱ | Consulta de Avaliações | Receitas d... | Em aberto | 100,00 |
| 22/06 | 22/06 ⏱ | Laser CO2 | Receitas d... | Em aberto | 900,00 |

> Há **15 registros** no total; a captura mostra 13 (mais 2 abaixo da dobra). Soma dos valores visíveis = R$ 6.600,00; o **Total do período** declarado é R$ 8.500,00 (inclui os 2 registros não visíveis).

### 6.3 Ações por linha (menu ⋮)

*(inferido a partir do padrão e do botão "?" de baixa)*

- **Receber / Dar baixa** — registra o recebimento (abre modal de recebimento, ver Seção 10/14).
- **Editar** — abre formulário do lançamento.
- **Excluir** — remove o lançamento (com confirmação).
- *(possíveis adicionais: Duplicar, Conciliar, Ver detalhes.)*

### 6.4 Ordenação

- Colunas com ◆ são ordenáveis (Vencimento, Recebimento, Descrição, Categoria, Método, Valor líquido).
- Clique alterna asc/desc (inferido). Ordenação default aparente: por **Vencimento** crescente (17/06 → 22/06).

### 6.5 Paginação

- Padrão do sistema: seletor **25 por página** (dropdown) à esquerda; controles `« ‹ [1] › »` à direita, página atual em roxo. *(rodapé abaixo da dobra na captura — inferido pelo padrão das demais listagens.)*

### 6.6 Rodapé / totais

- O total consolidado é mostrado pelos KPIs (Seção 5.2), não há linha de "total" no rodapé da tabela. *(inferido)*

---

## 7. Formulários

O formulário de criação/edição de uma conta a receber (acessado via "+" flutuante ou ação "Editar") contém, de forma inferida (alinhado ao padrão de lançamento financeiro do sistema):

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| **Descrição** | texto | sim | nome do lançamento |
| **Cliente / Paciente** | select (busca) | não | vínculo com contato; link "+ Adicionar" |
| **Categoria** | select | sim | ex. "Receitas de serviços" |
| **Conta financeira** | select | sim | ex. "Banco padrão", "Caixa" |
| **Método de pagamento** | select | não | cartão, dinheiro, PIX, etc. |
| **Valor (R$)** | numérico/monetário | sim | valor bruto |
| **Desconto / Acréscimo** | numérico | não | ajusta valor líquido |
| **Vencimento** | data | sim | `DD/MM/AAAA` |
| **Recebimento** | data | não | preenchido ao dar baixa |
| **Situação** | derivado | — | calculado (Recebido/Em aberto/Em atraso) |
| **Recorrência / Parcelas** | grupo | não | gerar múltiplas parcelas (inferido) |
| **Observações** | textarea | não | — |

Botão de envio: **Salvar** (roxo). *(todos os campos acima marcados como inferidos, exceto os refletidos diretamente nas colunas da tabela.)*

---

## 8. Filtros

### 8.1 Filtro de período (ativo)

- Chip: **Período de liquidação: 23/05/2026 – 22/06/2026**.
- Mapeado para a query string `?interval=2026-05-23&interval=2026-06-22` (duas ocorrências de `interval`: início e fim).
- Clicável para abrir seletor de datas (date range picker — inferido).

### 8.2 Adicionar filtro

- Link **+ Adicionar filtro** (roxo) abre painel/dropdown de filtros adicionais. Filtros inferidos disponíveis:
  - **Status / Situação:** Recebido (pago) / Em aberto (pendente) / Em atraso (vencido). *(coincide com os badges e KPIs clicáveis.)*
  - **Categoria:** seleção de categoria de receita.
  - **Conta financeira / Conta:** banco padrão, caixa, etc.
  - **Método de pagamento.**
  - **Cliente / Paciente.**

### 8.3 KPIs como filtro rápido

- Cada card-KPI (Vencidos, Vencem hoje, A vencer, A receber, Recebidos, Total do período) atua como atalho de filtro por status ao ser clicado (inferido). "Total do período" ativo na captura.

### 8.4 Busca textual

- Campo **Buscar** filtra por descrição/cliente (inferido).

---

## 9. Estados

### 9.1 Estado com dados (capturado)

15 registros, KPIs preenchidos, "Total do período" selecionado.

### 9.2 Estado vazio (inferido — padrão do sistema, ver Tela 22)

Quando os filtros não retornam registros:
- Ícone de lupa em círculo roxo-claro.
- Título: **Oops, nada foi encontrado!**
- Texto: **Os filtros selecionados não correspondem a nenhum registro.**
- Botões: **Limpar filtros** (contorno roxo) e **+ Adicionar novo** (roxo preenchido).

### 9.3 Estados de linha

- **Em atraso:** barra vermelha na borda esquerda + relógio ⏱ na coluna Recebimento + badge vermelho.
- **Em aberto:** badge laranja.
- **Recebido:** badge verde.

### 9.4 Carregamento (inferido)

- Skeleton/loader na área da tabela enquanto carrega.

---

## 10. Modais

### 10.1 Modal "Novo recebimento" / "Dar baixa" (inferido)

Acionado pela ação **Receber** (menu ⋮) ou pelo botão "+". Campos inferidos:

| Campo | Tipo | Observação |
|---|---|---|
| **Descrição** | texto | herda do lançamento |
| **Cliente / Paciente** | select | — |
| **Valor a receber** | monetário | valor pendente |
| **Valor recebido** | monetário | permite **baixa parcial** (valor < total) |
| **Data de recebimento** | data | default = hoje |
| **Conta financeira** | select | onde o valor entra (Banco padrão / Caixa) |
| **Método de pagamento** | select | cartão / dinheiro / PIX / etc. |
| **Desconto / Juros / Multa** | monetário | ajustes na baixa |
| **Observações** | textarea | — |

Botões: **Salvar** / **Confirmar recebimento** (roxo) e **Cancelar** / **×**. *(modal inferido — não capturado diretamente.)*

### 10.2 Modal de confirmação de exclusão (inferido)

Diálogo "Tem certeza?" com **Excluir** (vermelho) / **Cancelar**.

---

## 11. Modelo de dados

### 11.1 Entidade `ContaReceber` / `Lancamento` (recebível)

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | UUID/int | identificador |
| `descricao` | string | nome do lançamento (ex. "Massagem Relaxante") |
| `cliente_id` / `paciente_id` | FK nullable | contato vinculado |
| `categoria_id` | FK | categoria de receita (ex. "Receitas de serviços") |
| `conta_financeira_id` | FK | conta de destino (Banco padrão / Caixa) |
| `metodo_pagamento_id` | FK nullable | forma de pagamento |
| `valor_bruto` | decimal(10,2) | valor cheio |
| `desconto` | decimal(10,2) | desconto aplicado |
| `juros_multa` | decimal(10,2) | acréscimos (inferido) |
| `valor_liquido` | decimal(10,2) | valor efetivo (coluna "Valor líquido (R$)") |
| `valor_recebido` | decimal(10,2) | total já baixado (suporta baixa parcial) |
| `data_vencimento` | date | "Vencimento" |
| `data_recebimento` | date nullable | "Recebimento" (preenchido na baixa) |
| `situacao` | enum | `RECEBIDO` \| `EM_ABERTO` \| `EM_ATRASO` |
| `tipo` | enum | `RECEITA` (fixo nesta tela) |
| `parcela` / `total_parcelas` | int nullable | parcelamento (inferido) |
| `observacoes` | text nullable | — |
| `created_at` / `updated_at` | timestamp | auditoria |

### 11.2 Enum `Situacao` (status — textos exatos da UI)

| Valor | Label UI | Cor |
|---|---|---|
| `RECEBIDO` | Recebido | verde |
| `EM_ABERTO` | Em aberto | laranja |
| `EM_ATRASO` | Em atraso | vermelho |

> A situação `EM_ATRASO` é derivada: `EM_ABERTO` + `data_vencimento < hoje`. *(inferido)*

### 11.3 Entidades relacionadas (inferido)

- `Categoria` (`id`, `nome`, `tipo=RECEITA`).
- `ContaFinanceira` (`id`, `nome`, `tipo` banco/caixa, `saldo`).
- `MetodoPagamento` (`id`, `nome`, `icone`).

---

## 12. Endpoints API (inferidos)

| Ação | Método | Endpoint | Observação |
|---|---|---|---|
| Listar/filtrar | `GET` | `/api/clinica/financeiro/contas-a-receber?interval=2026-05-23&interval=2026-06-22&status=&categoria=&conta=&page=&per_page=25&search=` | retorna lançamentos + agregados dos KPIs |
| Obter KPIs/resumo | `GET` | `/api/clinica/financeiro/contas-a-receber/resumo?interval=...` | vencidos/vencem hoje/a vencer/a receber/recebidos/total |
| Criar | `POST` | `/api/clinica/financeiro/contas-a-receber` | novo lançamento |
| Detalhar | `GET` | `/api/clinica/financeiro/contas-a-receber/{id}` | — |
| Editar | `PUT/PATCH` | `/api/clinica/financeiro/contas-a-receber/{id}` | — |
| Excluir | `DELETE` | `/api/clinica/financeiro/contas-a-receber/{id}` | — |
| Dar baixa / receber | `POST` | `/api/clinica/financeiro/contas-a-receber/{id}/baixar` | body: valor_recebido, data, conta, metodo (suporta parcial) |
| Baixa em lote | `POST` | `/api/clinica/financeiro/contas-a-receber/baixar-em-lote` | ids[] |
| Exportar | `GET` | `/api/clinica/financeiro/contas-a-receber/exportar?formato=csv\|xlsx\|pdf&interval=...` | download |

> Todos os endpoints acima são **inferidos** (não observados diretamente). A única evidência confirmada de API é a rota de página e o tooltip de `/clinica/financeiro/contas-a-pagar`.

---

## 13. Regras e cálculos

### 13.1 KPIs (valores da captura)

- **Vencidos** = Σ valor_liquido pendente com `data_vencimento < hoje` = **R$ 780,00**.
  - Confere com as linhas Em atraso: 350,00 + 180,00 + 250,00 = **R$ 780,00**. ✓
- **Vencem hoje** = Σ pendentes com `data_vencimento = hoje` (22/06/2026) = **R$ 1.400,00**.
  - Confere com Em aberto de 22/06: 100,00 + 900,00 = 1.000,00 visíveis; restante (400,00) entre os 2 registros não exibidos. *(inferido)*
- **A vencer** = Σ pendentes com `data_vencimento > hoje` = **R$ 0,00**.
- **A receber** = Σ total pendente (não recebido) = **R$ 0,00** *(observação: aparece 0,00 na captura embora haja pendentes — provável que este KPI represente outra agregação específica; tratar com cautela, inferido).*
- **Recebidos** = Σ valor já recebido (situação Recebido) = **R$ 6.320,00**.
- **Total do período** = Σ de todos os lançamentos do período (recebidos + pendentes) = **R$ 8.500,00**.
  - Coerência: Recebidos 6.320 + Vencidos 780 + Vencem hoje 1.400 = **8.500,00**. ✓

### 13.2 Valor líquido

`valor_liquido = valor_bruto - desconto + juros_multa`.

### 13.3 Baixa parcial

- Permite `valor_recebido < valor_liquido`; o saldo remanescente mantém o lançamento como `EM_ABERTO`/`EM_ATRASO` com novo valor pendente. *(inferido)*
- Baixa total (`valor_recebido = valor_liquido`) move a situação para `RECEBIDO` e preenche `data_recebimento`.

### 13.4 Derivação de situação

- `RECEBIDO`: valor_recebido ≥ valor_liquido.
- `EM_ATRASO`: pendente e `data_vencimento < hoje`.
- `EM_ABERTO`: pendente e `data_vencimento ≥ hoje`.

---

## 14. Fluxos

### 14.1 Dar baixa (registrar recebimento)

1. Usuário clica em **⋮** na linha → **Receber** (ou seleciona linhas e usa **Ações em lote ▾ → Baixar**).
2. Abre o **modal de recebimento** (Seção 10.1) com dados pré-preenchidos.
3. Usuário informa **valor recebido** (total ou parcial), **data de recebimento**, **conta financeira** e **método**.
4. Clica em **Confirmar recebimento**.
5. Backend: `POST /contas-a-receber/{id}/baixar` → atualiza `valor_recebido`, `data_recebimento`, recalcula `situacao`, credita a conta financeira.
6. UI atualiza badge para **Recebido**, recalcula KPIs (Recebidos ↑, Vencidos/Vencem hoje ↓).

### 14.2 Criar lançamento

1. Botão **"+"** flutuante → modal/form de novo recebível.
2. Preenche campos (Seção 7) → **Salvar** → `POST /contas-a-receber`.
3. Linha aparece na tabela; KPIs recalculados.

### 14.3 Editar / Excluir

- **Editar:** ⋮ → Editar → form preenchido → Salvar (`PATCH`).
- **Excluir:** ⋮ → Excluir → confirmação → `DELETE`.

### 14.4 Filtrar por período

1. Clica no chip **Período de liquidação** → date range picker.
2. Seleciona datas → atualiza query `?interval=início&interval=fim` → recarrega lista e KPIs.

### 14.5 Exportar

- **Exportar ▾** → escolhe formato → `GET .../exportar?formato=...` → download.

---

## 15. Notas de implementação

- **Query string com chave repetida:** `interval` aparece duas vezes (`interval=2026-05-23&interval=2026-06-22`). O parser deve tratar `interval` como **array** `[início, fim]`, não como valor único. Garantir serialização/desserialização correta no front e no back.
- **Formato de datas na UI:** colunas usam `DD/MM` (sem ano); o ano vem do período/contexto. O picker e a query usam `YYYY-MM-DD`.
- **Formato monetário:** `R$ #.###,##` (separador de milhar `.`, decimal `,`), padrão pt-BR.
- **KPIs clicáveis:** implementar como filtros de status; manter o card ativo com **borda inferior roxa** (estado selecionado = "Total do período" por padrão).
- **Indicador visual de atraso:** barra vermelha na borda esquerda da `<tr>` + ícone de relógio ⏱ na célula de Recebimento, sempre que `situacao = EM_ATRASO`.
- **Coluna "Método":** renderizar por ícone (cartão, dinheiro, PIX, etc.) com tooltip do nome.
- **Truncamento:** "Categoria" trunca para `Receitas d...` com reticências; mostrar nome completo em tooltip.
- **Ações em lote:** botão **Ações em lote** permanece desabilitado (cinza) até haver ≥1 checkbox marcado; o checkbox do cabeçalho faz select-all da página.
- **Configurar colunas:** ícone de **engrenagem** no cabeçalho da tabela abre painel de visibilidade/ordem de colunas (persistir preferência por usuário).
- **Consistência com Contas a pagar:** esta tela é espelho de `/contas-a-pagar` (Tela 30) — reutilizar componentes (KPIs, tabela, filtros), trocando rótulos: "Recebimento"→"Pagamento", "Recebidos"→"Pagos", "A receber"→"A pagar", badge "Recebido"→"Pago".
- **Onboarding/gamificação:** banner "Ei, Lucas Bastos! Tô aqui guardando o seu desconto!" e card "Seu progresso 0%" são elementos globais, não específicos desta página.
- **Acessibilidade:** ícones "?" dos KPIs devem ter tooltip textual; badges de situação não devem depender só de cor (incluir o texto).

---

*Spec da página Financeiro / Contas a receber — reconstrução completa. Itens marcados "(inferido)" não foram observados diretamente nas capturas.*
