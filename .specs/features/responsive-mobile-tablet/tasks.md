# Tasks — Responsivo Mobile & Tablet

Spec: `spec.md` · Design: `design.md`. App mock client-side (React 19 / Next 16, Tailwind v4).
Tablet-first, CSS mobile-first. Breakpoint divisor = `md` (768px). Sem libs novas.

**Antes de codar:** abrir worktree `../artemise-worktrees/responsive-mobile-tablet`
(branch `feat/responsive-mobile-tablet`) — [[worktree-por-spec]]. Validar `tsc`+`eslint` no
worktree; `build` só no main pós-merge — [[build-worktree-turbopack]]. Merge direto, sem PR
— [[merge-direto-sem-pr]].

| ID | Status | Tarefa | Req |
|---|---|---|---|
| RSP1 | ✅ | **Drawer sidebar.** `AppShell`: backdrop `md:hidden` + fecha no pathname/`Esc`; `min-w-0` no `<main>`. `IconSidebar`: prop `expanded`→`open`, classes overlay (`fixed -translate-x-full` ↔ `translate-x-0`) no celular / fluxo (`md:static md:w-16/60`) no tablet+ | R-RSP-SHELL-1/2 |
| RSP2 | ✅ | **SubmenuShell** (`components/ui/submenu-shell.tsx`): coluna `md:w-48 lg:w-56` em md+; `<select>` nativo no topo (router.push) no celular; ativo `exact?==:startsWith` | R-RSP-SUB-1/2 |
| RSP3 | ✅ | **Refactor 5 submenus** (`financeiro/estoque/configuracoes/comunicacao/agenda`) p/ usar SubmenuShell (só `title`+`items`). Auditar `agenda-submenu` (pode já ser horizontal) | R-RSP-SUB-3 |
| RSP4 | ✅ | **Layouts módulo** (`app/{financeiro,estoque,configuracoes,comunicacao}/layout.tsx`): `flex h-full flex-col md:flex-row` + `min-w-0 flex-1` no conteúdo | R-RSP-SUB-1 |
| RSP5 | ✅ | **CSS `.rtable`** em `app/globals.css` (card-collapse < 768: blocos, thead oculto, `td::before` = `data-label`, `[data-label=""]` sem rótulo) + wrapper `components/ui/responsive-table.tsx` | R-RSP-TBL-1 |
| RSP6 | ✅ | **Adoção tabelas (7):** `patients-table`, `contacts-table`, `finance-table`, `procedimentos-table`, `pacotes-table`, `estoque-table`, `relatorio-table` — trocar `overflow-x-auto`→`<ResponsiveTable>` + `data-label` em cada `<td>` (`""` em checkbox/ações) | R-RSP-TBL-1/2 |
| RSP7 | ✅ | **Toolbars de lista:** `ListShell` busca `w-full sm:w-64` + rodapé `flex-wrap`; `patients-table` (sem ListShell) header/filtros `flex-wrap`, busca `w-full sm:w-56` | R-RSP-TBL-3 |
| RSP8 | ✅ | **Header:** colapsar WhatsApp+sino (`hidden sm:grid`); `min-w-0`+`truncate` no logo. **FloatingWidgets:** banner+progresso `hidden md:flex`; FABs com safe-area, z abaixo do drawer | R-RSP-SHELL-3/4 |
| RSP9 | ✅ | **Grids reusáveis:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-N` nos view-components compartilhados (dashboard cards, `finance-kpi-cards`, blocos relatório); charts `min-h` + card `min-w-0` | R-RSP-GRID-1/2 |
| RSP10 | 🟡 | **Verificação:** `tsc --noEmit` ✅ + eslint ✅ + **build no main ✅ (36 rotas)** pós-merge `feat/responsive-mobile-tablet`. **Pendente (manual/usuário):** QA visual DevTools @375px + @820px + Playwright (dashboard, lista-tabela, módulo-submenu, ficha): sem scroll horizontal, drawer ok, tabelas em card no celular, desktop idêntico | Critério aceite |

## Ordem sugerida
1. Shell base: **RSP1** (drawer) → **RSP8** (header/widgets).
2. Submenus: **RSP2** → **RSP3** → **RSP4**.
3. Tabelas: **RSP5** → **RSP6** → **RSP7**.
4. Grids: **RSP9**.
5. **RSP10** verificação por último.

RSP1, RSP2, RSP5 são independentes — paralelizáveis entre agentes (claim via Owner no STATE).

## Fora do MVP (follow-up)
- Retoque pixel tela-a-tela das 36; landscape dedicado; gestos swipe; PWA/offline.
- Mover `/contas-a-receber`/`/contas-a-pagar` sob layout financeiro (já deferido lote 7).
