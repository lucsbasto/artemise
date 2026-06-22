# Orçamentos — Modais

| Metadado | Valor |
|---|---|
| **Produto** | Clínica Experts (SaaS de gestão de clínicas) |
| **Domínio** | app.clinicaexperts.com.br |
| **Idioma** | pt-BR |
| **Contexto de origem** | Ficha do paciente → aba **Orçamentos** → botão **+ Adicionar novo orçamento** |
| **Rota base** | `app.clinicaexperts.com.br/clinica/contatos/listagem/paciente/{paciente_id}/orcamentos` |
| **Query de abertura do modal** | `?sale_quote_type=sale_quote&sale_quote_mode=new` (observado: `...&sal...` truncado na barra) |
| **Paciente de exemplo (id)** | `10318910` — Clara Ribeiro (Paciente de exemplo) |
| **Modais documentados** | Novo orçamento personalizado · Novo orçamento de pacote |
| **Telas-referência** | `docs/03-telas-21-a-30.md` — Telas 23 e 24 |
| **Capturas** | `Captura de tela 2026-06-22 153145.png` (personalizado) · `Captura de tela 2026-06-22 153230.png` (pacote) |
| **Data de captura** | 2026-06-22 |
| **Status** | Especificação de desenvolvimento (detalhada). Itens não visíveis na captura marcados como **(inferido)**. |

---

## Visão geral

Ambos os modais são a **mesma janela de criação de orçamento** (`sale_quote_mode=new`), diferenciada por um toggle interno **Tipo de orçamento** com dois valores: **Personalizado** e **Pacote**. Alternar o toggle reaproveita o mesmo modal, trocando apenas o título do cabeçalho, a presença do campo **Pacote** e o comportamento da seção **Procedimentos/Produtos**.

Estrutura comum (de cima para baixo):

1. **Cabeçalho** — título dinâmico + ícone de edição (losango/diamante) + botão **×** (fechar).
2. **Tipo de orçamento\*** — toggle `Personalizado | Pacote`.
3. **Dados básicos** — Cliente, Vendedor (e Pacote no modo Pacote) + link **Mostrar opções avançadas**.
4. **Procedimentos/Produtos** — tabela de itens + link de adicionar.
5. **Desconto** — dropdown colapsado "Sem desconto ou uso de saldo".
6. **Condições de pagamento** — link de adicionar condição.
7. **Valor total / Totais** — resumo monetário.
8. **Rodapé** — botão **Salvar**.

---

## Modal — Novo orçamento personalizado

![](../../images/Captura de tela 2026-06-22 153145.png)

- **Rota/URL:** `app.clinicaexperts.com.br/clinica/contatos/listagem/paciente/10318910/orcamentos?sale_quote_type=sale_quote&sale_quote_mode=new&sal...`
- **Título exato do cabeçalho:** `Novo orçamento personalizado`
- **Ícone do cabeçalho:** losango/diamante (ação de editar nome/identificação do orçamento — **inferido**).
- **Fechar:** ícone `×` no canto superior direito → fecha o modal e remove os parâmetros `sale_quote_*` da URL (**inferido**).

### Abas internas (toggle Tipo de orçamento)

| Aba | Estado nesta captura | Aparência |
|---|---|---|
| **Personalizado** | Selecionada (ativa) | Botão preenchido em roxo, texto branco |
| **Pacote** | Não selecionada | Botão de fundo claro, texto cinza/escuro |

- **Rótulo da seção:** `Tipo de orçamento*` (obrigatório).
- **Tipo de controle:** toggle de dois botões mutuamente exclusivos (segmented control).
- **Ação:** clicar em **Pacote** transforma este modal no **"Novo orçamento de pacote"** (ver subseção seguinte), sem fechar a janela.

### Seção — Dados básicos

| # | Rótulo exato | Tipo | Obrigatório | Placeholder / Valor exibido | Opções / Observações |
|---|---|---|---|---|---|
| 1 | `Cliente*` | Select com busca (autocomplete) | Sim | `Clara Ribeiro (Paciente de exemplo)` (pré-preenchido com o paciente da ficha) | Lista de pacientes/contatos. Link **`+ Adicionar`** à direita do rótulo abre criação rápida de cliente (**inferido**). |
| 2 | `Vendedor*` | Select | Sim | `Lucas Bastos` (pré-preenchido com o usuário logado — **inferido**) | Lista de profissionais/usuários da clínica. |
| 3 | `Mostrar opções avançadas` | Link expansível (disclosure) | Não | — | Ícone `▾` à esquerda, texto roxo. Expande campos adicionais — candidatos: validade do orçamento, observações, número/identificador, data de emissão, centro de custo (**inferido**, não visível na captura). |

- **Pré-seleção:** como o modal é aberto a partir da ficha do paciente, o campo **Cliente** já vem preenchido com o paciente corrente (`paciente_id` da rota).

### Seção — Procedimentos/Produtos (tabela de itens)

Cabeçalho de colunas (textos exatos) + 1 linha de item em branco por padrão:

| Coluna (rótulo exato) | Tipo de campo | Obrigatório | Placeholder / Valor inicial | Regras |
|---|---|---|---|---|
| `Nome` | Select com busca (autocomplete) | Sim | `Pesquise/Selecione` | Lista unificada de **procedimentos e produtos** cadastrados. Selecionar um item preenche `Valor (R$)` com o preço de tabela (**inferido**). |
| `Qtd.` | Numérico (stepper) | Sim | `1` | Inteiro ≥ 1 (**inferido**). |
| `Valor (R$)` | Monetário | Sim | `0,00` | Máscara monetária pt-BR (vírgula decimal, ponto de milhar). Editável (sobrescreve preço de tabela). |
| `Desconto un.` | Monetário/percentual + seletor de unidade | Não | `0,00` + seletor `R$` | Seletor de unidade com opções **`R$`** e **`%`** (**inferido** a partir do padrão da seção Desconto). Aplica desconto **unitário** (por unidade do item). |
| `Total (R$)` | Monetário (somente leitura) | — | `0,00` | Calculado: `(Valor − Desconto_un_convertido) × Qtd.` (ver Regras/cálculos). |
| (ações) | Ícone **lixeira** | — | — | Remove a linha do item. |

- **Link de adição:** `+ Adicionar Procedimentos/Produtos` (texto exato, roxo) → insere nova linha em branco na tabela.
- No modo **Personalizado**, a tabela já exibe **uma linha editável** pronta para preenchimento.

### Seção — Desconto

- **Rótulo exato:** `Desconto`.
- **Controle (à direita):** dropdown colapsado com o texto `Sem desconto ou uso de saldo ▾`.
- **Tipo:** select/disclosure. Opções (**inferidas**): `Sem desconto ou uso de saldo`, desconto em **R$**, desconto em **%**, e **uso de saldo/crédito do paciente** (a carteira do paciente — ver aba "Carteira" da ficha).
- **Escopo:** desconto **sobre o total do orçamento** (diferente do `Desconto un.` por item).

### Seção — Condições de pagamento

- **Rótulo exato:** `Condições de pagamento` (parcialmente visível no rodapé da captura, abaixo de Desconto).
- **Controle:** link **`+ Adicionar condição`** (texto exato confirmado no modal de pacote; mesmo componente reutilizado — **inferido** para o personalizado).
- **Comportamento (inferido):** cada condição representa uma parcela/forma de pagamento (método, valor, data de vencimento, nº de parcelas). Soma das condições deve fechar com o **Total**.

### Rodapé / Botões

| Texto exato | Estilo | Ação |
|---|---|---|
| `Salvar` | Botão roxo preenchido, centralizado no rodapé | Persiste o orçamento (POST). Mantém status inicial **rascunho/aberto** (**inferido**). |
| `×` (cabeçalho) | Ícone | Fecha o modal sem salvar. |

> **Observação:** Na captura não há botão "Cancelar" explícito; o fechamento se dá pelo `×` ou clique fora do modal (**inferido**). Botões de "Salvar e converter em venda" / "Gerar PDF" / "Enviar" podem aparecer após salvar (**inferido**).

---

## Modal — Novo orçamento de pacote

![](../../images/Captura de tela 2026-06-22 153230.png)

- **Rota/URL:** mesma base de orçamentos com `?sale_quote_type=sale_quote&sale_quote_mode=new&...`
- **Título exato do cabeçalho:** `Novo orçamento de pacote`
- **Ícone do cabeçalho:** losango/diamante (igual ao personalizado).
- **Fechar:** ícone `×`.

### Abas internas (toggle Tipo de orçamento)

| Aba | Estado nesta captura | Aparência |
|---|---|---|
| **Personalizado** | Não selecionada | Fundo claro, texto escuro |
| **Pacote** | Selecionada (ativa) | Botão preenchido em roxo, texto branco |

- **Rótulo:** `Tipo de orçamento*` (obrigatório).
- **Ação:** clicar em **Personalizado** retorna ao modal anterior.

### Seção — Dados básicos (3 colunas)

| # | Rótulo exato | Tipo | Obrigatório | Placeholder / Valor exibido | Opções / Observações |
|---|---|---|---|---|---|
| 1 | `Pacote*` | Select com busca | Sim | `Pesquise/Selecione o pacote` | Lista de **pacotes** cadastrados. Selecionar popula automaticamente a seção Procedimentos/Produtos e o **Valor total** (**inferido**). |
| 2 | `Cliente*` | Select com busca | Sim | `Clara Ribeiro (Paciente de exemplo)` (pré-preenchido) | Link **`+ Adicionar`** à direita do rótulo. |
| 3 | `Vendedor*` | Select | Sim | `Lucas Bastos` | Lista de profissionais/usuários. |

- **Disclosure:** `Mostrar opções avançadas` (`▾`, roxo) — mesmos campos avançados inferidos do modal personalizado.

### Seção — Procedimentos/Produtos

- **Rótulo exato:** `Procedimentos/Produtos`.
- Nesta captura **não há linha/tabela de itens visível** — apenas o link **`+ Adicionar Procedimentos/Produtos`** (texto exato, roxo).
- **Comportamento (inferido):** os procedimentos do orçamento vêm do **pacote** selecionado em `Pacote*`; o link permite **adicionar itens extras** avulsos (fora do pacote). As mesmas colunas do modo personalizado (`Nome`, `Qtd.`, `Valor (R$)`, `Desconto un.`, `Total (R$)`, lixeira) aparecem ao adicionar/popular itens.

### Seção — Desconto

- **Rótulo exato:** `Desconto`.
- **Controle (à direita):** `Sem desconto ou uso de saldo ▾` (idêntico ao modal personalizado).

### Seção — Condições de pagamento

- **Rótulo exato:** `Condições de pagamento`.
- **Controle:** link **`+ Adicionar condição`** (texto exato, roxo).

### Totais

- **Rótulo exato:** `Valor total`.
- **Valor exibido:** `R$ 0,00` (alinhado à direita, em destaque).
- **Cálculo (inferido):** `Valor total = (soma dos itens do pacote + itens extras) − Desconto`. Atualiza ao selecionar o pacote e ao alterar itens/desconto.

> Diferença em relação ao modo personalizado: o modal de pacote exibe um **único resumo "Valor total"** consolidado (em vez de a coluna `Total (R$)` por linha como foco principal), pois os itens derivam do pacote.

### Rodapé / Botões

| Texto exato | Estilo | Ação |
|---|---|---|
| `Salvar` | Botão roxo preenchido, centralizado | Persiste o orçamento de pacote (POST). |
| `×` (cabeçalho) | Ícone | Fecha o modal sem salvar. |

---

## Modelo de dados inferido

> Todos os nomes de tabela/coluna abaixo são **(inferidos)** a partir do parâmetro de rota `sale_quote` e dos rótulos de UI.

### Entidade `SaleQuote` (Orçamento)

| Campo (inferido) | Tipo | Origem na UI | Notas |
|---|---|---|---|
| `id` | bigint (PK) | — | Identificador do orçamento. |
| `type` / `sale_quote_type` | enum | query `sale_quote_type=sale_quote` | Tipo do documento (orçamento de venda). |
| `mode` | enum `personalizado \| pacote` | toggle **Tipo de orçamento** | Define se deriva de pacote ou é avulso. |
| `client_id` / `patient_id` | bigint (FK → Paciente/Contato) | **Cliente\*** | Pré-preenchido com `paciente_id` da rota. |
| `seller_id` / `professional_id` | bigint (FK → Profissional/Usuário) | **Vendedor\*** | Default = usuário logado. |
| `package_id` | bigint (FK → Pacote), nullable | **Pacote\*** (só modo pacote) | Obrigatório quando `mode=pacote`. |
| `discount_type` | enum `none \| amount \| percent \| balance` | **Desconto** | "Sem desconto ou uso de saldo". |
| `discount_value` | decimal | **Desconto** | Valor/percentual conforme `discount_type`. |
| `subtotal` | decimal (calculado) | — | Soma dos itens (ver fórmulas). |
| `total` | decimal (calculado) | **Valor total / Total** | `subtotal − desconto`. |
| `status` | enum `rascunho \| aberto \| aprovado \| convertido \| cancelado` | — | Inicial = rascunho/aberto (**inferido**). |
| `valid_until` | date, nullable | opções avançadas | Validade (**inferido**). |
| `notes` | text, nullable | opções avançadas | Observações (**inferido**). |
| `created_at` / `updated_at` | timestamp | — | Auditoria. |

### Entidade `SaleQuoteItem` (ItemOrçamento)

| Campo (inferido) | Tipo | Origem na UI | Notas |
|---|---|---|---|
| `id` | bigint (PK) | — | — |
| `sale_quote_id` | bigint (FK → SaleQuote) | — | Vínculo com o orçamento. |
| `itemable_type` | enum `procedure \| product` | **Nome** | Procedimento ou Produto. |
| `itemable_id` | bigint (FK polimórfico) | **Nome** | → Procedimento ou Produto. |
| `name` | string | **Nome** | Descrição exibida. |
| `quantity` | integer | **Qtd.** | Default 1. |
| `unit_price` | decimal | **Valor (R$)** | Preço de tabela (editável). |
| `unit_discount_value` | decimal | **Desconto un.** | Por unidade. |
| `unit_discount_type` | enum `amount \| percent` | seletor `R$ / %` | Unidade do desconto. |
| `line_total` | decimal (calculado) | **Total (R$)** | Ver fórmula. |
| `from_package` | boolean | — | `true` se herdado do pacote (**inferido**). |

### Entidade `SaleQuotePaymentCondition` (Condição de pagamento)

| Campo (inferido) | Tipo | Origem na UI | Notas |
|---|---|---|---|
| `id` | bigint (PK) | — | — |
| `sale_quote_id` | bigint (FK → SaleQuote) | — | — |
| `payment_method_id` | bigint (FK → MétodoPagamento) | **+ Adicionar condição** | Cartão, Pix, dinheiro etc. |
| `installments` | integer | condição | Nº de parcelas (**inferido**). |
| `amount` | decimal | condição | Valor da condição. |
| `due_date` | date | condição | Vencimento (**inferido**). |

### Relacionamentos

- `SaleQuote` **1—N** `SaleQuoteItem`.
- `SaleQuote` **1—N** `SaleQuotePaymentCondition`.
- `SaleQuote` **N—1** `Paciente/Contato` (Cliente).
- `SaleQuote` **N—1** `Profissional/Usuário` (Vendedor).
- `SaleQuote` **N—1** `Pacote` (opcional, modo pacote).
- `SaleQuoteItem` **N—1** `Procedimento` **ou** `Produto` (polimórfico).

---

## Endpoints API inferidos

> Todos **(inferidos)**. Base provável: `/clinica/.../orcamentos` (web) e/ou `/api/sale-quotes` (REST).

| Operação | Método + rota (inferida) | Payload / Notas |
|---|---|---|
| Listar orçamentos do paciente | `GET /api/patients/{patient_id}/sale-quotes` | Filtros, paginação (25/página). |
| Abrir modal de criação | `GET .../orcamentos?sale_quote_type=sale_quote&sale_quote_mode=new` | Estado de UI controlado por query (confirmado pela URL). |
| Criar orçamento | `POST /api/sale-quotes` | `{ mode, client_id, seller_id, package_id?, items[], discount_type, discount_value, payment_conditions[] }` |
| Editar orçamento | `PUT/PATCH /api/sale-quotes/{id}` | Mesmo payload. |
| Excluir orçamento | `DELETE /api/sale-quotes/{id}` | — |
| Buscar procedimentos/produtos (autocomplete do campo Nome) | `GET /api/items?q={termo}&type=procedure,product` | Alimenta `Pesquise/Selecione`. |
| Buscar pacotes (autocomplete) | `GET /api/packages?q={termo}` | Alimenta `Pesquise/Selecione o pacote`. |
| Buscar clientes (autocomplete) | `GET /api/contacts?q={termo}&role=patient` | Campo **Cliente**. |
| Buscar vendedores | `GET /api/professionals` | Campo **Vendedor**. |
| Métodos de pagamento | `GET /api/payment-methods` | Condições de pagamento. |
| **Converter em venda** | `POST /api/sale-quotes/{id}/convert` ou `POST /api/sales { from_quote_id }` | Gera a venda/recebíveis a partir do orçamento aprovado. |
| Gerar PDF / enviar | `GET /api/sale-quotes/{id}/pdf` · `POST /api/sale-quotes/{id}/send` | **(inferido)** — não visível na captura. |

---

## Regras / cálculos

Notação: vírgula decimal (pt-BR), arredondamento a 2 casas (**inferido**).

1. **Desconto unitário por item** (conforme `Desconto un.` + seletor `R$/%`):
   - Se unidade = `R$`: `desconto_unit = Desconto_un`.
   - Se unidade = `%`: `desconto_unit = Valor × (Desconto_un / 100)`.
2. **Total da linha (`Total (R$)`):**
   `line_total = (Valor − desconto_unit) × Qtd.`
   (clamp em 0 se negativo — **inferido**).
3. **Subtotal do orçamento:**
   `subtotal = Σ line_total` de todos os itens.
4. **Desconto do orçamento** (seção **Desconto**):
   - `Sem desconto`: `desconto_pedido = 0`.
   - `R$`: `desconto_pedido = valor`.
   - `%`: `desconto_pedido = subtotal × (valor / 100)`.
   - `Uso de saldo`: abate do crédito/carteira do paciente (**inferido**).
5. **Total / Valor total:**
   `total = subtotal − desconto_pedido`
   (não pode ser negativo — **inferido**).
6. **Condições de pagamento:** a soma das condições deve ser igual ao `total` (validação ao salvar — **inferido**).
7. **Modo Pacote:** ao selecionar `Pacote*`, os itens e o `subtotal` são pré-carregados do pacote; o **Valor total** reflete imediatamente. Itens extras adicionados somam ao subtotal.

---

## Fluxos

### Fluxo 1 — Criar orçamento personalizado
1. Ficha do paciente → aba **Orçamentos** → **+ Adicionar novo orçamento**.
2. Modal abre com toggle em **Personalizado**; **Cliente** pré-preenchido.
3. Conferir **Vendedor**.
4. Em **Procedimentos/Produtos**, selecionar item em `Nome` → preenche `Valor (R$)`.
5. Ajustar `Qtd.` e `Desconto un.` → `Total (R$)` recalcula.
6. (Opcional) **+ Adicionar Procedimentos/Produtos** para mais linhas.
7. (Opcional) Aplicar **Desconto** geral e/ou **+ Adicionar condição** de pagamento.
8. **Salvar** → orçamento persiste e aparece na listagem da aba Orçamentos.

### Fluxo 2 — Criar orçamento de pacote
1. No modal, clicar no toggle **Pacote** → título muda para **Novo orçamento de pacote**.
2. Selecionar **Pacote\*** → itens e **Valor total** são populados.
3. (Opcional) Adicionar itens extras, desconto e condições de pagamento.
4. **Salvar**.

### Fluxo 3 — Converter orçamento em venda (inferido)
1. Abrir orçamento salvo → ação **Converter em venda** (no menu `⋮` da listagem ou no detalhe).
2. Sistema gera a venda e os recebíveis correspondentes (Contas a receber).
3. Status do orçamento passa a `convertido`.

---

## Notas de implementação

- **Estado por query string:** a abertura e o modo do modal são governados por `sale_quote_type` e `sale_quote_mode` na URL — manter sincronização entre toggle e query para permitir deep-link e voltar/avançar do navegador.
- **Toggle sem perda de dados:** ao alternar Personalizado ↔ Pacote, preservar Cliente/Vendedor já preenchidos (**inferido**); avaliar comportamento dos itens (limpar vs. manter) ao trocar de modo.
- **Pré-preenchimento:** Cliente = paciente da rota; Vendedor = usuário logado.
- **Máscara monetária pt-BR:** vírgula como separador decimal e ponto de milhar em todos os campos `R$` (`Valor (R$)`, `Desconto un.`, `Total (R$)`, `Valor total`).
- **Seletor de unidade de desconto** (`R$ / %`) deve recalcular o `Total (R$)` em tempo real.
- **Campos obrigatórios** (`*`): Tipo de orçamento, Cliente, Vendedor (e Pacote no modo pacote). Validar antes de habilitar/efetivar **Salvar**.
- **Autocomplete** nos campos `Nome`, `Pacote` e `Cliente` (placeholder "Pesquise/Selecione...") — debounce nas buscas.
- **"Mostrar opções avançadas"** é uma seção colapsável; seu conteúdo não está visível na captura e está marcado como **(inferido)**.
- **Acessibilidade/UX:** modal centralizado sobre overlay escurecido; rodapé fixo com **Salvar**; fechamento por `×` (e clique no overlay — **inferido**).
- **Itens herdados de pacote** devem ser sinalizados (flag `from_package`) e, possivelmente, ter edição restrita (**inferido**).
