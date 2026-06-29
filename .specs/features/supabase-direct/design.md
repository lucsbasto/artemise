# Supabase Direct — Design

> Spec: `.specs/features/supabase-direct/spec.md`. Implementa SUP-01..13.
> **⚠️ Next.js modificado** (ver `web/AGENTS.md`): APIs podem divergir do padrão. Antes de codar
> middleware/proxy e qualquer API de runtime, **ler `web/node_modules/next/dist/docs/`**. Os exemplos
> Supabase abaixo são a referência de SDK; a *cola* com o Next desta versão se confirma na doc local.

---

## 1. Visão geral das camadas

```
Browser (Client Components)                    Server Components / Server Actions
        │                                                  │
  createBrowserClient (anon key)              createServerClient (anon key, cookies SSR)
        │                                                  │
        └───────────────┬──────────────────────────────────┘
                        ▼
              Supabase (Postgres gerenciado)
        ┌───────────────┼───────────────────────────┐
   PostgREST          Auth (GoTrue)              RPC (SQL functions)
   CRUD + select      signUp/signIn/signOut      criar_clinica (SECURITY DEFINER)
   (RLS por tenant)   JWT em cookie SSR          registrar_procedimento (atômico)
                                                 salvar_detalhe_profissional
```

Princípios:
- **Anon key only** no browser e na Vercel. Service-role jamais sai do servidor (e nesta fase nem é usada).
- Isolamento de tenant é **100% RLS** via `auth_clinica_id()`. O client nunca decide qual clínica vê.
- Lógica privilegiada (escrever fora do tenant, atomicidade) vive em **RPC SQL**, não em backend.
- A **interface `Collection<T>` não muda** — componentes ficam intactos (swap só na implementação).

---

## 2. Clientes Supabase (SUP-01)

Arquivos novos em `web/src/lib/supabase/`:

**`client.ts`** (browser, Client Components):
```ts
import { createBrowserClient } from "@supabase/ssr";
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

**`server.ts`** (Server Components / Actions):
```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(URL, ANON, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => { try { toSet.forEach(({name,value,options}) =>
        cookieStore.set(name,value,options)); } catch { /* chamado de Server Component: ok, middleware renova */ } },
    },
  });
}
```

**`middleware.ts`** (raiz `web/`) — renova sessão e protege rotas. ⚠️ **Confirmar na doc local** se esta
versão do Next usa `middleware` ou `proxy` e a assinatura de `matcher`. Padrão: `getAll/setAll` espelhando
cookies no `NextResponse`, `supabase.auth.getUser()`, e redirect p/ `/login` se sem user (exceto
`/login`, `/registrar`, assets). **Regra de ouro Supabase:** nada de código entre `createServerClient` e
`auth.getUser()`.

**Env** (`.env.local` + Vercel): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
> O projeto Supabase já existe: `pltiitcxhxizwbecdpjq` (us-west-2, ver STATE). `project_url`/`publishable_key`
> já no `.env.local` legado — renomear para os nomes `NEXT_PUBLIC_*`. Boot **falha explícito** se faltar (SUP-01 AC4).
> Nota: Supabase renomeou "anon key" → "publishable key"; aceitar o nome novo se o projeto já migrou.

---

## 3. Schema & RLS (SUP-02)

Nova migration Supabase (`supabase/migrations/0001_supabase_auth_rls.sql`) que **adapta** o schema atual.
Schema de negócio (21 tabelas, colunas) **preservado** do `backend/migrations/001_schema.sql`; mudam só
auth e RLS.

### 3.1 `usuarios` ligada ao Auth, `sessions` removida
```sql
-- usuarios vira PERFIL 1:1 com auth.users
alter table usuarios drop column if exists senha_hash;
-- garantir id = auth.uid()
alter table usuarios
  alter column id drop default,                       -- não gerar mais uuid próprio
  add constraint usuarios_id_fk foreign key (id) references auth.users(id) on delete cascade;
drop table if exists sessions;                        -- argon2id/sessões Go eliminados
```
`usuarios` mantém: `id (=auth.uid())`, `clinica_id`, `nome`, `email`, `perfil_acesso`, `ativo`, timestamps.

### 3.2 Função de tenant (resolve RLS recursiva)
```sql
create or replace function auth_clinica_id()
returns uuid
language sql stable security definer set search_path = public
as $$ select clinica_id from usuarios where id = auth.uid() $$;
```
`security definer` + `search_path` fixo: a função lê `usuarios` **ignorando a RLS de `usuarios`**, então a
policy de `usuarios` pode existir sem causar recursão.

### 3.3 RLS das 18 tabelas de negócio (reescreve `002_rls.sql`)
Mesmo loop, trocando a expressão. **`FORCE` não é mais necessário** (PostgREST usa a role `authenticated`,
não o dono das tabelas), mas manter `ENABLE` + `authenticated`:
```sql
-- por tabela t:
alter table t enable row level security;
create policy tenant_isolation on t for all to authenticated
  using (clinica_id = auth_clinica_id())
  with check (clinica_id = auth_clinica_id());
```
`registros_procedimento` etc. iguais. `WITH CHECK` bloqueia insert com `clinica_id` alheio (edge case spec).

### 3.4 Policies de `clinicas` e `usuarios` (RLS própria, sem a função)
```sql
alter table clinicas enable row level security;
create policy clinica_self on clinicas for all to authenticated
  using (id = auth_clinica_id()) with check (id = auth_clinica_id());

alter table usuarios enable row level security;
-- ler a própria linha + colegas da mesma clínica; nunca de outra clínica.
create policy usuarios_self on usuarios for select to authenticated
  using (id = auth.uid() or clinica_id = auth_clinica_id());
create policy usuarios_update_self on usuarios for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
```
> Atenção: `usuarios_self` usa `auth_clinica_id()` que lê `usuarios` — sem recursão porque a função é
> `security definer` (roda como dono, fora da RLS). Validar no banco real (risco listado na spec).

### 3.5 Default de `clinica_id` no insert
Para o client não precisar mandar `clinica_id` (e não poder forjar):
```sql
alter table pacientes alter column clinica_id set default auth_clinica_id();
-- ...repetir nas 18 tabelas tenant-scoped.
```
Com `WITH CHECK`, mesmo que o client mande outro valor, RLS rejeita. SUP-10 não precisa serializar `clinica_id`.

---

## 4. Auth (SUP-03 + SUP-09)

### 4.1 Login (`/login`, Client Component)
```ts
const supabase = createClient();
const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
if (error) showError("Credenciais inválidas");
else router.push("/dashboard");
```
> Campo do form é `senha`; o SDK espera `password`. Mapear no submit.

### 4.2 Registro (`/registrar`) — signUp + RPC atômica
```ts
const { data, error } = await supabase.auth.signUp({ email, password: senha });
if (error) return showError(...);          // email duplicado etc.
const { error: e2 } = await supabase.rpc("criar_clinica", {
  p_nome_clinica: clinica, p_nome_usuario: nome,
});
if (e2) return showError("Falha ao criar clínica");
router.push("/dashboard");
```
RPC (privilegiada, escreve `clinicas` antes do tenant existir):
```sql
create or replace function criar_clinica(p_nome_clinica text, p_nome_usuario text)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare v_clinica uuid; v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'sem sessão'; end if;
  if exists (select 1 from usuarios where id = v_uid) then
    return (select clinica_id from usuarios where id = v_uid);   -- idempotente
  end if;
  insert into clinicas (nome, slug)
    values (p_nome_clinica, lower(regexp_replace(p_nome_clinica,'\W+','-','g')) || '-' || substr(md5(random()::text),1,4))
    returning id into v_clinica;
  insert into usuarios (id, clinica_id, nome, email, perfil_acesso, ativo)
    values (v_uid, v_clinica, p_nome_usuario,
            (select email from auth.users where id = v_uid), 'admin', true);
  return v_clinica;
end $$;
```
**Órfão (risco DA5):** se a RPC falhar, o user Auth fica sem `usuarios`. Mitigações no design:
(a) RPC **idempotente** (acima: retorna clínica existente / cria se não há) → o registro pode re-tentar a
RPC no próximo login; (b) `/dashboard` server-side checa "tem linha em `usuarios`?"; se não, redireciona
para um passo "finalizar cadastro" que re-chama a RPC. **Alternativa avaliada:** trigger
`after insert on auth.users` — rejeitada porque o nome da clínica não chega no signUp (só email/senha);
manter signUp+RPC com a rede de idempotência.

### 4.3 Logout
```ts
await supabase.auth.signOut(); router.push("/login");
```

### 4.4 Guarda de rota
Substitui `loadServer`→`AuthError`→`redirect`. Dois níveis: (1) `middleware.ts` redireciona não-logado;
(2) cada Server Component usa `createClient()` server e, se `auth.getUser()` vazio, `redirect('/login')`.
`web/src/lib/data/server-load.ts` é **removido** (ou re-apontado p/ helper Supabase server).

---

## 5. Data layer CRUD (SUP-04 + SUP-10)

### 5.1 Problema camelCase ↔ snake_case
Go entregava JSON camelCase (tags). PostgREST devolve **nomes de coluna snake_case**. Os tipos TS em
`mock.ts` são camelCase. Sem mapeamento, tudo quebra. Solução: **mapa de campos por recurso** + aliasing
do PostgREST.

`web/src/lib/supabase/resource.ts` (novo):
```ts
export type FieldMap = Record<string, string>; // tsKey -> dbColumn
// select com alias PostgREST: "tsKey:db_col, ..." → PostgREST devolve já em camelCase
export function selectCols(map: FieldMap): string {
  return Object.entries(map).map(([ts, db]) => ts === db ? ts : `${ts}:${db}`).join(",");
}
// payload camelCase -> objeto snake_case p/ insert/update
export function toRow<T>(map: FieldMap, partial: Partial<T>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k in partial) out[map[k] ?? k] = (partial as any)[k];
  return out;
}
```
Cada recurso declara seu `FieldMap` (a maioria é identidade exceto `criadoEm:criado_em`,
`atualizadoEm:atualizado_em`, `dataNascimento:data_nascimento`, `clinicaId` omitido, etc.). Fonte da
verdade: colunas em `backend/migrations/001_schema.sql` × tags JSON nos structs de `backend/internal/domain`.

### 5.2 `create-collection.ts` reescrito (mesma interface)
```ts
export function createCollection<T extends WithId>(table: string, map: FieldMap): Collection<T> {
  const sel = selectCols(map);
  async function revalidate() {
    const supabase = createClient();
    const { data } = await supabase.from(table).select(sel).order("criado_em",{ascending:false});
    cache = (data ?? []) as T[]; emit();
  }
  return {
    getSnapshot, subscribe /* dispara revalidate */,
    add: async (item) => { await createClient().from(table).insert(toRow(map,item)); await revalidate(); },
    update: async (id,patch) => { await createClient().from(table).update(toRow(map,patch)).eq("id",id); await revalidate(); },
    remove: async (id) => { await createClient().from(table).delete().eq("id",id); await revalidate(); },
    toggle: async (id,key) => {  // lê estado atual e inverte (ou RPC toggle_ativo)
      const cur = cache.find(x=>x.id===id); 
      await createClient().from(table).update({ [map[key as string]??key]: !cur?.[key] }).eq("id",id); await revalidate();
    },
    set,
  };
}
```
> `subscribe`/`getSnapshot`/`useCollection`/`nextId`/`createLocalCollection` **inalterados**. `stores.ts`
> só troca a chamada: `createCollection<Patient>("pacientes", PACIENTE_MAP)`.
> Envelope `{items}` deixa de existir — o array vem direto; o cache absorve isso internamente, os
> componentes continuam recebendo `items: T[]` via `useCollection`.

### 5.3 Paginação/busca/ordenação
Hoje `use-list-controls.ts` faz busca/filtro/paginação **client-side** sobre o array completo. Mantém-se
assim (sem mudança) — `select()` traz a coleção do tenant. Se algum recurso crescer, migrar para
`.range()`/`.ilike()` server-side (fora de escopo agora).

---

## 6. Sub-recursos (SUP-05)

- **Detalhe do profissional**: `profissionaisDetalheStore` deixa de ser `createLocalCollection`. Leitura:
  `from("profissionais").select("*, profissional_detalhe(*), profissional_horarios(*), profissional_comissoes(*), profissional_procedimentos(procedimento_id)").eq("id",id)` (embed de FK PostgREST). Escrita
  composta → RPC `salvar_detalhe_profissional(p_id, p_detalhe jsonb, p_horarios jsonb, p_comissoes jsonb, p_proc_ids uuid[])`
  (uma transação: upsert detalhe; delete+insert horarios/comissoes/procedimentos do profissional). RLS via
  `security invoker` (default) — roda no tenant do chamador.
- **Registros por paciente**: `registrosProcedimentoStore` deixa de ser local. Sem mapa → CRUD direto.
  Com mapa → **RPC de estoque** (§8). Leitura: `from("registros_procedimento").select(sel).eq("paciente_id",pid)`.
- **Orçamentos + itens**: `orcamentosStore` já é REST; adicionar itens via `orcamento_itens`. Total por
  `pacote-calc.ts` (reuso) ou coluna gerada. Embed: `select("*, orcamento_itens(*)")`.

---

## 7. Computados no frontend (SUP-07 + SUP-11)

Re-portar `backend/internal/domain/*` → libs puras `web/src/lib/`. Origem dupla: a lógica **nasceu** no
front (`financeiro-calc.ts`, `pacote-calc.ts`) e foi portada p/ Go; agora volta. Fonte de verdade dos
algoritmos = arquivos Go + seus `_test.go` (reusar os casos de teste como golden).

| Lib front (nova/estendida) | Porta de | Consome (tabelas via select) |
|---|---|---|
| `financeiro-calc.ts` (estende) | `domain/financeiro.go` | `lancamentos_financeiros`, `categorias_contas` |
| `comissao-calc.ts` (nova) | `domain/comissao.go` (`CalcComissao` percentual/fixo) | `registros_procedimento`, `profissional_comissoes` |
| `dashboard-calc.ts` (nova) | `store/dashboard.go` + `domain/types_computados.go` | `lancamentos`, `eventos_agenda`, `registros`, `pacientes` |
| `agenda-calc.ts` (nova) | `store/agenda.go` | `eventos_agenda` |
| `estoque-calc.ts` (delta, nova) | `domain/estoque.go` (`CalcularDelta`) | usado só p/ exibir; baixa real é RPC |

Páginas Server Component (14) trocam `loadServer("/dashboard")` por: `createClient()` server →
`select` das tabelas-fonte no período → chamar a lib pura → passar ao componente. **Paridade (SUP-07 AC5):**
cada relatório validado contra 1 output do Go no dataset seed antes de aposentar o backend.

> Risco de fuso/arredondamento: `numeric`→`number` (PostgREST devolve numeric como **string** por
> default em alguns casos — forçar `::float8` no select OU `Number()` no mapper). Datas: comparar em
> `date`/`timestamptz` no mesmo TZ que o Go usava (UTC). Cobrir nos golden tests.

---

## 8. Estoque delta atômico (SUP-06)

RPC `registrar_procedimento` — única operação não-browser. `security invoker` (respeita RLS do chamador),
`search_path` fixo.
```sql
create or replace function registrar_procedimento(
  p_paciente_id uuid, p_registro jsonb, p_mapa jsonb, p_registro_id uuid default null)
returns uuid
language plpgsql set search_path = public
as $$
declare v_id uuid; v_sub record; v_anterior jsonb; v_delta numeric;
begin
  -- 1) anterior (edição) p/ delta líquido
  if p_registro_id is not null then
    select mapa into v_anterior from registros_procedimento where id = p_registro_id; -- RLS isola tenant
  end if;
  -- 2) p/ cada substância no mapa: lock + checa saldo + aplica delta
  for v_sub in select * from jsonb_to_recordset(p_mapa->'pontos') as x(substancia_id uuid, unidades numeric) loop
    select (saldo) from itens_estoque where id = v_sub.substancia_id for update; -- LOCK
    v_delta := v_sub.unidades - coalesce(unidades_anteriores(v_anterior, v_sub.substancia_id), 0);
    update itens_estoque set saldo = saldo - v_delta where id = v_sub.substancia_id;
    if (select saldo from itens_estoque where id = v_sub.substancia_id) < 0 then
      raise exception 'SALDO_INSUFICIENTE:%', v_sub.substancia_id;  -- aborta tudo
    end if;
  end loop;
  -- 3) upsert do registro
  ... insert/update registros_procedimento ... returning id into v_id;
  return v_id;
end $$;
```
- **Delete com estorno**: RPC `excluir_registro_procedimento(p_registro_id)` soma de volta as unidades
  (delta negativo, nunca falha).
- Frontend: `supabase.rpc("registrar_procedimento", {...})`; erro com prefixo `SALDO_INSUFICIENTE` →
  aviso no UI (equivale ao 409 atual). `aba-procedimentos.tsx` chama a RPC em vez do update local.

---

## 9. Seed (SUP-08)

`003_seed.sql` atual usa hash argon2id pré-computado — **não serve** (Supabase Auth gere a senha).
Novo fluxo de seed:
1. Criar o usuário admin via **Auth Admin API** (script Node com service-role, rodado **localmente/CI**,
   nunca na Vercel) OU `supabase.auth.signUp` manual + confirmar email.
2. Rodar SQL seed do restante (clínica, procedimentos, estoque, métodos, categorias, fichas) com o
   `clinica_id`/`usuario.id` resultantes. Adaptar `003_seed.sql` removendo `usuarios.senha_hash` e
   ligando `usuarios.id` ao uid do Auth.
3. Admin seed: `lucsbasto@gmail.com` (senha nova definida no signUp; argon2 some).

> Script de seed fica em `supabase/seed/` (Node + `@supabase/supabase-js` service-role, `.env` local
> gitignored). Não vai pro bundle da Vercel.

---

## 10. Migrations & projeto Supabase

Ordem (aplicar via Supabase SQL editor ou `supabase db push`):
1. `0001_base_schema.sql` — reusa o DDL de negócio do `backend/migrations/001_schema.sql` (21 tabelas,
   triggers `set_atualizado_em`) **sem** `sessions`/`senha_hash`.
2. `0002_auth_rls.sql` — §3 (usuarios↔auth.users, `auth_clinica_id()`, policies, defaults).
3. `0003_rpcs.sql` — `criar_clinica`, `salvar_detalhe_profissional`, `registrar_procedimento`,
   `excluir_registro_procedimento`, (`toggle_ativo` opcional).
4. seed (§9) — fora das migrations versionadas (dados de dev).

> O projeto `pltiitcxhxizwbecdpjq` já tem o schema Go aplicado (STATE). Decidir no Execute:
> **migrar in-place** (alterações §3 sobre o schema existente) ou **resetar** o projeto e aplicar limpo.
> Recomendado resetar (dev, sem dados de produção) p/ evitar resíduo da role `app_role`/`sessions`.

---

## 11. Remoção do Go & deploy (SUP-08)

- **Arquivos mortos no front:** `api-client.ts`, `api-client-server.ts`, `mock-api.ts`, `data/server-load.ts`
  removidos. `mock.ts` mantém só tipos + constantes de UI (sem dados mutáveis — já é assim).
- `NEXT_PUBLIC_API_URL`/`NEXT_PUBLIC_MOCK_API` eliminados do código e `.env`.
- `backend/` + `docker-compose.yml` saem do fluxo (deleção física = task de limpeza pós-smoke; Out of Scope).
- **Vercel:** Root Directory `web`; envs `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`;
  build `next build`. CORS deixa de existir (mesma origem → Supabase via SDK, sem proxy).

---

## 12. Mapa de mudanças (arquivo a arquivo)

| Arquivo | Ação |
|---|---|
| `web/package.json` | + `@supabase/supabase-js`, `@supabase/ssr` |
| `web/src/lib/supabase/{client,server,resource}.ts` | **novo** |
| `web/middleware.ts` (ou `proxy` — confirmar Next local) | **novo** (renova sessão + guarda rota) |
| `web/src/lib/data/create-collection.ts` | reescreve impl (interface intacta) |
| `web/src/lib/data/stores.ts` | troca `createCollection("/path")` → `(table, MAP)`; detalhe/registros deixam de ser local |
| `web/src/lib/data/server-load.ts` | **remove** (helper Supabase server) |
| `web/src/lib/api-client.ts`, `api-client-server.ts`, `mock-api.ts` | **remove** |
| `web/src/app/(auth)/login/page.tsx`, `registrar/page.tsx` | `supabase.auth.*` + RPC `criar_clinica` |
| 14 Server Components (`/dashboard`, `/financeiro/*`, `/agenda/*`, `/contas-a-*`) | `loadServer` → `createClient` server + lib pura |
| `web/src/lib/{financeiro-calc,comissao-calc,dashboard-calc,agenda-calc,estoque-calc}.ts` | porta de `internal/domain` |
| `web/src/components/.../aba-procedimentos.tsx` (+ mapa) | baixa via RPC `registrar_procedimento` |
| `supabase/migrations/000{1,2,3}_*.sql`, `supabase/seed/*` | **novo** |
| `STATE.md` | re-revoga D6, registra decisão Supabase direto |

---

## 13. Decisões resolvidas (eram abertas na spec)

- **Register órfão** → signUp + RPC **idempotente** + checagem em `/dashboard` (não trigger). §4.2.
- **Detalhe profissional composto** → RPC `salvar_detalhe_profissional` (transação). §6.
- **camelCase↔snake** → `FieldMap` por recurso + alias no `select` + `toRow` no write. §5.1.
- **numeric→number** → `Number()` no mapper / `::float8` no select. §7.
- **`FORCE` RLS** → não usar (PostgREST roda como `authenticated`, não dono). §3.3.
- **clinica_id no insert** → `default auth_clinica_id()` + `WITH CHECK`; client não envia. §3.5.

---

## 14. Riscos & gates

- **RLS recursiva `usuarios`** → `auth_clinica_id()` `security definer`; testar no banco real (1º gate SQL).
- **Next.js modificado** → middleware/proxy confirmado contra `node_modules/next/dist/docs/` antes de codar.
- **Paridade computados** → golden tests reusando os `_test.go` do Go; 1 caso/relatório.
- **Seed Auth** → service-role só local/CI, nunca na Vercel.
- **Gates:** SQL (RLS isola 2 clínicas) → `tsc --noEmit` → `eslint` → `next build` → smoke Supabase real
  (login + 1 CRUD + dashboard + baixa de estoque 409) → deploy Vercel.

---

## Próximo: `tasks.md`
Quebrar M1–M8 em tasks atômicas com gate por milestone; fundação (M1–M3 + migrations) **serial**,
depois M4/M5/M7 paralelizáveis entre subagents (M6 depende de M5; SUP-10 mapas antes de M4).
