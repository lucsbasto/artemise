# Tasks: Agenda Completa — STATUS: concluído

- **T1 — Mock** ✅ — bloco agenda (visão geral/relatório/eventos/drawer) em `lib/mock.ts`.
- **T2 — Compartilhados** ✅ — `agenda/agenda-submenu.tsx` (usePathname), `agenda/status-badge.tsx`
  (`AgendaStatusBadge`+`statusDot`); calendário `app/agenda/page.tsx` refatorado. R-AG-1, R-AG-7.
- **T3 — Visão geral** ✅ — `app/agenda/visao-geral/page.tsx` + `agenda/period-chart.tsx`. R-AG-2.
- **T4 — Relatório** ✅ — `agenda/relatorio-table.tsx` (client, abas+tabela+drawer) +
  `app/agenda/relatorio/page.tsx`. R-AG-3.
- **T5 — Eventos** ✅ — `agenda/eventos-card.tsx` (empty state + modal) +
  `app/agenda/eventos/page.tsx`. R-AG-4.
- **T6 — Modais** ✅ — `agenda/novo-evento-modal.tsx` (4 tipos) + `agenda/evento-drawer.tsx`. R-AG-5, R-AG-6.
- **T7 — Verificação** ✅ — `tsc --noEmit` + `eslint` verdes no worktree; `npm run build` verde no main
  (3 rotas novas prerenderizadas). Warning `width(-1)` do Recharts = L2 conhecido, inofensivo.

Gate: build + lint verdes antes do merge. ✅ Merge direto @ `747be48`.
