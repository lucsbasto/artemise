# Supabase Direct — remoção do backend Go, frontend fala direto com Supabase — Specification

## Problem Statement

Hoje o app tem **dois deploys**: frontend Next.js (`web/`) + backend Go (`backend/`, 89 rotas,
`net/http`+`pgx`, auth própria argon2id+sessões, RLS via `SET LOCAL app.clinica_id`). A Vercel só
hospeda bem o frontend; o Go exigiria um segundo host (Railway/Render/Fly) e operação separada.

Como o Postgres já é **Supabase gerenciado**, o backend Go é uma camada intermediária removível: o
frontend pode falar **direto com o Supabase** (PostgREST para CRUD + Supabase Auth + RPC para a lógica
que precisa de atomicidade). Resultado: **um único deploy na Vercel**, sem servidor Go.

Esta spec cobre a **migração completa de uma vez** (decisão do usuário): backend Go sai por inteiro ao
final; nada de fase intermediária com os dois rodando.

> **Re-revoga a D6.** A decisão D6 (backend Go puro) do STATE.md fica revogada por esta spec, assim como
> a trilha Drizzle/Supabase-Auth foi revogada antes dela. Terceiro giro de arquitetura: Drizzle → Go →
> **Supabase direto**. O modelo de domínio (21 tabelas, multitenant por `clinica_id`, mapa JSONB,
> ledgers financeiro/estoque, árvore de categorias) é **preservado**; muda só *onde* a lógica roda.

## Decisões de arquitetura (travadas com o usuário)

- **DA1 — Auth: Supabase Auth nativo.** `auth.users` guarda credenciais (signup/login do próprio
  Supabase). Tabela `usuarios` vira **perfil** com `id = auth.uid()` (FK → `auth.users`), carregando
  `clinica_id`, `nome`, `perfil_acesso`. Tabela `sessions` e todo o argon2id do Go são **eliminados**.
- **DA2 — RLS deriva tenant de `auth.uid()`.** Função SQL `auth_clinica_id()` =
  `(select clinica_id from usuarios where id = auth.uid())`. Todas as policies das 18 tabelas de negócio
  usam `clinica_id = auth_clinica_id()`. Acaba o `SET LOCAL app.clinica_id`. Isolamento multi-tenant
  passa a ser garantido pelo JWT do Supabase (cliente usa só a **anon key**, nunca service-role).
- **DA3 — Lógica pesada computa no frontend**, EXCETO estoque. Dashboard, relatórios financeiros
  (extrato/competência/fluxo/categorias/contas-receber-pagar/comissões) e agenda (visão-geral/relatório)
  buscam linhas cruas via PostgREST e **agregam em JS**, re-portando a lógica de `internal/domain` (Go)
  de volta para libs puras no `web/src/lib/` (origem original: `financeiro-calc.ts`, `pacote-calc.ts`).
- **DA4 — Estoque delta = RPC atômico.** A baixa/estorno de saldo (criar/editar/excluir registro de
  procedimento com `mapa`) é uma **função Postgres** com `SELECT ... FOR UPDATE` que valida saldo e
  lança exceção se insuficiente. Única operação que NÃO pode rodar no browser (race → saldo corrompido).
- **DA5 — Register via RPC `SECURITY DEFINER`.** Criar clínica+admin é atômico e privilegiado (escreve
  `clinicas` antes de existir tenant). Fluxo: `supabase.auth.signUp()` → RPC `criar_clinica(nome_clinica)`
  que insere `clinicas` + linha `usuarios` ligada a `auth.uid()`. Sem backend separado.
- **DA6 — Deploy único na Vercel**, root `web/`. Backend Go, `docker-compose.yml`, `backend/.env`
  removidos do fluxo de deploy (código pode ser arquivado/apagado — ver Out of Scope).

## Goals

- [ ] `@supabase/supabase-js` + `@supabase/ssr` instalados; clientes browser e server (App Router) prontos.
- [ ] Supabase Auth substitui login/registro/logout; sessão via cookies SSR; `usuarios` ligada a `auth.users`.
- [ ] RLS reescrita para `auth_clinica_id()`; isolamento de tenant testado (2ª clínica → 0 rows alheias).
- [ ] `create-collection.ts` reescrito sobre o client Supabase (mesma interface `Collection<T>` — zero
      mudança nos componentes que usam `useCollection`).
- [ ] 14 Server Components trocam `loadServer()`/`apiFetchServer` por client Supabase server-side.
- [ ] 10 endpoints computados re-implementados como agregação no frontend (libs puras testáveis).
- [ ] Estoque delta (criar/editar/excluir registro com mapa) via RPC atômica; 409→erro de saldo no UI.
- [ ] Register via RPC `criar_clinica`; login/logout via `supabase.auth`.
- [ ] Migrations Supabase: schema preservado + RLS nova + `usuarios↔auth.users` + seed re-feito via Auth.
- [ ] Backend Go fora do fluxo: `web/` builda e roda **sem** `NEXT_PUBLIC_API_URL`. Deploy Vercel verde.
- [ ] Gates: `tsc --noEmit` ✅, `eslint` ✅, `next build` ✅; smoke manual das telas-chave contra Supabase real.

## Out of Scope

| Item | Razão |
|---|---|
| Manter backend Go rodando em paralelo | Decisão = migração completa; Go sai de vez. |
| Apagar fisicamente `backend/` neste lote | Só **removido do fluxo de deploy**; deleção do dir é task de limpeza separada (após smoke OK). |
| Realtime / subscriptions Supabase | Stores continuam fetch-on-demand (revalidate); realtime fora desta fase. |
| Storage (upload de logo/avatars) | Upload de logo segue stub visual (já era out-of-scope no front). |
| RBAC por perfil (admin/recepção/profissional) | Backend Go também só fazia isolamento por tenant; role-check fica para fase futura. |
| Migrar hashes de senha argon2id → Supabase | Incompatível; usuário(s) **recriados** via Auth. 1 usuário seed (`lucsbasto@gmail.com`). |
| Edge Functions (Deno) | Lógica privilegiada cabe em RPC `SECURITY DEFINER`; sem Edge Functions nesta fase. |
| Otimização de N+1 nos relatórios computados | Agregação no front aceita tráfego maior; tuning depois (vira RPC se doer). |

---

## User Stories

> Ordem de execução por milestone. P1 = fundação (bloqueia tudo), P2 = dados/CRUD, P3 = computados,
> P4 = fecho/deploy.

### P1 — M1: Fundação Supabase client (SUP-01) ⭐ MVP

**User Story**: Como dev, quero o SDK Supabase configurado (browser + server) para que toda a app use
um único ponto de acesso ao Postgres gerenciado, sem o backend Go.

**Acceptance Criteria**:

1. WHEN o `web/package.json` é instalado THEN SHALL conter `@supabase/supabase-js` e `@supabase/ssr`.
2. WHEN um Client Component precisa do banco THEN SHALL usar `createBrowserClient(NEXT_PUBLIC_SUPABASE_URL,
   NEXT_PUBLIC_SUPABASE_ANON_KEY)` de um helper único (`web/src/lib/supabase/client.ts`).
3. WHEN um Server Component/Server Action precisa do banco THEN SHALL usar `createServerClient` do
   `@supabase/ssr` lendo/escrevendo cookies via `next/headers` (`web/src/lib/supabase/server.ts`).
4. WHEN as envs faltam THEN o app SHALL falhar com erro claro no boot (não silenciosamente apontar p/ Go).
5. WHEN o app builda THEN SHALL **não** referenciar `NEXT_PUBLIC_API_URL` em nenhum código vivo.

**Independent Test**: Um Server Component faz `supabase.from('pacientes').select('id').limit(1)` e
retorna sem erro de auth/conexão contra o Supabase real.

---

### P1 — M2: Schema + RLS reescrita para Supabase Auth (SUP-02) ⭐ MVP

**User Story**: Como gestor de uma clínica, quero que meus dados fiquem **isolados** de outras clínicas
mesmo com o frontend acessando o banco direto, para não haver vazamento entre tenants.

**Why P1**: É o eixo de segurança. Sem isso, anon key + acesso direto vazaria dados entre clínicas.

**Acceptance Criteria**:

1. WHEN a migration roda THEN a tabela `usuarios` SHALL ter `id uuid PRIMARY KEY REFERENCES auth.users(id)`
   (perfil 1:1 com o usuário do Supabase Auth), mantendo `clinica_id`, `nome`, `email`, `perfil_acesso`.
   A coluna `senha_hash` e a tabela `sessions` SHALL ser **removidas**.
2. WHEN existe a função `auth_clinica_id()` THEN SHALL retornar
   `(select clinica_id from usuarios where id = auth.uid())`, marcada `STABLE` e `SECURITY DEFINER` com
   `search_path` fixo (evita recursão de RLS na própria `usuarios`).
3. WHEN qualquer das **18 tabelas de negócio** (pacientes, profissionais, profissional_detalhe,
   profissional_horarios, profissional_comissoes, profissional_procedimentos, fornecedores,
   procedimentos, pacotes, pacote_itens, itens_estoque, registros_procedimento, eventos_agenda,
   contas_financeiras, categorias_contas, metodos_pagamento, lancamentos_financeiros, orcamentos,
   orcamento_itens, fichas_atendimento, modelos_documento) tem RLS THEN a policy SHALL ser
   `clinica_id = auth_clinica_id()` em `USING` e `WITH CHECK`, para `SELECT/INSERT/UPDATE/DELETE`.
4. WHEN um usuário autenticado da clínica A consulta dados da clínica B THEN SHALL retornar **0 linhas**
   (testado com 2 clínicas reais).
5. WHEN `usuarios` é consultada THEN a policy SHALL permitir o usuário ler a **própria** linha (e linhas
   da mesma `clinica_id` para staff), sem expor `usuarios` de outras clínicas.
6. WHEN `clinicas` é consultada THEN a policy SHALL expor só a clínica do próprio `auth_clinica_id()`.
7. WHEN o cliente usa a chave THEN SHALL ser **sempre a anon key** (service-role nunca no browser/Vercel client).

**Independent Test**: Logar como clínica A, `select * from pacientes` → só pacientes de A; trocar para
usuário da clínica B → só de B; nenhuma linha cruzada.

---

### P1 — M3: Auth (login / registro / logout) via Supabase Auth (SUP-03) ⭐ MVP

**User Story**: Como usuário, quero entrar, registrar uma nova clínica e sair, usando o Supabase Auth,
sem o endpoint Go de sessão.

**Acceptance Criteria**:

1. WHEN submeto `/login` com email+senha THEN o app SHALL chamar `supabase.auth.signInWithPassword`
   e, em sucesso, redirecionar para `/dashboard`; em falha, exibir erro (credenciais inválidas).
2. WHEN submeto `/registrar` com {nome, clinica, email, senha} THEN o app SHALL: (a) `supabase.auth.signUp`,
   (b) chamar a RPC `criar_clinica(nome_clinica, nome_usuario)` (`SECURITY DEFINER`) que insere `clinicas`
   + linha `usuarios` ligada ao `auth.uid()` recém-criado, atômico; (c) redirecionar para `/dashboard`.
3. WHEN clico logout THEN o app SHALL chamar `supabase.auth.signOut()` e redirecionar para `/login`.
4. WHEN um Server Component carrega sem sessão válida THEN SHALL `redirect('/login')` (substitui o
   tratamento atual de `AuthError`/401).
5. WHEN a sessão expira/é inválida THEN o `@supabase/ssr` SHALL renovar via cookies; falha → `/login`.
6. WHEN o email já existe THEN o registro SHALL falhar com mensagem clara (Supabase Auth garante unicidade).

**Independent Test**: Registrar clínica nova → cai no dashboard logado; logout → `/login`; login de novo
com as mesmas credenciais → dashboard. Dados da clínica nova isolados (RLS).

---

### P2 — M4: Data layer CRUD sobre Supabase (SUP-04) ⭐ MVP

**User Story**: Como dev, quero que as 13 coleções REST (`pacientes`, `profissionais`, `fornecedores`,
`procedimentos`, `pacotes`, `itens-estoque`, `contas-financeiras`, `categorias-contas`,
`metodos-pagamento`, `fichas-atendimento`, `modelos-documento`, `orcamentos`) funcionem direto no Supabase
**sem mudar os componentes**.

**Why P1/MVP**: É o grosso do app funcional (CRUD+busca+paginação+toggle já existem no front).

**Acceptance Criteria**:

1. WHEN `create-collection.ts` é reescrito THEN SHALL manter a **interface `Collection<T>` idêntica**
   (`getSnapshot/subscribe/add/update/remove/toggle/set`), trocando só a implementação interna de
   `apiFetch` para chamadas `supabase.from(table)...`.
2. WHEN `add(payload)` é chamado THEN SHALL `insert(payload).select().single()` e revalidar a lista.
3. WHEN `update(id, patch)` é chamado THEN SHALL `update(patch).eq('id', id)`; `remove(id)` →
   `delete().eq('id', id)`; `toggle(id)` → update do campo `ativo` (lê estado atual e inverte, ou RPC).
4. WHEN a lista é buscada THEN SHALL respeitar paginação (`range()`), busca (`ilike`/`textSearch`) e
   filtros equivalentes aos atuais; o envelope `{ items: T[] }` consumido pelo front SHALL ser preservado.
5. WHEN o payload usa nomes camelCase no TS THEN o mapeamento para colunas snake_case do Postgres SHALL
   ser explícito (camada de (de)serialização) — sem quebrar os tipos TS existentes.
6. WHEN `clinica_id` é necessário no insert THEN SHALL ser preenchido por **default/trigger no banco**
   (`default auth_clinica_id()`) OU no client; nunca confiável vindo só do client sem RLS `WITH CHECK`.

**Independent Test**: Em `/configuracoes/procedimentos`, criar/editar/excluir/toggle um procedimento →
persiste no Supabase e reflete reativo; recarregar a página mantém o dado.

---

### P2 — M5: Sub-recursos (detalhe profissional, registros+mapa, orçamentos+itens) (SUP-05)

**User Story**: Como gestor, quero os recursos aninhados (perfil rico do profissional, ficha de registros
do paciente, orçamentos com itens) funcionando direto no Supabase.

**Acceptance Criteria**:

1. WHEN abro o detalhe de um profissional THEN SHALL carregar `profissional_detalhe` + `horarios` +
   `comissoes` + `procedimentos` via selects (ou um `select` com embed PostgREST de FKs).
2. WHEN salvo o detalhe (PATCH composto: detalhe+horarios+comissoes+procedimentoIds) THEN SHALL aplicar
   as 4 tabelas de forma consistente — via RPC `salvar_detalhe_profissional(...)` (uma transação) OU
   sequência de upserts/deletes com tratamento de erro (decisão no design; RPC preferida p/ atomicidade).
3. WHEN listo registros de um paciente THEN SHALL `select` em `registros_procedimento` filtrado por
   `paciente_id` (RLS já garante tenant).
4. WHEN crio/edito orçamento THEN SHALL persistir `orcamentos` + `orcamento_itens`; total recalculado
   por lib pura (`pacote-calc.ts` reusada) e/ou coluna gerada.
5. WHEN registro de procedimento usa `mapa` THEN a baixa de estoque NÃO acontece aqui — vai por SUP-06.

**Independent Test**: Editar horários+comissões de um profissional e recarregar → persistido íntegro;
criar orçamento com itens → total correto e itens listados.

---

### P2 — M6: Estoque delta atômico via RPC (SUP-06) ⭐ crítico

**User Story**: Como gestor, quero que registrar/editar/excluir um procedimento com mapa de injetáveis
ajuste o estoque **sem corromper saldo** mesmo com uso concorrente.

**Why crítico**: Única lógica que não pode ir pro browser (race condition → saldo errado/negativo).

**Acceptance Criteria**:

1. WHEN existe a RPC `registrar_procedimento(paciente_id, payload, mapa)` THEN SHALL, numa transação:
   (a) `SELECT ... FOR UPDATE` nas linhas de `itens_estoque` referenciadas pelo mapa,
   (b) calcular o delta (`novo - anterior`), (c) se saldo insuficiente → `RAISE EXCEPTION` (mapeado p/
   erro de saldo no UI), (d) aplicar baixa e inserir/atualizar `registros_procedimento`.
2. WHEN edito um registro com mapa THEN a RPC SHALL recalcular delta líquido (novo−anterior, pode ser
   estorno) e aplicar; saldo insuficiente → exceção, nada persiste.
3. WHEN excluo um registro com mapa THEN a RPC SHALL **estornar** todas as unidades ao estoque (nunca falha).
4. WHEN a RPC roda THEN SHALL respeitar RLS (`SECURITY INVOKER`/`SET search_path`), agindo só no tenant
   do chamador; jamais tocar estoque de outra clínica.
5. WHEN o frontend recebe erro de saldo insuficiente THEN SHALL exibir aviso (equivalente ao 409 atual)
   sem aplicar mudança parcial.

**Independent Test**: Criar registro que baixa 5→2 de uma substância; tentar outro que exige 3 (só há 2)
→ erro de saldo, saldo permanece 2; excluir o primeiro → estorna para 5.

---

### P3 — M7: Relatórios computados no frontend (SUP-07)

**User Story**: Como gestor, quero o dashboard e os relatórios (financeiro + agenda) funcionando com
agregação no frontend sobre dados do Supabase.

**Acceptance Criteria**:

1. WHEN abro `/dashboard` THEN o app SHALL buscar as tabelas-fonte (`lancamentos_financeiros`,
   `eventos_agenda`, `registros_procedimento`, `pacientes`) no período e computar em lib pura
   (`web/src/lib/dashboard-calc.ts`) os KPIs (totalPacientes, agendamentosHoje, receitaMes,
   procedimentosMes, taxaRetorno), saldos (realizado/previsto), cashflow diário, próximos 24h e reports
   (porProfissional, diasMovimentados, heatAtivo, statusAgendamento, pacientesPorSexo, faturamentoComparado).
2. WHEN abro os 7 relatórios financeiros THEN cada um SHALL re-usar/portar a lógica de `internal/domain`
   (Go) para libs puras no front: **extrato**, **competência**, **fluxo** (dia/mês, encadeamento de
   saldo — `financeiro-calc.ts` já existia), **categorias** (árvore + percentual), **contas-receber**,
   **contas-pagar**, **comissões** (`CalcComissao` percentual/fixo por profissional×procedimento).
3. WHEN abro `/agenda/visao-geral` THEN SHALL computar no front: por_status, rankings prof/proc,
   horários movimentados (heatmap 0–23), dias movimentados — sobre `eventos_agenda` do período.
4. WHEN abro `/agenda/relatorio` THEN SHALL listar `eventos_agenda` com filtros (status/prof/paciente/
   data) e paginação, no client.
5. WHEN qualquer relatório agrega THEN os números SHALL bater com os do backend Go atual (paridade
   validada em pelo menos 1 caso por relatório).

**Independent Test**: `/dashboard` e `/financeiro/fluxo-de-caixa-diario` renderizam os mesmos valores que
o backend Go produzia para o mesmo dataset seed.

---

### P4 — M8: Seed + remoção do backend do fluxo + deploy Vercel (SUP-08)

**User Story**: Como dev, quero o app rodando 100% sem o Go, com seed re-feito via Supabase Auth e deploy
na Vercel.

**Acceptance Criteria**:

1. WHEN o seed roda THEN SHALL criar o usuário admin via **Supabase Auth** (não hash pré-computado) +
   linha `usuarios` ligada + dados seed (clínica, procedimentos, estoque, métodos, categorias, fichas).
2. WHEN o `web/` builda THEN SHALL **não** depender de `backend/` nem de `NEXT_PUBLIC_API_URL`; arquivos
   mortos (`api-client.ts`, `api-client-server.ts`, `mock-api.ts`) removidos ou re-apontados.
3. WHEN o deploy Vercel roda THEN SHALL ter Root Directory = `web`, envs `NEXT_PUBLIC_SUPABASE_URL` e
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` configuradas, e build verde.
4. WHEN `docker-compose.yml`/`backend/.env` referenciam o Go THEN SHALL ser retirados do fluxo de deploy
   (dir `backend/` pode ficar arquivado até task de limpeza — ver Out of Scope).
5. WHEN o STATE.md é atualizado THEN SHALL registrar a re-revogação da D6 e a nova decisão (Supabase direto).

**Independent Test**: Deploy na Vercel acessível; login + dashboard + um CRUD funcionam em produção
contra o Supabase real; nenhum request bate em host Go.

---

## Edge Cases

- WHEN o cliente tenta setar `clinica_id` de outra clínica num insert THEN o `WITH CHECK` da RLS SHALL
  rejeitar (defesa contra client malicioso).
- WHEN `auth.uid()` é nulo (não logado) THEN `auth_clinica_id()` retorna NULL → policies retornam 0 linhas.
- WHEN a RPC de estoque encontra saldo insuficiente THEN SHALL abortar a transação inteira (zero baixa parcial).
- WHEN um numeric do Postgres volta THEN o client SHALL tratar como **número** (não string) na agregação.
- WHEN refs opcionais cross-tabela (agendamento→paciente, lançamento→conta/categoria) são gravadas THEN
  ambas pertencem ao mesmo tenant — garantido por RLS + (idealmente) FK; validar no design.
- WHEN o registro Supabase Auth cria usuário mas a RPC `criar_clinica` falha THEN o usuário fica órfão →
  o design SHALL tratar (RPC idempotente / retry / cleanup) para não travar o cadastro.
- WHEN dois inserts concorrentes baixam o mesmo item THEN o `FOR UPDATE` serializa (sem perda de baixa).
- WHEN a sessão Supabase está só no cookie e o Server Component renderiza THEN `@supabase/ssr` SHALL ler
  o cookie corretamente (sem vazar entre requests/usuários).

---

## Requirement Traceability

| Requirement ID | Story / Milestone | Substitui (backend Go) | Fase | Status |
|---|---|---|---|---|
| SUP-01 | M1: Supabase client browser+server | `api-client.ts`/`api-client-server.ts` | Design | Pending |
| SUP-02 | M2: Schema + RLS via `auth_clinica_id()` | `SET LOCAL app.clinica_id` + `002_rls.sql` | Design | Pending |
| SUP-03 | M3: Auth login/registro/logout | handlers `auth.go` + `sessions` + argon2id | Design | Pending |
| SUP-04 | M4: CRUD 13 coleções | 13 grupos CRUD do router Go | Design | Pending |
| SUP-05 | M5: sub-recursos (detalhe/registros/orçamentos) | handlers detalhe/registros/orcamentos | Design | Pending |
| SUP-06 | M6: estoque delta RPC atômico | baixa transacional Go (`internal/store`) | Design | Pending |
| SUP-07 | M7: computados no frontend | dashboard+financeiro+agenda (`internal/domain`) | Design | Pending |
| SUP-08 | M8: seed Auth + remoção Go + deploy Vercel | `cmd/seed`, `cmd/server`, docker | Design | Pending |
| SUP-09 | RPC `criar_clinica` (`SECURITY DEFINER`) | register handler atômico | Design | Pending |
| SUP-10 | Mapeamento camelCase↔snake_case (de)serialização | tags JSON do Go | Design | Pending |
| SUP-11 | Libs puras re-portadas (financeiro/dashboard/comissão calc) | `internal/domain/*` | Design | Pending |
| SUP-12 | Teste de isolamento multi-tenant (2 clínicas) | smoke RLS Go | Design | Pending |
| SUP-13 | Gates tsc+eslint+build + smoke Supabase real + deploy | gates Go | - | Pending |

**ID format:** `SUP-[NUMBER]`
**Status values:** Pending → In Design → In Tasks → Implementing → Verified
**Coverage:** 13 total, 0 mapeados a tasks (mapeados na fase Tasks) ⚠️

---

## Success Criteria

- [ ] App roda 100% sem o backend Go; nenhum request a host Go; `NEXT_PUBLIC_API_URL` eliminado.
- [ ] Login/registro/logout via Supabase Auth; sessão SSR por cookies funciona em Server Components.
- [ ] RLS isola tenant de verdade: usuário da clínica A nunca vê dado da clínica B (testado com 2 clínicas).
- [ ] 13 coleções CRUD + sub-recursos persistem no Supabase via a mesma interface `Collection<T>`
      (componentes inalterados).
- [ ] Estoque delta atômico: baixa/estorno corretos, saldo insuficiente bloqueia sem baixa parcial.
- [ ] Dashboard + 7 relatórios financeiros + 2 de agenda batem os números do backend Go (paridade).
- [ ] `tsc --noEmit` ✅, `eslint` ✅, `next build` ✅.
- [ ] Deploy na Vercel verde (root `web`, envs Supabase), login+dashboard+CRUD ok em produção.
- [ ] STATE.md atualizado: D6 re-revogada, nova decisão registrada.

---

## Riscos & Pontos de atenção

- **RLS recursiva na `usuarios`**: `auth_clinica_id()` consulta `usuarios`; se a própria `usuarios` tiver
  policy que chama a função → loop. Resolver com `SECURITY DEFINER` + `search_path` fixo na função, e
  policy de `usuarios` baseada em `id = auth.uid()` (não na função).
- **Atomicidade do register** (DA5): signUp + RPC são 2 passos; usuário órfão se a RPC falhar. Avaliar
  trigger `on auth.users insert` como alternativa mais robusta no design.
- **Paridade dos computados** (DA3): re-portar Go→JS pode introduzir divergência sutil (arredondamento,
  fuso, status). Validar 1 caso por relatório contra o Go antes de aposentá-lo.
- **camelCase↔snake_case**: o Go entregava JSON camelCase; PostgREST entrega nomes de coluna
  (snake_case). Sem uma camada de mapeamento, os tipos TS quebram. SUP-10 é obrigatório, não opcional.
- **service-role nunca no client**: qualquer operação que precise de bypass de RLS fica em RPC
  `SECURITY DEFINER` server-side; a anon key é a única exposta na Vercel/browser.
- **Performance dos relatórios**: agregar no front puxa muitas linhas. Se algum relatório ficar pesado,
  promover para RPC/view é o caminho de escape (já previsto em Out of Scope/tuning).

---

## Próximos passos (pós-spec)

1. Revisar/aprovar esta spec.
2. **Design** (`.specs/features/supabase-direct/design.md`): clientes Supabase, SQL exato das policies +
   funções (`auth_clinica_id`, `criar_clinica`, `registrar_procedimento`), mapa de (de)serialização,
   libs puras a portar, ordem de migrations.
3. **Tasks** (`tasks.md`): quebrar M1–M8 em tasks atômicas com gate por milestone.
4. Abrir worktree `feat/supabase-direct` (ver [[worktree-por-spec]]) e implementar — fundação (M1–M3)
   antes de paralelizar M4–M7 entre subagents.
