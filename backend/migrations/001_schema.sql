-- migrate:up

-- gen_random_uuid() é nativo no Postgres 13+; pgcrypto garante compat.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Trigger genérico para manter atualizado_em em UPDATE.
CREATE OR REPLACE FUNCTION set_atualizado_em()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- Tenant e usuários
-- ============================================================
CREATE TABLE clinicas (
  id        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome      TEXT NOT NULL,
  slug      TEXT NOT NULL UNIQUE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE usuarios (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id    UUID NOT NULL REFERENCES clinicas(id),
  nome          TEXT NOT NULL,
  email         TEXT NOT NULL,
  senha_hash    TEXT NOT NULL,
  perfil_acesso TEXT NOT NULL CHECK (perfil_acesso IN ('admin','recepção','profissional')),
  ativo         BOOLEAN NOT NULL DEFAULT true,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (clinica_id, email)
);
CREATE TRIGGER trg_usuarios_atualizado_em BEFORE UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

CREATE TABLE sessions (
  token      TEXT PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  expira_em  TIMESTAMPTZ NOT NULL,
  criado_em  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_sessions_usuario ON sessions(usuario_id);
CREATE INDEX idx_sessions_expira ON sessions(expira_em);

-- ============================================================
-- Pacientes
-- ============================================================
CREATE TABLE pacientes (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id          UUID NOT NULL REFERENCES clinicas(id),
  nome                TEXT NOT NULL,
  tipo                TEXT NOT NULL DEFAULT 'Paciente',
  etiquetas           TEXT[] NOT NULL DEFAULT '{}',
  identificador       TEXT,
  ativo               BOOLEAN NOT NULL DEFAULT true,
  sexo                TEXT,
  data_nascimento     DATE,
  cpf                 TEXT,
  email               TEXT,
  endereco            TEXT,
  observacoes         TEXT,
  recebe_notificacoes BOOLEAN NOT NULL DEFAULT true,
  criado_em           TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_pacientes_clinica ON pacientes(clinica_id);
CREATE INDEX idx_pacientes_clinica_ativo ON pacientes(clinica_id, ativo);
CREATE TRIGGER trg_pacientes_atualizado_em BEFORE UPDATE ON pacientes
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

-- ============================================================
-- Procedimentos e pacotes
-- ============================================================
CREATE TABLE procedimentos (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id    UUID NOT NULL REFERENCES clinicas(id),
  nome          TEXT NOT NULL,
  categoria     TEXT,
  duracao_min   SMALLINT NOT NULL DEFAULT 60,
  valor         NUMERIC(10,2) NOT NULL DEFAULT 0,
  ativo         BOOLEAN NOT NULL DEFAULT true,
  usa_mapa      BOOLEAN NOT NULL DEFAULT false,
  cor           TEXT,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_procedimentos_clinica ON procedimentos(clinica_id);
CREATE TRIGGER trg_procedimentos_atualizado_em BEFORE UPDATE ON procedimentos
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

CREATE TABLE pacotes (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id    UUID NOT NULL REFERENCES clinicas(id),
  descricao     TEXT NOT NULL,
  valor_total   NUMERIC(10,2) NOT NULL DEFAULT 0,
  validade      TEXT NOT NULL DEFAULT 'Ilimitado',
  ativo         BOOLEAN NOT NULL DEFAULT true,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_pacotes_clinica ON pacotes(clinica_id);
CREATE TRIGGER trg_pacotes_atualizado_em BEFORE UPDATE ON pacotes
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

CREATE TABLE pacote_itens (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id      UUID NOT NULL REFERENCES clinicas(id),
  pacote_id       UUID NOT NULL REFERENCES pacotes(id) ON DELETE CASCADE,
  nome            TEXT NOT NULL,
  procedimento_id UUID REFERENCES procedimentos(id),
  qtd             SMALLINT NOT NULL DEFAULT 1,
  preco_unitario  NUMERIC(10,2) NOT NULL DEFAULT 0,
  desconto        NUMERIC(10,2) NOT NULL DEFAULT 0,
  total           NUMERIC(10,2) NOT NULL DEFAULT 0
);
CREATE INDEX idx_pacote_itens_pacote ON pacote_itens(pacote_id);

-- ============================================================
-- Profissionais (identificação + detalhe rico)
-- ============================================================
CREATE TABLE profissionais (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id    UUID NOT NULL REFERENCES clinicas(id),
  nome          TEXT NOT NULL,
  tipo          TEXT NOT NULL DEFAULT 'Profissional',
  etiquetas     TEXT[] NOT NULL DEFAULT '{}',
  identificador TEXT,
  ativo         BOOLEAN NOT NULL DEFAULT true,
  avatar_tone   TEXT NOT NULL DEFAULT 'brand' CHECK (avatar_tone IN ('brand','green')),
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_profissionais_clinica ON profissionais(clinica_id);
CREATE TRIGGER trg_profissionais_atualizado_em BEFORE UPDATE ON profissionais
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

CREATE TABLE profissional_detalhe (
  profissional_id UUID PRIMARY KEY REFERENCES profissionais(id) ON DELETE CASCADE,
  clinica_id      UUID NOT NULL REFERENCES clinicas(id),
  cpf             TEXT,
  data_nascimento DATE,
  telefone        TEXT,
  email           TEXT,
  conselho        TEXT,
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
CREATE INDEX idx_prof_horarios_prof ON profissional_horarios(profissional_id);

CREATE TABLE profissional_comissoes (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id      UUID NOT NULL REFERENCES clinicas(id),
  profissional_id UUID NOT NULL REFERENCES profissionais(id) ON DELETE CASCADE,
  procedimento_id UUID REFERENCES procedimentos(id),
  tipo            TEXT NOT NULL CHECK (tipo IN ('percentual','fixo')),
  valor           NUMERIC(10,2) NOT NULL
);
CREATE INDEX idx_prof_comissoes_prof ON profissional_comissoes(profissional_id);

CREATE TABLE profissional_procedimentos (
  profissional_id UUID NOT NULL REFERENCES profissionais(id) ON DELETE CASCADE,
  procedimento_id UUID NOT NULL REFERENCES procedimentos(id) ON DELETE CASCADE,
  clinica_id      UUID NOT NULL REFERENCES clinicas(id),
  PRIMARY KEY (profissional_id, procedimento_id)
);

-- ============================================================
-- Fornecedores
-- ============================================================
CREATE TABLE fornecedores (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id    UUID NOT NULL REFERENCES clinicas(id),
  nome          TEXT NOT NULL,
  tipo          TEXT NOT NULL DEFAULT 'Fornecedor',
  etiquetas     TEXT[] NOT NULL DEFAULT '{}',
  identificador TEXT,
  ativo         BOOLEAN NOT NULL DEFAULT true,
  avatar_tone   TEXT NOT NULL DEFAULT 'brand',
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_fornecedores_clinica ON fornecedores(clinica_id);
CREATE TRIGGER trg_fornecedores_atualizado_em BEFORE UPDATE ON fornecedores
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

-- ============================================================
-- Estoque
-- ============================================================
CREATE TABLE itens_estoque (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id    UUID NOT NULL REFERENCES clinicas(id),
  nome          TEXT NOT NULL,
  sku           TEXT,
  categoria     TEXT,
  unidade       TEXT NOT NULL DEFAULT 'un',
  saldo         NUMERIC(12,3) NOT NULL DEFAULT 0,
  minimo        NUMERIC(12,3) NOT NULL DEFAULT 0,
  custo         NUMERIC(10,2) NOT NULL DEFAULT 0,
  ativo         BOOLEAN NOT NULL DEFAULT true,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_itens_estoque_clinica ON itens_estoque(clinica_id);
CREATE TRIGGER trg_itens_estoque_atualizado_em BEFORE UPDATE ON itens_estoque
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

-- ============================================================
-- Registros de procedimento (ficha do paciente)
-- ============================================================
CREATE TABLE registros_procedimento (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id      UUID NOT NULL REFERENCES clinicas(id),
  paciente_id     UUID NOT NULL REFERENCES pacientes(id),
  procedimento    TEXT NOT NULL,
  profissional    TEXT NOT NULL DEFAULT '',
  profissional_id UUID REFERENCES profissionais(id),
  procedimento_id UUID REFERENCES procedimentos(id),
  data            DATE NOT NULL,
  status          TEXT NOT NULL DEFAULT 'agendado'
                    CHECK (status IN ('realizado','agendado','cancelado')),
  valor           NUMERIC(10,2) NOT NULL DEFAULT 0,
  observacoes     TEXT,
  usa_mapa        BOOLEAN NOT NULL DEFAULT false,
  mapa            JSONB,
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_registros_clinica_paciente ON registros_procedimento(clinica_id, paciente_id);
CREATE INDEX idx_registros_clinica_data ON registros_procedimento(clinica_id, data);
CREATE TRIGGER trg_registros_atualizado_em BEFORE UPDATE ON registros_procedimento
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

-- ============================================================
-- Agenda
-- ============================================================
CREATE TABLE eventos_agenda (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id      UUID NOT NULL REFERENCES clinicas(id),
  paciente_id     UUID REFERENCES pacientes(id),
  profissional_id UUID REFERENCES profissionais(id),
  procedimento_id UUID REFERENCES procedimentos(id),
  paciente        TEXT,
  profissional    TEXT,
  procedimento    TEXT,
  inicio          TIMESTAMPTZ NOT NULL,
  fim             TIMESTAMPTZ NOT NULL,
  status          TEXT NOT NULL DEFAULT 'Agendado'
                    CHECK (status IN ('Agendado','Confirmado','Não compareceu','Concluído','Cancelado')),
  tipo            TEXT NOT NULL DEFAULT 'Agendamento',
  valor           NUMERIC(10,2),
  observacoes     TEXT,
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_eventos_clinica_inicio ON eventos_agenda(clinica_id, inicio);
CREATE INDEX idx_eventos_clinica_paciente ON eventos_agenda(clinica_id, paciente_id);
CREATE TRIGGER trg_eventos_atualizado_em BEFORE UPDATE ON eventos_agenda
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

-- ============================================================
-- Financeiro
-- ============================================================
CREATE TABLE contas_financeiras (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id    UUID NOT NULL REFERENCES clinicas(id),
  nome          TEXT NOT NULL,
  tipo          TEXT NOT NULL,
  saldo         NUMERIC(12,2) NOT NULL DEFAULT 0,
  icon          TEXT NOT NULL DEFAULT 'bank',
  ativo         BOOLEAN NOT NULL DEFAULT true,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_contas_clinica ON contas_financeiras(clinica_id);
CREATE TRIGGER trg_contas_atualizado_em BEFORE UPDATE ON contas_financeiras
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

CREATE TABLE categorias_contas (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id    UUID NOT NULL REFERENCES clinicas(id),
  descricao     TEXT NOT NULL,
  ativo         BOOLEAN NOT NULL DEFAULT true,
  parent_id     UUID REFERENCES categorias_contas(id),
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_categorias_clinica ON categorias_contas(clinica_id);
CREATE INDEX idx_categorias_parent ON categorias_contas(parent_id);
CREATE TRIGGER trg_categorias_atualizado_em BEFORE UPDATE ON categorias_contas
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

CREATE TABLE metodos_pagamento (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id    UUID NOT NULL REFERENCES clinicas(id),
  descricao     TEXT NOT NULL,
  tipo          TEXT NOT NULL,
  marca         TEXT NOT NULL DEFAULT '—',
  ativo         BOOLEAN NOT NULL DEFAULT true,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_metodos_clinica ON metodos_pagamento(clinica_id);
CREATE TRIGGER trg_metodos_atualizado_em BEFORE UPDATE ON metodos_pagamento
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

CREATE TABLE lancamentos_financeiros (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id    UUID NOT NULL REFERENCES clinicas(id),
  tipo          TEXT NOT NULL CHECK (tipo IN ('receita','despesa')),
  descricao     TEXT NOT NULL,
  categoria_id  UUID REFERENCES categorias_contas(id),
  metodo_id     UUID REFERENCES metodos_pagamento(id),
  conta_id      UUID REFERENCES contas_financeiras(id),
  paciente_id   UUID REFERENCES pacientes(id),
  fornecedor_id UUID REFERENCES fornecedores(id),
  vencimento    DATE NOT NULL,
  liquidacao    DATE,
  situacao      TEXT NOT NULL DEFAULT 'Em aberto'
                  CHECK (situacao IN ('Recebido','Pago','Em atraso','Em aberto')),
  valor         NUMERIC(10,2) NOT NULL,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_lancamentos_clinica_venc ON lancamentos_financeiros(clinica_id, vencimento);
CREATE INDEX idx_lancamentos_clinica_tipo_sit ON lancamentos_financeiros(clinica_id, tipo, situacao);
CREATE INDEX idx_lancamentos_clinica_paciente ON lancamentos_financeiros(clinica_id, paciente_id);
CREATE TRIGGER trg_lancamentos_atualizado_em BEFORE UPDATE ON lancamentos_financeiros
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

-- ============================================================
-- Orçamentos
-- ============================================================
CREATE TABLE orcamentos (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id    UUID NOT NULL REFERENCES clinicas(id),
  paciente_id   UUID REFERENCES pacientes(id),
  vendedor_id   UUID REFERENCES usuarios(id),
  cliente       TEXT NOT NULL DEFAULT '',
  vendedor      TEXT NOT NULL DEFAULT '',
  data          DATE NOT NULL,
  total         NUMERIC(10,2) NOT NULL DEFAULT 0,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_orcamentos_clinica ON orcamentos(clinica_id);
CREATE INDEX idx_orcamentos_paciente ON orcamentos(paciente_id);
CREATE TRIGGER trg_orcamentos_atualizado_em BEFORE UPDATE ON orcamentos
  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();

CREATE TABLE orcamento_itens (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id   UUID NOT NULL REFERENCES clinicas(id),
  orcamento_id UUID NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
  nome         TEXT NOT NULL,
  qtd          SMALLINT NOT NULL DEFAULT 1,
  valor        NUMERIC(10,2) NOT NULL,
  desconto     NUMERIC(10,2) NOT NULL DEFAULT 0,
  total        NUMERIC(10,2) NOT NULL DEFAULT 0
);
CREATE INDEX idx_orcamento_itens_orcamento ON orcamento_itens(orcamento_id);

-- ============================================================
-- Configurações (fichas, modelos)
-- ============================================================
CREATE TABLE fichas_atendimento (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id UUID NOT NULL REFERENCES clinicas(id),
  nome       TEXT NOT NULL,
  ativo      BOOLEAN NOT NULL DEFAULT true,
  criado_em  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_fichas_clinica ON fichas_atendimento(clinica_id);

CREATE TABLE modelos_documento (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id UUID NOT NULL REFERENCES clinicas(id),
  nome       TEXT NOT NULL,
  tipo       TEXT NOT NULL,
  ativo      BOOLEAN NOT NULL DEFAULT true,
  criado_em  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_modelos_clinica ON modelos_documento(clinica_id);

-- migrate:down

DROP TABLE IF EXISTS modelos_documento CASCADE;
DROP TABLE IF EXISTS fichas_atendimento CASCADE;
DROP TABLE IF EXISTS orcamento_itens CASCADE;
DROP TABLE IF EXISTS orcamentos CASCADE;
DROP TABLE IF EXISTS lancamentos_financeiros CASCADE;
DROP TABLE IF EXISTS metodos_pagamento CASCADE;
DROP TABLE IF EXISTS categorias_contas CASCADE;
DROP TABLE IF EXISTS contas_financeiras CASCADE;
DROP TABLE IF EXISTS eventos_agenda CASCADE;
DROP TABLE IF EXISTS registros_procedimento CASCADE;
DROP TABLE IF EXISTS itens_estoque CASCADE;
DROP TABLE IF EXISTS fornecedores CASCADE;
DROP TABLE IF EXISTS profissional_procedimentos CASCADE;
DROP TABLE IF EXISTS profissional_comissoes CASCADE;
DROP TABLE IF EXISTS profissional_horarios CASCADE;
DROP TABLE IF EXISTS profissional_detalhe CASCADE;
DROP TABLE IF EXISTS profissionais CASCADE;
DROP TABLE IF EXISTS pacote_itens CASCADE;
DROP TABLE IF EXISTS pacotes CASCADE;
DROP TABLE IF EXISTS procedimentos CASCADE;
DROP TABLE IF EXISTS pacientes CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS clinicas CASCADE;
DROP FUNCTION IF EXISTS set_atualizado_em();
