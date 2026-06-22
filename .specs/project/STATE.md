# STATE — memória do projeto

## Projeto
Reconstrução do SaaS **Clínica Experts** (gestão de clínicas, pt-BR) a partir de 36 specs
em `docs/paginas/` + 58 screenshots em `images/`. App web em `web/`.

## Decisões
- **D1** — Stack UI: Next.js 16 (App Router, Turbopack) + Tailwind v4 + componentes shadcn-style hand-rolled + Recharts + lucide-react. Tailwind v4 usa `@theme` em CSS (sem tailwind.config). shadcn CLI evitado (instável no Next 16); primitives feitas à mão em `src/components/ui/`.
- **D2** — Dados: mock estático em `src/lib/mock.ts`, valores exatos dos screenshots.
- **D3** — Cor de marca roxo `#7c3aed` (token `--brand`). Sem dark mode nesta fase.
- **D4** — Charts são Client Components (`"use client"`); páginas seguem Server Components.
- **D5** — Rotas simplificadas: `/`, `/agenda`, `/pacientes`, `/financeiro` (specs reais usam `/clinica/...`).

## Lições
- **L1** — Server Component NÃO pode passar função como prop a Client Component (ex.: `tickFormatter`). Usar enum string serializável e resolver a função dentro do client. (Quebrou o build; corrigido em `mini-bars.tsx`.)
- **L2** — Recharts `ResponsiveContainer` emite warning `width(-1)` no prerender estático — inofensivo, hidrata no client.

## Concluído
- Feature **ui-core**: AppShell + 4 telas (Dashboard, Agenda, Pacientes, Financeiro). `.specs/features/ui-core/`.
- Feature **ui-tables**: +4 telas — Profissionais (10), Fornecedores (11), Contas a receber (13), Contas a pagar (14). Componentes reusáveis `ContactsTable`, `FinanceTable`, `StatusBadge`. 8/36 telas.
- Ambas no `origin/main` (PR #1 mergeado via hook OMC). build ✅ lint ✅.

## Sessão / retomada
- **PAUSADO em 2026-06-22.** Usuário vai retomar em OUTRA sessão.
- **Estado limpo:** `origin/main` @ `4392e68`, working tree limpo, build ✅ lint ✅.
- **Retomar com:** `cd web && npm run dev` → http://localhost:3000.
- **Próximo passo combinado:** lote 3 de telas. Candidatos: Ficha do paciente (spec 08, complexa — abas) OU cadastros (Procedimentos 32, Pacotes 34, Estoque 24).
- Branches locais `feat/ui-core` e `feat/ui-tables` já mergeadas (podem ser deletadas).

## Pendências / próximos
- Verificação visual pixel-a-pixel pelo usuário (abrir http://localhost:3000).
- Ajustar rótulos dia-da-semana em `weekDays` (mock) se divergir do screenshot.
- Próximas telas (32 restantes), modais/drawers, date-range picker funcional, backend/RLS.

## Preferências
- Usuário pediu fluxo **tlc-spec-driven**. Artefatos em `.specs/`.
