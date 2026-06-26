# Responsivo — Mobile & Tablet — Design

**Spec**: `.specs/features/responsive-mobile-tablet/spec.md`
**Status**: Draft

---

## Architecture Overview

Quatro frentes independentes, todas na **fundação** (componentes compartilhados). As 36
telas herdam sem edição individual.

```
AppShell ─┬─ Header            (R-RSP-SHELL-3)  ações colapsam
          ├─ IconSidebar       (R-RSP-SHELL-1)  vira drawer < md
          ├─ backdrop          (novo, < md)
          ├─ main
          │   └─ {módulo}/layout.tsx
          │        └─ SubmenuShell (novo)       (R-RSP-SUB)  coluna md+ / topo < md
          │             └─ página
          │                  └─ ListShell / *Table → .rtable  (R-RSP-TBL)
          └─ FloatingWidgets   (R-RSP-SHELL-4)  banner recolhe < md
```

Princípio: **CSS mobile-first** (base = celular, `md:`/`lg:` acrescentam). Sem libs novas
(DEC-4). JS só onde estado é inevitável (drawer aberto/fechado). Breakpoint divisor = `md`
(768px) = limite tablet/celular.

---

## 1. Drawer da sidebar (R-RSP-SHELL-1/2)

`AppShell` já tem `sidebarExpanded` (hoje só alarga `w-16`→`w-60` em fluxo). Reaproveitar
o mesmo estado com semântica dupla por breakpoint:

- **`md:`+ (tablet/desktop):** comportamento atual — `IconSidebar` em fluxo, hambúrguer
  alterna estreita↔larga. Zero regressão.
- **`< md` (celular):** `IconSidebar` sai do fluxo, vira overlay `fixed inset-y-0 left-0`,
  some translacionada (`-translate-x-full`) quando fechada, entra (`translate-x-0`) quando
  aberta. Backdrop `md:hidden` escurece e fecha ao toque.

### `AppShell` (contrato novo)
```tsx
const [open, setOpen] = React.useState(false);
const pathname = usePathname();
React.useEffect(() => setOpen(false), [pathname]); // fecha ao navegar (R-RSP-SHELL-1)

<Header onToggleSidebar={() => setOpen(v => !v)} />
<div className="flex flex-1 overflow-hidden">
  {/* backdrop só no celular */}
  {open && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setOpen(false)} />}
  <IconSidebar open={open} onNavigate={() => setOpen(false)} />
  <main className="scroll-thin min-w-0 flex-1 overflow-y-auto bg-background">{children}</main>
</div>
```
`min-w-0` no `<main>` é crítico: sem ele filhos largos (tabelas) furam o flex e criam
scroll horizontal da página (R-RSP-SHELL-2).

### `IconSidebar` (contrato novo)
Trocar prop `expanded` por `open`. Wrapper:
```tsx
<nav className={cn(
  "flex shrink-0 flex-col gap-1 border-r border-border bg-surface py-3",
  // celular: overlay deslizante, sempre em modo "expandido" (rótulos) p/ toque
  "fixed inset-y-0 left-0 z-40 w-60 px-2 transition-transform duration-200",
  open ? "translate-x-0" : "-translate-x-full",
  // tablet/desktop: volta ao fluxo, sem transform, largura por estado
  "md:static md:z-auto md:translate-x-0",
  open ? "md:w-60 md:items-stretch md:px-2" : "md:w-16 md:items-center md:px-0",
)}>
```
No celular `Esc` fecha (handler no AppShell). Itens `<Link>` chamam `onNavigate` (já coberto
pelo effect de pathname, mas mantém fechamento imediato).

**Alvo de toque (DEC-5):** itens do drawer no celular usam altura ≥ `h-10`.

---

## 2. SubmenuShell — submenus de módulo (R-RSP-SUB-1/2/3)

Hoje 5 submenus quase idênticos (`financeiro/estoque/configuracoes/comunicacao/agenda`),
cada um `<nav className="w-56 ...">` + lista de `{label, href}` + lógica de ativo. Os
`layout.tsx` fazem `<div className="flex h-full"><Submenu/><div>{children}</div></div>`.

### Extrair `components/ui/submenu-shell.tsx`
```tsx
type SubItem = { label: string; href: string; exact?: boolean };
export function SubmenuShell({ title, items }: { title: string; items: SubItem[] }) { ... }
```
Comportamento por faixa:
- **`md:`+** — coluna vertical como hoje, mas largura responsiva: `md:w-48 lg:w-56`
  (libera ~50px de conteúdo no tablet, R-RSP-SUB-2).
- **`< md`** — **não** vira coluna. Renderiza no topo do conteúdo um seletor:
  `<select>` nativo (item ativo pré-selecionado) que faz `router.push(value)` no change.
  Nativo = acessível, zero lib, bom no toque. (Alternativa tira-rolável descartada: mais
  markup, menos previsível com 12 itens como em financeiro.)

Lógica de ativo unificada: `exact ? pathname === href : pathname.startsWith(href)`
(cobre o caso "Visão geral" `/financeiro` exato vs prefixo dos demais).

### Layouts dos módulos
```tsx
<div className="flex h-full flex-col md:flex-row">  {/* empilha no celular */}
  <SubmenuShell title="Financeiro" items={ITEMS} />
  <div className="min-w-0 flex-1 overflow-y-auto">{children}</div>
</div>
```
Refatorar os 5 `*Submenu` para reusar `SubmenuShell` (passam só `title`+`items`).
`agenda-submenu` pode já ser horizontal — auditar; se diverge, só portar os `items`.

---

## 3. ResponsiveTable — tabelas viram cards no celular (R-RSP-TBL, DEC-1)

### Decisão de abordagem
- **Escolhida — CSS card-collapse.** Mantém o markup `<table>` existente; cada `<td>`
  ganha `data-label="…"`; o wrapper recebe classe `.rtable`. Uma regra global vira a tabela
  em cards rótulo→valor abaixo de `md`. **Baixíssimo churn**, preserva row-click, toggles,
  checkbox e kebab intactos.
- **Descartada — componente coluna-config** (`<ResponsiveTable columns rows>`): limpo, mas
  exigiria reescrever 7 tabelas hand-rolled com markup divergente. Custo não justifica num
  app tablet-first onde a tabela nativa já é o alvo primário.

### CSS (em `app/globals.css`)
```css
@media (max-width: 767px) {
  .rtable table, .rtable thead, .rtable tbody,
  .rtable th, .rtable td, .rtable tr { display: block; }
  .rtable thead { display: none; }                 /* cabeçalho some; rótulo vem do data-label */
  .rtable tr {
    border: 1px solid var(--border);
    border-radius: var(--radius-card);
    margin-bottom: .5rem;
    padding: .25rem .75rem;
  }
  .rtable td {
    display: flex; align-items: center; justify-content: space-between;
    gap: 1rem; border: 0; padding: .5rem .25rem;
  }
  .rtable td::before {
    content: attr(data-label);
    font-weight: 600; color: var(--muted); font-size: .75rem;
    text-transform: uppercase; letter-spacing: .02em;
  }
  .rtable td[data-label=""]::before { content: none; }  /* células de ação/checkbox sem rótulo */
}
```

### `components/ui/responsive-table.tsx` (wrapper fino)
Substitui o atual `<div className="overflow-x-auto">`:
```tsx
export function ResponsiveTable({ children }: { children: React.ReactNode }) {
  // md+: rola horizontal se precisar; < md: card-collapse via .rtable
  return <div className="rtable md:overflow-x-auto">{children}</div>;
}
```

### Adoção (R-RSP-TBL-1) — 7 tabelas
`patients-table`, `contacts-table`, `finance-table`, `procedimentos-table`,
`pacotes-table`, `estoque-table`, `relatorio-table`. Por tabela:
1. trocar wrapper `overflow-x-auto` → `<ResponsiveTable>`.
2. adicionar `data-label="Nome"` etc. em cada `<td>` (vazio `data-label=""` em
   checkbox/ações p/ não imprimir rótulo).
3. nada muda no `<thead>` (escondido no celular).

### Toolbars (R-RSP-TBL-3)
- `ListShell`: barra de filtros já é `flex-wrap`; só garantir busca `w-full sm:w-64` e
  rodapé `flex-wrap gap-3`.
- `patients-table` (não usa ListShell): header de ações e barra de filtros hoje são
  `flex items-center` sem wrap → adicionar `flex-wrap`; busca `w-full sm:w-56`.

---

## 4. Header, FloatingWidgets, grids

### Header (R-RSP-SHELL-3)
Ações secundárias já têm exemplo (`Ajuda` usa `hidden sm:inline`). Estender: WhatsApp e
sino `hidden sm:grid` no celular (busca + avatar + hambúrguer + logo permanecem). Sem wrap,
sem corte. `min-w-0` + `truncate` no bloco do logo por segurança.

### FloatingWidgets (R-RSP-SHELL-4)
- Banner inferior-esquerdo (`left-20`, colide com conteúdo no celular): `hidden md:flex`
  (recolhe no celular). Card "Seu progresso" idem.
- FABs inferior-direito: mantêm; adicionar `pb-[env(safe-area-inset-bottom)]`/margem p/ não
  colar na barra do SO; garantir z acima do conteúdo, abaixo do drawer (`z-20` < `z-40`).

### Grids (R-RSP-GRID-1/2)
Padrão a aplicar onde houver `grid-cols-{2,3,4}` fixo nos **componentes-view
compartilhados** (dashboard cards, `finance-kpi-cards`, blocos de relatório):
`grid-cols-1 sm:grid-cols-2 lg:grid-cols-N`. Charts: `ResponsiveContainer` já fluido; travar
só `min-h` legível e garantir card pai `min-w-0`. Ajuste tela-a-tela fora de escopo (spec);
aqui só os componentes-view reusáveis.

---

## Lista de arquivos tocados

| Arquivo | Mudança |
|---|---|
| `components/shell/app-shell.tsx` | estado drawer + backdrop + `min-w-0` |
| `components/shell/icon-sidebar.tsx` | prop `open`, classes overlay/fluxo |
| `components/shell/header.tsx` | colapsar ações secundárias |
| `components/shell/floating-widgets.tsx` | recolher banner < md |
| `components/ui/submenu-shell.tsx` | **novo** |
| `components/ui/responsive-table.tsx` | **novo** |
| `app/globals.css` | regra `.rtable` |
| `components/{financeiro,estoque,configuracoes,comunicacao,agenda}/*submenu.tsx` | usar SubmenuShell |
| `app/{financeiro,estoque,configuracoes,comunicacao}/layout.tsx` | `flex-col md:flex-row` + `min-w-0` |
| 7 `*-table.tsx` | wrapper + `data-label` |
| `components/ui/list-shell.tsx` | busca `w-full sm:w-64`, rodapé wrap |

---

## Riscos & verificação

- **R1** — `.rtable td::before` imprime rótulo em célula que já tem rótulo visual → usar
  `data-label=""` nas células de ação/checkbox. Mitigado pela regra `[data-label=""]`.
- **R2** — row-click (`<tr onClick>`) em modo block no celular: continua funcionando
  (bloco recebe clique). Validar em `patients-table`.
- **R3** — `<select>` de submenu com 12 itens (financeiro): aceitável; nativo lida bem.
- **Verificação:** DevTools responsive @ 375px e 820px + Playwright screenshots dos 4
  arquétipos (dashboard, lista-tabela, módulo-com-submenu, ficha). `tsc`+`eslint` no
  worktree; `build` no main pós-merge ([[build-worktree-turbopack]]).

## Próximo passo
`tasks.md`: atomizar (1) drawer, (2) SubmenuShell + refactor 5+5, (3) `.rtable` +
ResponsiveTable + adoção 7 tabelas, (4) header/widgets/grids, (5) QA visual.
