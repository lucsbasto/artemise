# Backend Go — Clínica Experts

API HTTP em Go (stdlib `net/http` + `pgx/v5`) que substitui o mock do frontend por
persistência real em Postgres, com isolamento multi-clínica via Row Level Security.

## Pré-requisitos

- Go 1.22+ (testado com 1.26)
- Postgres 16 — via `docker-compose.yml` na raiz do repo (role `app_role`, não-superusuário)

## Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste. Principais:

| Var | Padrão | Descrição |
|---|---|---|
| `DATABASE_URL` | — (obrigatória) | conexão Postgres. Local: `postgres://app_role:app_secret@localhost:5432/artemise?sslmode=disable` |
| `PORT` | `8080` | porta HTTP |
| `APP_ENV` | `dev` | `dev`/`prod`. `prod` ativa `Secure` no cookie de sessão |
| `SESSION_TTL_H` | `720` | validade da sessão em horas (30 dias) |
| `ARGON2_TIME` / `ARGON2_MEMORY` / `ARGON2_THREADS` | `1` / `65536` / `4` | parâmetros do hash argon2id |

## Subir o banco (Docker)

Na raiz do repositório:

```bash
docker compose up -d db
```

O init script (`backend/docker/init/01-app-role.sql`) cria o role `app_role`
(não-superusuário, dono do schema — necessário para que o `FORCE ROW LEVEL SECURITY`
realmente isole tenants) e habilita `pgcrypto`.

## Migrations

O runner próprio aplica `migrations/NNN_*.sql` (controle em `schema_migrations`):

```bash
cd backend
DATABASE_URL=postgres://app_role:app_secret@localhost:5432/artemise?sslmode=disable go run ./cmd/migrate up    # aplica pendentes
DATABASE_URL=... go run ./cmd/migrate down  # reverte (ordem inversa)
```

- `001_schema.sql` — todas as tabelas + triggers `atualizado_em`
- `002_rls.sql` — `ENABLE` + `FORCE ROW LEVEL SECURITY` e policies por `clinica_id`
- `003_seed.sql` — dados iniciais do mock (clínica, admin, paciente Clara, procedimentos,
  estoque, métodos de pagamento, categorias, fichas). Idempotente (`ON CONFLICT DO NOTHING`).

**Usuário seed**: `lucsbasto@gmail.com` / senha `senha123` (perfil `admin`).

## Conexão: admin vs runtime (Supabase)

Em Supabase, RLS só isola se o servidor conecta como role **NOBYPASSRLS**. Por isso há
duas conexões (ambas via **Session pooler**, porta 5432 — a conexão direta é IPv6-only;
NÃO usar o Transaction pooler 6543, que quebra migrations e `SET LOCAL`):

| Uso | Role | Quando |
|---|---|---|
| **Runtime** (`cmd/server`) | `app_role` (NOBYPASSRLS, sem CREATE) | `DATABASE_URL` no `.env` aponta aqui |
| **Admin** (`cmd/migrate up/down`, provisionamento) | `postgres.<ref>` (tem BYPASSRLS + CREATE) | URL comentada no `.env` |

⚠️ **Migrations rodam com a URL admin**, não `app_role` (ele não tem `CREATE`):

```bash
cd backend
DATABASE_URL=postgresql://postgres.<ref>:<senha>@aws-N-<região>.pooler.supabase.com:5432/postgres?sslmode=require go run ./cmd/migrate up
```

**Provisionar `app_role` num projeto novo** (rodar uma vez como admin no SQL editor):

```sql
CREATE ROLE app_role LOGIN PASSWORD '<senha-forte>' NOSUPERUSER NOCREATEROLE NOBYPASSRLS;
GRANT USAGE ON SCHEMA public TO app_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO app_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO app_role;
```

`app_role` é NÃO-dono das tabelas: como NOBYPASSRLS, já cai nas policies do `ENABLE RLS`
(não precisa `FORCE`, que só vale pro dono). Verificado: clínica errada → 0 rows.

## Executar

```bash
cd backend
DATABASE_URL=... go run ./cmd/server
# loga "db ok" e sobe em :8080; SIGTERM/SIGINT → "shutdown ok"
curl -s localhost:8080/api/health   # {"status":"ok","ts":"..."}
```

## Testar

```bash
cd backend
go build ./... && go vet ./...
go test ./...   # auth (argon2) + domain (fluxo, comissão, pacote, estoque delta)
```

## Arquitetura

```
cmd/server   — entrypoint HTTP (ServeMux 1.22, graceful shutdown)
cmd/migrate  — runner de migrations
internal/
  config     — leitura de env
  db         — pgxpool + runner
  auth       — argon2id (hash/verify), sessões
  app        — App{Pool,Cfg}, middleware (SessionResolver + RLS tx via SET LOCAL), UserFrom/TxFrom
  http       — router.go (registra todos os recursos), handlers/*
  store      — queries pgx por entidade (todas via tx do request → RLS)
  domain     — structs (camelCase) + cálculos puros (financeiro, comissão, pacote, estoque)
  respond    — helpers JSON/erro
migrations   — SQL versionado
```

Cada request autenticado abre uma transação e executa
`SET LOCAL app.clinica_id/user_id/perfil_acesso`; as policies RLS filtram por
`current_setting('app.clinica_id')`. Nenhum handler usa o pool diretamente.
