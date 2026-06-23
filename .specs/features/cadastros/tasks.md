# Tasks: Cadastros (lote 3) — STATUS: ✅ todas concluídas (build + lint verdes)

Legenda: [P] = paralelizável. Gate de cada task: `npm run build` continua passando (ou ao menos `tsc`/import resolve).
Reuso obrigatório: `Toggle`, `StatusBadge`, `EmptyState`, `Breadcrumb`, `Button`, `Card`, `cn`, `brl`.

---

- **T1 — Fundação: mock + primitives base** (sem deps) → CAD-05, CAD-09
  - `lib/mock.ts`: +`Procedimento[]` (4 da spec 32), +`Pacote[]` (~3), +`ItemEstoque[]` (~5, 1-2 c/ saldo≤mínimo),
    +`estoqueSummary`, +`coresProcedimento` (paleta nomeada), +tipos.
  - `lib/pacote-calc.ts`: `itemTotal`, `subtotal`, `valorTotal` (puro, clamp ≥0, %/R$).
  - `components/ui/modal.tsx`: Dialog base (overlay, X, Esc, fecha clique-fora, footer slot).
  - `components/ui/field.tsx`: label (asterisco/ⓘ) + slot de input.
  - `components/ui/list-shell.tsx`: chrome de listagem (header título+contador+Exportar/Ações em lote, filtros, paginação).
  - Done when: tudo importável, sem erro de tipo. `pacote-calc` retorna valores corretos.

- **T2 — Navegação: sidebar + layout estoque** (dep: T1) → CAD-04
  - `components/shell/icon-sidebar.tsx`: href Configurações→`/configuracoes/procedimentos`, Estoque→`/estoque/items`.
  - `app/estoque/layout.tsx` + `components/estoque/estoque-submenu.tsx`: submenu "Estoque" (Controle de estoque ativo via pathname; demais inertes "Em breve").
  - Done when: ícones navegam, item ativo destaca roxo; submenu renderiza em `/estoque/*`.

- **T3 — Procedimentos** [P] (dep: T1,T2) → CAD-01, CAD-06
  - `app/configuracoes/procedimentos/page.tsx` (server, breadcrumb `Configurações / Procedimentos`).
  - `components/procedimentos/procedimentos-view.tsx` (client, estado modal + FAB).
  - `procedimentos-table.tsx` (via `ListShell`; colunas Nome·Categoria·Duração·Valor·Ativo; toggle inline; categoria "-" quando null).
  - `procedimento-modal.tsx` (campos da spec §7; "Materiais de atendimento" + "Custo total"; "Informações Adicionais" recolhível; validação Nome/Cor).
  - Done when: fiel a spec 32; modal abre/fecha; build ok. R: CAD-01, CAD-06.

- **T4 — Pacotes** [P] (dep: T1,T2) → CAD-02, CAD-07
  - `app/configuracoes/pacotes/page.tsx` (server, breadcrumb `Configurações / Pacotes`).
  - `pacotes-view.tsx` + `pacotes-table.tsx` (via `ListShell`; colunas Descrição·Valor total·Validade·Ativo).
  - `pacote-modal.tsx`: Descrição*/Validade*/Ativo/Observações; tabela itens dinâmica (Nome·Qtd·Valor·Desconto un.±R$/%·Total·🗑); "+ Adicionar"; seção Desconto recolhível; "Valor total" recalculado via `pacote-calc`.
  - Done when: fiel a spec 34; total recalcula ao vivo (qtd/valor/desconto); clamp ≥0; build ok. R: CAD-02, CAD-07.

- **T5 — Estoque** [P] (dep: T1,T2) → CAD-03, CAD-08
  - `app/estoque/items/page.tsx` (server) + `estoque-view.tsx` (client).
  - `estoque-indicators.tsx`: 3 cards (Estoque baixo/vermelho, Estoque alto/amarelo, Todos/azul ativo) com contagens do summary; clicáveis (filtro visual).
  - `estoque-table.tsx` (via `ListShell`; colunas Nome·SKU·Categoria·Unidade·Saldo atual·Estoque mínimo·Custo·Valor; valor=saldo×custo; realce vermelho saldo≤mínimo). `EmptyState` se vazio.
  - `item-modal.tsx`: Nome*/SKU/Categoria/Unidade/Saldo inicial/Estoque mínimo/Custo/Marca; Salvar/Cancelar.
  - Done when: fiel a spec 24 (populado); indicadores com contagens; linha baixa realçada; build ok. R: CAD-03, CAD-08.

- **T6 — Verificação** (dep: T3,T4,T5) → CAD-10
  - `npm run build` + `npm run lint`. Corrigir erros. Smoke nas 3 rotas + abrir cada modal.
  - Atualizar STATE.md (concluído lote 3, 11/36).
  - Done when: build verde, lint limpo, 3 rotas + 3 modais OK.

## Ordem de execução
T1 → T2 → (T3 ∥ T4 ∥ T5) → T6.

## Traceabilidade
| ID | Task | Status |
|---|---|---|
| CAD-01 | T3 | Pending |
| CAD-02 | T4 | Pending |
| CAD-03 | T5 | Pending |
| CAD-04 | T2 | Pending |
| CAD-05 | T1 | Pending |
| CAD-06 | T3 | Pending |
| CAD-07 | T4 | Pending |
| CAD-08 | T5 | Pending |
| CAD-09 | T1 | Pending |
| CAD-10 | T6 | Pending |
