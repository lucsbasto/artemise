# Financeiro / Fluxo de Caixa Mensal

| Metadado | Valor |
|---|---|
| **Título da página** | Fluxo de caixa mensal |
| **Módulo** | Financeiro |
| **Breadcrumb** | Financeiro / Fluxo de caixa mensal |
| **Rota** | `/financeiro/fluxo-de-caixa-mensal/month` |
| **URL completa** | `app.clinicaexperts.com.br/financeiro/fluxo-de-caixa-mensal/month?generic=transfer%3Atrue&generic=initial_balance%3Atrue&generic=...` |
| **Tipo de tela** | Relatório financeiro (visão anual agregada por mês) |
| **Idioma** | pt-BR |
| **Tela de referência (docs)** | Tela 34 — `04-telas-31-a-40.md` |
| **Captura de tela** | `Captura de tela 2026-06-22 153435.png` |
| **Permissão inferida** | Acesso ao módulo Financeiro (inferido) |
| **Última revisão** | 2026-06-22 |

![](../../images/Captura de tela 2026-06-22 153435.png)

---

## 1. Identificação

- **Nome exibido:** **Fluxo de caixa mensal** (título do card principal).
- **Breadcrumb (roxo, abaixo do header):** **Financeiro** / **Fluxo de caixa mensal**.
- **Rota base:** `/financeiro/fluxo-de-caixa-mensal/month`.
  - O segmento final **`/month`** indica a granularidade ativa (mensal). A tela equivalente diária usa `/financeiro/fluxo-de-caixa-diario/day` (Tela 33).
- **Query string observada (parcial):**
  - `generic=transfer%3Atrue` → `transfer:true` (incluir transferências).
  - `generic=initial_balance%3Atrue` → `initial_balance:true` (incluir saldo inicial).
  - `generic=...` (truncado na barra de endereço; inferidos: `net_amount:true`/valor líquido e `forecast:false`/previsão — ver §8).
- **Módulo:** Financeiro (ícone de cifrão roxo destacado na sidebar).
- **Usuário logado:** Lucas Bastos (avatar **"LB"** com borda verde, canto superior direito).

---

## 2. Objetivo

Apresentar a **visão anual do fluxo de caixa** da clínica, agregando todos os lançamentos financeiros **por mês** dentro de um ano-calendário selecionado. Para cada mês exibe **saldo inicial**, **entradas**, **saídas**, **lucro/prejuízo (resultado do mês)** e **saldo final**, encadeando o saldo final de um mês como saldo inicial do mês seguinte.

Serve a propósitos de:
- **Planejamento e acompanhamento anual** de caixa (12 meses de uma vez).
- **Leitura visual rápida** via gráfico combinado (barras de entradas/saídas + linha de saldo).
- **Identificação de meses com movimentação** versus meses neutros.

É a contraparte **mensal** do relatório **Fluxo de caixa diário** (Tela 33), com estrutura idêntica e granularidade diferente.

---

## 3. Navegação (toggle diário/mensal)

- **Acesso:** via menu do módulo **Financeiro** na sidebar esquerda (ícone de cifrão roxo, ativo nesta tela).
- **Breadcrumb clicável:** **Financeiro** retorna ao índice/home do módulo (inferido).
- **Toggle diário ⇄ mensal (inferido):** As duas visões são telas irmãs distinguidas pelo último segmento de rota:
  - **Diário:** `/financeiro/fluxo-de-caixa-diario/day` (eixo X = dias do mês; seletor = mês).
  - **Mensal:** `/financeiro/fluxo-de-caixa-mensal/month` (eixo X = meses do ano; seletor = ano).
  - Na captura **não há um controle de toggle visível dentro do card**; a alternância ocorre pelos itens de menu do Financeiro (inferido). Caso exista um segmented control diário/mensal, ele deve apenas trocar a rota preservando os filtros gerais (inferido).
- **Preservação de estado (inferido):** ao alternar diário↔mensal, manter os `generic=` filtros (transferência, saldo inicial, valor padrão, previsão) na nova rota.

---

## 4. Layout

Estrutura em três camadas, da borda para o centro:

1. **Header do app (topo, fundo branco):** hambúrguer (☰) + logo **clínicaexperts**; à direita ícone WhatsApp (rosa), ícone de busca/atalho, link **"Ajuda"** (com "?"), sino de notificações e avatar **"LB"** (borda verde).
2. **Sidebar esquerda (estreita, ícones):** navegação principal; ícone **Financeiro** (cifrão) ativo com fundo roxo arredondado.
3. **Área principal (fundo cinza claro):** breadcrumb no topo + **um card branco** (cantos arredondados, sombra leve) que concentra todo o conteúdo, na ordem vertical:
   - **Cabeçalho do card:** título **"Fluxo de caixa mensal"** (esquerda) + botão **"Exportar ▾"** (direita).
   - **Barra de filtros:** seletor de ano **‹ 2026 ›** + chip **"Filtros gerais: …"** com **"×"** + link **"+ Adicionar filtro"**.
   - **Gráfico combinado** (barras + linha) com legenda no topo direito.
   - **Tabela mensal** (12 linhas, Janeiro→Dezembro) com rolagem vertical.

**Elementos sobrepostos (onboarding, ignoráveis para a feature):** faixa laranja **"Ei, Lucas Bastos! Tô aqui guardando o seu desconto!"** e card **"0% — Seu progresso"** no canto inferior direito; botão flutuante roxo **"+"** (presente no padrão do app).

---

## 5. Componentes

### 5.1 Cabeçalho do card
- **Título:** texto exato **"Fluxo de caixa mensal"**.
- **Botão "Exportar ▾":** dropdown de exportação à direita. Opções inferidas: **PDF**, **Excel/XLSX**, **CSV** (inferido).

### 5.2 Barra de filtros
- **Seletor de ano:** controle pílula com **‹** (anterior), rótulo central **"2026"** e **›** (próximo). Navega ano a ano.
- **Chip "Filtros gerais":** rótulo **"Filtros gerais:"** seguido do texto exato:
  > **Transferência: Sim, Saldo inicial: Sim, Valor padrão: Líquido, Previsão: Não**
  - Possui um **"×"** ao final para **limpar/remover** o conjunto de filtros gerais.
- **Link "+ Adicionar filtro":** roxo, abre seletor de filtros adicionais (ver §8).

### 5.3 Gráfico (combinado: colunas + linha)
- **Tipo:** gráfico de **colunas verticais** (entradas e saídas) sobreposto a uma **linha** (saldo). Combo chart.
- **Legenda (topo direito):**
  - **■ Entradas** — verde.
  - **■ Saídas** — vermelho.
  - **— Saldo** — linha azul.
- **Eixo Y (valores, de cima para baixo, textos exatos):** **R$ 8k**, **R$ 6k**, **R$ 4k**, **R$ 2k**, **R$ 0**, **-R$ 2k**, **-R$ 4k**.
- **Eixo X (meses, textos exatos):** **Jan 2026**, **Fev 2026**, **Mar 2026**, **Abr 2026**, **Mai 2026**, **Jun 2026**, **Jul 2026**, **Ago 2026**, **Set 2026**, **Out 2026**, **Nov 2026**, **Dez 2026**.
- **Séries:**
  - **Entradas (coluna verde):** valor positivo, cresce para cima a partir de R$ 0.
  - **Saídas (coluna vermelha):** valor negativo, cresce para baixo a partir de R$ 0 (na captura, empilhada/contígua à coluna verde no mesmo mês).
  - **Saldo (linha azul):** saldo acumulado; permanece em R$ 0 de Jan a Mai, **sobe em Jun** (até ~R$ 2,4k) e mantém o patamar de Jul a Dez.
- **Dados representados na captura:** apenas **Jun 2026** apresenta colunas significativas — entrada verde ~**R$ 6k** (até o topo) e saída vermelha ~**R$ 4k** (abaixo de zero). Demais meses sem barras.
- **Interações inferidas:** tooltip ao passar o mouse mostrando entradas/saídas/saldo do mês; toggle de séries clicando na legenda (inferido).

### 5.4 Botões e controles (resumo)
| Componente | Texto/Ícone | Ação |
|---|---|---|
| Botão exportar | **Exportar ▾** | Abre dropdown de exportação |
| Seta ano anterior | **‹** | Ano − 1 |
| Seta ano seguinte | **›** | Ano + 1 |
| Chip filtros gerais | **Filtros gerais: …** **×** | Exibe/limpa filtros gerais |
| Link adicionar filtro | **+ Adicionar filtro** | Abre seletor de filtros |
| Legenda gráfico | Entradas / Saídas / Saldo | Toggle de série (inferido) |

---

## 6. Tabela mensal

**Colunas (cabeçalho, textos exatos):**

| Coluna | Texto exato do cabeçalho | Ícone | Alinhamento |
|---|---|---|---|
| 1 | **Mês** | — | esquerda |
| 2 | **Saldo inicial (R$)** | — | direita (valor) |
| 3 | **Entrada (R$)** | seta verde ↘ (entrada) | direita |
| 4 | **Saída (R$)** | seta vermelha ↗ (saída) | direita |
| 5 | **Lucro/Prejuizo (R$)** | — | direita |
| 6 | **Saldo final (R$)** | — | direita |

> Observação de fidelidade: o cabeçalho aparece escrito **"Lucro/Prejuizo (R$)"** (sem acento em "Prejuízo") na captura.

**Linhas (uma por mês do ano, Janeiro → Dezembro). Dados exatos observados:**

| Mês | Saldo inicial (R$) | Entrada (R$) | Saída (R$) | Lucro/Prejuizo (R$) | Saldo final (R$) |
|---|---|---|---|---|---|
| Janeiro | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 |
| Fevereiro | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 |
| Março | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 |
| Abril | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 |
| Maio | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 |
| Junho | 0,00 | 6.320,00 | 3.889,00 | 2.431,00 | 2.431,00 |
| Julho | 2.431,00 | 0,00 | 0,00 | 0,00 | 2.431,00 |
| Agosto | 2.431,00 | 0,00 | 0,00 | 0,00 | 2.431,00 |
| Setembro | 2.431,00 | 0,00 | 0,00 | 0,00 | 2.431,00 |
| Outubro | 2.431,00 | 0,00 | 0,00 | 0,00 | 2.431,00 |
| Novembro | 2.431,00 | 0,00 | 0,00 | 0,00 | 2.431,00 |
| Dezembro | 2.431,00 (inferido) | 0,00 (inferido) | 0,00 (inferido) | 0,00 (inferido) | 2.431,00 (inferido) |

> Dezembro está abaixo do recorte visível; valores inferidos por continuidade do encadeamento (Novembro saldo final = 2.431,00 → Dezembro saldo inicial = 2.431,00).

**Mapeamento de colunas para os termos do enunciado:**
- **mês** → coluna **Mês**.
- **entradas** → coluna **Entrada (R$)**.
- **saídas** → coluna **Saída (R$)**.
- **saldo do mês** → coluna **Lucro/Prejuizo (R$)** = Entrada − Saída.
- **saldo acumulado** → coluna **Saldo final (R$)** (acumulado a partir do **Saldo inicial (R$)**, que é o saldo final do mês anterior).

**Totais (inferido):** Na captura **não há linha de totais visível** na base da tabela. Recomenda-se exibir um rodapé com (inferido):
- **Total Entradas** = soma das entradas dos 12 meses (no exemplo: **6.320,00**).
- **Total Saídas** = soma das saídas (no exemplo: **3.889,00**).
- **Resultado do ano** = Total Entradas − Total Saídas (no exemplo: **2.431,00**).
- **Saldo final do ano** = Saldo final de Dezembro (no exemplo: **2.431,00**).

**Cores/formatação (inferido):** valores monetários no formato pt-BR (`#.###,00`, sem símbolo na célula; "R$" no cabeçalho). Entradas em verde, saídas em vermelho, lucro/prejuízo negativo em vermelho com sinal "-" (inferido a partir das telas irmãs).

---

## 7. Formulários

Esta tela é **somente leitura** (relatório). **Não há formulários de criação/edição** no corpo da página.

Formulários acessórios (inferido):
- **Seletor de "Adicionar filtro":** mini-formulário/popover para escolher critério, operador e valor (ver §8).
- **Diálogo de exportação:** caso o "Exportar" abra opções de formato/intervalo antes de baixar (inferido).

---

## 8. Filtros

### 8.1 Seletor de ano (intervalo principal)
- Controle **‹ 2026 ›**. Define o ano-calendário cujos 12 meses serão exibidos no gráfico e na tabela.
- **Comportamento (inferido):** ao mudar o ano, recarrega gráfico + tabela; **Saldo inicial de Janeiro** passa a ser o saldo final de Dezembro do ano anterior (continuidade entre anos).

### 8.2 Filtros gerais (chip)
Texto exato do chip: **"Transferência: Sim, Saldo inicial: Sim, Valor padrão: Líquido, Previsão: Não"**. Cada par mapeia para um parâmetro `generic=`:

| Rótulo (UI) | Valor (UI) | Parâmetro inferido | Efeito |
|---|---|---|---|
| Transferência | Sim | `transfer:true` | Inclui transferências entre contas no cálculo |
| Saldo inicial | Sim | `initial_balance:true` | Considera o saldo inicial das contas (lançamento de abertura) |
| Valor padrão | Líquido | `net_amount:true` (inferido) | Usa valor **líquido** (descontos/taxas) em vez de bruto |
| Previsão | Não | `forecast:false` (inferido) | Exclui lançamentos previstos/futuros não realizados |

- O **"×"** do chip limpa/reseta os filtros gerais para o padrão (inferido).

### 8.3 Filtros adicionais ("+ Adicionar filtro")
Filtros extras aplicáveis (inferido a partir do padrão das telas financeiras):
- **Conta** (conta financeira: ex.: *Banco padrão*, *Caixa*) — restringe o fluxo a uma conta.
- **Categoria** / **Subcategoria** de lançamento.
- **Método de pagamento**.
- **Tipo** (receita/despesa).

> A captura não exibe um filtro de conta aberto, mas o domínio possui contas (Tela 36); um filtro por **conta** é esperado aqui (inferido).

---

## 9. Estados

- **Estado padrão (populado):** captura atual — 12 meses listados; meses sem movimentação exibem **0,00** em todas as colunas (exceto saldo inicial/final encadeado); gráfico mostra barras apenas nos meses com lançamentos.
- **Estado "ano sem nenhum lançamento" (vazio):** todos os meses com **0,00** e saldos zerados; gráfico plano na linha de R$ 0; **sem barras**. (inferido — pode exibir mensagem padrão do app **"Hmm, está vazio por aqui!"** / **"Nenhum registro encontrado."** caso a API retorne vazio, conforme telas 39/40.)
- **Estado de carregamento (inferido):** skeleton no gráfico e na tabela enquanto busca dados do ano.
- **Estado de erro (inferido):** mensagem de falha ao carregar com opção de tentar novamente.

---

## 10. Modais

- **Dropdown "Exportar":** menu com formatos de saída (PDF/Excel/CSV) — não é modal pleno, é popover (inferido).
- **Popover "+ Adicionar filtro":** seletor de critério de filtro (inferido).
- **Tooltip do gráfico:** ao passar o mouse sobre um mês, exibe entradas/saídas/saldo (inferido).
- **Não há modais de cadastro/edição** nesta tela (somente leitura).

---

## 11. Modelo de dados inferido

```jsonc
// Resposta do relatório mensal (inferido)
{
  "year": 2026,
  "filters": {
    "transfer": true,
    "initial_balance": true,
    "value_mode": "net",      // "net" (Líquido) | "gross" (Bruto)
    "forecast": false,
    "account_id": null         // filtro opcional por conta
  },
  "months": [
    {
      "month": 1,              // 1..12
      "label": "Janeiro",
      "opening_balance": 0.00, // Saldo inicial (R$)
      "inflow": 0.00,          // Entrada (R$)
      "outflow": 0.00,         // Saída (R$)
      "result": 0.00,          // Lucro/Prejuízo (R$) = inflow - outflow
      "closing_balance": 0.00  // Saldo final (R$) = opening_balance + result
    }
    // ... até month: 12
  ],
  "totals": {                  // inferido (não visível na captura)
    "inflow": 6320.00,
    "outflow": 3889.00,
    "result": 2431.00,
    "closing_balance": 2431.00 // saldo final de dezembro
  }
}
```

**Entidades relacionadas (inferido):**
- `Account` (conta financeira) → `{ id, name, type }` (ex.: *Banco padrão*/Conta Corrente, *Caixa*/Caixa — Tela 36).
- `Transaction` (lançamento) → `{ id, type: 'income'|'expense'|'transfer', amount_gross, amount_net, date, account_id, category_id, status, is_forecast }`.
- O relatório é uma **agregação** de `Transaction` por mês (e por ano), respeitando os filtros gerais.

---

## 12. Endpoints API inferidos

> Todos **(inferido)** — derivados da rota e dos parâmetros `generic=`.

| Método | Endpoint (inferido) | Descrição |
|---|---|---|
| `GET` | `/api/financeiro/fluxo-de-caixa-mensal?year=2026&transfer=true&initial_balance=true&value_mode=net&forecast=false&account_id=` | Retorna agregação mensal (12 meses) + totais |
| `GET` | `/api/financeiro/fluxo-de-caixa-diario?month=2026-06&...` | Versão diária (tela irmã) |
| `GET` | `/api/financeiro/contas` | Lista contas para o filtro de conta |
| `GET` | `/api/financeiro/categorias` | Lista categorias para filtro |
| `GET` | `/api/financeiro/fluxo-de-caixa-mensal/export?format=pdf|xlsx|csv&year=2026&...` | Exportação do relatório |

- A query string real usa o padrão **`generic=<chave>%3A<valor>`** (par `chave:valor` URL-encoded), repetido por filtro. Ex.: `generic=transfer%3Atrue&generic=initial_balance%3Atrue&...`.

---

## 13. Regras / Cálculos

Seja `m` um mês de 1 a 12 dentro do ano selecionado.

1. **Entrada do mês** `inflow[m]` = soma dos lançamentos de **receita** (e transferências de entrada, se `transfer=true`) com competência/caixa no mês `m`, no modo de valor selecionado (líquido por padrão).
2. **Saída do mês** `outflow[m]` = soma dos lançamentos de **despesa** (e transferências de saída, se aplicável) no mês `m`.
3. **Lucro/Prejuízo do mês (saldo do mês)**:
   ```
   result[m] = inflow[m] - outflow[m]
   ```
   No exemplo de Junho: `6.320,00 - 3.889,00 = 2.431,00`.
4. **Saldo inicial do mês**:
   ```
   opening_balance[1] = saldo de abertura do ano (saldo final de dez do ano anterior, ou 0,00 se primeiro período)
   opening_balance[m] = closing_balance[m-1]   (m > 1)
   ```
5. **Saldo final do mês (saldo acumulado)**:
   ```
   closing_balance[m] = opening_balance[m] + result[m]
   ```
   - Junho: `0,00 + 2.431,00 = 2.431,00`.
   - Julho: `opening = 2.431,00`, `result = 0,00` → `closing = 2.431,00` (mantém-se até dezembro pois não há novos lançamentos).
6. **Encadeamento (continuidade contábil):** o **Saldo final** de um mês é exatamente o **Saldo inicial** do mês seguinte. Logo, a coluna **Saldo final** representa o **saldo acumulado mensal**.
7. **Efeito dos filtros gerais:**
   - `Saldo inicial: Sim` → o lançamento de abertura das contas entra no `opening_balance` (do contrário começaria em 0,00).
   - `Transferência: Sim` → transferências entre contas são contabilizadas (relevante quando filtrado por conta específica).
   - `Valor padrão: Líquido` → usa `amount_net`; se `Bruto`, usaria `amount_gross`.
   - `Previsão: Não` → considera apenas lançamentos realizados; se `Sim`, inclui previstos/futuros.
8. **Linha do gráfico (saldo):** a série **Saldo** plota `closing_balance[m]` (acumulado), enquanto as **colunas** plotam `inflow[m]` (verde, +) e `outflow[m]` (vermelho, −).
9. **Formatação monetária:** pt-BR, duas casas decimais, separador de milhar "." e decimal ",". Valores negativos com sinal "-" e cor vermelha (inferido).

---

## 14. Fluxos

**F1 — Consultar o ano (padrão):**
1. Usuário acessa Financeiro → Fluxo de caixa mensal.
2. Sistema carrega ano corrente (2026), aplica filtros gerais padrão.
3. Renderiza gráfico (12 meses) e tabela (Jan→Dez) com saldos encadeados.

**F2 — Trocar de ano:**
1. Usuário clica **‹** ou **›** no seletor de ano.
2. Sistema recarrega dados do novo ano; saldo inicial de Janeiro = saldo final de Dezembro do ano anterior.

**F3 — Ajustar filtros gerais:**
1. Usuário interage com o chip "Filtros gerais" (ou "×" para limpar).
2. Sistema recalcula entradas/saídas/saldos conforme transferência, saldo inicial, valor bruto/líquido e previsão; atualiza gráfico e tabela.

**F4 — Adicionar filtro (ex.: conta):**
1. Usuário clica **+ Adicionar filtro**, escolhe **Conta** = *Banco padrão*.
2. Relatório passa a refletir somente a conta selecionada.

**F5 — Exportar:**
1. Usuário clica **Exportar ▾**, escolhe formato (PDF/Excel/CSV).
2. Sistema gera o arquivo do ano/filtros vigentes e dispara o download.

**F6 — Alternar diário/mensal (inferido):**
1. Usuário acessa a tela **Fluxo de caixa diário** (rota `/day`).
2. Filtros gerais são preservados; granularidade muda para dias do mês.

---

## 15. Notas de implementação

1. **Granularidade na rota:** manter o segmento `/month` (mensal) vs `/day` (diário) como fonte de verdade da visão; ambas compartilham componente de gráfico e tabela parametrizado por granularidade.
2. **Query string `generic`:** o front serializa filtros como pares `chave:valor` URL-encoded repetidos em `generic=`. Garantir round-trip (ler da URL → estado → reescrever na URL) para deep-linking e compartilhamento.
3. **Encadeamento de saldo:** calcular no back-end de forma ordenada (Jan→Dez), propagando `closing_balance[m-1]` para `opening_balance[m]`; cuidado com a transição entre anos (saldo de abertura).
4. **Sempre renderizar 12 meses:** mesmo sem lançamentos, exibir todos os meses com `0,00` (e saldo encadeado), como na captura — não ocultar meses vazios.
5. **Cabeçalho "Lucro/Prejuizo (R$)":** texto na UI está **sem acento** em "Prejuízo"; ao reconstruir, alinhar com o produto se deve ser corrigido para "Lucro/Prejuízo (R$)".
6. **Formatação pt-BR:** usar `Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 })`; "R$" apenas nos cabeçalhos das colunas e no eixo Y do gráfico (abreviado: `R$ 8k`, `R$ 2k`, `-R$ 4k`).
7. **Gráfico combo:** colunas (entradas verdes / saídas vermelhas) + linha (saldo azul) com eixo Y simétrico (positivo e negativo). Garantir que saídas apareçam abaixo de zero e o eixo escale automaticamente (na captura: -R$ 4k a R$ 8k).
8. **Totais de rodapé:** considerar adicionar a linha de totais (Entradas/Saídas/Resultado/Saldo final do ano) — ausente na captura, mas útil (ver §6).
9. **Performance:** a agregação é por ano; cachear por `{year + filtros}` é viável (dados mudam só com novos lançamentos).
10. **Estado vazio:** reutilizar o padrão do app (**"Hmm, está vazio por aqui!"** / **"Nenhum registro encontrado."**) caso a API retorne sem nenhum lançamento no ano.
11. **Acessibilidade:** tabela deve ter cabeçalhos `<th>` associados; valores numéricos alinhados à direita; cores de receita/despesa acompanhadas de sinal "-" (não depender só da cor).
