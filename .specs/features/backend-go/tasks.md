# Backend Go — Tasks

**Spec**: `.specs/features/backend-go/spec.md`
**Design**: `.specs/features/backend-go/design.md`
**Status**: Draft

**Gate padrão Go**: `cd backend && go build ./... && go vet ./...`
**Gate padrão Frontend (M8)**: `cd web && npx tsc --noEmit && npm run lint`
**Aviso de build**: build Next.js NÃO roda em worktree (Turbopack rejeita junction de node_modules). Validar `go build` + `go vet` no backend diretamente; validar `tsc + lint` no frontend; buildar no main pós-merge.

---

## Nota de rastreabilidade

Cada milestone mapeia para os Requisitos Funcionais definidos em `spec.md` (arquivo irmão). A tabela abaixo usa os IDs de RF que o spec deve declarar — consulte `spec.md` para o texto completo de cada requisito.

| Milestone | RFs cobertos (spec.md) |
|---|---|
| M1 Bootstrap | BK-RF-01 (módulo Go + deps), BK-RF-02 (pool pgx + config env), BK-RF-03 (servidor HTTP ServeMux), BK-RF-04 (health check) |
| M2 Migrations + Seed | BK-RF-05 (runner migrations), BK-RF-06 (schema núcleo), BK-RF-07 (RLS policies), BK-RF-08 (seed dados mock) |
| M3 Auth + RLS | BK-RF-09 (hash argon2id), BK-RF-10 (login/sessão/cookie), BK-RF-11 (middleware auth + SET LOCAL), BK-RF-12 (logout + me) |
| M4 CRUD cadastros | BK-RF-13 (helper CRUD genérico), BK-RF-14 (pacientes), BK-RF-15 (profissionais + fornecedores), BK-RF-16 (procedimentos + pacotes), BK-RF-17 (itens_estoque), BK-RF-18 (financeiro cadastros), BK-RF-19 (fichas + modelos) |
| M5 Sub-recursos | BK-RF-20 (profissional detalhe rico), BK-RF-21 (registros_procedimento + mapa JSONB), BK-RF-22 (orçamentos + itens + calc) |
| M6 Estoque transacional | BK-RF-23 (baixa estoque por delta), BK-RF-24 (aviso saldo insuficiente) |
| M7 Endpoints computados | BK-RF-25 (dashboard KPIs), BK-RF-26 (agenda), BK-RF-27 (extrato + competência + calc Go), BK-RF-28 (fluxo + categorias + contas-receber/pagar + comissões) |
| M8 Swap frontend | BK-RF-29 (api-client.ts), BK-RF-30 (create-collection via API), BK-RF-31 (Server Components fetch), BK-RF-32 (remover mock mutável) |
| M9 Fecho | BK-RF-33 (README backend), BK-RF-34 (STATE atualizado), BK-RF-35 (smoke test final) |

---

## Nota de protocolo

**Multi-agent task board:** antes de começar qualquer task, edite a linha abaixo e preencha `Owner` com seu id (`@nome` ou session id) e mude `Status` para `wip`. Ao terminar, mude para `done` e limpe `Owner`. Só pegar tasks `todo` com `Owner` vazio. Uma task `wip` com Owner preenchido = já tem dono, NÃO pegar. Status válidos: `todo` | `wip` | `blocked` | `done`. (Protocolo em `.specs/project/STATE.md` — "Protocolo de posse".)

---

## Task Board

| ID | Status | Owner | Task | Verificação | Commit |
|---|---|---|---|---|---|
| BK-1 | todo | | M1: init go.mod + pgxpool + config env | `cd backend && go build ./... && go vet ./...` limpos; `DATABASE_URL=<url> go run ./cmd/server` loga "db ok" | `feat(backend): bootstrap módulo Go com pgxpool e config env` |
| BK-2 | todo | | M1: servidor net/http ServeMux 1.22+ + graceful shutdown | `go build ./...` limpo; `SIGTERM` ao processo → log "shutdown ok" e exit 0 | `feat(backend): servidor HTTP ServeMux e graceful shutdown` |
| BK-3 | todo | | M1: rota GET /api/health | `curl -s localhost:8080/api/health` → HTTP 200 `{"status":"ok"}` | `feat(backend): rota GET /api/health` |
| BK-4 | todo | | M2: runner de migrations em Go (schema_migrations) | `go run ./cmd/migrate up` aplica; `go run ./cmd/migrate down` reverte; `\dt schema_migrations` existe | `feat(backend): runner de migrations SQL com schema_migrations` |
| BK-5 | todo | | M2: migration 001 schema núcleo (todas as tabelas do design) | `go run ./cmd/migrate up`; `\dt` lista todas as tabelas; `down` limpa sem erro | `feat(backend/migrations): 001 schema núcleo — todas as tabelas` |
| BK-6 | todo | | M2: migration 002 RLS policies (clinica_id via current_setting) | `SET LOCAL app.clinica_id = '<uuid-A>'`; SELECT retorna apenas rows da clínica A | `feat(backend/migrations): 002 RLS policies por clinica_id` |
| BK-7 | todo | | M2: seed SQL (clínica, admin Lucas Bastos, paciente Clara Ribeiro, dados de mock.ts) | `SELECT count(*) FROM procedimentos` ≥ 14; `metodos_pagamento` = 8; login seed → 200 | `feat(backend/migrations): seed dados iniciais do mock.ts` |
| BK-8 | todo | | M3: hash argon2id — criar e verificar senha | `go test ./internal/auth/...` → hash+verify round-trip passa; hashes distintos para inputs distintos | `feat(backend): argon2id hash e verificação de senha` |
| BK-9 | todo | | M3: POST /api/auth/login — valida senha, cria sessão, seta cookie | `curl -X POST /api/auth/login -d '{"email":"...","senha":"..."}' -c jar.txt -v` → 200 e header `Set-Cookie: session=` | `feat(backend): POST /api/auth/login com sessão e cookie` |
| BK-10 | todo | | M3: middleware sessão→usuário + middleware txn SET LOCAL clinica_id/user_id | Sem cookie → 401; com cookie válido → 200; 2 clínicas no seed → RLS isola rows | `feat(backend): middleware autenticação e RLS por request` |
| BK-11 | todo | | M3: POST /api/auth/logout + GET /api/auth/me | `curl -b jar.txt /api/auth/me` → 200 JSON usuário; após logout → 401 | `feat(backend): POST /api/auth/logout e GET /api/auth/me` |
| BK-12 | todo | | M4: helper CRUD reusável (list/create/read/update/delete/toggle + paginação) | `go build ./...` limpo; helper reutilizado por ≥ 2 stores distintos | `feat(backend): helper CRUD genérico com pgx` |
| BK-13 | todo | | M4: CRUD pacientes (list/create/read/update/delete) | curl POST → 201; GET list `?q=`/`?page=`/`?sort=` → correto; DELETE → 204; `go vet ./...` limpo | `feat(backend): CRUD pacientes` |
| BK-14 | todo | | M4: CRUD profissionais (contato) + fornecedores com toggle ativo | CRUD + `PATCH /{id}/toggle` inverte `ativo` em cada recurso; list paginado | `feat(backend): CRUD profissionais e fornecedores` |
| BK-15 | todo | | M4: CRUD procedimentos + pacotes (pacote retorna itens) | `GET /api/pacotes/{id}` → JSON com `itens[]`; toggle ativo; list paginado | `feat(backend): CRUD procedimentos e pacotes` |
| BK-16 | todo | | M4: CRUD itens_estoque com saldo_atual exposto | `GET /api/estoque` → lista com `saldo_atual`; toggle ativo; `go vet ./...` limpo | `feat(backend): CRUD itens de estoque` |
| BK-17 | todo | | M4: CRUD contas_financeiras + categorias_contas (árvore pai→filhos) + metodos_pagamento | `GET /api/categorias-contas` → JSON com `filhos[]`; toggle nos 3 recursos | `feat(backend): CRUD financeiro — contas, categorias, métodos pagamento` |
| BK-18 | todo | | M4: CRUD fichas_atendimento + modelos_documento (retorna campo corpo HTML) | `GET /api/modelos-documento/{id}` → JSON com `corpo`; toggle ativo | `feat(backend): CRUD fichas de atendimento e modelos de documento` |
| BK-19 | todo | | M5: GET/PATCH profissional detalhe rico (horarios/comissoes/procedimentos/certificacoes) | `GET /api/profissionais/{id}/detalhe` → JSON com 4 chaves; PATCH persiste e GET confirma | `feat(backend): profissional detalhe rico (horários, comissões, procedimentos, certificações)` |
| BK-20 | todo | | M5: CRUD registros_procedimento por paciente com mapa injetáveis JSONB | POST com `mapa:{pontos:[]}` → 201; GET confirma campo `mapa` presente no JSON | `feat(backend): registros de procedimento com mapa injetáveis JSONB` |
| BK-21 | todo | | M5: orçamentos por paciente + orcamento_itens + total calculado (porta pacote-calc.ts) | Criar orçamento com 2 itens; `total` no GET bate com cálculo manual; `go vet ./...` limpo | `feat(backend): orçamentos por paciente com total calculado` |
| BK-22 | todo | | M6: baixa de estoque transacional por delta ao criar/editar injetável + aviso saldo insuficiente | Seed saldo=5; POST quantidade=3 → saldo=2; POST quantidade=3 → 409 `{"erro":"saldo_insuficiente"}`; editar de 3→1 → saldo volta a 4 | `feat(backend): baixa de estoque transacional com aviso de saldo` |
| BK-23 | todo | | M7: GET /api/dashboard (KPIs computados dos dados reais) | `curl /api/dashboard -b jar.txt` → 200 JSON; `total_pacientes` bate com `SELECT count(*) FROM pacientes` | `feat(backend): endpoint dashboard com KPIs computados` |
| BK-24 | todo | | M7: GET /api/agenda/visao-geral + /api/agenda/relatorio paginado | `visao-geral` → JSON com `por_status{}`; `relatorio?status=concluido` → lista filtrada | `feat(backend): endpoints agenda visão-geral e relatório` |
| BK-25 | todo | | M7: GET /api/financeiro/extrato + /competencia (portando financeiro-calc.ts para Go) | `go test ./internal/calc/...` → TestFluxoRows encadeamento passa; KPIs de extrato batem com seed | `feat(backend): endpoints financeiro extrato e competência + calc Go` |
| BK-26 | todo | | M7: GET /api/financeiro/fluxo?granularidade=dia\|mes + /categorias + /contas-receber + /contas-pagar + /comissoes | Fluxo mensal → 12 meses com saldo encadeado; categorias → percentuais somam 100%; `go vet ./...` limpo | `feat(backend): endpoints financeiro fluxo, categorias, contas-receber/pagar, comissões` |
| BK-27 | todo | | M8: criar web/src/lib/api-client.ts (fetch + credentials: include) | `cd web && npx tsc --noEmit && npm run lint` limpos; `apiFetch` exportado e tipado; sem `any` injustificado | `feat(frontend): api-client.ts — fetch com cookies` |
| BK-28 | todo | | M8: reimplementar create-collection.ts chamando API (mesma interface pública Collection) | Interface `Collection<T>` / `useCollection` inalterada; CRUD no browser vai contra API; `tsc + lint` limpos | `feat(frontend): create-collection via API (swap do store em memória)` |
| BK-29 | todo | | M8: trocar imports de dados computados em Server Components por apiFetch | `cd web && npx tsc --noEmit && npm run lint` limpos; abrindo `/` com API rodando → KPIs reais sem erro de console | `feat(frontend): Server Components buscam dados computados via API` |
| BK-30 | todo | | M8: remover dependência de mock.ts para dados mutáveis | `grep -r "from.*lib/mock" web/src` não retorna imports de dados mutáveis; `tsc + lint + npm run build` limpos | `feat(frontend): remove dependência de mock.ts para dados mutáveis` |
| BK-31 | todo | | M9: README backend (setup Supabase, env, migrate, run) | Seguir README do zero → servidor sobe e `/api/health` retorna 200 | `docs(backend): README com setup Supabase, env, migrate e run` |
| BK-32 | todo | | M9: atualizar .specs/project/STATE.md (T6 done + resumo backend) | T6 = `done` na tabela; seção "Concluído" tem parágrafo sobre backend-go | `chore(state): T6 backend concluído — swap frontend sem mock` |
| BK-33 | todo | | M9: smoke test final — go build/vet + tsc + lint + curl das rotas principais | `go build ./... && go vet ./...` → 0 erros; `tsc --noEmit && npm run lint` → 0 erros; curl health + login + pacientes + dashboard → 200 | `chore(backend): smoke test final — build, vet, tsc, lint e curl` |

---

## Detalhamento por Milestone

### M1 — Bootstrap

**Dep**: nenhuma
**Foco**: esqueleto mínimo rodando contra Supabase real; nada mais.

---

#### BK-1 — init go.mod + pgxpool + config env

**O que**: Criar `backend/` com `go.mod` (módulo `github.com/lucsb/artemise/backend`), dependências `github.com/jackc/pgx/v5` e `golang.org/x/crypto`; `internal/config/config.go` lê `DATABASE_URL` (obrigatória, panic se ausente) e `PORT` (padrão `8080`) via `os.Getenv`; `internal/db/pool.go` abre `pgxpool.New` e valida com `Ping`.
**Onde**: `backend/go.mod`, `backend/go.sum`, `backend/internal/config/config.go`, `backend/internal/db/pool.go`
**Done when**:
- [ ] `cd backend && go build ./...` sem erro
- [ ] `go vet ./...` sem aviso
- [ ] `DATABASE_URL=<supabase> go run ./cmd/server` loga "db ok" e não panics

---

#### BK-2 — servidor net/http ServeMux 1.22+ + graceful shutdown

**O que**: `cmd/server/main.go` cria `http.NewServeMux()`, instancia `http.Server{Handler: mux}`; captura `os.Signal` (`SIGTERM`, `SIGINT`) via `signal.NotifyContext`; ao receber sinal chama `srv.Shutdown(ctx)` com timeout de 10 s e loga "shutdown ok".
**Onde**: `backend/cmd/server/main.go`
**Done when**:
- [ ] `go build ./...` limpo
- [ ] Servidor sobe na porta configurada
- [ ] Enviar `SIGTERM` → log "shutdown ok" → exit 0

---

#### BK-3 — rota GET /api/health

**O que**: Registrar `mux.HandleFunc("GET /api/health", ...)` (sintaxe ServeMux 1.22) retornando HTTP 200 `Content-Type: application/json` com body `{"status":"ok","ts":"<RFC3339>"}`.
**Onde**: `backend/internal/server/routes.go`
**Done when**:
- [ ] `curl -s localhost:8080/api/health` → HTTP 200
- [ ] Body é JSON válido com chave `status` = `"ok"`
- [ ] `go vet ./...` limpo

---

### M2 — Migrations + Seed

**Dep**: BK-1 (pool disponível)
**Foco**: schema completo no Supabase + dados iniciais fiéis ao `web/src/lib/mock.ts`.

---

#### BK-4 — runner de migrations em Go

**O que**: `cmd/migrate/main.go` aceita argumento `up` ou `down`; lê arquivos `backend/migrations/NNN_*.sql` em ordem numérica; mantém tabela `schema_migrations(version VARCHAR PRIMARY KEY, applied_at TIMESTAMPTZ)`; aplica apenas versões não aplicadas; `down` reverte em ordem decrescente usando a seção `-- down` de cada arquivo (separador `-- migrate:down`).
**Onde**: `backend/cmd/migrate/main.go`, `backend/internal/migrate/runner.go`
**Done when**:
- [ ] `go run ./cmd/migrate up` numa DB limpa → `schema_migrations` tem linhas
- [ ] `go run ./cmd/migrate down` → tabelas removidas; segunda execução é idempotente
- [ ] `go vet ./...` limpo

---

#### BK-5 — migration 001 schema núcleo

**O que**: `backend/migrations/001_schema.sql` cria (seção `-- migrate:up`) todas as tabelas definidas em `design.md`: `clinicas`, `usuarios`, `sessions`, `pacientes`, `profissionais`, `fornecedores`, `procedimentos`, `pacotes`, `pacote_itens`, `itens_estoque`, `registros_procedimento`, `orcamentos`, `orcamento_itens`, `fichas_atendimento`, `modelos_documento`, `contas_financeiras`, `categorias_contas`, `metodos_pagamento`, `lancamentos`, `agendamentos`, `comissoes`, `horarios_profissional`, `certificacoes_profissional`. Seção `-- migrate:down` faz `DROP TABLE` na ordem inversa de FKs.
**Onde**: `backend/migrations/001_schema.sql`
**Done when**:
- [ ] `go run ./cmd/migrate up` → `\dt` lista todas as tabelas acima
- [ ] `go run ./cmd/migrate down` → `\dt` retorna vazio (exceto `schema_migrations`)
- [ ] Segundo `up` após `down` → idempotente, sem erro

---

#### BK-6 — migration 002 RLS policies

**O que**: `backend/migrations/002_rls.sql` executa `ALTER TABLE <tabela> ENABLE ROW LEVEL SECURITY` em cada tabela de negócio (todas exceto `clinicas`, `usuarios`, `sessions`, `schema_migrations`); cria policy `FOR ALL USING (clinica_id = current_setting('app.clinica_id', true)::uuid)` para o role da aplicação; tabelas sem `clinica_id` recebem `FORCE ROW LEVEL SECURITY` com policy explícita de bloqueio (ou são excluídas da RLS).
**Onde**: `backend/migrations/002_rls.sql`
**Done when**:
- [ ] `go run ./cmd/migrate up` (com 001 já aplicado)
- [ ] No psql: `SET LOCAL app.clinica_id = '<uuid-A>'; SELECT * FROM pacientes;` → só pacientes da clínica A
- [ ] Trocar para uuid de clínica inexistente → 0 linhas
- [ ] `go run ./cmd/migrate down` remove policies e desabilita RLS

---

#### BK-7 — seed SQL dados iniciais

**O que**: `backend/migrations/003_seed.sql` insere dados extraídos de `web/src/lib/mock.ts`:
- 1 clínica: "Clínica Experts" com UUID fixo
- 1 usuário admin: Lucas Bastos, `lucsbasto@gmail.com`, senha `argon2id` pré-computada
- 1 paciente: Clara Ribeiro com dados do mock
- Todos os `procedimentos` (≥ 14 estéticos incluindo injetáveis com `usa_mapa=true`)
- Todos os `itens_estoque` com `saldo_atual` do mock (toxina, ácido, pdo, bioestimulador)
- 8 `metodos_pagamento` exatos (Boleto, Cartão de crédito, Cartão de débito, Depósito, Dinheiro, Máquina de cartão, PIX, Transferência)
- `categorias_contas` árvore com pais e filhos
- `fichas_atendimento` (10 registros do mock)

**Onde**: `backend/migrations/003_seed.sql`
**Done when**:
- [ ] `go run ./cmd/migrate up` → `SELECT count(*) FROM procedimentos` ≥ 14
- [ ] `SELECT count(*) FROM metodos_pagamento` = 8
- [ ] `SELECT count(*) FROM fichas_atendimento` = 10
- [ ] Login com `lucsbasto@gmail.com` + senha seed via `POST /api/auth/login` → 200

---

### M3 — Auth + RLS Wiring

**Dep**: BK-4..7 (schema e seed prontos)
**Foco**: autenticação completa; RLS ativado por request via `SET LOCAL`.

---

#### BK-8 — hash argon2id

**O que**: `backend/internal/auth/password.go`: `HashPassword(plain string) (string, error)` usando `golang.org/x/crypto/argon2` (Argon2id, parâmetros: `time=1`, `memory=64*1024`, `threads=4`, `keyLen=32`, salt aleatório 16 bytes); output no formato `$argon2id$v=19$m=65536,t=1,p=4$<salt_b64>$<hash_b64>`. `VerifyPassword(encoded, plain string) (bool, error)` parseia o encoded e recomputa.
**Onde**: `backend/internal/auth/password.go`, `backend/internal/auth/password_test.go`
**Done when**:
- [ ] `go test ./internal/auth/...` → PASS
- [ ] Teste 1: hash + verify round-trip → true
- [ ] Teste 2: hash de string diferente → false
- [ ] Teste 3: hashes de mesma string são diferentes (salt aleatório) → true

---

#### BK-9 — POST /api/auth/login

**O que**: Handler `POST /api/auth/login` decodifica `{"email":"...","senha":"..."}` JSON; busca `usuarios` por email; chama `VerifyPassword`; cria linha em `sessions(id UUID DEFAULT gen_random_uuid(), usuario_id, clinica_id, expires_at = NOW() + INTERVAL '7 days')`; seta `Set-Cookie: session=<uuid>; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800`. Erros: email não encontrado ou senha incorreta → 401 `{"erro":"credenciais_invalidas"}`.
**Onde**: `backend/internal/handler/auth.go`
**Done when**:
- [ ] `curl -X POST localhost:8080/api/auth/login -H 'Content-Type: application/json' -d '{"email":"lucsbasto@gmail.com","senha":"<seed>"}' -c /tmp/jar.txt -v` → HTTP 200
- [ ] Header `Set-Cookie: session=<uuid>` presente na resposta
- [ ] `SELECT count(*) FROM sessions` = 1
- [ ] Email errado → 401

---

#### BK-10 — middleware sessão→usuário + middleware txn SET LOCAL

**O que**:
- `backend/internal/middleware/auth.go`: lê cookie `session`; faz `SELECT u.*, s.clinica_id FROM sessions s JOIN usuarios u ON u.id = s.usuario_id WHERE s.id = $1 AND s.expires_at > NOW()`; injeta `*UserCtx{ID, ClinicaID, ...}` em `context.Context`; 401 se ausente ou expirado.
- `backend/internal/middleware/rls.go`: wraps o handler; adquire `*pgxpool.Conn`; executa `BEGIN; SET LOCAL app.clinica_id = $1; SET LOCAL app.user_id = $2`; armazena conn no context; deferred `COMMIT` (ou `ROLLBACK` em panic); passa o `pgx.Tx` no context para os handlers.

**Onde**: `backend/internal/middleware/auth.go`, `backend/internal/middleware/rls.go`
**Done when**:
- [ ] `curl GET /api/pacientes` sem cookie → 401
- [ ] Com cookie válido → 200 (lista vazia ou com dados do seed)
- [ ] Seed com 2 clínicas: sessão da clínica A não vê pacientes da clínica B

---

#### BK-11 — POST /api/auth/logout + GET /api/auth/me

**O que**: `POST /api/auth/logout`: deleta `sessions` por ID do cookie; seta `Set-Cookie: session=; Max-Age=0; Path=/`. `GET /api/auth/me` (rota protegida): retorna `{"id","nome","email","clinica_id","papel"}` do usuário injetado no context.
**Onde**: `backend/internal/handler/auth.go`
**Done when**:
- [ ] `curl -b /tmp/jar.txt localhost:8080/api/auth/me` → 200 JSON com `email: "lucsbasto@gmail.com"`
- [ ] `curl -X POST -b /tmp/jar.txt localhost:8080/api/auth/logout` → 200
- [ ] `curl -b /tmp/jar.txt localhost:8080/api/auth/me` → 401

---

### M4 — CRUD Genérico Cadastros

**Dep**: BK-10 + BK-11 (middleware e auth completos)
**Foco**: todos os recursos de cadastro com paginação, busca e toggle. Tasks BK-13..18 são paralelas entre si após BK-12.

---

#### BK-12 — helper CRUD reusável

**O que**: `backend/internal/store/crud.go` com funções reutilizáveis:
- `ParseListParams(r *http.Request) (q, sort string, page, limit int)` — lê `?q=`, `?sort=`, `?page=`, `?limit=` com defaults (`page=1`, `limit=25`)
- `RespondJSON(w http.ResponseWriter, status int, v any)` — serializa JSON e seta Content-Type
- `RespondError(w http.ResponseWriter, status int, msg string)` — responde `{"erro":"..."}` JSON
- Helper de scan genérico para rows pgx usando `pgx.CollectRows`

**Onde**: `backend/internal/store/crud.go`, `backend/internal/server/respond.go`
**Done when**:
- [ ] `go build ./...` limpo
- [ ] Funções reutilizadas por ≥ 2 stores distintos nas tasks seguintes
- [ ] `go vet ./...` sem aviso

---

#### BK-13 — CRUD pacientes

**O que**: `store/pacientes.go` + `handler/pacientes.go`. Rotas registradas:
- `GET /api/pacientes` — list com `?q=` (busca em nome/email), `?sort=nome|data_nascimento`, `?page=`, `?limit=`; retorna `{"data":[...],"total":N,"page":P}`
- `POST /api/pacientes` → 201 com JSON do recurso criado
- `GET /api/pacientes/{id}` → 200 ou 404
- `PATCH /api/pacientes/{id}` → 200
- `DELETE /api/pacientes/{id}` → 204
- `PATCH /api/pacientes/{id}/toggle` → 200 (inverte `ativo`)

**Onde**: `backend/internal/store/pacientes.go`, `backend/internal/handler/pacientes.go`
**Done when**:
- [ ] `curl -X POST .../api/pacientes -H 'Content-Type: application/json' -d '{"nome":"Teste","email":"t@t.com"}' -b jar.txt` → 201
- [ ] `curl .../api/pacientes?q=Teste -b jar.txt` → `{"data":[{...}],"total":1}`
- [ ] `curl -X DELETE .../api/pacientes/{id} -b jar.txt` → 204
- [ ] `go vet ./...` limpo

---

#### BK-14 — CRUD profissionais (contato) + fornecedores

**O que**: Stores e handlers para `profissionais` e `fornecedores`. Mesmas 6 rotas do padrão (list/create/get/update/delete/toggle). `profissionais` inclui campos de contato (telefone, email, especialidade). `fornecedores` inclui CNPJ e contato.
**Onde**: `backend/internal/store/profissionais.go`, `backend/internal/store/fornecedores.go`, handlers correspondentes
**Done when**:
- [ ] CRUD completo + toggle em cada recurso via curl
- [ ] List com `?q=` filtra por nome em ambos
- [ ] `go vet ./...` limpo

---

#### BK-15 — CRUD procedimentos + pacotes (pacote retorna itens)

**O que**: Stores e handlers para `procedimentos` e `pacotes`. `GET /api/pacotes/{id}` faz JOIN com `pacote_itens` e retorna `{"...","itens":[{"procedimento_id","qtd","preco_unitario"}]}`. Toggle ativo em ambos.
**Onde**: `backend/internal/store/procedimentos.go`, `backend/internal/store/pacotes.go`, handlers correspondentes
**Done when**:
- [ ] `curl GET /api/pacotes/{id} -b jar.txt` → JSON com chave `itens[]`
- [ ] `POST /api/pacotes` com `itens` cria pacote e itens em transação
- [ ] Toggle inverte `ativo`; `go vet ./...` limpo

---

#### BK-16 — CRUD itens_estoque com saldo_atual exposto

**O que**: Store e handler para `itens_estoque`. List retorna `saldo_atual` em cada item. Toggle ativo. Nenhuma baixa aqui (M6).
**Onde**: `backend/internal/store/estoque.go`, `backend/internal/handler/estoque.go`
**Done when**:
- [ ] `curl GET /api/estoque -b jar.txt` → JSON com `saldo_atual` em cada item
- [ ] Toggle inverte `ativo`
- [ ] `go vet ./...` limpo

---

#### BK-17 — CRUD contas_financeiras + categorias_contas (árvore) + metodos_pagamento

**O que**: Stores e handlers para os 3 recursos. `GET /api/categorias-contas` retorna árvore `[{"id","descricao","tipo","filhos":[...]}]` (recursivo até 2 níveis, conforme design). Toggle ativo nos 3 recursos.
**Onde**: `backend/internal/store/financeiro_cadastros.go`, handlers correspondentes
**Done when**:
- [ ] `curl GET /api/categorias-contas -b jar.txt` → JSON com `filhos[]` preenchidos do seed
- [ ] Toggle em cada um dos 3 recursos
- [ ] `go vet ./...` limpo

---

#### BK-18 — CRUD fichas_atendimento + modelos_documento

**O que**: Stores e handlers para os 2 recursos de configuração. `GET /api/modelos-documento/{id}` inclui campo `corpo` (HTML). Toggle ativo em ambos.
**Onde**: `backend/internal/store/config_recursos.go`, handlers correspondentes
**Done when**:
- [ ] `curl GET /api/modelos-documento/{id} -b jar.txt` → JSON com `corpo` não-nulo
- [ ] CRUD completo em `fichas_atendimento`
- [ ] `go vet ./...` limpo

---

### M5 — Sub-recursos

**Dep**: BK-13..18 (recursos base prontos). BK-19, BK-20 e BK-21 são paralelas entre si.
**Foco**: dados aninhados e cálculo de total de orçamento.

---

#### BK-19 — GET/PATCH profissional detalhe rico

**O que**: `GET /api/profissionais/{id}/detalhe` retorna JSON com 4 sub-seções: `horarios[]`, `comissoes[]`, `procedimentos[]`, `certificacoes[]` (queries em tabelas filhas). `PATCH /api/profissionais/{id}/detalhe` aceita partial update: substitui as rows filhas no body recebido dentro de transação (delete+insert por sub-seção).
**Onde**: `backend/internal/store/profissional_detalhe.go`; adição em `backend/internal/handler/profissionais.go`
**Done when**:
- [ ] `curl GET /api/profissionais/{id}/detalhe -b jar.txt` → JSON com as 4 chaves presentes (arrays, podem ser vazios)
- [ ] `curl PATCH .../detalhe -d '{"horarios":[{"dia":"segunda","inicio":"09:00","fim":"18:00"}]}'` persiste; GET confirma

---

#### BK-20 — CRUD registros_procedimento por paciente + mapa injetáveis JSONB

**O que**: Rotas: `GET /api/pacientes/{id}/registros`, `POST /api/pacientes/{id}/registros`, `GET /api/pacientes/{id}/registros/{rid}`, `PATCH /api/pacientes/{id}/registros/{rid}`, `DELETE /api/pacientes/{id}/registros/{rid}`. Campo `mapa` é `JSONB` em `registros_procedimento`; armazenado e retornado opaco (sem validação de schema — estrutura definida pelo frontend).
**Onde**: `backend/internal/store/registros.go`, `backend/internal/handler/registros.go`
**Done when**:
- [ ] `curl POST /api/pacientes/{id}/registros -d '{"procedimento_id":"...","mapa":{"pontos":[],"substancias":[]}}' -b jar.txt` → 201
- [ ] `curl GET /api/pacientes/{id}/registros/{rid} -b jar.txt` → JSON com `mapa` presente
- [ ] DELETE → 204; `go vet ./...` limpo

---

#### BK-21 — orçamentos por paciente + orcamento_itens + total calculado

**O que**: Rotas: `GET|POST /api/pacientes/{id}/orcamentos`, `GET|PATCH|DELETE /api/pacientes/{id}/orcamentos/{oid}`, `POST|PATCH|DELETE /api/pacientes/{id}/orcamentos/{oid}/itens/{iid}`. Total recalculado no servidor aplicando a mesma fórmula de `web/src/lib/pacote-calc.ts` (subtotal por item com desconto unitário + desconto do orçamento), implementada em `backend/internal/calc/pacote.go`.
**Onde**: `backend/internal/calc/pacote.go`, `backend/internal/store/orcamentos.go`, `backend/internal/handler/orcamentos.go`
**Done when**:
- [ ] Criar orçamento com 2 itens (valores do seed); `curl GET .../orcamentos/{oid} -b jar.txt` → `total` bate com cálculo manual
- [ ] `go test ./internal/calc/...` → TestTotalOrcamento passa
- [ ] `go vet ./...` limpo

---

### M6 — Estoque Transacional

**Dep**: BK-16 (itens_estoque base), BK-20 (registros_procedimento base)
**Foco**: atomicidade garantida por transação; saldo nunca negativo.

---

#### BK-22 — baixa de estoque transacional + aviso saldo insuficiente

**O que**: Modificar `handler/registros.go` e `store/estoque.go`: ao `POST /api/pacientes/{id}/registros` com campos `injetavel_id` (UUID de `itens_estoque`) e `quantidade_usada` (float), dentro da transação RLS do middleware executar:

```sql
UPDATE itens_estoque
SET saldo_atual = saldo_atual - $delta
WHERE id = $injetavel_id
  AND clinica_id = current_setting('app.clinica_id')::uuid
  AND saldo_atual >= $delta
RETURNING saldo_atual
```

Se 0 linhas afetadas → rollback → HTTP 409 `{"erro":"saldo_insuficiente","item_id":"...","saldo_atual":N}`.

Ao `PATCH` (edição do registro existente): calcular `delta = nova_quantidade - quantidade_anterior`; se delta > 0 debitar, se delta < 0 creditar; mesma verificação de saldo para débito.

**Onde**: `backend/internal/handler/registros.go` (modificação de BK-20), `backend/internal/store/estoque.go`
**Done when**:
- [ ] Seed: item com `saldo_atual = 5`; `POST` com `quantidade_usada = 3` → 201; `GET /api/estoque/{id}` → `saldo_atual = 2`
- [ ] `POST` com `quantidade_usada = 3` (saldo agora 2) → 409 `{"erro":"saldo_insuficiente","saldo_atual":2}`
- [ ] `PATCH` do registro anterior de 3→1 → saldo volta a 4
- [ ] `go vet ./...` limpo

---

### M7 — Endpoints Computados

**Dep**: BK-13..22 (todos os recursos e transações prontos). BK-23, BK-24, BK-25, BK-26 são paralelas entre si.
**Foco**: agregar dados reais; portar cálculos de `financeiro-calc.ts` para Go.

---

#### BK-23 — GET /api/dashboard

**O que**: Agrega em uma query (ou multiple queries): `total_pacientes`, `agendamentos_hoje` (count com `data = CURRENT_DATE`), `receita_mes` (SUM de lançamentos de receita do mês corrente com `status = 'realizado'`), `procedimentos_mes` (count de registros do mês), `taxa_retorno` (% pacientes com ≥ 2 registros no mês, arredondado para 1 decimal).
**Onde**: `backend/internal/handler/dashboard.go`, `backend/internal/store/dashboard.go`
**Done when**:
- [ ] `curl localhost:8080/api/dashboard -b jar.txt` → 200 JSON
- [ ] `total_pacientes` bate com `SELECT count(*) FROM pacientes WHERE clinica_id = ...`
- [ ] `go vet ./...` limpo

---

#### BK-24 — GET /api/agenda/visao-geral + /api/agenda/relatorio

**O que**:
- `GET /api/agenda/visao-geral`: retorna `{"por_status":{"agendado":N,...},"rankings_profissional":[...],"rankings_procedimento":[...],"horarios_movimentados":[[hora,count],...]}`.
- `GET /api/agenda/relatorio`: lista paginada de agendamentos com filtros `?data_ini=YYYY-MM-DD&data_fim=YYYY-MM-DD&status=&profissional_id=`; retorna `{"data":[...],"total":N}`.

**Onde**: `backend/internal/handler/agenda.go`, `backend/internal/store/agenda.go`
**Done when**:
- [ ] `curl /api/agenda/visao-geral -b jar.txt` → JSON com chave `por_status` (objeto com os 5 status)
- [ ] `curl /api/agenda/relatorio?status=concluido -b jar.txt` → lista filtrada corretamente
- [ ] `go vet ./...` limpo

---

#### BK-25 — GET /api/financeiro/extrato + /competencia (portando financeiro-calc.ts)

**O que**:
- Portar funções puras de `web/src/lib/financeiro-calc.ts` para `backend/internal/calc/financeiro.go`: `FluxoRows`, `Percentual`, `SomaSaldos`, `TotalNode` (mesma lógica, tipagem Go).
- `GET /api/financeiro/extrato?data_ini=&data_fim=`: retorna `{"kpis":{"receitas_abertas":...,"receitas_realizadas":...,"despesas_abertas":...,"despesas_realizadas":...,"total_periodo":...},"data":[...]}`.
- `GET /api/financeiro/competencia?mes=YYYY-MM`: retorna `{"kpis":{...},"data":[...],"totais":{"bruto":...,"liquido":...}}`.

**Onde**: `backend/internal/calc/financeiro.go`, `backend/internal/calc/financeiro_test.go`, `backend/internal/handler/financeiro.go`, `backend/internal/store/financeiro.go`
**Done when**:
- [ ] `go test ./internal/calc/...` → `TestFluxoRows` valida encadeamento de saldo (saldo_final[N] = saldo_inicial[N+1])
- [ ] `curl /api/financeiro/extrato -b jar.txt` → KPIs presentes e numéricos
- [ ] Valores batem com cálculo manual sobre o seed
- [ ] `go vet ./...` limpo

---

#### BK-26 — GET /api/financeiro/fluxo + /categorias + /contas-receber + /contas-pagar + /comissoes

**O que**:
- `GET /api/financeiro/fluxo?granularidade=dia|mes&ref=YYYY-MM`: agrupa lançamentos por dia (se `dia`) ou por mês (se `mes`); aplica `FluxoRows` para encadear saldo; retorna array com campos `periodo`, `saldo_inicial`, `entrada`, `saida`, `lucro`, `saldo_final`.
- `GET /api/financeiro/categorias?mes=YYYY-MM`: retorna 2 árvores `receitas` e `despesas` com campos `percentual` (via `Percentual`) e `valor`; folhas + pais totalizados via `TotalNode`.
- `GET /api/financeiro/contas-receber?page=&limit=`: lançamentos com `tipo = 'receita'` paginados.
- `GET /api/financeiro/contas-pagar?page=&limit=`: lançamentos com `tipo = 'despesa'` paginados.
- `GET /api/financeiro/comissoes?status=aberto`: comissões por profissional com total.

**Onde**: `backend/internal/handler/financeiro.go` (adições), `backend/internal/store/financeiro.go` (adições)
**Done when**:
- [ ] `curl /api/financeiro/fluxo?granularidade=mes -b jar.txt` → array de 12 objetos (Jan–Dez); `saldo_final[N]` = `saldo_inicial[N+1]`
- [ ] `curl /api/financeiro/categorias -b jar.txt` → chaves `receitas` e `despesas` com `percentual` somando 100% dentro de cada grupo
- [ ] `go vet ./...` limpo

---

### M8 — Swap Frontend

**Dep**: BK-23..26 (todos os endpoints computados prontos). Tasks BK-27→28→29→30 são sequenciais (cada uma depende da anterior).
**Foco**: remover mock mutável; frontend busca dados reais sem quebrar interface existente.

---

#### BK-27 — criar web/src/lib/api-client.ts

**O que**: `web/src/lib/api-client.ts` exporta:
- `apiFetch<T>(path: string, options?: RequestInit): Promise<T>` — base URL de `NEXT_PUBLIC_API_URL` (default `http://localhost:8080`); `credentials: "include"`; lança `AuthError extends Error` em 401; lança `ApiError extends Error` com `status` e `body` em outros erros 4xx/5xx.
- `class AuthError extends Error`
- `class ApiError extends Error { status: number; body: unknown }`

**Onde**: `web/src/lib/api-client.ts` (novo)
**Done when**:
- [ ] `cd web && npx tsc --noEmit` limpo
- [ ] `npm run lint` limpo
- [ ] `apiFetch` é genérico, sem `any` injustificado, sem `// eslint-disable`

---

#### BK-28 — reimplementar create-collection.ts via API

**O que**: Reescrever `web/src/lib/data/create-collection.ts` mantendo **exatamente a mesma interface pública** (`Collection<T>`, `useCollection(store)`, `nextId()`). Implementação interna: `add` chama `apiFetch` POST; `update` chama PATCH; `remove` chama DELETE; `toggle` chama PATCH `/{id}/toggle`; `useCollection` usa `useState` + `useEffect` com fetch inicial e revalida após cada mutação. `web/src/lib/data/stores.ts` mapeia cada store para o path de API correspondente (`/api/pacientes`, `/api/procedimentos`, etc.).
**Onde**: `web/src/lib/data/create-collection.ts` (rewrite), `web/src/lib/data/stores.ts` (ajuste de configuração de path)
**Done when**:
- [ ] CRUD de procedimentos no browser funciona (cria, edita, exclui, toggle) contra a API Go
- [ ] `cd web && npx tsc --noEmit && npm run lint` limpos
- [ ] Nenhum componente consumidor mudou de interface (zero alterações em componentes de UI)

---

#### BK-29 — Server Components buscam dados computados via API

**O que**: Identificar com `grep -r "from.*lib/mock" web/src/app` todas as páginas Server Component que importam dados computados (dashboard KPIs, agenda visão-geral, financeiro extrato/fluxo/categorias). Substituir cada import de mock por `await apiFetch(...)` com tipagem correta. Manter `Suspense` e tratamento de erro (`notFound()` ou `redirect('/login')` em `AuthError`).
**Onde**: Páginas Server Component afetadas (descobrir com grep acima)
**Done when**:
- [ ] `cd web && npx tsc --noEmit && npm run lint` limpos
- [ ] Abrir `localhost:3000` com API Go rodando → KPIs do dashboard mostram dados reais (não mock)
- [ ] Nenhum erro no console do browser

---

#### BK-30 — remover dependência de mock.ts para dados mutáveis

**O que**: Auditar `web/src/lib/mock.ts`; remover todos os exports de dados mutáveis que agora vêm da API (arrays de procedimentos, pacientes, profissionais, fornecedores, itens_estoque, etc.). **Manter**: tipos TypeScript exportados para uso no frontend; constantes de UI imutáveis (ex.: `weekDays`, `statusColors`, `statusDot`); dados que são puramente de apresentação sem equivalente na API. Corrigir todos os importadores que foram quebrados.
**Onde**: `web/src/lib/mock.ts`; importadores identificados via `grep -r "from.*lib/mock" web/src`
**Done when**:
- [ ] `grep -r "from.*lib/mock" web/src --include="*.ts" --include="*.tsx"` retorna apenas imports de tipos ou constantes de UI (não de arrays de dados)
- [ ] `cd web && npx tsc --noEmit && npm run lint` limpos
- [ ] `npm run build` verde

---

### M9 — Fecho

**Dep**: BK-30 (swap completo). BK-31 e BK-32 são paralelas; BK-33 aguarda ambas.
**Foco**: documentação, STATE atualizado e gate final limpo.

---

#### BK-31 — README backend

**O que**: `backend/README.md` com seções:
1. **Pré-requisitos**: Go 1.22+, projeto Supabase (PostgreSQL)
2. **Variáveis de ambiente**: `DATABASE_URL` (connection string Supabase), `PORT` (padrão 8080), `SESSION_SECRET` (string aleatória ≥ 32 chars)
3. **Migrations**: `go run ./cmd/migrate up` (idempotente); `go run ./cmd/migrate down` para reverter
4. **Seed**: incluído na migration 003; re-executar se necessário com `go run ./cmd/migrate up`
5. **Executar**: `go run ./cmd/server`
6. **Testar**: `go test ./...`

**Onde**: `backend/README.md`
**Done when**:
- [ ] Seguir o README do zero num terminal limpo (sem histórico) → servidor sobe
- [ ] `curl localhost:8080/api/health` → 200

---

#### BK-32 — atualizar .specs/project/STATE.md

**O que**: Em `.specs/project/STATE.md`:
- Tabela "Próximos passos": marcar `T6` como `done`
- Seção "Concluído": adicionar parágrafo sobre backend-go (stack: Go net/http + pgx/v5 + Supabase; endpoints: auth, CRUD cadastros, sub-recursos, estoque transacional, computados; RLS por clinica_id; swap frontend sem mock mutável)
- Seção "Sessão / retomada": atualizar com estado atual

**Onde**: `.specs/project/STATE.md`
**Done when**:
- [ ] `T6` aparece como `done` na tabela com `Owner` vazio
- [ ] Seção "Concluído" tem entrada "Feature **backend-go**"

---

#### BK-33 — smoke test final

**O que**: Sequência de verificação manual (anotar resultados):
1. `cd backend && go build ./... && go vet ./...` → 0 erros
2. `go run ./cmd/migrate up` (idempotente) → sem erro
3. `go run ./cmd/server &`
4. `curl -s localhost:8080/api/health` → 200 `{"status":"ok"}`
5. `curl -s -X POST localhost:8080/api/auth/login -H 'Content-Type: application/json' -d '{"email":"lucsbasto@gmail.com","senha":"..."}' -c /tmp/smoke.txt` → 200
6. `curl -s localhost:8080/api/pacientes -b /tmp/smoke.txt` → 200 com lista
7. `curl -s localhost:8080/api/dashboard -b /tmp/smoke.txt` → 200 com KPIs
8. `kill %1` (servidor) → exit limpo
9. `cd web && npx tsc --noEmit && npm run lint` → 0 erros

**Onde**: nenhum arquivo novo — execução e anotação
**Done when**:
- [ ] Todos os 9 passos acima retornam 0 / HTTP 200
- [ ] Zero erros de compilação Go ou TypeScript

---

## Execution Plan

```
M1 (sequencial)
  BK-1 → BK-2 → BK-3
    └── M2 (sequencial)
          BK-4 → BK-5 → BK-6 → BK-7
            └── M3 (sequencial)
                  BK-8 → BK-9 → BK-10 → BK-11
                    └── M4 (BK-12 primeiro, depois BK-13..18 paralelos)
                          BK-12 → [BK-13 | BK-14 | BK-15 | BK-16 | BK-17 | BK-18]
                            └── M5 (paralelas)
                                  [BK-19 | BK-20 | BK-21]
                                    └── M6 (aguarda BK-16 + BK-20)
                                          BK-22
                                            └── M7 (paralelas)
                                                  [BK-23 | BK-24 | BK-25 | BK-26]
                                                    └── M8 (sequencial)
                                                          BK-27 → BK-28 → BK-29 → BK-30
                                                            └── M9 ([BK-31 | BK-32] → BK-33)
```

**Tasks paralelas dentro do milestone:**
- M4: BK-13, BK-14, BK-15, BK-16, BK-17, BK-18 (arquivos distintos, sem conflito de merge)
- M5: BK-19, BK-20, BK-21
- M7: BK-23, BK-24, BK-25, BK-26
- M9: BK-31, BK-32 (BK-33 aguarda ambas)

---

## Cobertura de rastreabilidade

| RF (spec.md) | Task |
|---|---|
| BK-RF-01 módulo Go + deps | BK-1 |
| BK-RF-02 pool pgx + config env | BK-1 |
| BK-RF-03 servidor HTTP ServeMux | BK-2 |
| BK-RF-04 health check | BK-3 |
| BK-RF-05 runner migrations | BK-4 |
| BK-RF-06 schema núcleo | BK-5 |
| BK-RF-07 RLS policies | BK-6 |
| BK-RF-08 seed dados mock | BK-7 |
| BK-RF-09 hash argon2id | BK-8 |
| BK-RF-10 login/sessão/cookie | BK-9 |
| BK-RF-11 middleware auth + SET LOCAL | BK-10 |
| BK-RF-12 logout + me | BK-11 |
| BK-RF-13 helper CRUD genérico | BK-12 |
| BK-RF-14 CRUD pacientes | BK-13 |
| BK-RF-15 CRUD profissionais + fornecedores | BK-14 |
| BK-RF-16 CRUD procedimentos + pacotes | BK-15 |
| BK-RF-17 CRUD itens_estoque | BK-16 |
| BK-RF-18 CRUD financeiro cadastros | BK-17 |
| BK-RF-19 CRUD fichas + modelos | BK-18 |
| BK-RF-20 profissional detalhe rico | BK-19 |
| BK-RF-21 registros_procedimento + mapa JSONB | BK-20 |
| BK-RF-22 orçamentos + itens + calc | BK-21 |
| BK-RF-23 baixa estoque transacional por delta | BK-22 |
| BK-RF-24 aviso saldo insuficiente (409) | BK-22 |
| BK-RF-25 dashboard KPIs | BK-23 |
| BK-RF-26 agenda visão-geral + relatório | BK-24 |
| BK-RF-27 extrato + competência + calc Go | BK-25 |
| BK-RF-28 fluxo + categorias + cr/cp + comissões | BK-26 |
| BK-RF-29 api-client.ts | BK-27 |
| BK-RF-30 create-collection via API | BK-28 |
| BK-RF-31 Server Components via apiFetch | BK-29 |
| BK-RF-32 remover mock mutável | BK-30 |
| BK-RF-33 README backend | BK-31 |
| BK-RF-34 STATE atualizado | BK-32 |
| BK-RF-35 smoke test final | BK-33 |

35 RFs mapeados — 33 tasks — cobertura total.
