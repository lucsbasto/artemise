# Feature: Responsivo — Mobile & Tablet

> App nasceu desktop-first (shell de 2 sidebars em fluxo, tabelas largas, overlays com
> offsets fixos). Uso real será majoritariamente em **tablet**, e celular como secundário.
> Este spec corrige a **fundação reutilizável** (shell, submenus, tabelas, modais, grids,
> header, FAB). As 36 telas herdam o comportamento; ajuste tela-a-tela fica fora de escopo.

## Objetivo

App utilizável e confortável em **tablet (primário)** e **celular (secundário)**, sem
regressão no desktop. Foco em padrões reusáveis, não em retoque pixel de cada tela.

## Alvo & breakpoints

Estratégia **tablet-first** (otimizar tablet primeiro, celular escala pra baixo), mas
implementação **mobile-first** no CSS (base = celular, `md:`/`lg:` acrescentam).

| Faixa | Largura | Tailwind | Layout |
|-------|---------|----------|--------|
| Celular | < 768px | base (sem prefixo) | 1 coluna, sidebars viram drawer, tabelas viram cards |
| Tablet (primário) | 768–1023px | `md:` | sidebar ícones fixa, submenu colapsável/drawer, tabelas nativas, grids 2-col |
| Desktop | ≥ 1024px | `lg:` | comportamento atual intacto |

Breakpoints = padrão Tailwind v4 (`sm 640 · md 768 · lg 1024 · xl 1280`). Sem custom.

## Decisões

- **DEC-1 — Tabelas:** primitive `ResponsiveTable` único. Renderiza `<table>` nativa em
  `md:`+ (tablet/desktop) e **cards empilhados** (uma "linha" = um card rótulo→valor) em
  celular. Evita scroll de 2 eixos no toque. Sem scroll-horizontal como solução padrão.
- **DEC-2 — Sidebar de ícones:** em celular vira **off-canvas drawer** (overlay + backdrop,
  fecha ao navegar/tocar fora). Em tablet/desktop continua em fluxo como hoje.
- **DEC-3 — Submenus de módulo** (financeiro/estoque/config/comunicação/agenda): em celular
  **não** ocupam coluna; viram seletor no topo (dropdown ou linha rolável horizontal). Em
  tablet/desktop seguem como coluna lateral (largura pode encolher no tablet).
- **DEC-4 — Sem libs novas.** Só Tailwind + estado React. Sem headless-ui/drawer lib.
- **DEC-5 — Alvo de toque** mínimo 40px (`size-10`) em controles interativos primários.

## Requisitos (IDs rastreáveis)

### Shell
- **R-RSP-SHELL-1** — `IconSidebar` em celular: escondida do fluxo, abre como drawer
  sobreposto (z acima do conteúdo) com backdrop escurecido; hambúrguer do header alterna.
  Drawer fecha ao: tocar backdrop, navegar por item, `Esc`. Em `md:`+ comportamento atual.
- **R-RSP-SHELL-2** — `AppShell` não deve permitir overflow horizontal da viewport em
  nenhuma faixa (sem scroll lateral da página). `main` rola só na vertical.
- **R-RSP-SHELL-3** — `Header` (`h-14`): em celular preserva hambúrguer + logo + avatar;
  ações secundárias (WhatsApp/busca/ajuda/sino) colapsam (esconder rótulos / agrupar em
  "⋮" ou esconder as não-essenciais). Sem quebra de linha nem corte do logo.
- **R-RSP-SHELL-4** — `FloatingWidgets`: banner inferior-esquerdo (`left-20`) não pode
  cobrir conteúdo nem o FAB em celular — esconder ou recolher em telas estreitas; FAB(s)
  inferior-direito permanecem acessíveis e não sobrepõem barra de navegação do SO.

### Submenus de módulo
- **R-RSP-SUB-1** — `app/{financeiro,estoque,configuracoes,comunicacao}/layout.tsx` +
  `agenda/*`: em celular o `*Submenu` deixa de ser coluna lateral e vira navegação no topo
  do conteúdo (dropdown com item ativo como rótulo, ou tira rolável horizontal).
- **R-RSP-SUB-2** — Em `md:` (tablet) submenu pode estreitar (`w-56` → menor) mas permanece
  coluna; conteúdo ao lado nunca abaixo de ~360px úteis.
- **R-RSP-SUB-3** — Padrão aplicado uma vez (componente/wrapper comum), não copiado em cada
  submenu divergente.

### Tabelas & listas
- **R-RSP-TBL-1** — Primitive `ResponsiveTable` (DEC-1) criado e adotado pelas tabelas
  largas: `patients-table`, `contacts-table`, `finance-table`, `procedimentos-table`,
  `pacotes-table`, `estoque-table`, `relatorio-table`.
- **R-RSP-TBL-2** — Modo card (celular) mostra os campos-chave de cada linha como
  rótulo→valor, preserva ações de linha (toggle Ativo, kebab ⋮) e seleção (checkbox) quando
  existirem na variante desktop.
- **R-RSP-TBL-3** — Toolbars de lista (`ListShell`: busca / + filtro / ações em lote /
  exportar / paginação) empilham em celular sem estourar largura; busca ocupa largura total.

### Modais & formulários
- **R-RSP-MOD-1** — `ui/modal` já é `w-full max-w-*`; garantir que `size="xl"`/`lg` não
  estoure no celular (já coberto por `max-w` + `p-4`) e que o corpo role internamente em
  telas baixas (modal alto não empurra layout). Validar, ajustar se preciso.
- **R-RSP-MOD-2** — Grids de formulário 2-col (`ui/field`, `AddressFields`,
  `novo-evento-modal`, `orcamento-modal`) colapsam para 1-col em celular.

### Conteúdo / grids
- **R-RSP-GRID-1** — Grids de dashboard/relatórios fixos em 2/3/4 colunas passam a
  `grid-cols-1` em celular e escalam via `md:`/`lg:`. KPIs em fila viram 1–2 por linha.
- **R-RSP-GRID-2** — Charts (Recharts `ResponsiveContainer`) mantêm altura legível e não
  estouram a largura do card em celular.

## Fora de escopo

- Retoque pixel-a-pixel de cada uma das 36 telas individualmente (só os padrões + adoção
  nas tabelas/grids listados).
- Dark mode, gestos avançados (swipe), PWA/offline, orientação landscape dedicada.
- Backend, autenticação, novos dados de mock.
- Reescrita de charts; só conter largura/altura.

## Critério de aceite

- `tsc` ✅ · `eslint` ✅ · `npm run build` ✅ (36 rotas) — buildar no main pós-merge
  (worktree não builda, ver [[build-worktree-turbopack]]).
- Em **375px** (iPhone SE) e **820px** (iPad): sem scroll horizontal da página; sidebar
  acessível via drawer (celular); nenhuma das tabelas adotadas força pan de 2 eixos no
  celular; submenus de módulo não roubam a coluna de conteúdo no celular.
- Desktop (≥1024px) visualmente **idêntico** ao atual (zero regressão).
- Verificação visual nos breakpoints via DevTools responsive / Playwright (tarefa de QA).

## Notas de implementação

- Abrir **worktree irmão** `../artemise-worktrees/responsive-mobile-tablet` (branch
  `feat/responsive-mobile-tablet`) antes de codar — ver memória [[worktree-por-spec]].
- Validar `tsc`+`eslint` no worktree; build só no main pós-merge ([[build-worktree-turbopack]]).
- Merge direto na main, sem PR ([[merge-direto-sem-pr]]).
- Próximo passo natural: `design.md` (estrutura do drawer, API do `ResponsiveTable`,
  wrapper de submenu) → `tasks.md`.
