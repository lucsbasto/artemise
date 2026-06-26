# Vendas

**Rota:** `/vendas/` (dashboard) · `/vendas/orcamentos` (listagem)
**Tipo:** Dashboard (visão geral) + Listagem
**Screenshots:** `vendas.png`, `vendas-bottom.png`, `vendas-orcamentos.png`

## Propósito

Módulo comercial. Reúne o funil de **orçamentos** e as **vendas** efetivadas (personalizada, crédito/saldo e pacote), com dashboard de indicadores e rankings. O CRUD de venda/orçamento é todo via **modal** (deep-linkável), não há página dedicada de criação.

## Sub-páginas (breadcrumb `Vendas / ...`)

| Sub-página | Rota | Conteúdo |
|---|---|---|
| **Visão geral** | `/vendas/` | Dashboard de KPIs + gráficos + rankings |
| **Orçamentos** | `/vendas/orcamentos` | Listagem de orçamentos E vendas (mesma grade) |

> A listagem fica em `/vendas/orcamentos` e serve tanto a orçamentos quanto a vendas criadas. Não há rota separada `/vendas/lista`.

## Visão geral (dashboard) — `/vendas/`

### Filtros (topo)
- **Período** (chip): default últimos 30 dias (ex.: `26/05/2026 – 25/06/2026`). Datepicker com atalhos Hoje / Esta semana / Este mês / Últimos 7 dias / Últimos 30 dias + calendário.
- **+ Adicionar filtro** · **Limpar filtros** (mostra "N filtros aplicados") · campo **Buscar**.

### KPIs (4 cards, com % de variação vs. período anterior e tooltip ⓘ)
| Card | Conteúdo |
|---|---|
| **Faturamento** | R$ total recebido/faturado |
| **Vendas** | nº de vendas |
| **Valor orçado** | R$ em orçamentos |
| **Ticket médio** | R$ médio por venda |

### Gráficos / blocos
- **Faturamento x Vendas** — gráfico combo (barras Faturamento + linhas Vendas/Orçado). Granularidade: **Diária / Semanal / Mensal / Anual**. Legenda: Faturamento · Vendas · Orçado.
- **Orçamentos** (card lateral, link "Ver todos" → `/vendas/orcamentos`).
- **Vendas por tipo** (mini gráfico de barras por tipo de venda).
- **Ranking de Procedimentos** · **Ranking de Produtos** · **Ranking de Pacientes** (cada um com "ver mais"). Empty state: "Não há nada aqui! Nenhuma venda encontrada para os filtros selecionados".

## Listagem de Orçamentos — `/vendas/orcamentos`

- Cabeçalho: título **Orçamentos** + **Exportar ▾** (à direita; desabilitado quando não há registros).
- Filtros: chip **Período** + **+ Adicionar filtro** + **Buscar**.
- **Paginação:** seletor por página (10 / 25 / 50 / 100; default 25) + navegação `« ‹ › »`.
- **Empty state:** ícone de lupa + "Oops, nada foi encontrado! Os filtros selecionados não correspondem a nenhum registro." + botões **Limpar filtros** e **+ Adicionar novo orçamento**.

> Conta de teste estava sem orçamentos/vendas no período → não foi possível observar as **colunas** da grade populada. Estrutura de colunas inferida do detalhe da venda (cliente, descrição, valor, status, vendedor, data).

### Filtros disponíveis (menu "Adicionar filtro")
| Filtro | Tipo | Opções |
|---|---|---|
| **Período** | datepicker | Hoje · Esta semana · Este mês · Últimos 7 dias · Últimos 30 dias · calendário |
| **Cliente** | select busca | pacientes/contatos |
| **Vendedor** | select busca | profissionais/usuários |
| **Status** | multiselect | **Ganho · Perdido · Vencido · Aberto** |

## FAB (botão + flutuante) — criação

`data-cy=floating-button`. Opções:
- **Novo orçamento** (fora do escopo deste doc; proposta comercial, vira venda quando "Ganho")
- **Nova venda personalizada** → [venda-personalizada.md](venda-personalizada.md)
- **Nova venda de crédito** (modal "Nova venda de saldo") → [venda-credito.md](venda-credito.md)
- **Nova venda de pacote** → [venda-pacote.md](venda-pacote.md)

### Deep-links de modal descobertos
Todos compartilham `?order_modal_type=order&order_modal_mode=new&order_type=<tipo>`:
| Tipo | `order_type` |
|---|---|
| Venda personalizada | `sale` |
| Venda de crédito/saldo | `credit` |
| Venda de pacote | `combo` |
| Orçamento | (via "Novo orçamento") |

Modal de **detalhe** da venda salva: `?order_modal_type=order&order_modal_mode=info&order_id=<id>`.

## Detalhe da venda ("Detalhes da venda")

Drawer lateral (abre ao salvar ou clicar numa venda). Badge do tipo no topo: **Personalizada / Crédito / Pacote**.

**Cabeçalho:** Valor (R$) · Cliente (foto+nome) · Vendedor · Data de competência · Categoria · Descrição · Parcelamento (Nx).

**Procedimentos/Produtos** (tabela, só em personalizada/pacote): Nome · Quantidade · Valor unitário (R$) · Desconto unitário (R$) · Total (R$).

**Valor total (R$)** (expansível): Subtotal · Descontos dos itens · Desconto geral · Uso de saldo · **Total**.

**Recebimento** (tabela): Parc. (1/1) · Método · Conta · Valor (R$) · Recebido (R$) · Em aberto (R$) · Vencimento · Recebim. · **Situação** (badge ex.: "Em aberto") · **Ações** (ícone $ = registrar recebimento; menu ⋮). Rodapé: Valor recebido / Valor a receber / Valor em aberto, com sub-linhas Uso de saldo · Desconto · Juros · Multa · Tarifas.

**Ações (rodapé do drawer):** **Gerar documento** · **Imprimir** · **Excluir** · **Editar**.

> ⚠️ "Gerar documento" e "Imprimir" não foram acionados (potencial geração de NF/contrato externo). Apenas documentados.

## Observações para o Artemise

- **3 tipos de venda** num só modal, diferenciados por `order_type`: personalizada (itens avulsos), crédito/saldo (vende saldo pré-pago do paciente) e pacote (combo de procedimentos pré-cadastrado). Boa cobertura comercial de clínica.
- Listagem unifica **orçamento + venda** na mesma grade; orçamento "Ganho" converte em venda. Funil enxuto.
- Dashboard já entrega ticket médio, faturamento x orçado e rankings (procedimento/produto/paciente) — métricas de gestão prontas, sem BI externo.
- Status de orçamento (Ganho/Perdido/Vencido/Aberto) habilita relatório de conversão de funil.
- Recebimento embutido na venda (parcelas, método, conta, vencimento, situação) acopla venda↔financeiro — evita lançamento manual duplicado.
- "Uso de saldo" no desconto integra a venda de crédito: paciente pré-paga saldo e abate em compras futuras.
