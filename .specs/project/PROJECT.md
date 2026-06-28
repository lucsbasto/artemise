# PROJECT — Artemise (Clínica Experts)

> Documento de visão/escopo do projeto. Tarefas e progresso ficam em [STATE.md](./STATE.md).

## Visão

Reconstrução do SaaS **Clínica Experts** — plataforma de gestão de clínicas (estética/saúde),
pt-BR — a partir de engenharia reversa de **36 specs** (`docs/paginas/`) + **58 screenshots**
(`images/`). Objetivo: app web fiel ao produto original (pixel-a-pixel) com backend próprio.

## Objetivos

- **G1** — Reproduzir as 36 telas do produto com fidelidade visual ao screenshot. **Status: 36/36.**
- **G2** — Interatividade real (CRUD + busca/filtro/ordenação/paginação) via data-layer desacoplado.
- **G3** — Backend próprio multitenant seguro (RLS por request), substituindo o mock.
- **G4** — Responsivo tablet-first (divisor `md` 768px), sem libs extras.

## Escopo

**Dentro:** 36 telas (Dashboard, Agenda, Pacientes/Ficha, Financeiro, Estoque, Cadastros,
Configurações, Comunicação), mapa de injetáveis, auth própria, multitenancy por `clinica_id`.

**Fora (out-of-scope):** dark mode (D3), Supabase Auth, ORM (Drizzle revogado — D6), pagamentos
reais, integrações WhatsApp/e-mail reais (só UI/catálogos mock tipo `modelosMensagens`).

## Stack

| Camada | Tecnologia | Decisão |
|---|---|---|
| Frontend | Next.js 16 (App Router, Turbopack) + Tailwind v4 (`@theme`, sem config) + shadcn-style hand-rolled + Recharts + lucide-react | D1 |
| Backend | Go (`net/http` stdlib, ServeMux 1.22+) + Postgres via Supabase + driver `pgx/v5` (sem framework, sem ORM) | D6 |
| Auth | Própria em Go: tabela `sessions` + cookie `httpOnly` + `argon2id` | D6 |
| Multitenancy | Shared-schema; `clinica_id` em toda tabela; RLS por request via `SET LOCAL app.clinica_id` em transação | D6 |
| Marca | Roxo `#7c3aed` (token `--brand`), sem dark mode | D3 |

## Arquitetura

```
artemise/
├── web/        Next.js — Server Components consomem /api/*; api-client.ts (+ server); create-collection via fetch
├── backend/    Go — internal/{http,store,domain,auth,db}, cmd/{server,seed,migrate}, migrations/*.sql
├── docs/       paginas/ (36 specs canônicas)
├── images/     58 screenshots de referência
└── .specs/     project/ (PROJECT.md, STATE.md) + features/ (spec+design+tasks por feature)
```

- Charts = Client Components (`"use client"`); páginas = Server Components (D4).
- Relatórios (dashboard/fluxo de caixa/KPIs) = queries computadas, não tabelas.
- Cálculos puros portados p/ `internal/domain` (espelham `financeiro-calc.ts`/`pacote-calc.ts`).

## Roadmap / Status

- ✅ **UI** — 36/36 telas (ui-core, ui-tables, cadastros, ficha-paciente, agenda, financeiro, estoque, config, comunicação).
- ✅ **Interatividade** — data-layer `create-collection` + stores em memória; CRUD/busca/paginação na maioria das telas.
- ✅ **Mapa de injetáveis** — feature `procedimentos-aba` ligada à ficha.
- ✅ **Responsivo** — RSP1–RSP9 mergeados (RSP10 = QA visual manual pendente).
- ✅ **Backend Go** — M1–M9 implementados e mergeados; frontend swapado p/ `/api/*`.
- ⏳ **Pendente:** smoke contra DB real (`backend/scripts/smoke.sh`, requer Docker); QA visual @375/@820 no browser.

## Convenções

- Fluxo **tlc-spec-driven**; artefatos em `.specs/`. Uma feature = `spec.md` + `design.md` + `tasks.md`.
- **Merge direto na main**, sem PR (ver [[merge-direto-sem-pr]]).
- Todo spec novo abre worktree irmão `../artemise-worktrees/<feature>` (ver [[worktree-por-spec]]).
- Build não roda em worktree (Turbopack rejeita junction de node_modules) — buildar no main pós-merge (ver [[build-worktree-turbopack]]).
- Task board multi-agent em STATE.md: reivindicar task (Owner+wip) antes de codar.
