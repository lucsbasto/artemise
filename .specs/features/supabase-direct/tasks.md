# Supabase Direct — Tasks

> Spec: `spec.md` · Design: `design.md`. Cobre SUP-01..13.
> **Worktree:** abrir `../artemise-worktrees/supabase-direct` (branch `feat/supabase-direct`) antes de
> codar (ver [[worktree-por-spec]]). **Build não roda em worktree** (Turbopack rejeita junction de
> node_modules — [[build-worktree-turbopack]]): validar `tsc --noEmit` + `eslint` no worktree, rodar
> `next build` no **main pós-merge**. Merge direto na main, sem PR ([[merge-direto-sem-pr]]).

## Protocolo de posse (multi-agent)
Antes de pegar uma task: editar a linha, preencher `Owner` (`@nome`/session id), `Status`→`wip`.
Ao terminar: `Status`→`done`, limpar `Owner`. Só pegar `todo` com `Owner` vazio. `wip` com Owner = tem
dono, NÃO pegar. Status: `todo` | `wip` | `blocked` | `done`.

---

## Ordem & paralelização

```
SERIAL (fundação, bloqueia tudo):
  M0 worktree+deps → M1 clients → MIG (migrations SQL+RLS) → M3 auth

PARALELO (após fundação, subagents em lanes não-sobrepostas):
  ├─ SUP-10 FieldMaps  →  M4 CRUD stores
  ├─ M5 sub-recursos (detalhe/registros/orçamentos)         [depende SUP-10]
  ├─ M7 computados (5 libs puras + 14 server components)     [depende M1]
  └─ M6 estoque RPC                                          [depende M5 registros]

FECHO (serial, no main):
  M8 seed + remoção Go + build + smoke + deploy
```
> SUP-10 (FieldMaps) é pré-requisito de M4/M5 — fazer primeiro na fase paralela. M6 depois de M5
> (registros). M7 só depende dos clients (M1). Lanes não tocam os mesmos arquivos (ver mapa §12 do design).

---

## Board

| ID | Status | Owner | Milestone | Task | Gate / Verificação | Req |
|----|--------|-------|-----------|------|--------------------|-----|
| S0  | done |  | M0 | Worktree + `npm i @supabase/supabase-js @supabase/ssr` | tsc compila ✅ | — |
| S1  | done |  | M1 | `lib/supabase/{env,client,server}.ts` + envs `NEXT_PUBLIC_SUPABASE_*` | tsc verde ✅ | SUP-01 |
| S2  | done |  | M1 | **`proxy.ts`** (Next 16: middleware→proxy, runtime Node) renova sessão + guarda rota | matcher exclui estáticos ✅ | SUP-01 |
| S3  | done |  | M1 | Boot falha explícito sem envs (`env.ts`) | remoção NEXT_PUBLIC_API_URL → S17 | SUP-01 |
| MIG1| done |  | MIG | `0001_base_schema.sql` (23 tabelas, sem sessions/senha_hash) | aplicado via pooler como postgres ✅ | SUP-02 |
| MIG2| done |  | MIG | `0002_auth_rls.sql`: usuarios↔auth.users; `auth_clinica_id()` SD; RLS 21 tabelas + clinicas/usuarios; default auth_clinica_id() | **RLS GATE PASS** (B vê 0 de A; A não vê B; WITH CHECK bloqueia forja) ✅ | SUP-02, SUP-12 |
| MIG3| done |  | MIG | `0003_rpcs.sql`: criar_clinica, registrar_procedimento (FOR UPDATE), excluir_registro_procedimento, salvar_detalhe_profissional | 6 funções; criar_clinica testado ✅ | SUP-06, SUP-09 |
| S4  | todo |  | M3 | `/login` → `signInWithPassword` (map `senha`→`password`); erro inválido | login real → `/dashboard` | SUP-03 |
| S5  | todo |  | M3 | `/registrar` → `signUp` + `rpc criar_clinica`; trata email duplicado + órfão (re-check `/dashboard`) | registrar clínica nova → logado, isolada | SUP-03, SUP-09 |
| S6  | todo |  | M3 | Logout (`signOut`) + guarda server (`getUser` vazio→`redirect`); **remover** `data/server-load.ts` + `api-client*.ts` + `mock-api.ts` | logout→`/login`; grep AuthError = 0 | SUP-03 |
| S7  | todo |  | SUP-10 | `lib/supabase/resource.ts` (`FieldMap`/`selectCols`/`toRow`) + FieldMap dos 13 recursos (colunas 001_schema × tags domain) | cada map cobre todos campos do tipo TS | SUP-10 |
| S8  | todo |  | M4 | Reescrever `create-collection.ts` sobre client Supabase (interface `Collection<T>` **intacta**) | unit: add/update/remove/toggle/revalidate | SUP-04 |
| S9  | todo |  | M4 | `stores.ts`: 13 `createCollection(table, MAP)`; detalhe/registros deixam de ser `createLocalCollection` | CRUD+toggle persiste em 3 telas-amostra | SUP-04 |
| S10 | todo |  | M5 | Detalhe profissional: select com embed FK + escrita via `salvar_detalhe_profissional` | editar horários+comissões persiste íntegro | SUP-05 |
| S11 | todo |  | M5 | Registros por paciente (sem mapa = CRUD direto) + orçamentos+itens (embed, total `pacote-calc`) | criar orçamento c/ itens → total correto | SUP-05 |
| S12 | todo |  | M6 | `aba-procedimentos` + mapa: criar/editar/excluir registro com mapa via RPC; erro `SALDO_INSUFICIENTE`→aviso | baixa 5→2; exige 3 (só 2)→erro; delete→estorna 5 | SUP-06 |
| S13 | todo |  | M7 | Portar `domain/*`→libs puras: `comissao-calc`, `dashboard-calc`, `agenda-calc`, `estoque-calc` (+ estende `financeiro-calc`) | golden tests reusam `*_test.go` | SUP-07, SUP-11 |
| S14 | todo |  | M7 | 14 Server Components: `loadServer`→`createClient` server + lib pura (dashboard, 7 financeiro, 2 agenda, contas-a-*) | paridade 1 caso/relatório vs Go | SUP-07 |
| S15 | todo |  | M7 | numeric→number no mapper (`Number()`/`::float8`); datas em UTC | relatórios batem centavos/dias | SUP-07 |
| S16 | todo |  | M8 | Seed via Auth: script Node service-role (local/CI) cria admin `lucsbasto@gmail.com` + linha `usuarios`; SQL seed do resto | login seed funciona; dados isolados | SUP-08 |
| S17 | todo |  | M8 | Limpeza: remover `NEXT_PUBLIC_API_URL`/`MOCK_API`; backend Go fora do fluxo; `mock.ts` só tipos | `next build` no main verde (36 rotas) | SUP-08 |
| S18 | todo |  | M8 | Deploy Vercel: root `web`, envs Supabase; smoke prod (login+dashboard+CRUD); STATE.md re-revoga D6 | prod acessível; 0 requests a host Go | SUP-08, SUP-13 |

---

## Gates por milestone

- **M1**: `tsc` ✅; server component lê Supabase; rota protegida redireciona.
- **MIG**: aplica limpo no Supabase real; **RLS isola 2 clínicas** (gate de segurança, bloqueia o resto).
- **M3**: login/registro/logout reais; guarda funciona; arquivos Go-client removidos.
- **M4/M5**: CRUD+sub-recursos persistem; `Collection<T>` intacta (zero mudança de componente).
- **M6**: baixa/estorno/409 corretos sob a RPC.
- **M7**: paridade numérica vs Go (1 caso/relatório); golden tests verdes.
- **M8**: `tsc`+`eslint`+`next build` (main) ✅; smoke Supabase real ✅; deploy Vercel ✅.

## Definition of Done (feature)
App roda 100% sem Go; RLS isola tenant (testado 2 clínicas); 13 coleções + sub-recursos + estoque atômico
+ computados com paridade; deploy Vercel verde; STATE.md atualizado (D6 re-revogada). Success Criteria da
spec todos ✅.

---

## Notas de execução
- **Ordem dura:** S7 (FieldMaps) antes de S8/S9. MIG2 (RLS) é gate — nada de M4+ contra banco sem isolamento provado.
- **Lanes paralelas pós-fundação:** {S8,S9} · {S10,S11} · {S13,S14,S15} em subagents/worktrees separados;
  S12 só após S11. Não tocar `create-collection.ts` e `stores.ts` em lanes diferentes ao mesmo tempo.
- **Build:** só no main pós-merge ([[build-worktree-turbopack]]).
- **Smoke Supabase real:** projeto `pltiitcxhxizwbecdpjq` (us-west-2); decidir reset vs in-place (design §10).
