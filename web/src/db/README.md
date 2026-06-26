# Banco de dados — Drizzle + Supabase (multitenant / RLS)

Backend de dados do SaaS. **Shared-schema multitenancy**: uma tabela por entidade,
coluna `clinica_id` em toda tabela de negócio, isolamento por **Row-Level Security**.

## Modelo de tenancy

- `clinicas` — o tenant (a clínica). Spec 31 (dados) + 30 (preferências em jsonb).
- `profiles` — 1:1 com `auth.users` do Supabase (trigger espelha no signup).
- `memberships` — vínculo `profile ↔ clinica` + `role`. **Resolve o tenant ativo.**

Cada tabela de negócio (`pacientes`, `agendamentos`, `lancamentos`, …) carrega
`clinica_id NOT NULL` e recebe 4 policies CRUD (`tenantPolicies`) que filtram por
`clinica_id in (select private.user_clinica_ids())`.

`private.user_clinica_ids()` é `SECURITY DEFINER` (ignora RLS de `memberships`, sem
recursão) e lê os vínculos ativos do `auth.uid()` logado. `user_is_admin(clinica)` /
`user_is_owner(clinica)` fazem o gate por role.

### Hardening (revisão de segurança)

- **Onboarding** — criar clínica é **só** via `select create_clinica(nome, pessoa_tipo, documento)`
  (RPC `SECURITY DEFINER` que cria a clínica + membership `owner` atômico). `clinicas_insert`
  no RLS é `false` e `memberships_insert` exige `user_is_admin` → ninguém se autojunta a
  uma clínica alheia.
- **Gate por role** — gerenciar membros e editar/deletar a clínica exige admin/owner.
- **FKs compostas same-tenant** — filhos (itens, sub-registros) referenciam o pai por
  `(clinica_id, pai_id)`, impedindo anexar a um pai de outro tenant. Refs opcionais
  (set-null) ficam FK simples → validar same-tenant no app no write.
- **Índices** — `clinica_id` indexado em toda tabela (via unique `(clinica_id, id)` nos
  pais ou índice próprio nos filhos) + secundários quentes (datas, FKs de join).

## Aplicar (ordem importa)

```bash
# 1. configurar conexão
cp .env.example .env   # preencher DATABASE_URL (Supabase)

# 2. função + trigger de RLS  (ANTES das migrations — policies dependem dela)
psql "$DATABASE_URL" -f src/db/rls.sql

# 3. tabelas + policies
npm run db:migrate
```

> A função em `rls.sql` usa `check_function_bodies = off`, então pode ser criada
> antes de `public.memberships` existir (a tabela vem na migration seguinte).

Comandos: `db:generate` (gera migration do schema), `db:migrate` (aplica),
`db:push` (sync direto, dev), `db:studio` (UI).

## Acesso em runtime

`client.ts` expõe:

- `db` — conexão admin. Filtre por `clinica_id` manualmente (tarefas de sistema/seed).
- `withTenant(claims, cb)` — executa `cb` numa transação com `role=authenticated` +
  claims do JWT, fazendo o **RLS valer** (`auth.uid()` / `user_clinica_ids()`).

## Derivados (não são tabelas)

Dashboard, fluxo de caixa (17/18), KPIs, rankings, heatmaps e o extrato (15)/
competência (16) são **agregações/views** sobre `lancamentos` + `agendamentos`,
não tabelas próprias.

## Pendências

- Wiring de auth (Supabase SSR) + provisão do projeto Supabase real.
- Seed a partir de `src/lib/mock.ts` (1 clínica demo).
- `drizzle` relations para a query API (opcional, ergonomia).
- Trocar os stores em memória (`src/lib/data/*`) por chamadas que usam `withTenant`.
