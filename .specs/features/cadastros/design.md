# Cadastros (lote 3) — Design

## Visão arquitetural

Segue padrões já estabelecidos (D1-D5):
- Páginas = Server Components que importam mock e montam um wrapper client.
- Tabelas/modais com estado = Client Components (`"use client"`).
- Tailwind v4 tokens; primitives em `src/components/ui/`.
- Reuso: `Toggle`, `StatusBadge`, `EmptyState`, `Breadcrumb`, `Button`, `Card`.

### Decisões de design

- **DD1 — `ListShell` (novo)**: o chrome de listagem (header título+contador+Exportar/Ações em lote,
  barra de filtros "+ Adicionar filtro" + busca, rodapé paginação "25 por página") repete em 3 telas.
  Extrair `components/ui/list-shell.tsx` que recebe `title`, `count`, `children` (a `<table>`), e
  slots opcionais (`headerExtra`, `filtersExtra`). **Não** refatorar `ContactsTable`/`FinanceTable`
  existentes (risco; fora de escopo) — só as 3 tabelas novas usam `ListShell`.
- **DD2 — `Modal` base (novo)**: `components/ui/modal.tsx` — overlay escurecido, fecha em X/Esc/clique
  fora, título + children + footer. Client. Usado pelos 3 modais (CAD-09).
- **DD3 — Rotas reais**: `app/configuracoes/procedimentos/page.tsx`, `app/configuracoes/pacotes/page.tsx`,
  `app/estoque/items/page.tsx`. Sidebar de ícones ganha `href`: Configurações → `/configuracoes/procedimentos`,
  Estoque → `/estoque/items`.
- **DD4 — Submenu de Estoque**: `app/estoque/layout.tsx` renderiza submenu lateral "Estoque"
  (Controle de estoque ativo; demais "Em breve" inertes) + `children`. Configurações **não** tem
  submenu nesta fase (só breadcrumb), pra manter simples.
- **DD5 — Estado dos modais**: cada página tem wrapper client (`*-view.tsx`) que detém `useState` de
  abertura do modal e renderiza tabela + FAB + modal. FAB roxo "+" reposicionado dentro da view
  (canto inf. direito) abre o modal de criação. Página server só passa mock.
- **DD6 — Pacote — cálculo**: lógica de total em helper puro `lib/pacote-calc.ts` (testável,
  reaproveitável no modal). Estado dos itens via `useState<ItemDraft[]>` no modal.
- **DD7 — Cor (procedimento)**: paleta nomeada estática (Cinza, Azul, Verde, Vermelho, Roxo, Laranja)
  com swatch hex; dropdown simples.

---

## Componentes

### Novos — UI base
| Arquivo | Tipo | Responsabilidade | Reusa |
|---|---|---|---|
| `ui/list-shell.tsx` | client | Chrome de listagem genérico (header, filtros, paginação) | — |
| `ui/modal.tsx` | client | Dialog base (overlay, X, Esc, footer) | — |
| `ui/field.tsx` | client | Label + input/select wrapper p/ modais (rótulo, asterisco, ⓘ) | — |

### Novos — Procedimentos (CAD-01, CAD-06)
| Arquivo | Tipo | Responsabilidade |
|---|---|---|
| `app/configuracoes/procedimentos/page.tsx` | server | Monta breadcrumb + view, passa mock |
| `components/procedimentos/procedimentos-view.tsx` | client | Estado modal + tabela + FAB |
| `components/procedimentos/procedimentos-table.tsx` | client | Tabela (Nome/Categoria/Duração/Valor/Ativo) via `ListShell` |
| `components/procedimentos/procedimento-modal.tsx` | client | Modal Novo/Editar Procedimento |

### Novos — Pacotes (CAD-02, CAD-07)
| Arquivo | Tipo | Responsabilidade |
|---|---|---|
| `app/configuracoes/pacotes/page.tsx` | server | Breadcrumb + view |
| `components/pacotes/pacotes-view.tsx` | client | Estado modal + tabela + FAB |
| `components/pacotes/pacotes-table.tsx` | client | Tabela (Descrição/Valor total/Validade/Ativo) via `ListShell` |
| `components/pacotes/pacote-modal.tsx` | client | Modal Novo pacote (itens dinâmicos + desconto + total) |
| `lib/pacote-calc.ts` | puro | `itemTotal`, `subtotal`, `valorTotal` (clamp ≥ 0, %/R$) |

### Novos — Estoque (CAD-03, CAD-08)
| Arquivo | Tipo | Responsabilidade |
|---|---|---|
| `app/estoque/layout.tsx` | server/client | Submenu "Estoque" + children |
| `app/estoque/items/page.tsx` | server | View |
| `components/estoque/estoque-submenu.tsx` | client | Submenu lateral (item ativo via pathname) |
| `components/estoque/estoque-view.tsx` | client | Estado modal + indicadores + tabela + FAB |
| `components/estoque/estoque-indicators.tsx` | client | 3 cards (baixo/alto/todos) clicáveis |
| `components/estoque/estoque-table.tsx` | client | Tabela (Nome/SKU/Categoria/Unidade/Saldo/Mínimo/Custo/Valor) via `ListShell` |
| `components/estoque/item-modal.tsx` | client | Modal Novo/Editar item |

### Modificados
| Arquivo | Mudança |
|---|---|
| `components/shell/icon-sidebar.tsx` | href em Configurações (`/configuracoes/procedimentos`) e Estoque (`/estoque/items`) |
| `lib/mock.ts` | +tipos e dados: `Procedimento[]`, `Pacote[]`, `ItemEstoque[]`, `estoqueSummary`, paleta de cores |

---

## Modelo de dados (mock)

```ts
// Procedimento
type Procedimento = { id; nome; categoria: string|null; duracaoMin; valor; ativo };
// Pacote
type Pacote = { id; descricao; valorTotal; validade: string; ativo };
type ItemPacoteDraft = { nome; qtd; valor; descontoUn; descontoTipo: "R$"|"%" };
// Estoque
type ItemEstoque = { id; nome; sku; categoria; unidade; saldo; minimo; custo };
//   valor (valorização) = saldo * custo (derivado)
//   estoqueBaixo = saldo <= minimo
type EstoqueSummary = { baixo; alto; todos };
type CorOption = { nome; hex };
```

Dados de exemplo: 4 procedimentos (da spec 32: Limpeza/Microagulhamento/Peeling/Acne, 60min),
~3 pacotes (combos plausíveis), ~5 itens de estoque (1-2 com saldo ≤ mínimo p/ realce vermelho).

---

## Fórmulas (pacote-calc.ts) — spec 34 §9

```
descEfetivoUn = tipo=="%" ? valor*(descUn/100) : descUn
liquidoUn     = max(0, valor - descEfetivoUn)
itemTotal     = qtd * liquidoUn
subtotal      = Σ itemTotal
descGlobalEf  = tipo=="%" ? subtotal*(descGlobal/100) : descGlobal
valorTotal    = max(0, subtotal - descGlobalEf)
```

---

## Ordem de execução

T1 (mock + primitives base) → T2 (sidebar+layout estoque) →
(T3 procedimentos ∥ T4 pacotes ∥ T5 estoque) → T6 (verificação).

T3/T4/T5 paralelizáveis (delegáveis a sub-agents) após T1+T2.

## Riscos

- **R1**: `ListShell` genérico demais quebra fidelidade visual. Mitig.: slots opcionais, validar contra screenshots.
- **R2**: Cálculo de pacote (%/R$, clamp) — cobrir com helper puro + teste manual no modal.
- **R3**: Next 16 + layout aninhado (`estoque/layout`) — seguir App Router padrão; build gate.
