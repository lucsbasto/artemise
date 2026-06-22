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
- Feature **ui-core**: AppShell + 4 telas (Dashboard, Agenda, Pacientes, Financeiro). `npm run build` ✅ · `npm run lint` ✅. Ver `.specs/features/ui-core/`.

## Pendências / próximos
- Verificação visual pixel-a-pixel pelo usuário (abrir http://localhost:3000).
- Ajustar rótulos dia-da-semana em `weekDays` (mock) se divergir do screenshot.
- Próximas telas (32 restantes), modais/drawers, date-range picker funcional, backend/RLS.

## Preferências
- Usuário pediu fluxo **tlc-spec-driven**. Artefatos em `.specs/`.
