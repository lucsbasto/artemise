# Backend Go — Clínica Experts: Documento de Design

**Fase**: Design (TLC Spec-Driven)
**Data**: 2026-06-26
**Status**: Rascunho inicial

---

## 1. Visão Arquitetural

### 1.1 Contexto

SaaS multi-tenant para clínicas estéticas. Cada clínica é um tenant isolado (`clinica_id`). O frontend Next.js 16 (App Router) hoje consome dados de `web/src/lib/mock.ts` via stores de sessão (`Collection<T>`). O backend substitui integralmente esse mock, mantendo a interface `Collection<T>` inalterada no cliente — apenas sua implementação muda de array in-memory para chamadas HTTP.

### 1.2 Diagrama de camadas

```
┌────────────────────────────────────────────┐
│  Next.js 16 (App Router) — web/            │
│  Server Components ──► fetch server-side   │
│  Client Components ──► api-client.ts       │
│                         (Collection HTTP)  │
└────────────────────┬───────────────────────┘
                     │ HTTP/JSON (REST)
                     ▼
┌────────────────────────────────────────────┐
│  Go HTTP Server — backend/                 │
│  net/http + http.ServeMux (Go 1.22+)      │
│  ┌──────────────────────────────────────┐  │
│  │ internal/http  (router, middleware,  │  │
│  │                handlers)             │  │
│  ├──────────────────────────────────────┤  │
│  │ internal/store  (queries pgx/pool)   │  │
│  ├──────────────────────────────────────┤  │
│  │ internal/domain (structs, regras)    │  │
│  ├──────────────────────────────────────┤  │
│  │ internal/auth   (argon2id, sessões)  │  │
│  ├──────────────────────────────────────┤  │
│  │ internal/db     (pool, migrate)      │  │
│  └──────────────────────────────────────┘  │
└────────────────────┬───────────────────────┘
                     │ pgx/v5 (pgxpool)
                     ▼
┌────────────────────────────────────────────┐
│  Postgres (Supabase)                       │
│  Row Level Security por clinica_id         │
│  Role autenticada (não service-role)       │
└────────────────────────────────────────────┘
```

### 1.3 Fluxo de request autenticado

```
Request HTTP
  → Middleware SessionResolver
      → lê cookie "session_token"
      → SELECT usuario_id, clinica_id FROM sessions WHERE token=$1 AND expira_em > now()
      → injeta {usuarioID, clinicaID, perfilAcesso} no context
  → Handler
      → pool.BeginTx()
      → SET LOCAL app.clinica_id = '<uuid>'
      → SET LOCAL app.user_id    = '<uuid>'
      → queries normais (RLS filtra automaticamente)
      → Commit / Rollback
  → JSON response
```

---

## 2. Decisões de Arquitetura

### D-1: Go stdlib puro para HTTP

**Decisão**: `net/http` + `http.ServeMux` (Go 1.22+). Zero framework web (sem Gin, Echo, Chi).

**Justificativa**: Go 1.22 introduziu padrões de rota com método e parâmetros (`"GET /api/pacientes/{id}"`) que eliminam a principal vantagem dos frameworks leves. A stdlib é a dependência mais estável possível, sem risco de abandono ou breaking change de terceiro. O overhead é irrelevante para o volume de uma clínica estética.

**Implicação**: Middleware empilhado manualmente como `http.Handler` wrappers (pattern `func(next http.Handler) http.Handler`).

---

### D-2: Dependências externas mínimas

**Decisão**: Apenas `jackc/pgx/v5` (pgxpool) e `golang.org/x/crypto` (argon2id). Nenhuma outra dep.

**Justificativa**: YAGNI. ORM introduz N+1 silencioso e dificulta queries de agregação financeira. `database/sql` com `pgx` como driver funcionaria, mas pgxpool oferece typed scanning via `pgx.CollectRows` + `pgx.RowToStructByName` sem reflection pesada.

**O que fica fora**: GORM, sqlx, sqlc, gorilla/mux, zerolog, viper. Logging via `log/slog` (stdlib desde Go 1.21).

---

### D-3: Postgres no Supabase, migrations SQL puras

**Decisão**: Arquivos `backend/migrations/NNN_nome.sql` aplicados por runner próprio em Go. Tabela `schema_migrations(version TEXT PRIMARY KEY, aplicado_em TIMESTAMPTZ)`.

**Justificativa**: Ferramentas externas (goose, migrate) adicionam dep, convenções de nomenclatura e modo de execução que podem conflitar com o ambiente Supabase. Um runner de ~80 linhas em Go que lê `migrations/*.sql` em ordem lexicográfica e controla a tabela é totalmente auditável.

**Runner**: `cmd/migrate/main.go` (binário separado). Aplica idempotentemente — skip se version já existe em `schema_migrations`.

---

### D-4: Auth por cookie httpOnly + tabela sessions

**Decisão**: Login gera token `crypto/rand` (32 bytes, hex), persiste em `sessions`, devolve via `Set-Cookie: session_token=<token>; HttpOnly; SameSite=Lax; Path=/; Secure`. Sem JWT.

**Justificativa**: JWT requer rotação de secret, biblioteca de parse e não permite revogação imediata. Cookie httpOnly protege contra XSS. SameSite=Lax protege contra CSRF para operações de mutação (POST/PATCH/DELETE). Sessão é revogada deletando a linha — simples, auditável.

**Expiração**: 30 dias por default, renovável a cada request (sliding expiration via UPDATE sessions SET expira_em = now() + interval '30 days').

---

### D-5: Row Level Security por clinica_id via SET LOCAL

**Decisão**: Backend conecta com role Postgres com permissões restritas (não `postgres`/service-role). Por request abre transação e executa:

```sql
SET LOCAL app.clinica_id = '<uuid>';
SET LOCAL app.user_id    = '<uuid>';
```

Policies RLS usam `current_setting('app.clinica_id')`.

**Justificativa**: RLS como última linha de defesa garante que um bug no handler nunca vaze dados de outro tenant — mesmo que o handler esqueça o filtro `WHERE clinica_id = $n`. SET LOCAL é restrito à transação, sem leak entre requests no pool.

**Trade-off registrado**: Ver seção 9 (Riscos).

---

### D-6: JSON encoding/decoding nativo com tags camelCase

**Decisão**: `encoding/json` stdlib. Structs Go com tag `json:"camelCase"` casando exatamente os tipos TypeScript do frontend.

**Justificativa**: Nenhuma lib de serialização adiciona valor suficiente para justificar dependência. As tags já são o mecanismo oficial.

**Convenção**: Campos opcionais como ponteiro (`*string`, `*time.Time`) para distinguir "não enviado" de zero-value; `omitempty` em respostas onde faz sentido.

---

### D-7: Baixa de estoque dentro da transação do registro

**Decisão**: Ao criar/editar `registros_procedimento` com `usaMapa=true`, a baixa de `itens_estoque.saldo` ocorre na mesma transação de banco, sem filas ou eventos assíncronos.

**Justificativa**: Atomicidade é exigida pela natureza da operação (registro injetável + consumo de substância). Volume de uma clínica não justifica complexidade de mensageria. Rollback automático reverte ambas as operações em caso de erro.

---

### D-8: Layout monorepo — backend/ ao lado de web/

**Decisão**: `artemise/backend/` com `go.mod` próprio (`module github.com/clinicaexperts/backend`).

**Justificativa**: Compartilhar repo facilita deploy coordenado e referências cruzadas de spec. Módulo Go separado porque frontend e backend têm toolchains distintos e nunca se importam mutuamente.

---

## 3. Schema do Banco (DDL)

> Convenções: `id UUID DEFAULT gen_random_uuid() PRIMARY KEY`, `clinica_id UUID NOT NULL REFERENCES clinicas(id)`, `criado_em TIMESTAMPTZ DEFAULT now()`, `atualizado_em TIMESTAMPTZ DEFAULT now()`. Trigger `set_atualizado_em` atualiza o campo automaticamente.

### 3.1 Tenant e Usuários

```sql
CREATE TABLE clinicas (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  criado_em   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE usuarios (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id    UUID NOT NULL REFERENCES clinicas(id),
  email         TEXT NOT NULL,
  senha_hash    TEXT NOT NULL,          -- argon2id
  perfil_acesso TEXT NOT NULL CHECK (perfil_acesso IN ('admin','recepção','profissional')),
  ativo         BOOLEAN NOT NULL DEFAULT true,
  criado_em     TIMESTAMPTZ DEFAULT now(),
  atualizado_em TIMESTAMPTZ DEFAULT now(),
  UNIQUE (clinica_id, email)
);

CREATE TABLE sessions (
  token       TEXT PRIMARY KEY,         -- hex 32 bytes
  usuario_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  expira_em   TIMESTAMPTZ NOT NULL,
  criado_em   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX ON sessions(usuario_id);
CREATE INDEX ON sessions(expira_em);
```

### 3.2 Pacientes

```sql
CREATE TABLE pacientes (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id            UUID NOT NULL REFERENCES clinicas(id),
  nome                  TEXT NOT NULL,
  tipo                  TEXT NOT NULL DEFAULT 'Paciente',
  etiquetas             TEXT[] NOT NULL DEFAULT '{}',
  identificador         TEXT,           -- telefone principal
  ativo                 BOOLEAN NOT NULL DEFAULT true,
  sexo                  TEXT,
  data_nascimento       DATE,
  cpf                   TEXT,
  email                 TEXT,
  endereco              TEXT,
  observacoes           TEXT,
  recebe_notificacoes   BOOLEAN NOT NULL DEFAULT true,
  criado_em             TIMESTAMPTZ DEFAULT now(),
  atualizado_em         TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX ON pacientes(clinica_id);
CREATE INDEX ON pacientes(clinica_id, ativo);
```

### 3.3 Profissionais

```sql
-- Identificação básica (compartilha estrutura com fornecedores via "contato")
CREATE TABLE profissionais (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id    UUID NOT NULL REFERENCES clinicas(id),
  nome          TEXT NOT NULL,
  tipo          TEXT NOT NULL DEFAULT 'Profissional',
  etiquetas     TEXT[] NOT NULL DEFAULT '{}',
  identificador TEXT,
  ativo         BOOLEAN NOT NULL DEFAULT true,
  avatar_tone   TEXT NOT NULL DEFAULT 'brand' CHECK (avatar_tone IN ('brand','green')),
  criado_em     TIMESTAMPTZ DEFAULT now(),
  atualizado_em TIMESTAMPTZ DEFAULT now()
);

-- Detalhe rico (1:1 com profissionais)
CREATE TABLE profissional_detalhe (
  profissional_id UUID PRIMARY KEY REFERENCES profissionais(id) ON DELETE CASCADE,
  clinica_id      UUID NOT NULL REFERENCES clinicas(id),
  cpf             TEXT,
  data_nascimento DATE,
  telefone        TEXT,
  email           TEXT,
  conselho        TEXT,                 -- CRM, CRO, CREFITO, COREN, CRBM, CRF, Outro
  registro        TEXT,
  uf_registro     CHAR(2),
  especialidade   TEXT,
  certificacoes   TEXT[] NOT NULL DEFAULT '{}',
  vinculo         TEXT CHECK (vinculo IN ('CLT','PJ','Autônomo','Sócio')),
  chave_pix       TEXT,
  perfil_acesso   TEXT CHECK (perfil_acesso IN ('admin','recepção','profissional'))
);

CREATE TABLE profissional_horarios (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id      UUID NOT NULL REFERENCES clinicas(id),
  profissional_id UUID NOT NULL REFERENCES profissionais(id) ON DELETE CASCADE,
  dia_semana      SMALLINT NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
  inicio          TIME NOT NULL,
  fim             TIME NOT NULL
);

CREATE TABLE profissional_comissoes (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id      UUID NOT NULL REFERENCES clinicas(id),
  profissional_id UUID NOT NULL REFERENCES profissionais(id) ON DELETE CASCADE,
  procedimento_id UUID REFERENCES procedimentos(id), -- NULL = regra padrão
  tipo            TEXT NOT NULL CHECK (tipo IN ('percentual','fixo')),
  valor           NUMERIC(10,2) NOT NULL
);

-- Procedimentos que o profissional executa
CREATE TABLE profissional_procedimentos (
  profissional_id UUID NOT NULL REFERENCES profissionais(id) ON DELETE CASCADE,
  procedimento_id UUID NOT NULL REFERENCES procedimentos(id) ON DELETE CASCADE,
  clinica_id      UUID NOT NULL REFERENCES clinicas(id),
  PRIMARY KEY (profissional_id, procedimento_id)
);
```

### 3.4 Fornecedores

```sql
CREATE TABLE fornecedores (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id    UUID NOT NULL REFERENCES clinicas(id),
  nome          TEXT NOT NULL,
  tipo          TEXT NOT NULL DEFAULT 'Fornecedor',
  etiquetas     TEXT[] NOT NULL DEFAULT '{}',
  identificador TEXT,
  ativo         BOOLEAN NOT NULL DEFAULT true,
  avatar_tone   TEXT NOT NULL DEFAULT 'brand',
  criado_em     TIMESTAMPTZ DEFAULT now(),
  atualizado_em TIMESTAMPTZ DEFAULT now()
);
```

### 3.5 Procedimentos e Pacotes

```sql
CREATE TABLE procedimentos (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id  UUID NOT NULL REFERENCES clinicas(id),
  nome        TEXT NOT NULL,
  categoria   TEXT,                     -- Facial, Corporal, Injetáveis, Estética
  duracao_min SMALLINT NOT NULL DEFAULT 60,
  valor       NUMERIC(10,2) NOT NULL DEFAULT 0,
  ativo       BOOLEAN NOT NULL DEFAULT true,
  usa_mapa    BOOLEAN NOT NULL DEFAULT false,
  cor         TEXT,                     -- hex da cor no calendário
  criado_em   TIMESTAMPTZ DEFAULT now(),
  atualizado_em TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE pacotes (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id  UUID NOT NULL REFERENCES clinicas(id),
  descricao   TEXT NOT NULL,
  valor_total NUMERIC(10,2) NOT NULL DEFAULT 0,
  validade    TEXT NOT NULL DEFAULT 'Ilimitado',
  ativo       BOOLEAN NOT NULL DEFAULT true,
  criado_em   TIMESTAMPTZ DEFAULT now(),
  atualizado_em TIMESTAMPTZ DEFAULT now()
);
```

### 3.6 Estoque

```sql
CREATE TABLE itens_estoque (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id  UUID NOT NULL REFERENCES clinicas(id),
  nome        TEXT NOT NULL,
  sku         TEXT,
  categoria   TEXT,
  unidade     TEXT NOT NULL DEFAULT 'un',
  saldo       NUMERIC(12,3) NOT NULL DEFAULT 0,
  minimo      NUMERIC(12,3) NOT NULL DEFAULT 0,
  custo       NUMERIC(10,2) NOT NULL DEFAULT 0,
  criado_em   TIMESTAMPTZ DEFAULT now(),
  atualizado_em TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX ON itens_estoque(clinica_id);
```

### 3.7 Registros de Procedimentos (ficha do paciente)

```sql
CREATE TABLE registros_procedimento (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id      UUID NOT NULL REFERENCES clinicas(id),
  paciente_id     UUID NOT NULL REFERENCES pacientes(id),
  procedimento    TEXT NOT NULL,        -- nome snapshot (não FK, para histórico)
  profissional    TEXT NOT NULL,        -- nome snapshot
  profissional_id UUID REFERENCES profissionais(id),
  procedimento_id UUID REFERENCES procedimentos(id),
  data            DATE NOT NULL,
  status          TEXT NOT NULL DEFAULT 'agendado'
                    CHECK (status IN ('realizado','agendado','cancelado')),
  valor           NUMERIC(10,2) NOT NULL DEFAULT 0,
  observacoes     TEXT,
  usa_mapa        BOOLEAN NOT NULL DEFAULT false,
  mapa            JSONB,               -- FichaInjetaveis serializada
  criado_em       TIMESTAMPTZ DEFAULT now(),
  atualizado_em   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX ON registros_procedimento(clinica_id, paciente_id);
CREATE INDEX ON registros_procedimento(clinica_id, data);
```

**Estrutura JSONB do campo `mapa`** (espelha `FichaInjetaveis` do frontend):

```json
{
  "pontos": [
    {
      "id": "uuid",
      "substanciaId": "item_estoque_id",
      "modo": "selecionavel",
      "x": 0.42,
      "y": 0.31,
      "regiaoId": "testa",
      "unidades": 20
    }
  ],
  "rastreioPorSub": {
    "item_estoque_id": {
      "marca": "Allergan",
      "numeroLote": "ABC123",
      "dataDiluicao": "2026-06-20",
      "volumeDiluicao": "2ml",
      "dataValidade": "2026-12-01"
    }
  },
  "relatorio": "Texto livre do relatório."
}
```

### 3.8 Agenda

```sql
CREATE TABLE eventos_agenda (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id      UUID NOT NULL REFERENCES clinicas(id),
  paciente_id     UUID REFERENCES pacientes(id),
  profissional_id UUID REFERENCES profissionais(id),
  procedimento_id UUID REFERENCES procedimentos(id),
  paciente        TEXT,                 -- snapshot para display
  profissional    TEXT,                 -- snapshot
  procedimento    TEXT,                 -- snapshot
  inicio          TIMESTAMPTZ NOT NULL,
  fim             TIMESTAMPTZ NOT NULL,
  status          TEXT NOT NULL DEFAULT 'Agendado'
                    CHECK (status IN ('Agendado','Confirmado','Não compareceu','Concluído','Cancelado')),
  tipo            TEXT NOT NULL DEFAULT 'Agendamento',
  valor           NUMERIC(10,2),
  observacoes     TEXT,
  criado_em       TIMESTAMPTZ DEFAULT now(),
  atualizado_em   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX ON eventos_agenda(clinica_id, inicio);
CREATE INDEX ON eventos_agenda(clinica_id, paciente_id);
```

### 3.9 Financeiro

```sql
CREATE TABLE contas_financeiras (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id  UUID NOT NULL REFERENCES clinicas(id),
  nome        TEXT NOT NULL,
  tipo        TEXT NOT NULL,            -- Caixa, Conta Corrente, Carteira
  saldo       NUMERIC(12,2) NOT NULL DEFAULT 0,
  icon        TEXT NOT NULL DEFAULT 'bank',
  ativo       BOOLEAN NOT NULL DEFAULT true,
  criado_em   TIMESTAMPTZ DEFAULT now(),
  atualizado_em TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE categorias_contas (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id  UUID NOT NULL REFERENCES clinicas(id),
  descricao   TEXT NOT NULL,
  ativo       BOOLEAN NOT NULL DEFAULT true,
  parent_id   UUID REFERENCES categorias_contas(id), -- auto-relacional (2 níveis)
  criado_em   TIMESTAMPTZ DEFAULT now(),
  atualizado_em TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE metodos_pagamento (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id  UUID NOT NULL REFERENCES clinicas(id),
  descricao   TEXT NOT NULL,
  tipo        TEXT NOT NULL,            -- Dinheiro, PIX, Cartão, Boleto, Transferência
  marca       TEXT NOT NULL DEFAULT '—',
  ativo       BOOLEAN NOT NULL DEFAULT true,
  criado_em   TIMESTAMPTZ DEFAULT now(),
  atualizado_em TIMESTAMPTZ DEFAULT now()
);

-- FONTE ÚNICA dos relatórios financeiros computados
CREATE TABLE lancamentos_financeiros (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id      UUID NOT NULL REFERENCES clinicas(id),
  tipo            TEXT NOT NULL CHECK (tipo IN ('receita','despesa')),
  descricao       TEXT NOT NULL,
  categoria_id    UUID REFERENCES categorias_contas(id),
  metodo_id       UUID REFERENCES metodos_pagamento(id),
  conta_id        UUID REFERENCES contas_financeiras(id),
  paciente_id     UUID REFERENCES pacientes(id),
  fornecedor_id   UUID REFERENCES fornecedores(id),
  vencimento      DATE NOT NULL,
  liquidacao      DATE,                 -- NULL = em aberto
  situacao        TEXT NOT NULL DEFAULT 'Em aberto'
                    CHECK (situacao IN ('Recebido','Pago','Em atraso','Em aberto')),
  valor           NUMERIC(10,2) NOT NULL,
  criado_em       TIMESTAMPTZ DEFAULT now(),
  atualizado_em   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX ON lancamentos_financeiros(clinica_id, vencimento);
CREATE INDEX ON lancamentos_financeiros(clinica_id, tipo, situacao);
CREATE INDEX ON lancamentos_financeiros(clinica_id, paciente_id);
```

### 3.10 Orçamentos

```sql
CREATE TABLE orcamentos (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id  UUID NOT NULL REFERENCES clinicas(id),
  paciente_id UUID REFERENCES pacientes(id),
  vendedor_id UUID REFERENCES usuarios(id),
  cliente     TEXT NOT NULL,           -- snapshot
  vendedor    TEXT NOT NULL,           -- snapshot
  data        DATE NOT NULL,
  total       NUMERIC(10,2) NOT NULL DEFAULT 0,
  criado_em   TIMESTAMPTZ DEFAULT now(),
  atualizado_em TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE orcamento_itens (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id  UUID NOT NULL REFERENCES clinicas(id),
  orcamento_id UUID NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
  nome        TEXT NOT NULL,
  qtd         SMALLINT NOT NULL DEFAULT 1,
  valor       NUMERIC(10,2) NOT NULL,
  desconto    NUMERIC(10,2) NOT NULL DEFAULT 0,
  total       NUMERIC(10,2) NOT NULL
);
```

### 3.11 Configurações (fichas, modelos)

```sql
CREATE TABLE fichas_atendimento (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id  UUID NOT NULL REFERENCES clinicas(id),
  nome        TEXT NOT NULL,
  ativo       BOOLEAN NOT NULL DEFAULT true,
  criado_em   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE modelos_documento (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id  UUID NOT NULL REFERENCES clinicas(id),
  nome        TEXT NOT NULL,
  tipo        TEXT NOT NULL,
  ativo       BOOLEAN NOT NULL DEFAULT true,
  criado_em   TIMESTAMPTZ DEFAULT now()
);
```

### 3.12 RLS — Policies de exemplo

```sql
-- Habilitar RLS em todas as tabelas tenant-scoped
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lancamentos_financeiros ENABLE ROW LEVEL SECURITY;
-- (repetir para todas as tabelas com clinica_id)

-- Role para a aplicação Go (criada no Supabase com permissões limitadas)
CREATE ROLE app_role NOINHERIT;
GRANT USAGE ON SCHEMA public TO app_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_role;

-- Policy: SELECT só retorna linhas do tenant corrente
CREATE POLICY tenant_isolation_select ON pacientes
  FOR SELECT TO app_role
  USING (clinica_id = current_setting('app.clinica_id')::uuid);

-- Policy: INSERT exige clinica_id do contexto
CREATE POLICY tenant_isolation_insert ON pacientes
  FOR INSERT TO app_role
  WITH CHECK (clinica_id = current_setting('app.clinica_id')::uuid);

-- Policy: UPDATE e DELETE apenas no próprio tenant
CREATE POLICY tenant_isolation_update ON pacientes
  FOR UPDATE TO app_role
  USING (clinica_id = current_setting('app.clinica_id')::uuid);

CREATE POLICY tenant_isolation_delete ON pacientes
  FOR DELETE TO app_role
  USING (clinica_id = current_setting('app.clinica_id')::uuid);

-- Exemplo de policy com checagem de perfil (apenas admin pode deletar usuários)
CREATE POLICY admin_only_delete ON usuarios
  FOR DELETE TO app_role
  USING (
    clinica_id = current_setting('app.clinica_id')::uuid
    AND current_setting('app.perfil_acesso') = 'admin'
  );
```

**Trigger de atualização de timestamp** (aplicar em todas as tabelas com `atualizado_em`):

```sql
CREATE OR REPLACE FUNCTION set_atualizado_em()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.atualizado_em = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_pacientes_atualizado_em
  BEFORE UPDATE ON pacientes
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();
```

---

## 4. Layout de Diretórios

```
backend/
├── cmd/
│   ├── api/
│   │   └── main.go          # Entrypoint: lê env, abre pool, monta router, serve
│   └── migrate/
│       └── main.go          # Runner de migrations (binário separado)
├── internal/
│   ├── http/
│   │   ├── router.go        # http.ServeMux — registra todas as rotas
│   │   ├── middleware.go    # SessionResolver, CORS, logging, recover
│   │   ├── respond.go       # helpers: JSON(), Error(), NotFound()
│   │   └── handlers/
│   │       ├── auth.go      # /api/auth/*
│   │       ├── pacientes.go
│   │       ├── profissionais.go
│   │       ├── agenda.go
│   │       ├── financeiro.go
│   │       ├── estoque.go
│   │       ├── procedimentos.go
│   │       ├── orcamentos.go
│   │       ├── dashboard.go
│   │       └── config.go    # fichas, modelos, métodos, categorias, contas
│   ├── store/
│   │   ├── pacientes.go     # queries pgx para pacientes
│   │   ├── profissionais.go
│   │   ├── agenda.go
│   │   ├── financeiro.go
│   │   ├── estoque.go
│   │   └── ...              # um arquivo por entidade
│   ├── domain/
│   │   ├── types.go         # structs Go (espelham JSON do frontend)
│   │   ├── estoque.go       # BaixarEstoque(), calcularDelta()
│   │   ├── financeiro.go    # FluxoRows(), SomaSaldos(), TotalNode()
│   │   └── comissao.go      # CalcComissao()
│   ├── auth/
│   │   ├── hash.go          # HashSenha(), VerificarSenha() — argon2id
│   │   └── session.go       # GerarToken(), CriarSession(), RevogarSession()
│   └── db/
│       ├── pool.go          # Abre pgxpool a partir de DATABASE_URL
│       └── migrate.go       # Runner: lê migrations/, aplica pendentes
├── migrations/
│   ├── 001_init_clinicas_usuarios.sql
│   ├── 002_pacientes.sql
│   ├── 003_profissionais.sql
│   ├── 004_procedimentos_pacotes.sql
│   ├── 005_estoque.sql
│   ├── 006_agenda.sql
│   ├── 007_financeiro.sql
│   ├── 008_orcamentos.sql
│   ├── 009_config.sql
│   ├── 010_rls_policies.sql
│   └── 011_seed_dev.sql     # seed apenas para ambiente dev (guard por env var)
├── go.mod
└── go.sum
```

---

## 5. Contratos de API

### 5.1 Convenções gerais

- Base URL: `http://localhost:8080` (dev) / `https://api.clinicaexperts.com.br` (prod)
- Autenticação: Cookie `session_token` (httpOnly). Todas as rotas exceto `/api/auth/login` exigem sessão válida.
- Content-Type: `application/json` em todas as requests e responses.
- Datas: ISO 8601 (`"2026-06-22T14:00:00Z"`) no wire; o frontend formata para exibição.
- Paginação: `?page=1&pageSize=20` (default 20). Resposta inclui `{ total, page, pageSize, items: [...] }`.
- Busca: `?q=texto` — ILIKE `%texto%` nos campos relevantes (nome, identificador).
- Ordenação: `?sort=nome&order=asc`.

**Formato de erro padrão:**

```json
{
  "error": "mensagem legível",
  "code":  "VALIDATION_ERROR",
  "field": "email"
}
```

**Códigos HTTP:**
- `200 OK` — leitura ou update
- `201 Created` — criação (body = recurso criado)
- `204 No Content` — delete
- `400 Bad Request` — validação / payload inválido
- `401 Unauthorized` — sem sessão
- `403 Forbidden` — perfil sem permissão
- `404 Not Found` — recurso inexistente ou de outro tenant
- `409 Conflict` — duplicata (email, slug)
- `422 Unprocessable Entity` — regra de domínio violada (ex.: saldo insuficiente)
- `500 Internal Server Error` — erro não tratado

---

### 5.2 Tabela de recursos CRUD

| Recurso                        | Métodos                                            |
|--------------------------------|----------------------------------------------------|
| `/api/pacientes`               | GET (list), POST                                   |
| `/api/pacientes/{id}`          | GET, PATCH, DELETE                                 |
| `/api/pacientes/{id}/toggle`   | PATCH (inverte `ativo`)                            |
| `/api/pacientes/{id}/registros`| GET (list), POST                                   |
| `/api/pacientes/{id}/orcamentos`| GET (list), POST                                  |
| `/api/profissionais`           | GET (list), POST                                   |
| `/api/profissionais/{id}`      | GET (detalhe rico), PATCH, DELETE                  |
| `/api/profissionais/{id}/toggle`| PATCH                                             |
| `/api/fornecedores`            | GET, POST                                          |
| `/api/fornecedores/{id}`       | GET, PATCH, DELETE                                 |
| `/api/fornecedores/{id}/toggle`| PATCH                                             |
| `/api/procedimentos`           | GET, POST                                          |
| `/api/procedimentos/{id}`      | GET, PATCH, DELETE                                 |
| `/api/procedimentos/{id}/toggle`| PATCH                                             |
| `/api/pacotes`                 | GET, POST                                          |
| `/api/pacotes/{id}`            | GET, PATCH, DELETE                                 |
| `/api/pacotes/{id}/toggle`     | PATCH                                             |
| `/api/itens-estoque`           | GET, POST                                          |
| `/api/itens-estoque/{id}`      | GET, PATCH, DELETE                                 |
| `/api/contas-financeiras`      | GET, POST                                          |
| `/api/contas-financeiras/{id}` | GET, PATCH, DELETE                                 |
| `/api/categorias-contas`       | GET, POST                                          |
| `/api/categorias-contas/{id}`  | GET, PATCH, DELETE                                 |
| `/api/categorias-contas/{id}/toggle`| PATCH                                        |
| `/api/metodos-pagamento`       | GET, POST                                          |
| `/api/metodos-pagamento/{id}`  | GET, PATCH, DELETE                                 |
| `/api/metodos-pagamento/{id}/toggle`| PATCH                                        |
| `/api/fichas-atendimento`      | GET, POST                                          |
| `/api/fichas-atendimento/{id}` | GET, PATCH, DELETE                                 |
| `/api/fichas-atendimento/{id}/toggle`| PATCH                                       |
| `/api/modelos-documento`       | GET, POST                                          |
| `/api/modelos-documento/{id}`  | GET, PATCH, DELETE                                 |
| `/api/modelos-documento/{id}/toggle`| PATCH                                        |
| `/api/lancamentos-financeiros` | GET (list), POST                                   |
| `/api/lancamentos-financeiros/{id}`| GET, PATCH, DELETE                           |
| `/api/orcamentos`              | GET, POST                                          |
| `/api/orcamentos/{id}`         | GET, PATCH, DELETE                                 |
| `/api/eventos-agenda`          | GET (list com ?inicio=&fim=), POST                 |
| `/api/eventos-agenda/{id}`     | GET, PATCH, DELETE                                 |

**Mapeamento 1:1 com `Collection<T>`:**

| Método Collection | HTTP                                    |
|-------------------|-----------------------------------------|
| `getSnapshot()`   | `GET /api/{recurso}` → `.items`         |
| `add(item)`       | `POST /api/{recurso}`                   |
| `update(id, patch)`| `PATCH /api/{recurso}/{id}`            |
| `remove(id)`      | `DELETE /api/{recurso}/{id}` → 204      |
| `toggle(id, key)` | `PATCH /api/{recurso}/{id}/toggle` + `{ key }` no body |
| `set(next)`       | Não exposto diretamente (usado para reordenação local) |

---

### 5.3 Exemplos de request/response

#### Auth — Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email":  "lucsbasto@gmail.com",
  "senha":  "senha-secreta"
}
```

**200 OK:**
```json
{
  "id":           "550e8400-e29b-41d4-a716-446655440000",
  "nome":         "Lucas Bastos",
  "email":        "lucsbasto@gmail.com",
  "perfilAcesso": "admin",
  "clinicaId":    "a1b2c3d4-..."
}
```
+ `Set-Cookie: session_token=<hex64>; HttpOnly; SameSite=Lax; Path=/; Secure; Max-Age=2592000`

**401 (credenciais inválidas):**
```json
{ "error": "Email ou senha incorretos", "code": "INVALID_CREDENTIALS" }
```

---

#### Pacientes — List

```
GET /api/pacientes?q=clara&page=1&pageSize=20&sort=nome&order=asc
```

**200 OK:**
```json
{
  "total":    1,
  "page":     1,
  "pageSize": 20,
  "items": [
    {
      "id":                 "uuid",
      "nome":               "Clara Ribeiro",
      "tipo":               "Paciente",
      "etiquetas":          [],
      "identificador":      "+55 (11) 99999-9999",
      "ativo":              true,
      "sexo":               "Feminino",
      "dataNascimento":     "1991-12-02",
      "cpf":                "315.772.070-84",
      "email":              "clara@exemplo.com",
      "recebeNotificacoes": false,
      "criadoEm":           "2026-06-22T15:00:43Z"
    }
  ]
}
```

---

#### Dashboard — Computado

```
GET /api/dashboard?inicio=2026-06-18&fim=2026-06-22
```

**200 OK:**
```json
{
  "balance": {
    "saldoRealizado":    1831,
    "saldoPrevisto":      781,
    "entradasRealizadas": 4370,
    "entradasPrevistas":  6200,
    "saidasRealizadas":  -2539,
    "saidasPrevistas":   -5419,
    "periodo":           "18/06/2026 - 22/06/2026"
  },
  "cashflowDaily": [
    {
      "label":             "18 Jun",
      "entradas":          1200,
      "entradasPrevistas": 1500,
      "saidas":            -300,
      "saidasPrevistas":   -700,
      "saldo":              900,
      "saldoPrevisto":      800
    }
  ],
  "next24h": [
    {
      "paciente":     "Clara Ribeiro",
      "procedimento": "Limpeza de Pele Profunda",
      "horario":      "14:00 - 15:00"
    }
  ],
  "reports": {
    "porProfissional":    [{ "label": "LB", "total": 1 }],
    "diasMovimentados":   [{ "dia": "S", "total": 1 }],
    "statusAgendamento":  { "total": 1, "label": "Agendamentos", "legenda": "1 agendamentos no período" },
    "pacientesPorSexo":   { "total": 1, "label": "Pacientes",    "legenda": "1 pacientes no período" },
    "faturamentoComparado": [{ "label": "18 Jun", "valor": 3800 }]
  }
}
```

---

### 5.4 Endpoints computados — Lógica de agregação SQL

#### `GET /api/dashboard`

```sql
-- balance: realizados no período
SELECT
  COALESCE(SUM(valor) FILTER (WHERE tipo='receita' AND situacao IN ('Recebido','Pago')), 0) AS entradas_realizadas,
  COALESCE(SUM(valor) FILTER (WHERE tipo='despesa' AND situacao IN ('Recebido','Pago')), 0) AS saidas_realizadas,
  COALESCE(SUM(valor) FILTER (WHERE tipo='receita'), 0) AS entradas_previstas,
  COALESCE(SUM(valor) FILTER (WHERE tipo='despesa'), 0) AS saidas_previstas
FROM lancamentos_financeiros
WHERE clinica_id = $1 AND vencimento BETWEEN $2 AND $3;

-- cashflowDaily: agrupar por dia
SELECT
  vencimento::date AS dia,
  COALESCE(SUM(valor) FILTER (WHERE tipo='receita' AND situacao IN ('Recebido','Pago')), 0) AS entradas,
  COALESCE(SUM(valor) FILTER (WHERE tipo='despesa' AND situacao IN ('Recebido','Pago')), 0) AS saidas
FROM lancamentos_financeiros
WHERE clinica_id = $1 AND vencimento BETWEEN $2 AND $3
GROUP BY dia ORDER BY dia;
-- Go encadeia os saldos com domain.FluxoRows()

-- next24h: próximos eventos nas próximas 24h
SELECT e.inicio, e.fim, e.paciente, e.procedimento
FROM eventos_agenda e
WHERE e.clinica_id = $1
  AND e.inicio BETWEEN now() AND now() + interval '24 hours'
  AND e.status NOT IN ('Cancelado')
ORDER BY e.inicio LIMIT 10;
```

---

#### `GET /api/financeiro/fluxo?periodo=dia|mes`

```sql
-- periodo=dia: agrupar por data dentro do mês corrente
SELECT
  vencimento::date AS label,
  COALESCE(SUM(valor) FILTER (WHERE tipo='receita'), 0) AS entradas,
  COALESCE(SUM(valor) FILTER (WHERE tipo='despesa'), 0) AS saidas
FROM lancamentos_financeiros
WHERE clinica_id = $1
  AND date_trunc('month', vencimento) = date_trunc('month', $2::date)
GROUP BY label ORDER BY label;

-- periodo=mes: agrupar por mês dentro do ano
SELECT
  date_trunc('month', vencimento) AS label,
  COALESCE(SUM(valor) FILTER (WHERE tipo='receita'), 0) AS entradas,
  COALESCE(SUM(valor) FILTER (WHERE tipo='despesa'), 0) AS saidas
FROM lancamentos_financeiros
WHERE clinica_id = $1
  AND date_trunc('year', vencimento) = date_trunc('year', $2::date)
GROUP BY label ORDER BY label;
-- Go aplica domain.FluxoRows() para encadear saldo
```

---

#### `GET /api/financeiro/categorias`

```sql
SELECT
  cc.id, cc.descricao, cc.parent_id,
  COALESCE(SUM(lf.valor), 0) AS valor
FROM categorias_contas cc
LEFT JOIN lancamentos_financeiros lf
  ON lf.categoria_id = cc.id
  AND lf.clinica_id = $1
  AND lf.vencimento BETWEEN $2 AND $3
WHERE cc.clinica_id = $1
GROUP BY cc.id, cc.descricao, cc.parent_id
ORDER BY cc.parent_id NULLS FIRST, cc.descricao;
-- Go monta a árvore pai→filhos em memória
```

---

#### `GET /api/comissoes`

```sql
SELECT
  p.nome AS profissional,
  rp.procedimento AS referencia,
  rp.data,
  rp.valor AS base,
  COALESCE(
    -- regra específica para o procedimento
    (SELECT pc.valor FROM profissional_comissoes pc
     WHERE pc.profissional_id = rp.profissional_id
       AND pc.procedimento_id = rp.procedimento_id
       AND pc.clinica_id = $1 LIMIT 1),
    -- regra padrão (procedimento_id IS NULL)
    (SELECT pc.valor FROM profissional_comissoes pc
     WHERE pc.profissional_id = rp.profissional_id
       AND pc.procedimento_id IS NULL
       AND pc.clinica_id = $1 LIMIT 1),
    0
  ) AS percentual
FROM registros_procedimento rp
JOIN profissionais p ON p.id = rp.profissional_id
WHERE rp.clinica_id = $1
  AND rp.status = 'realizado'
  AND rp.data BETWEEN $2 AND $3;
-- Go calcula valor = base * percentual / 100 (ou fixo)
```

---

#### `GET /api/agenda/visao-geral`

```sql
SELECT
  COUNT(*) AS total_agendamentos,
  COUNT(*) FILTER (WHERE status = 'Concluído') AS concluidos,
  -- ociosidade = 1 - (horas_ocupadas / horas_disponiveis)
  -- horas_disponiveis calculado a partir de profissional_horarios no período
  COUNT(DISTINCT paciente_id) AS total_pacientes
FROM eventos_agenda
WHERE clinica_id = $1
  AND inicio BETWEEN $2 AND $3;
-- KPIs de frequência, dias movimentados, heatmap de horários: GROUP BY em Go
```

---

#### `GET /api/financeiro/contas-receber` e `GET /api/financeiro/contas-pagar`

```sql
SELECT
  l.*,
  cc.descricao AS categoria_nome,
  p.nome AS paciente_nome
FROM lancamentos_financeiros l
LEFT JOIN categorias_contas cc ON cc.id = l.categoria_id
LEFT JOIN pacientes p ON p.id = l.paciente_id
WHERE l.clinica_id = $1
  AND l.tipo = 'receita'          -- 'despesa' para contas-pagar
  AND l.vencimento BETWEEN $2 AND $3
ORDER BY l.vencimento, l.criado_em;
-- KPIs: SUM por situacao (Recebido/Em atraso/Em aberto)
```

---

## 6. Lógica de Domínio

### 6.1 Baixa de estoque transacional (injetáveis)

Localização: `internal/domain/estoque.go` + handler `POST /api/pacientes/{id}/registros`.

**Fluxo criar registro com mapa:**

```
1. Decodificar body → RegistroProcedimento com mapa != nil
2. Abrir transação
3. SET LOCAL app.clinica_id / app.user_id
4. Se editando (PATCH): buscar registro anterior → obter mapa_anterior
5. calcularDelta(mapa_anterior, mapa_novo):
   - Para cada substanciaId: somarUnidades(pontos) por substância
   - delta[substanciaId] = unidades_novas - unidades_anteriores (0 em criação)
6. Para cada substanciaId com delta != 0:
   a. SELECT saldo FROM itens_estoque WHERE id=$sub FOR UPDATE
   b. Se (saldo - delta) < 0: ROLLBACK → 422 "Saldo insuficiente para {nome}"
   c. UPDATE itens_estoque SET saldo = saldo - delta WHERE id=$sub
7. INSERT/UPDATE registros_procedimento com mapa serializado
8. COMMIT
```

```go
// domain/estoque.go
type DeltaEstoque map[string]float64  // substanciaId → delta unidades

func calcularDelta(anterior, novo *FichaInjetaveis) DeltaEstoque {
    delta := DeltaEstoque{}
    somarPontos := func(f *FichaInjetaveis, sinal float64) {
        if f == nil { return }
        for _, p := range f.Pontos {
            delta[p.SubstanciaID] += sinal * p.Unidades
        }
    }
    somarPontos(anterior, -1)
    somarPontos(novo, +1)
    return delta
}
```

**Aviso de saldo insuficiente** retorna `422` com body:
```json
{
  "error": "Saldo insuficiente para 'Toxina Botulínica 100ui'. Disponível: 10 ui, necessário: 20 ui.",
  "code":  "INSUFFICIENT_STOCK",
  "item":  "uuid-do-item"
}
```

---

### 6.2 Fluxo de caixa encadeado

Localização: `internal/domain/financeiro.go`.

Porta direta de `web/src/lib/financeiro-calc.ts`:

```go
type CashflowPoint struct {
    Label             string  `json:"label"`
    Entradas          float64 `json:"entradas"`
    EntradasPrevistas float64 `json:"entradasPrevistas"`
    Saidas            float64 `json:"saidas"`
    SaidasPrevistas   float64 `json:"saidasPrevistas"`
    Saldo             float64 `json:"saldo"`
    SaldoPrevisto     float64 `json:"saldoPrevisto"`
}

type FluxoRow struct {
    Label        string  `json:"label"`
    SaldoInicial float64 `json:"saldoInicial"`
    Entrada      float64 `json:"entrada"`
    Saida        float64 `json:"saida"`
    Lucro        float64 `json:"lucro"`
    SaldoFinal   float64 `json:"saldoFinal"`
}

func FluxoRows(points []CashflowPoint, saldoInicial float64) []FluxoRow {
    inicial := saldoInicial
    rows := make([]FluxoRow, len(points))
    for i, p := range points {
        entrada := p.Entradas
        saida := math.Abs(p.Saidas)
        lucro := entrada - saida
        saldoFinal := inicial + lucro
        rows[i] = FluxoRow{
            Label: p.Label, SaldoInicial: inicial,
            Entrada: entrada, Saida: saida,
            Lucro: lucro, SaldoFinal: saldoFinal,
        }
        inicial = saldoFinal
    }
    return rows
}
```

---

### 6.3 Cálculo de comissão

Localização: `internal/domain/comissao.go`.

```go
type RegraComissao struct {
    ProcedimentoID *string // nil = padrão
    Tipo           string  // "percentual" | "fixo"
    Valor          float64
}

// CalcComissao retorna o valor de comissão para um lançamento.
// Prioridade: regra específica do procedimento > regra padrão (ProcedimentoID nil).
func CalcComissao(base float64, regras []RegraComissao, procedimentoID string) float64 {
    var padrao *RegraComissao
    for i := range regras {
        r := &regras[i]
        if r.ProcedimentoID != nil && *r.ProcedimentoID == procedimentoID {
            return aplicar(base, r)
        }
        if r.ProcedimentoID == nil {
            padrao = r
        }
    }
    if padrao != nil {
        return aplicar(base, padrao)
    }
    return 0
}

func aplicar(base float64, r *RegraComissao) float64 {
    if r.Tipo == "percentual" {
        return base * r.Valor / 100
    }
    return r.Valor
}
```

---

### 6.4 Cálculo de pacote/orçamento

Localização: `internal/domain/financeiro.go`. Porta de `web/src/lib/pacote-calc.ts`:

```go
func ItemTotal(qtd int, valor, descontoUn float64, descontoTipo string) float64 {
    var descEfetivo float64
    if descontoTipo == "%" {
        descEfetivo = valor * descontoUn / 100
    } else {
        descEfetivo = descontoUn
    }
    liquido := math.Max(0, valor-descEfetivo)
    return float64(qtd) * liquido
}

func ValorTotal(itens []OrcamentoItemDraft, descontoGlobal float64, descontoTipo string) float64 {
    sub := 0.0
    for _, it := range itens {
        sub += ItemTotal(it.Qtd, it.Valor, it.DescontoUn, it.DescontoTipo)
    }
    var descEfetivo float64
    if descontoTipo == "%" {
        descEfetivo = sub * descontoGlobal / 100
    } else {
        descEfetivo = descontoGlobal
    }
    return math.Max(0, sub-descEfetivo)
}
```

---

## 7. Estratégia de Migrations e Seed

### 7.1 Runner de migrations

`internal/db/migrate.go`:

```go
func RunMigrations(ctx context.Context, pool *pgxpool.Pool, dir string) error {
    // 1. Criar tabela schema_migrations se não existir
    // 2. Listar *.sql em dir/, ordenar lexicograficamente
    // 3. Para cada arquivo:
    //    a. SELECT 1 FROM schema_migrations WHERE version = $arquivo
    //    b. Se já aplicado: skip
    //    c. BEGIN
    //    d. Executar conteúdo do arquivo
    //    e. INSERT INTO schema_migrations(version, aplicado_em) VALUES($arquivo, now())
    //    f. COMMIT (ou ROLLBACK e retornar erro com nome do arquivo)
}
```

Invocado no `cmd/api/main.go` antes de iniciar o servidor, e disponível como binário standalone `cmd/migrate`.

### 7.2 Seed de desenvolvimento

`migrations/011_seed_dev.sql`:

```sql
DO $$ BEGIN
  IF current_setting('app.env', true) != 'dev' THEN RETURN; END IF;
  -- Insere clinica, usuario admin, pacientes, procedimentos, estoque
  -- exatamente com os dados do web/src/lib/mock.ts
  -- Uso: psql $DATABASE_URL -v "app.env=dev" -f 011_seed_dev.sql
END $$;
```

Alternativa: `cmd/seed/main.go` que lê `mock.ts` inferido (ou JSON extraído) e popula via pgx. Protegido por `if os.Getenv("APP_ENV") != "dev" { log.Fatal(...) }`.

### 7.3 Variáveis de ambiente

```
DATABASE_URL=postgres://app_role:senha@db.supabase.co:5432/postgres?sslmode=require
SESSION_SECRET=hex-aleatório-para-assinar-nada (sessions são opacas)
PORT=8080
APP_ENV=dev|prod
ARGON2_TIME=1
ARGON2_MEMORY=65536
ARGON2_THREADS=4
```

---

## 8. Plano de Swap do Frontend

### 8.1 Princípio

A interface `Collection<T>` (`getSnapshot / subscribe / add / update / remove / toggle / set`) permanece **idêntica**. Apenas a implementação troca de array in-memory para chamadas HTTP. Os componentes de UI não tocam.

### 8.2 `api-client.ts` (novo)

`web/src/lib/data/api-client.ts`:

```typescript
// Wrapper fetch tipado. Lança ApiError em respostas 4xx/5xx.
export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "include",    // envia cookie de sessão
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error ?? "Erro desconhecido", body.code);
  }
  return res.json();
}
```

### 8.3 `create-collection.ts` reimplementado

Mantém a mesma assinatura exportada. Internamente:

```typescript
export function createCollection<T extends WithId>(
  endpoint: string,           // ex: "/pacientes"
  seed: T[] = []              // opcional: hydration inicial SSR
): Collection<T> {
  let cache: T[] = seed;
  const subs = new Set<() => void>();
  const emit = () => subs.forEach((f) => f());

  // Hidratação assíncrona após mount (revalida cache)
  async function revalidate() {
    const { items } = await apiFetch<{ items: T[] }>(endpoint);
    cache = items;
    emit();
  }

  return {
    getSnapshot: () => cache,
    subscribe:   (cb) => { subs.add(cb); revalidate(); return () => subs.delete(cb); },
    add:  async (item) => { await apiFetch(endpoint, { method: "POST",   body: JSON.stringify(item) }); revalidate(); },
    update: async (id, patch) => { await apiFetch(`${endpoint}/${id}`, { method: "PATCH", body: JSON.stringify(patch) }); revalidate(); },
    remove: async (id) => { await apiFetch(`${endpoint}/${id}`, { method: "DELETE" }); revalidate(); },
    toggle: async (id, key) => { await apiFetch(`${endpoint}/${id}/toggle`, { method: "PATCH", body: JSON.stringify({ key }) }); revalidate(); },
    set:    async (next) => { cache = next; emit(); }, // reordenação local apenas
  };
}
```

**Nota**: `add/update/remove/toggle` retornam `Promise<void>` — a tipagem `Collection<T>` precisará aceitar `void | Promise<void>`. Alternativa: manter síncronos com optimistic update e rollback em erro.

### 8.4 Server Components

Componentes que hoje importam dados do mock diretamente (`import { procedimentos } from "@/lib/mock"`) passam a:

```typescript
// app/configuracoes/procedimentos/page.tsx (Server Component)
import { apiFetch } from "@/lib/data/api-client-server"; // versão sem credentials:include

export default async function ProcedimentosPage() {
  const { items } = await apiFetch<{ items: Procedimento[] }>("/procedimentos");
  // passa como prop para Client Components
}
```

`api-client-server.ts` usa `fetch` com `cache: "no-store"` e lê o cookie de sessão do header `Cookie` do request atual (via `cookies()` do Next.js).

### 8.5 Dados computados (dashboard, financeiro, agenda)

Páginas que hoje importam agregados estáticos do mock (`cashflowDaily`, `balance`, etc.) passam a Server Components que chamam `/api/dashboard`, `/api/financeiro/fluxo`, etc. no servidor, sem store.

### 8.6 Ordem de swap (por risco)

1. Auth (`/api/auth/login`, `/api/auth/me`) — pré-requisito de tudo
2. Recursos de configuração simples (procedimentos, pacotes, fichas, modelos, métodos, categorias, contas) — sem dependências complexas
3. Pacientes e profissionais — entidades centrais
4. Estoque e fornecedores
5. Agenda (eventos)
6. Financeiro CRUD (lançamentos)
7. Computados: dashboard, visão geral agenda, relatórios financeiros
8. Comissões e registros de procedimento com mapa (domínio mais complexo — estoque)

---

## 9. Riscos e Trade-offs

### R-1: RLS via SET LOCAL vs. filtro WHERE explícito

**Risco**: SET LOCAL funciona apenas dentro da transação. Se um handler executar queries fora de uma transação (auto-commit), o `app.clinica_id` não estará definido e a query retornará vazio (ou erro se `current_setting` for configurado como obrigatório).

**Mitigação**: Middleware `RequireTx` garante que toda requisição autenticada abre uma transação. Testar com `current_setting('app.clinica_id', false)` (segundo argumento = não lançar erro se ausente) e retornar erro explícito.

**Alternativa rejeitada**: Filtro WHERE explícito em todas as queries. Mais verboso, sem proteção contra esquecimento do dev. RLS é mais seguro como segunda linha.

---

### R-2: pgx vs. database/sql

**Trade-off**: `pgx/v5` direto (sem `database/sql` adapter) oferece `pgx.CollectRows` + `pgx.RowToStructByName` para scanning automático sem reflection pesada, além de suporte nativo a arrays Postgres (`TEXT[]`, `JSONB`). A desvantagem é o lock-in ao pgx — mas o vendor lock-in ao Postgres já existe por decisão de stack.

**Decisão**: pgx direto, sem adapter `database/sql`.

---

### R-3: Saldo de contas_financeiras denormalizado

**Risco**: `contas_financeiras.saldo` é atualizado a cada lançamento liquidado. Se um lançamento for editado retroativamente ou deletado, o saldo pode ficar inconsistente.

**Mitigação**: Trigger Postgres que recalcula o saldo via `SUM(valor) FILTER (WHERE liquidacao IS NOT NULL AND conta_id = NEW.conta_id)` a cada INSERT/UPDATE/DELETE em `lancamentos_financeiros`. Alternativamente, saldo é sempre computado on-demand (sem coluna denormalizada) — mais simples e correto, porém com uma query adicional na listagem de contas.

**Decisão inicial**: Computar saldo on-demand. Denormalizar apenas se performance exigir (improvável para volume de clínica).

---

### R-4: Paginação servidor vs. cliente

**Situação atual do mock**: todos os dados carregados em memória, paginação/filtro no cliente via `useListControls`.

**Risco de swap**: `Collection.getSnapshot()` retorna todos os itens — se o backend paginar, o contrato quebra.

**Mitigação**: `createCollection` reimplementado busca a página completa (até 1000 itens) no primeiro subscribe. Para recursos com grande volume (lançamentos financeiros), expor endpoint paginado separado consumido diretamente pelo Server Component ou por hook dedicado — não via `Collection`.

---

### R-5: Sessões sem JWT — escalabilidade horizontal

**Risco**: Com múltiplas instâncias Go, todas precisam ler da tabela `sessions` a cada request (1 SELECT por request autenticado).

**Mitigação**: A tabela `sessions` tem índice em `token` (PRIMARY KEY). O Supabase usa Postgres com connection pooling (PgBouncer) — latência de ~1ms por lookup é aceitável. Para o volume de uma clínica, essa não é uma limitação real.

**Escalabilidade futura**: Adicionar Redis como cache de sessão (SET token → usuario_id+clinica_id, TTL = 30min) se necessário, sem mudar a interface.

---

### R-6: JSONB do mapa de injetáveis sem validação de schema

**Risco**: Backend salva o JSONB do mapa sem validar a estrutura interna (pontos, rastreioPorSub). Um cliente mal-formado pode corromper o dado.

**Mitigação**: Deserializar para `domain.FichaInjetaveis` no handler antes de salvar. Se a deserialização falhar, retornar 400. A serialização de volta para JSONB usa a struct validada.

---

### R-7: Argon2id — custo de CPU no login

**Trade-off**: Argon2id com parâmetros seguros (time=1, memory=64MB, threads=4) leva ~300ms por hash. Aceitável para login, mas não para operações em batch.

**Configuração**: Parâmetros via variáveis de ambiente (`ARGON2_TIME`, `ARGON2_MEMORY`, `ARGON2_THREADS`) para ajuste por ambiente (dev pode usar valores menores).

---

*Documento gerado em 2026-06-26. Próxima fase: Tasks (breakdown em tarefas atômicas de implementação).*
