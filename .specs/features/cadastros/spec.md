# Cadastros (lote 3) — Specification

## Problem Statement

O SaaS Clínica Experts precisa das telas de **cadastro de catálogo**: Procedimentos (serviços),
Pacotes (combos de procedimentos/produtos) e Itens de Estoque. São telas de listagem + modal de
cadastro/edição que alimentam agenda, vendas e fichas. Hoje 8/36 telas existem; este lote leva a 11/36.

## Goals

- [ ] 3 telas de listagem fiéis às specs 32, 34, 24, montadas no AppShell existente.
- [ ] 3 modais de cadastro/edição (Procedimento, Pacote com itens dinâmicos, Item de estoque).
- [ ] Rotas reais: `/configuracoes/procedimentos`, `/configuracoes/pacotes`, `/estoque/items`.
- [ ] Sidebar de ícones com Configurações e Estoque navegáveis (hoje "dead").
- [ ] Reuso máximo de primitives existentes (Toggle, StatusBadge, EmptyState, Breadcrumb, Card, Button).
- [ ] build ✅ + lint ✅, smoke nas 3 rotas.

## Out of Scope

| Feature | Razão |
|---|---|
| Persistência / API real | Mock estático (D2). Modais validam mas não salvam. |
| Submenu lateral de Estoque (Giro, Contagem, etc.) | Só "Controle de estoque" nesta fase; demais itens são "Em breve". |
| Submenu de Configurações completo (Categorias, Fichas, etc.) | Só Procedimentos + Pacotes; demais "Em breve". |
| Categoria inline ("+ Adicionar" dentro do modal) | Dropdown estático; criação inline fora de escopo. |
| Autocomplete server-side, exportação, ações em lote funcionais | Visual apenas (botões inertes), igual aos lotes 1-2. |
| Filtros funcionais / ordenação / busca | Visual apenas (igual lotes anteriores). |

---

## User Stories

### P1: Listagem de Procedimentos ⭐ MVP

**User Story**: Como gestor da clínica, quero ver a lista de procedimentos cadastrados (nome,
categoria, duração, valor, ativo) para gerenciar o catálogo de serviços.

**Why P1**: Catálogo de serviços é base da agenda e vendas; tela mais simples do lote.

**Acceptance Criteria**:

1. WHEN acesso `/configuracoes/procedimentos` THEN sistema SHALL exibir card "Procedimentos" com
   contador "{N} registros", breadcrumb `Configurações / Procedimentos`, e tabela com colunas
   **Nome · Categoria · Duração · Valor · Ativo**.
2. WHEN há procedimentos no mock THEN cada linha SHALL exibir nome, categoria (ou "-"), duração em
   minutos, valor em BRL e toggle "Ativo" verde.
3. WHEN a tela carrega THEN SHALL exibir barra de filtros ("+ Adicionar filtro" + busca "Buscar"),
   botões "Exportar"/"Ações em lote" e rodapé de paginação "25 por página" + controles.

**Independent Test**: Abrir `/configuracoes/procedimentos`, ver 4 procedimentos do mock com toggles verdes.

---

### P1: Listagem de Pacotes ⭐ MVP

**User Story**: Como gestor, quero ver os pacotes (combos) cadastrados com descrição, valor total,
validade e status para gerenciar ofertas combinadas.

**Why P1**: Pacotes são oferta comercial central; reusa o mesmo padrão de listagem.

**Acceptance Criteria**:

1. WHEN acesso `/configuracoes/pacotes` THEN sistema SHALL exibir card "Pacotes" com breadcrumb
   `Configurações / Pacotes` e tabela com colunas **Descrição · Valor total · Validade · Ativo**.
2. WHEN há pacotes no mock THEN cada linha SHALL exibir descrição, valor total em BRL, validade
   (ex.: "Ilimitado") e toggle "Ativo".
3. WHEN a tela carrega THEN SHALL reusar o mesmo chrome de listagem (header, filtros, paginação).

**Independent Test**: Abrir `/configuracoes/pacotes`, ver pacotes do mock com valores totais.

---

### P1: Listagem de Estoque (Controle de estoque) ⭐ MVP

**User Story**: Como gestor, quero ver os itens de estoque com saldo, mínimo, custo e valorização,
e indicadores de estoque baixo/alto, para controlar insumos.

**Why P1**: Controle de insumos; tela com indicadores clicáveis (padrão novo).

**Acceptance Criteria**:

1. WHEN acesso `/estoque/items` THEN sistema SHALL exibir submenu lateral "Estoque" (item "Controle
   de estoque" ativo) e card "Controle de estoque".
2. WHEN a tela carrega THEN SHALL exibir 3 cards indicadores: **Estoque baixo** (vermelho),
   **Estoque alto** (amarelo), **Todos** (azul, ativo) com contagens reais do mock.
3. WHEN há itens no mock THEN tabela SHALL exibir colunas **Nome · SKU · Categoria · Unidade ·
   Saldo atual · Estoque mínimo · Custo · Valor** com valorização = saldo × custo.
4. WHEN saldo ≤ estoque mínimo THEN a linha SHALL receber realce vermelho (estoque baixo).

**Independent Test**: Abrir `/estoque/items`, ver itens, indicadores com contagens, linha de estoque baixo realçada.

---

### P2: Modal "Editar/Novo Procedimento"

**User Story**: Como gestor, quero abrir um modal para criar/editar um procedimento com seus campos
comerciais e operacionais.

**Why P2**: Edição é importante mas a listagem entrega valor sozinha.

**Acceptance Criteria**:

1. WHEN clico no FAB "+" (ou ⋮ → Editar / nome) THEN sistema SHALL abrir modal "Novo Procedimento"
   (ou "Editar Procedimento") sobre overlay escurecido.
2. WHEN o modal abre THEN SHALL exibir campos: **Nome\*** (texto), **Valor de venda** + dropdown
   "Fixo", **Custo adicional**, **Cor\***, **Duração** (minutos), **Tempo de reconsulta** (dias),
   **Categoria**, toggle **Ativo**; seção "Materiais de atendimento" + linha "Custo total";
   seção recolhível "Informações Adicionais"; botão "Salvar".
3. WHEN clico em "X" / overlay / Esc THEN o modal SHALL fechar sem persistir.
4. WHEN campos obrigatórios (Nome, Cor) vazios e clico "Salvar" THEN SHALL destacar erro (validação client).

**Independent Test**: Abrir modal pelo FAB, ver todos os campos, fechar pelo X.

---

### P2: Modal "Novo Pacote" (itens dinâmicos + desconto)

**User Story**: Como gestor, quero montar um pacote adicionando procedimentos/produtos com qtd,
valor, desconto e ver o total recalculado.

**Why P2**: Modal mais complexo (cálculo dinâmico); listagem entrega valor antes.

**Acceptance Criteria**:

1. WHEN abro "Novo pacote" THEN SHALL exibir **Descrição\***, **Validade\*** (default "Ilimitado"),
   toggle **Ativo**, **Observações**; seção "Procedimentos/Produtos" (tabela editável); seção
   recolhível "Desconto"; linha "Valor total"; botão "Salvar".
2. WHEN a tabela de itens renderiza THEN cada linha SHALL ter colunas **Nome** (select), **Qtd.**,
   **Valor (R$)**, **Desconto un.** (+ seletor R$/%), **Total (R$)** (read-only) e lixeira (🗑).
3. WHEN altero Qtd./Valor/Desconto de um item THEN **Total (R$)** da linha e **Valor total** SHALL
   recalcular em tempo real conforme fórmulas da spec (§9).
4. WHEN clico "+ Adicionar Procedimentos/Produtos" THEN SHALL adicionar nova linha vazia.
5. WHEN expando "Desconto" THEN SHALL exibir campo `Desconto` + seletor R$/% que afeta o "Valor total".

**Independent Test**: Abrir modal, adicionar 2 itens com qtd/valor, ver total somar; aplicar desconto %, ver total cair.

---

### P2: Modal "Novo/Editar Item" de estoque

**User Story**: Como gestor, quero cadastrar/editar um item de estoque com seus campos.

**Why P2**: Edição complementa a listagem.

**Acceptance Criteria**:

1. WHEN clico "+ Adicionar novo item" / FAB THEN SHALL abrir modal "Novo item".
2. WHEN o modal abre THEN SHALL exibir campos: **Nome\***, **SKU**, **Categoria**, **Unidade**,
   **Saldo inicial**, **Estoque mínimo**, **Custo**, **Marca/Fornecedor**; botões "Salvar"/"Cancelar".
3. WHEN fecho (X/Cancelar) THEN modal SHALL fechar sem persistir.

**Independent Test**: Abrir modal pelo CTA, ver campos, cancelar.

---

## Edge Cases

- WHEN listagem sem registros THEN SHALL exibir empty-state "Hmm, está vazio por aqui!" /
  "Nenhum registro encontrado." (reusa `EmptyState`).
- WHEN desconto torna total negativo THEN "Valor total" SHALL ser clampado em R$ 0,00.
- WHEN percentual > 100 no modal de pacote THEN SHALL clampar/validar (≤ 100).
- WHEN item de estoque com saldo > mínimo THEN SHALL contar em "Todos" mas não em "Estoque baixo".
- WHEN procedimento sem categoria THEN coluna Categoria SHALL exibir "-".

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|---|---|---|---|
| CAD-01 | P1: Listagem Procedimentos | Design | Pending |
| CAD-02 | P1: Listagem Pacotes | Design | Pending |
| CAD-03 | P1: Listagem Estoque + indicadores | Design | Pending |
| CAD-04 | Sidebar Configurações/Estoque navegáveis | Design | Pending |
| CAD-05 | Mock data (procedimentos, pacotes, estoque) | Design | Pending |
| CAD-06 | P2: Modal Procedimento | Design | Pending |
| CAD-07 | P2: Modal Pacote (cálculo dinâmico) | Design | Pending |
| CAD-08 | P2: Modal Item de estoque | Design | Pending |
| CAD-09 | Componente Modal base reutilizável | Design | Pending |
| CAD-10 | build + lint + smoke 3 rotas | - | Pending |

**ID format:** `CAD-[NUMBER]`
**Status values:** Pending → In Design → In Tasks → Implementing → Verified
**Coverage:** 10 total, 0 mapped to tasks, 10 unmapped ⚠️ (mapeados na fase Tasks)

---

## Success Criteria

- [ ] 3 rotas acessíveis e fiéis às specs (textos exatos das colunas e títulos).
- [ ] Modais abrem/fecham; modal de pacote recalcula total corretamente.
- [ ] Sidebar destaca módulo ativo (Configurações roxo / Estoque roxo).
- [ ] `npm run build` verde, `npm run lint` limpo.
- [ ] 11/36 telas concluídas.
