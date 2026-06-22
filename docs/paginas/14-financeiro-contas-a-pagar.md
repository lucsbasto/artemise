# Financeiro / Contas a Pagar

| Metadado | Valor |
|---|---|
| **Página** | Financeiro / Contas a pagar |
| **Rota/URL** | `app.clinicaexperts.com.br/clinica/financeiro/contas-a-pagar?interval=2026-05-23&interval=2026-06-22` |
| **Módulo** | Financeiro |
| **Breadcrumb** | `Financeiro / Contas a pagar` |
| **Item do submenu** | Contas a pagar (ativo/destacado em roxo) |
| **Tipo de tela** | Listagem com KPIs + tabela + filtros |
| **Produto** | Clínica Experts (SaaS de gestão de clínicas) |
| **Idioma** | pt-BR |
| **Tela de referência (docs)** | Tela 30 — `03-telas-21-a-30.md` |
| **Captura** | `Captura de tela 2026-06-22 153401.png` |
| **Data da captura** | 2026-06-22 |

![](../../images/Captura de tela 2026-06-22 153401.png)

---

## 1. Identificação

- **Nome da página:** Contas a pagar.
- **Título (H1) na área de conteúdo:** **Contas a pagar**, seguido do contador **13 registros** (texto cinza, menor, à direita do título).
- **Rota:** `/clinica/financeiro/contas-a-pagar`.
- **Query string:** `?interval=2026-05-23&interval=2026-06-22` — par de datas (início e fim) que define o **Período de liquidação** exibido no chip de filtro como **23/05/2026 - 22/06/2026**. O parâmetro `interval` é repetido duas vezes (formato `YYYY-MM-DD`): primeira ocorrência = data inicial, segunda = data final (inferido).
- **Breadcrumb:** `Financeiro / Contas a pagar` (logo abaixo do header, em roxo).
- **Espelhamento:** estrutura idêntica à de **Contas a receber** (Telas 28/29), com a diferença de que aqui trata-se de **despesas/pagamentos** em vez de recebíveis. Onde Contas a receber tem a coluna **Recebimento** e KPI **Recebidos**, aqui há **Pagamento** e **Pagos**.

---

## 2. Objetivo

Listar e gerenciar todas as **contas a pagar (despesas)** da clínica dentro do período de liquidação selecionado, exibindo:

- KPIs consolidados por status (Vencidos, Vencem hoje, A vencer, Pagos, Total do período);
- a relação detalhada de cada despesa (vencimento, pagamento, descrição, categoria, método, situação e valor líquido);
- ações de gestão por linha (dar baixa/pagar, editar, excluir) e em lote.

Permite ao gestor financeiro acompanhar a inadimplência da clínica (o que está vencido/em aberto), planejar desembolsos futuros e registrar o pagamento (baixa) das despesas. É a contraparte de despesas do módulo Financeiro, complementando a Visão geral (Tela 27) e Contas a receber (Tela 28).

---

## 3. Navegação

- **Como chegar:**
  - Sidebar de ícones → ícone **"$" (Financeiro)** → submenu **Contas a pagar**.
  - Card **A pagar** da **Visão geral** (Tela 27) → link **Ver todas**.
  - URL direta `/clinica/financeiro/contas-a-pagar`.
- **Submenu lateral do módulo Financeiro** (mesma ordem da Tela 29), com **Contas a pagar** destacado quando ativo:
  1. Visão geral
  2. Contas a receber
  3. **Contas a pagar** (ativo)
  4. Extrato de movimentações
  5. Relatório de competência
  6. Fluxo de caixa diário
  7. Fluxo de caixa mensal
  8. Relatório de categorias
  9. Contas financeiras
  10. Categorias de contas
  11. Métodos de pagamento
  12. Integração maquininha
- **Saídas a partir desta tela (inferido):**
  - Botão flutuante **"+"** (canto inferior direito) → criar nova conta a pagar.
  - Clique em uma linha / ação **editar** → modal/painel de edição da despesa.
  - Ação **pagar / dar baixa** → modal de pagamento.
  - **Exportar** → download da listagem.

---

## 4. Layout

Estrutura de cima para baixo, dentro de um **card branco centralizado** sobre fundo cinza claro:

1. **Header global** (topo): logo clínicaexperts; hambúrguer; à direita ícones WhatsApp, busca/atalhos ("lupa +"), **Ajuda**, notificações (sino com badge), avatar **LB** (Lucas Bastos, círculo verde).
2. **Breadcrumb:** `Financeiro / Contas a pagar`.
3. **Sidebar de ícones** à esquerda, com **Financeiro ("$")** destacado em roxo. (Na captura a sidebar de rótulos está colapsada; pode ser expandida via "›" no rodapé — ver Tela 29 para o submenu expandido.)
4. **Cabeçalho do card:**
   - Esquerda: título **Contas a pagar** + contador **13 registros**.
   - Direita: botões **Ações em lote ▾** (desabilitado/cinza até haver seleção) e **Exportar ▾**.
5. **Linha de filtros:** chip **Período de liquidação: 23/05/2026 - 22/06/2026**, link **+ Adicionar filtro** (roxo) e campo **Buscar** (à direita).
6. **Linha de KPIs (cards de totais):** cinco blocos horizontais com ponto colorido + rótulo + ícone "?" + valor (ver §5).
7. **Tabela** de contas a pagar (cabeçalho com ordenação e engrenagem; linhas de dados; ações ⋮).
8. **Paginação** (inferida, padrão do sistema — não totalmente visível na captura por corte inferior).
9. **Botão flutuante "+"** (roxo, canto inferior direito).
10. **Widget de onboarding** (canto inferior direito): banner laranja **"Ei, Lucas Bastos! Tô aqui guardando o seu desconto!"** e card **"Seu progresso 0%"**.

---

## 5. Componentes

### 5.1 Cabeçalho e botões de ação

- **Título:** `Contas a pagar`.
- **Contador:** `13 registros` (reflete o total de linhas correspondentes aos filtros).
- **Botão `Ações em lote` ▾** — cinza/desabilitado; habilita ao marcar ao menos um checkbox de linha (inferido: ações como pagar em lote, excluir em lote, alterar categoria).
- **Botão `Exportar` ▾** — dropdown de exportação (inferido: CSV / Excel / PDF).
- **Link `+ Adicionar filtro`** (roxo).
- **Campo `Buscar`** (placeholder "Buscar").
- **Botão flutuante `+`** (roxo) — criação rápida de nova conta a pagar (rótulo textual "Nova despesa"/"Adicionar conta a pagar" — inferido; na captura é apenas o ícone "+").

> Observação: nesta tela **não** existe um botão textual "Nova despesa" no cabeçalho do card; a criação rápida ocorre pelo **botão flutuante "+"**. (O texto exato do tooltip do "+" não é legível na captura — inferido.)

### 5.2 Cards de totais (KPIs) — VALORES EXATOS

Cinco cards em linha, cada um com um **ponto colorido**, rótulo, ícone de ajuda **"?"** e valor monetário. Valores conforme a captura:

| # | Rótulo | Cor do ponto | Valor (exato) | Significado |
|---|---|---|---|---|
| 1 | **Vencidos** | vermelho | **R$ 500,00** | Despesas vencidas e ainda não pagas no período |
| 2 | **Vencem hoje** | laranja | **R$ 2.880,00** | Despesas com vencimento na data atual |
| 3 | **A vencer** | azul | **R$ 0,00** | Despesas com vencimento futuro (dentro do período) |
| 4 | **Pagos** | verde | **R$ 3.889,00** | Despesas já liquidadas/pagas |
| 5 | **Total do período** | (selecionado, **borda inferior roxa**) | **R$ 7.269,00** | Soma total das despesas do período |

- O card **Total do período** aparece **selecionado/ativo** (destaque com borda roxa).
- Os KPIs são **clicáveis** e atuam como filtro rápido por status (inferido — comportamento idêntico ao de Contas a receber).
- Cada "?" exibe tooltip explicativo (inferido).

### 5.3 Badges de situação (status)

Exibidos na coluna **Situação** da tabela:

| Badge | Cor | Significado |
|---|---|---|
| **Pago** | verde | Despesa liquidada (com data de pagamento preenchida) |
| **Em atraso** | vermelho | Vencida e não paga (linha com barra vermelha à esquerda) |
| **Em aberto** | laranja | Pendente, ainda dentro do prazo / sem pagamento registrado |

(Possíveis status adicionais não exibidos na captura, inferidos: **A vencer**, **Cancelado**.)

---

## 6. Tabela

### 6.1 Colunas (exatas, da esquerda para a direita)

| Coluna | Conteúdo | Ordenável | Observações |
|---|---|---|---|
| (checkbox) | Seleção de linha; cabeçalho com select-all | — | Habilita "Ações em lote" |
| **Vencimento** | Data de vencimento (formato `dd/mm`) | Sim (◆) | — |
| **Pagamento** | Data de pagamento (`dd/mm`) ou `—` quando não pago | Sim (◆) | Vazio para Em aberto/Em atraso |
| **Descrição** | Texto da despesa | Sim (◆) | — |
| **Categoria** | Categoria da despesa (truncada: "Outras de...") | Sim (◆) | Predomina "Outras despesas" |
| **Método** | Ícone da forma de pagamento | Sim (◆) | Ícones (cartão, dinheiro, etc.) |
| **Situação** | Badge de status (Pago / Em atraso / Em aberto) | — | Cores conforme §5.3 |
| **Valor líquido (R$)** | Valor monetário da despesa | Sim (◆) | Cabeçalho com ícone "?" |
| (engrenagem) | Configurar colunas visíveis | — | Ícone ⚙ no cabeçalho, à direita |
| (ações) | Menu **⋮** por linha | — | Pagar / Editar / Excluir |

> Nota de cruzamento: o enunciado pede colunas "fornecedor" e "conta". **Na captura da Tela 30 essas colunas NÃO aparecem** no conjunto visível (Vencimento, Pagamento, Descrição, Categoria, Método, Situação, Valor líquido). **Fornecedor** e **Conta (conta financeira)** são tratados como **colunas opcionais configuráveis via engrenagem** e como **campos do modelo/formulário** (inferido) — ver §10 e §11.

### 6.2 Dados de exemplo (linhas exatas da captura)

| Vencimento | Pagamento | Descrição | Categoria | Situação | Valor líq (R$) |
|---|---|---|---|---|---|
| 17/06 | 17/06 | Aluguel da Clínica | Outras de... | **Pago** | 1.200,00 |
| 17/06 | 17/06 | Material de Escritório | Outras de... | **Pago** | 150,00 |
| 17/06 | — | Renovação de Licenças | Outras de... | **Em atraso** | 500,00 |
| 18/06 | 18/06 | Água | Outras de... | **Pago** | 400,00 |
| 18/06 | 18/06 | Manutenção de Equipamentos | Outras de... | **Pago** | 800,00 |
| 18/06 | 18/06 | Limpeza | Outras de... | **Pago** | 300,00 |
| 20/06 | 20/06 | Software de Gestão | Outras de... | **Pago** | 239,00 |
| 21/06 | 21/06 | Internet | Outras de... | **Pago** | 300,00 |
| 22/06 | 22/06 | Energia Elétrica | Outras de... | **Pago** | 500,00 |
| 22/06 | — | Serviços Contábeis | Outras de... | **Em aberto** | 750,00 |
| 22/06 | — | Telefone Fixo | Outras de... | **Em aberto** | 150,00 |
| 22/06 | — | Marketing Digital | Outras de... | **Em aberto** | 1.000,00 |
| 22/06 | — | Assessoria Jurídica | Outras de... | **Em aberto** | 980,00 |

São **13 linhas** (= contador "13 registros").

### 6.3 Destaques visuais de linha

- Linha **Em atraso** (Renovação de Licenças, 17/06, R$ 500,00) possui **barra vermelha na borda esquerda** e coluna Pagamento vazia (`—`).
- Linhas **Pago** têm a coluna Pagamento preenchida e badge verde.
- Linhas **Em aberto** (22/06) têm Pagamento vazio e badge laranja.

### 6.4 Ordenação

- Colunas com **◆** são ordenáveis (Vencimento, Pagamento, Descrição, Categoria, Método, Valor líquido).
- Ordenação padrão observada: por **Vencimento** crescente (17/06 → 22/06).
- Clique no cabeçalho alterna asc/desc (inferido).

### 6.5 Paginação

- Padrão do sistema (inferido, não totalmente visível por corte da captura): seletor **"25 por página"** à esquerda e controles **`« ‹ [1] › »`** à direita, com a página atual em roxo.
- Com 13 registros, há **uma única página**.

### 6.6 Totais

- A **soma das despesas do período** é exibida no KPI **Total do período = R$ 7.269,00** (não há linha de rodapé de totais visível na tabela; o total é consolidado nos KPIs). Validação aritmética em §13.

---

## 7. Formulários

A tela em si é uma **listagem**; os formulários ocorrem em **modais** (ver §10):

- **Formulário de nova/edição de despesa** (conta a pagar).
- **Formulário de pagamento (baixa)**.
- **Formulário de filtro avançado** (acionado por "+ Adicionar filtro").

Campos detalhados em §10 e §11.

---

## 8. Filtros

- **Chip ativo:** **Período de liquidação: 23/05/2026 - 22/06/2026** (controlado pela query `interval`). Clicável para abrir seletor de datas (inferido).
- **Link `+ Adicionar filtro`** abre painel/dropdown de filtros adicionais. Filtros inferidos (alinhados ao modelo de dados):
  - **Intervalo / Período** (de liquidação ou de vencimento) — datas início/fim.
  - **Status / Situação** — Pago, Em aberto, Em atraso, A vencer (multi-seleção).
  - **Categoria** — categoria de despesa (ex.: "Outras despesas").
  - **Fornecedor** — fornecedor vinculado.
  - **Conta financeira / Conta** — conta de débito (ex.: "Banco padrão", "Caixa").
  - **Método de pagamento** — cartão, dinheiro, PIX, boleto, etc.
- **Campo `Buscar`** — busca textual (provavelmente por descrição/fornecedor — inferido).
- **KPIs clicáveis** funcionam como atalho de filtro por status (inferido).

---

## 9. Estados

- **Estado padrão (com dados):** 13 registros listados, KPIs preenchidos, "Total do período" ativo.
- **Estado vazio (inferido, padrão do sistema):** ícone de lupa em círculo roxo claro, título **"Oops, nada foi encontrado!"**, texto **"Os filtros selecionados não correspondem a nenhum registro."**, com botões **Limpar filtros** (contorno roxo) e **+ Adicionar nova despesa / Adicionar conta a pagar** (roxo). (Mesmo padrão observado na Tela 22.)
- **Estado de carregamento (inferido):** skeleton/spinner na tabela.
- **Linhas em atraso:** destaque com barra vermelha à esquerda.

---

## 10. Modais

> Campos inferidos a partir do modelo de dados, das colunas da tabela e dos modais análogos de orçamento (Telas 23/24) e Contas a receber.

### 10.1 Modal "Nova despesa" / "Editar conta a pagar" (inferido)

- **Cabeçalho:** título **Nova despesa** (ou **Editar despesa**) + botão **×**.
- **Campos:**
  - **Descrição\*** — texto livre (ex.: "Aluguel da Clínica").
  - **Fornecedor** — dropdown de fornecedores (com link **+ Adicionar**); ref. Tela 26 (Fornecedores).
  - **Categoria\*** — dropdown de categorias de despesa (ex.: "Outras despesas").
  - **Conta financeira\*** — dropdown (ex.: "Banco padrão", "Caixa") — conta de débito.
  - **Método de pagamento** — dropdown (cartão, dinheiro, PIX, boleto).
  - **Valor (R$)\*** — numérico monetário.
  - **Vencimento\*** — data.
  - **Recorrência / Parcelamento** — opção de repetir a despesa (inferido).
  - **Observações** — texto livre (inferido).
- **Rodapé:** botão **Salvar** (roxo).

### 10.2 Modal "Pagamento" / "Dar baixa" (inferido)

Acionado pela ação **Pagar** (⋮) de uma linha **Em aberto/Em atraso**:

- **Cabeçalho:** título **Registrar pagamento** (ou **Dar baixa**) + **×**.
- **Campos:**
  - **Data de pagamento\*** — data (default: hoje) → preenche a coluna **Pagamento**.
  - **Conta financeira\*** — conta de onde sai o valor.
  - **Método de pagamento** — forma de pagamento.
  - **Valor pago (R$)\*** — default igual ao valor da despesa; permite pagamento parcial/juros/desconto (inferido).
  - **Juros/Multa** e **Desconto** (inferido).
  - **Observações**.
- **Efeito:** muda **Situação** para **Pago** (verde), preenche **Pagamento** e atualiza KPIs (Pagos ↑, Em aberto/Vencidos ↓).
- **Rodapé:** botão **Confirmar pagamento** / **Salvar** (roxo).

---

## 11. Modelo de dados

### 11.1 Entidade `ContaPagar` (inferido)

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `string`/`uuid` | Identificador único |
| `descricao` | `string` | Descrição da despesa (obrigatório) |
| `fornecedor_id` | `string` (FK → Fornecedor) | Fornecedor vinculado (opcional) |
| `fornecedor` | `Fornecedor` (relacionamento) | Objeto fornecedor |
| `categoria_id` | `string` (FK → CategoriaConta) | Categoria de despesa (obrigatório) |
| `categoria` | `string`/`CategoriaConta` | Ex.: "Outras despesas" |
| `conta_financeira_id` | `string` (FK → ContaFinanceira) | Conta de débito (ex.: Banco padrão, Caixa) |
| `metodo_pagamento_id` | `string` (FK → MetodoPagamento) | Forma de pagamento |
| `valor` | `decimal` (R$) | Valor bruto |
| `valor_liquido` | `decimal` (R$) | Valor líquido exibido na tabela |
| `data_vencimento` | `date` | Vencimento (coluna Vencimento) |
| `data_pagamento` | `date \| null` | Data de baixa (coluna Pagamento); `null` se não pago |
| `situacao` / `status` | `enum` | Status da conta (ver 11.2) |
| `juros` / `multa` | `decimal \| null` | Encargos no pagamento (inferido) |
| `desconto` | `decimal \| null` | Desconto no pagamento (inferido) |
| `recorrencia` | `object \| null` | Configuração de repetição (inferido) |
| `observacoes` | `string \| null` | Observações (inferido) |
| `created_at` / `updated_at` | `datetime` | Auditoria (inferido) |

### 11.2 Enum `situacao` / status

| Valor (inferido) | Rótulo exibido | Cor |
|---|---|---|
| `paid` | **Pago** | verde |
| `overdue` | **Em atraso** | vermelho |
| `open` / `pending` | **Em aberto** | laranja |
| `to_due` | **A vencer** (não visível na captura) | azul |
| `canceled` | **Cancelado** (inferido) | cinza |

---

## 12. Endpoints API inferidos

> Todos inferidos; prefixo provável `/api` ou `/clinica/financeiro`.

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/financeiro/contas-a-pagar?interval[]=2026-05-23&interval[]=2026-06-22` | Lista contas a pagar do período (paginado, com filtros/ordenação) |
| `GET` | `/api/financeiro/contas-a-pagar/resumo?interval[]=...` | KPIs (Vencidos, Vencem hoje, A vencer, Pagos, Total do período) |
| `GET` | `/api/financeiro/contas-a-pagar/{id}` | Detalhe de uma conta |
| `POST` | `/api/financeiro/contas-a-pagar` | Cria nova despesa |
| `PUT`/`PATCH` | `/api/financeiro/contas-a-pagar/{id}` | Edita despesa |
| `DELETE` | `/api/financeiro/contas-a-pagar/{id}` | Exclui despesa |
| `POST` | `/api/financeiro/contas-a-pagar/{id}/pagamento` | Registra pagamento/baixa |
| `POST` | `/api/financeiro/contas-a-pagar/acoes-em-lote` | Ações em lote (pagar/excluir vários) |
| `GET` | `/api/financeiro/contas-a-pagar/exportar?formato=csv\|xlsx\|pdf` | Exportação |
| `GET` | `/api/fornecedores` | Opções de fornecedor (filtro/form) |
| `GET` | `/api/financeiro/categorias-de-contas` | Opções de categoria |
| `GET` | `/api/financeiro/contas-financeiras` | Opções de conta financeira |
| `GET` | `/api/financeiro/metodos-de-pagamento` | Opções de método |

---

## 13. Regras / cálculos

Com base nos dados da captura (13 linhas):

- **Pagos** = soma das linhas com situação **Pago**:
  1.200,00 + 150,00 + 400,00 + 800,00 + 300,00 + 239,00 + 300,00 + 500,00 = **R$ 3.889,00** ✅ (bate com KPI **Pagos**).
- **Em atraso (Vencidos)** = soma das linhas **Em atraso**:
  500,00 (Renovação de Licenças) = **R$ 500,00** ✅ (bate com KPI **Vencidos**).
- **Em aberto** = soma das linhas **Em aberto** (22/06):
  750,00 + 150,00 + 1.000,00 + 980,00 = **R$ 2.880,00**.
  - Estas 4 linhas vencem em **22/06**. Considerando a data de referência **22/06/2026** (fim do período), elas **vencem hoje** → KPI **Vencem hoje = R$ 2.880,00** ✅.
- **A vencer** = despesas com vencimento futuro (após hoje) e não pagas = **R$ 0,00** ✅ (nenhuma linha com vencimento > 22/06).
- **Total do período** = soma de **todas** as 13 linhas:
  3.889,00 (pagos) + 500,00 (atraso) + 2.880,00 (em aberto) = **R$ 7.269,00** ✅ (bate com KPI **Total do período**).

**Regras derivadas:**
- `Total do período = Pagos + Vencidos + Vencem hoje + A vencer`.
- **Vencidos** = não pagas com `data_vencimento < hoje`.
- **Vencem hoje** = não pagas com `data_vencimento == hoje`.
- **A vencer** = não pagas com `data_vencimento > hoje` (dentro do período).
- **Pagos** = `data_pagamento` preenchida (situação Pago).
- **Em aberto** (badge) corresponde, no recorte da data atual, a despesas que **vencem hoje**; **Em atraso** corresponde a **Vencidos**.
- Valores monetários em formato pt-BR (`R$ 1.234,56`, separador de milhar `.` e decimal `,`).
- A data "hoje" para classificação dos KPIs = **22/06/2026** (fim do intervalo / data corrente da captura).

---

## 14. Fluxos

### 14.1 Dar baixa (registrar pagamento) — fluxo principal

1. Usuário localiza uma despesa **Em aberto** ou **Em atraso** na tabela.
2. Clica no menu **⋮** da linha → opção **Pagar / Dar baixa**.
3. Abre o **modal de pagamento** (§10.2): preenche **Data de pagamento** (default hoje), **Conta financeira**, **Método**, **Valor pago** (default = valor da despesa), eventuais **juros/desconto**.
4. Clica **Confirmar pagamento**.
5. Sistema:
   - grava `data_pagamento` e muda `situacao` → **Pago**;
   - move o valor de **Vencidos/Vencem hoje** para **Pagos** nos KPIs;
   - badge da linha vira **Pago** (verde) e a coluna **Pagamento** passa a exibir a data;
   - debita a conta financeira (reflete em Contas financeiras / Extrato de movimentações).

### 14.2 Criar nova despesa

1. Botão flutuante **"+"** (ou empty state "+ Adicionar nova despesa").
2. Preenche o modal (§10.1) → **Salvar**.
3. Nova linha aparece na tabela com situação **Em aberto** (ou **A vencer**); contador e KPIs atualizam.

### 14.3 Editar / Excluir

- **⋮ → Editar** → modal de edição → **Salvar**.
- **⋮ → Excluir** → confirmação → remove a linha e recalcula KPIs.

### 14.4 Ações em lote

1. Marca checkboxes de várias linhas → botão **Ações em lote** habilita.
2. Escolhe ação (pagar em lote / excluir / alterar categoria — inferido) → confirma.

### 14.5 Exportar

- **Exportar ▾** → escolhe formato (CSV/Excel/PDF — inferido) → download da listagem filtrada.

### 14.6 Filtrar por período

- Clica no chip **Período de liquidação** → seletor de datas → atualiza query `interval` e recarrega lista + KPIs.

---

## 15. Notas de implementação

- **Persistência de filtros na URL:** o período é mantido em `?interval=<inicio>&interval=<fim>` (repetição do parâmetro). Garantir parsing de query param repetido (array) no front e no back.
- **Espelhar componentes com Contas a receber** (Telas 28/29): mesma estrutura de KPIs + tabela + filtros; reaproveitar componentes parametrizando "receber" vs "pagar" (coluna Recebimento/Pagamento; KPI Recebidos/Pagos; sinal/cor do valor).
- **Colunas configuráveis (engrenagem):** Fornecedor e Conta financeira não aparecem por padrão; implementar como colunas opcionais (preferência persistida por usuário — inferido).
- **KPIs como filtros:** ao clicar em um KPI, aplicar filtro de status correspondente e destacar o card ativo (borda roxa), como o "Total do período" atual.
- **Cálculo de KPIs no backend** com base na data corrente do servidor (fuso pt-BR), conforme regras de §13; evitar recalcular só no front para não divergir.
- **Destaque de inadimplência:** linhas **Em atraso** recebem barra vermelha à esquerda; aplicar via classe condicional `situacao === overdue`.
- **Formatação monetária pt-BR** (`Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`).
- **Datas exibidas como `dd/mm`** na tabela (ano omitido), mas armazenadas/filtradas como `YYYY-MM-DD`.
- **Estado vazio** reutilizar o padrão "Oops, nada foi encontrado!" com botões Limpar filtros / Adicionar nova despesa.
- **Botão "Ações em lote"** permanece desabilitado até haver seleção; "Exportar" sempre habilitado.
- **Acessibilidade:** tooltips "?" nos KPIs e no cabeçalho "Valor líquido (R$)" devem ter texto descritivo; badges de situação devem ter rótulo textual além da cor.
- **Onboarding/gamificação:** widget "Seu progresso 0%" e banner de desconto são globais, não específicos desta tela.

---

*Spec da página Financeiro / Contas a pagar — cruzada com a Tela 30 de `03-telas-21-a-30.md`.*
