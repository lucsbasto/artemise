-- ============================================================================
-- Clínica Experts — Schema PostgreSQL (multi-tenant)
-- Gerado a partir das specs em docs/paginas/. Tudo INFERIDO — validar antes de produção.
--
-- Multi-tenancy: banco único / schema único / discriminador clinica_id + RLS.
-- Cada tabela de negócio tem clinica_id NOT NULL e policy de isolamento por tenant.
-- A aplicação seta o tenant por transação:  SET app.current_tenant = '<clinica_id>';
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. ENUM TYPES
-- ----------------------------------------------------------------------------
CREATE TYPE tipo_pessoa              AS ENUM ('fisica','juridica');
CREATE TYPE usuario_clinica_papel    AS ENUM ('owner','admin','profissional','recepcao','financeiro');
CREATE TYPE sexo_enum                AS ENUM ('feminino','masculino','outro');
CREATE TYPE tipo_comissao_enum       AS ENUM ('percentual','valor');

CREATE TYPE evento_tipo              AS ENUM ('consultation','lock','reminder','promotion');
CREATE TYPE evento_status            AS ENUM ('scheduled','confirmed','no_show','completed','canceled');
CREATE TYPE recorrencia_enum         AS ENUM ('none','daily','weekly','monthly','yearly','custom');
CREATE TYPE evento_prof_papel        AS ENUM ('profissional','participante');

CREATE TYPE orcamento_mode           AS ENUM ('personalizado','pacote');
CREATE TYPE orcamento_status         AS ENUM ('rascunho','aberto','aprovado','convertido','cancelado');
CREATE TYPE itemable_type_enum       AS ENUM ('procedure','product');
CREATE TYPE desconto_tipo_enum       AS ENUM ('valor','percentual');
CREATE TYPE wallet_tx_tipo           AS ENUM ('credito','debito','cashback');

CREATE TYPE lancamento_tipo          AS ENUM ('RECEITA','DESPESA','TRANSFERENCIA','SALDO_INICIAL');
CREATE TYPE lancamento_situacao      AS ENUM ('pago','recebido','em_aberto','em_atraso');
CREATE TYPE conta_financeira_tipo    AS ENUM ('caixa','conta_corrente','carteira');
CREATE TYPE categoria_financeira_tipo AS ENUM ('RECEITA','DESPESA');
CREATE TYPE metodo_pagamento_tipo    AS ENUM ('dinheiro','pix','cartao_credito','cartao_debito','maquina_cartao','boleto','deposito','transferencia');
CREATE TYPE comissao_origem          AS ENUM ('VENDA','PROCEDIMENTO');
CREATE TYPE comissao_status          AS ENUM ('em_aberto','pago','cancelado');

CREATE TYPE estoque_unidade          AS ENUM ('un','ml','g','mg','l','cx');
CREATE TYPE movimentacao_tipo        AS ENUM ('entrada','saida','ajuste');
CREATE TYPE movimentacao_origem      AS ENUM ('compra','venda','ajuste','contagem','abertura','transferencia');
CREATE TYPE contagem_tipo            AS ENUM ('parcial','geral');
CREATE TYPE contagem_status          AS ENUM ('rascunho','em_andamento','finalizada','ajustada');
CREATE TYPE item_aberto_status       AS ENUM ('aberto','proximo_vencimento','vencido','esgotado');

CREATE TYPE canal_tipo               AS ENUM ('whatsapp_lite','whatsapp_business','email','sms');
CREATE TYPE canal_status             AS ENUM ('active','inactive');
CREATE TYPE canal_status_conexao     AS ENUM ('connected','disconnected','pending','error');
CREATE TYPE mensagem_gatilho         AS ENUM ('aniversario','boas_vindas','agendamento_criado','agendamento_alterado',
                                              'agendamento_cancelado','agendamento_confirmado','confirmacao_agendamento',
                                              'lembrete_agendamento','lembrete_retorno','lembrete_fatura','formulario_pre_atendimento');
CREATE TYPE antecedencia_unidade     AS ENUM ('horas','dias');
CREATE TYPE envio_status             AS ENUM ('agendado','enviado','entregue','lido','falhou','respondido');

CREATE TYPE campo_ficha_tipo         AS ENUM ('text','textarea','number','select','radio','checkbox','multiselect',
                                              'date','boolean','image','file','signature','currency','section');
CREATE TYPE documento_tipo           AS ENUM ('atestado','prescricao','receita');
CREATE TYPE precificacao_tipo        AS ENUM ('fixo','variavel','percentual');

-- ----------------------------------------------------------------------------
-- 1. NÚCLEO / TENANT
-- ----------------------------------------------------------------------------

-- Raiz do tenant. clinica.id == tenant_id.
CREATE TABLE clinica (
    id                bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo_pessoa       tipo_pessoa NOT NULL DEFAULT 'juridica',
    cnpj              varchar(18),
    cpf               varchar(14),
    nome_fantasia     varchar(255) NOT NULL,
    razao_social      varchar(255) NOT NULL,
    logotipo_url      varchar(500),
    ddi               varchar(5)  NOT NULL DEFAULT '+55',
    telefone          varchar(20) NOT NULL,
    email             varchar(255) NOT NULL,
    pais              varchar(100) NOT NULL DEFAULT 'Brasil',
    cep               varchar(10) NOT NULL,
    estado            varchar(2)  NOT NULL,
    cidade            varchar(120) NOT NULL,
    bairro            varchar(120) NOT NULL,
    rua               varchar(255) NOT NULL,
    numero            varchar(20) NOT NULL,
    complemento       varchar(255),
    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now()
);

-- Usuário global (pode acessar várias clínicas).
CREATE TABLE usuario (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome        varchar(255) NOT NULL,
    email       varchar(255) NOT NULL UNIQUE,
    senha_hash  varchar(255) NOT NULL,
    avatar_url  varchar(500),
    ativo       boolean NOT NULL DEFAULT true,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Vínculo N:N usuário <-> clínica, com papel (membership multi-tenant).
CREATE TABLE usuario_clinica (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id  bigint NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    clinica_id  bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    papel       usuario_clinica_papel NOT NULL DEFAULT 'recepcao',
    ativo       boolean NOT NULL DEFAULT true,
    created_at  timestamptz NOT NULL DEFAULT now(),
    UNIQUE (usuario_id, clinica_id)
);

-- Preferências do sistema (chave/valor por clínica).
CREATE TABLE preferencia_sistema (
    id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id   bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    chave        varchar(100) NOT NULL,
    valor        varchar(255),
    atualizado_por bigint REFERENCES usuario(id),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    UNIQUE (clinica_id, chave)
);

-- ----------------------------------------------------------------------------
-- 2. CONTATOS
-- ----------------------------------------------------------------------------
CREATE TABLE paciente (
    id                 bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id         bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    nome_completo      varchar(255) NOT NULL,
    is_exemplo         boolean NOT NULL DEFAULT false,
    avatar_url         varchar(500),
    cpf                varchar(11),
    data_nascimento    date,
    sexo               sexo_enum,
    email              varchar(255),
    telefone           varchar(20),
    whatsapp           boolean NOT NULL DEFAULT false,
    recebe_notificacoes boolean NOT NULL DEFAULT true,
    cep                varchar(8),
    logradouro         varchar(255),
    numero             varchar(20),
    bairro             varchar(120),
    cidade             varchar(120),
    uf                 varchar(2),
    pais               varchar(60) DEFAULT 'Brasil',
    observacoes        text,
    ativo              boolean NOT NULL DEFAULT true,
    created_at         timestamptz NOT NULL DEFAULT now(),
    updated_at         timestamptz NOT NULL DEFAULT now(),
    deleted_at         timestamptz,
    UNIQUE (clinica_id, cpf)
);

CREATE TABLE profissional (
    id                bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id        bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    usuario_id        bigint REFERENCES usuario(id),
    nome              varchar(255) NOT NULL,
    iniciais          varchar(5),
    avatar_url        varchar(500),
    telefone          varchar(20),
    email             varchar(255),
    especialidade     varchar(120),
    conselho_tipo     varchar(10),       -- CRM, CRO, CREFITO...
    conselho_numero   varchar(30),
    conselho_uf       varchar(2),
    comissao_padrao   numeric(12,2) DEFAULT 0,
    tipo_comissao     tipo_comissao_enum,
    cor               varchar(7),
    disponivel_agenda boolean NOT NULL DEFAULT true,
    ativo             boolean NOT NULL DEFAULT true,
    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now(),
    deleted_at        timestamptz
);

CREATE TABLE fornecedor (
    id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id      bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    pessoa          tipo_pessoa NOT NULL DEFAULT 'juridica',
    razao_social    varchar(255) NOT NULL,
    nome_fantasia   varchar(255),
    cnpj            varchar(14),
    cpf             varchar(11),
    identificador   varchar(60),
    telefone        varchar(20),
    email           varchar(255),
    cep             varchar(8),
    logradouro      varchar(255),
    numero          varchar(20),
    complemento     varchar(120),
    bairro          varchar(120),
    cidade          varchar(120),
    uf              varchar(2),
    observacoes     text,
    ativo           boolean NOT NULL DEFAULT true,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),
    deleted_at      timestamptz,
    UNIQUE (clinica_id, cnpj)
);

CREATE TABLE etiqueta (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id  bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    nome        varchar(80) NOT NULL,
    cor         varchar(7),
    UNIQUE (clinica_id, nome)
);

-- Pivô polimórfico simples contato<->etiqueta (contato_tipo = paciente|profissional|fornecedor)
CREATE TABLE contato_etiqueta (
    id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id   bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    etiqueta_id  bigint NOT NULL REFERENCES etiqueta(id) ON DELETE CASCADE,
    contato_tipo varchar(20) NOT NULL,   -- paciente | profissional | fornecedor
    contato_id   bigint NOT NULL,
    UNIQUE (etiqueta_id, contato_tipo, contato_id)
);

CREATE TABLE sala (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id  bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    nome        varchar(255) NOT NULL,
    capacidade  int,
    ativo       boolean NOT NULL DEFAULT true
);

-- ----------------------------------------------------------------------------
-- 3. CATÁLOGO CLÍNICO (procedimentos, categorias, pacotes, fichas, documentos)
-- ----------------------------------------------------------------------------
CREATE TABLE categoria_procedimento (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id  bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    nome        varchar(100) NOT NULL,
    ativo       boolean NOT NULL DEFAULT true,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now(),
    deleted_at  timestamptz,
    UNIQUE (clinica_id, nome)
);

CREATE TABLE ficha_atendimento (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id  bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    nome        varchar(255) NOT NULL,
    tipo        varchar(50),
    ativo       boolean NOT NULL DEFAULT true,
    padrao      boolean NOT NULL DEFAULT false,
    ordem       int,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now(),
    UNIQUE (clinica_id, nome)
);

CREATE TABLE campo_ficha (
    id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id   bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    ficha_id     bigint NOT NULL REFERENCES ficha_atendimento(id) ON DELETE CASCADE,
    rotulo       varchar(255) NOT NULL,
    tipo         campo_ficha_tipo NOT NULL,
    obrigatorio  boolean NOT NULL DEFAULT false,
    placeholder  varchar(255),
    opcoes       jsonb,
    ajuda        varchar(500),
    secao        varchar(120),
    ordem        int NOT NULL DEFAULT 0,
    config       jsonb
);

CREATE TABLE procedimento (
    id                   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id           bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    categoria_id         bigint REFERENCES categoria_procedimento(id),
    ficha_atendimento_id bigint REFERENCES ficha_atendimento(id),
    nome                 varchar(255) NOT NULL,
    valor_venda          numeric(12,2) NOT NULL DEFAULT 0,
    tipo_precificacao    precificacao_tipo NOT NULL DEFAULT 'fixo',
    custo_adicional      numeric(12,2) NOT NULL DEFAULT 0,
    cor                  varchar(30),
    duracao_minutos      int NOT NULL DEFAULT 60,
    tempo_reconsulta_dias int NOT NULL DEFAULT 0,
    comissao_valor       numeric(12,2),
    comissao_tipo        tipo_comissao_enum,
    ativo                boolean NOT NULL DEFAULT true,
    created_at           timestamptz NOT NULL DEFAULT now(),
    updated_at           timestamptz NOT NULL DEFAULT now(),
    deleted_at           timestamptz
);

-- Habilidades: quais profissionais executam o procedimento (N:N)
CREATE TABLE procedimento_profissional (
    id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id      bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    procedimento_id bigint NOT NULL REFERENCES procedimento(id) ON DELETE CASCADE,
    profissional_id bigint NOT NULL REFERENCES profissional(id) ON DELETE CASCADE,
    UNIQUE (procedimento_id, profissional_id)
);

CREATE TABLE pacote (
    id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id      bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    descricao       varchar(120) NOT NULL,
    validade_tipo   varchar(20) NOT NULL DEFAULT 'ilimitado',  -- ilimitado | personalizado
    validade_qtd    int,
    validade_unidade varchar(10),                              -- dias | meses
    desconto_tipo   desconto_tipo_enum NOT NULL DEFAULT 'valor',
    desconto_valor  numeric(12,2) NOT NULL DEFAULT 0,
    observacoes     text,
    ativo           boolean NOT NULL DEFAULT true,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE item_pacote (
    id                    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id            bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    pacote_id             bigint NOT NULL REFERENCES pacote(id) ON DELETE CASCADE,
    tipo                  itemable_type_enum NOT NULL,    -- procedure | product
    procedimento_id       bigint REFERENCES procedimento(id),
    produto_id            bigint,                          -- REFERENCES item_estoque(id) (def. abaixo)
    nome                  varchar(255) NOT NULL,
    quantidade            int NOT NULL DEFAULT 1,
    valor_unitario        numeric(12,2) NOT NULL DEFAULT 0,
    desconto_unitario     numeric(12,2) NOT NULL DEFAULT 0,
    desconto_unitario_tipo desconto_tipo_enum NOT NULL DEFAULT 'valor',
    ordem                 int
);

CREATE TABLE modelo_documento (
    id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id      bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    profissional_id bigint REFERENCES profissional(id),
    tipo            documento_tipo NOT NULL,
    nome            varchar(255) NOT NULL,
    conteudo        text NOT NULL,
    conteudo_formato varchar(10) NOT NULL DEFAULT 'html',  -- html | delta | json
    ativo           boolean NOT NULL DEFAULT true,
    criado_por      bigint REFERENCES usuario(id),
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Catálogo estático de variáveis de documento (global, sem clinica_id).
CREATE TABLE variavel_documento (
    id      bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    chave   varchar(100) NOT NULL UNIQUE,   -- ex: paciente.nome_completo
    rotulo  varchar(120) NOT NULL,
    grupo   varchar(30)  NOT NULL           -- paciente | clinica | profissional | atendimento | sistema
);

-- ----------------------------------------------------------------------------
-- 4. AGENDA / EVENTOS
-- ----------------------------------------------------------------------------
CREATE TABLE evento (
    id                bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id        bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    tipo              evento_tipo NOT NULL,
    titulo            varchar(255),
    paciente_id       bigint REFERENCES paciente(id),       -- só consultation
    sala_id           bigint REFERENCES sala(id),
    inicio            timestamptz,
    fim               timestamptz,
    dia_inteiro       boolean NOT NULL DEFAULT false,
    duracao_min       int,
    recorrencia       recorrencia_enum NOT NULL DEFAULT 'none',
    status            evento_status,                        -- só consultation
    cor               varchar(7),
    valor_total       numeric(12,2),                        -- só consultation
    comanda_habilitada boolean NOT NULL DEFAULT false,
    previsao_recebimento date,
    clinica_toda      boolean NOT NULL DEFAULT false,       -- lock
    permitir_outros   boolean NOT NULL DEFAULT false,       -- promotion
    observacao        text,
    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_evento_periodo ON evento (clinica_id, inicio, fim);

CREATE TABLE evento_profissional (
    id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id      bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    evento_id       bigint NOT NULL REFERENCES evento(id) ON DELETE CASCADE,
    profissional_id bigint NOT NULL REFERENCES profissional(id),
    papel           evento_prof_papel NOT NULL DEFAULT 'profissional',
    UNIQUE (evento_id, profissional_id)
);

CREATE TABLE evento_item (
    id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id      bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    evento_id       bigint NOT NULL REFERENCES evento(id) ON DELETE CASCADE,
    procedimento_id bigint REFERENCES procedimento(id),
    produto_id      bigint,                                  -- REFERENCES item_estoque(id)
    nome            varchar(255) NOT NULL,
    quantidade      int NOT NULL DEFAULT 1,
    valor_unitario  numeric(12,2)
);

CREATE TABLE lista_espera (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id  bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    paciente_id bigint NOT NULL REFERENCES paciente(id),
    ativo       boolean NOT NULL DEFAULT true,
    created_at  timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 5. FINANCEIRO
-- ----------------------------------------------------------------------------
CREATE TABLE conta_financeira (
    id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id    bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    nome          varchar(150) NOT NULL,
    tipo          conta_financeira_tipo NOT NULL,
    saldo_inicial numeric(12,2) NOT NULL DEFAULT 0,
    saldo_atual   numeric(12,2) NOT NULL DEFAULT 0,   -- materializado; recalcular nas movimentações
    padrao        boolean NOT NULL DEFAULT false,
    ativo         boolean NOT NULL DEFAULT true,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE categoria_financeira (
    id                bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id        bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    categoria_pai_id  bigint REFERENCES categoria_financeira(id),  -- auto-relação (2 níveis)
    descricao         varchar(150) NOT NULL,
    tipo              categoria_financeira_tipo NOT NULL,
    cor               varchar(7),
    ordem             int,
    ativo             boolean NOT NULL DEFAULT true,
    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now(),
    deleted_at        timestamptz
);

CREATE TABLE metodo_pagamento (
    id                     bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id             bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    descricao              varchar(150) NOT NULL,
    tipo                   metodo_pagamento_tipo NOT NULL,
    taxa_percentual        numeric(5,2) DEFAULT 0,
    prazo_recebimento_dias int DEFAULT 0,
    parcelas_max           int DEFAULT 1,
    conta_destino_id       bigint REFERENCES conta_financeira(id),
    ativo                  boolean NOT NULL DEFAULT true,
    created_at             timestamptz NOT NULL DEFAULT now(),
    updated_at             timestamptz NOT NULL DEFAULT now()
);

-- Livro-caixa unificado. ContaReceber/ContaPagar = views por tipo (ver fim do arquivo).
CREATE TABLE lancamento_financeiro (
    id                  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id          bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    tipo                lancamento_tipo NOT NULL,
    descricao           varchar(255) NOT NULL,
    categoria_id        bigint REFERENCES categoria_financeira(id),
    conta_financeira_id bigint NOT NULL REFERENCES conta_financeira(id),
    metodo_pagamento_id bigint REFERENCES metodo_pagamento(id),
    paciente_id         bigint REFERENCES paciente(id),     -- preenchido p/ receitas
    fornecedor_id       bigint REFERENCES fornecedor(id),   -- preenchido p/ despesas
    evento_id           bigint REFERENCES evento(id),       -- origem comanda/agendamento
    valor_bruto         numeric(12,2) NOT NULL,
    desconto            numeric(12,2) NOT NULL DEFAULT 0,
    juros_multa         numeric(12,2) NOT NULL DEFAULT 0,
    valor_liquido       numeric(12,2) NOT NULL,
    valor_liquidado     numeric(12,2) NOT NULL DEFAULT 0,   -- baixa parcial (recebido/pago)
    data_competencia    date NOT NULL,
    data_vencimento     date NOT NULL,
    data_execucao       date,                                -- liquidação; null = em aberto
    situacao            lancamento_situacao NOT NULL DEFAULT 'em_aberto',
    parcela             int,
    total_parcelas      int,
    is_previsao         boolean NOT NULL DEFAULT false,
    recorrencia         jsonb,
    observacao          text,
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_lanc_periodo ON lancamento_financeiro (clinica_id, data_vencimento, situacao);
CREATE INDEX idx_lanc_competencia ON lancamento_financeiro (clinica_id, data_competencia);

CREATE TABLE comissao (
    id                  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id          bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    profissional_id     bigint NOT NULL REFERENCES profissional(id),
    origem_tipo         comissao_origem NOT NULL,
    evento_id           bigint REFERENCES evento(id),        -- origem procedimento/atendimento
    orcamento_id        bigint,                              -- origem venda (REFERENCES orcamento)
    categoria_id        bigint REFERENCES categoria_financeira(id),
    data_referencia     date NOT NULL,
    base                numeric(12,2) NOT NULL,
    percentual          numeric(5,2) NOT NULL,
    valor_comissao      numeric(12,2) NOT NULL,
    status              comissao_status NOT NULL DEFAULT 'em_aberto',
    data_pagamento      timestamptz,
    lancamento_id       bigint REFERENCES lancamento_financeiro(id),  -- gerado ao pagar
    conta_financeira_id bigint REFERENCES conta_financeira(id),
    metodo_pagamento_id bigint REFERENCES metodo_pagamento(id),
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 6. CARTEIRA / CRÉDITOS / ORÇAMENTOS (paciente)
-- ----------------------------------------------------------------------------
CREATE TABLE carteira (
    id               bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id       bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    paciente_id      bigint NOT NULL UNIQUE REFERENCES paciente(id) ON DELETE CASCADE,
    saldo            numeric(12,2) NOT NULL DEFAULT 0,
    cashback         numeric(12,2) NOT NULL DEFAULT 0,
    numero_mascarado varchar(25),
    updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE wallet_transaction (
    id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id      bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    carteira_id     bigint NOT NULL REFERENCES carteira(id) ON DELETE CASCADE,
    paciente_id     bigint NOT NULL REFERENCES paciente(id),
    tipo            wallet_tx_tipo NOT NULL,
    valor           numeric(12,2) NOT NULL,
    descricao       varchar(255),
    ref_origem_tipo varchar(20),    -- venda | orcamento | ajuste
    ref_origem_id   bigint,
    created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE pacote_contratado (
    id                  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id          bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    paciente_id         bigint NOT NULL REFERENCES paciente(id),
    pacote_id           bigint NOT NULL REFERENCES pacote(id),
    pacote_nome         varchar(255) NOT NULL,
    procedimento_id     bigint REFERENCES procedimento(id),
    total_sessoes       int NOT NULL,
    sessoes_utilizadas  int NOT NULL DEFAULT 0,
    data_compra         date NOT NULL,
    validade            date,
    created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE orcamento (
    id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id     bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    paciente_id    bigint NOT NULL REFERENCES paciente(id),
    vendedor_id    bigint NOT NULL REFERENCES profissional(id),
    pacote_id      bigint REFERENCES pacote(id),
    mode           orcamento_mode NOT NULL,
    discount_type  varchar(10) NOT NULL DEFAULT 'none',   -- none|amount|percent|balance
    discount_value numeric(12,2) NOT NULL DEFAULT 0,
    status         orcamento_status NOT NULL DEFAULT 'rascunho',
    valid_until    date,
    notes          text,
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE item_orcamento (
    id                  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id          bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    orcamento_id        bigint NOT NULL REFERENCES orcamento(id) ON DELETE CASCADE,
    itemable_type       itemable_type_enum NOT NULL,
    itemable_id         bigint NOT NULL,
    name                varchar(255) NOT NULL,
    quantity            int NOT NULL DEFAULT 1,
    unit_price          numeric(12,2) NOT NULL DEFAULT 0,
    unit_discount_value numeric(12,2) NOT NULL DEFAULT 0,
    unit_discount_type  desconto_tipo_enum NOT NULL DEFAULT 'valor',
    from_package        boolean NOT NULL DEFAULT false
);

CREATE TABLE condicao_pagamento (
    id                bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id        bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    orcamento_id      bigint NOT NULL REFERENCES orcamento(id) ON DELETE CASCADE,
    metodo_pagamento_id bigint NOT NULL REFERENCES metodo_pagamento(id),
    installments      int NOT NULL DEFAULT 1,
    amount            numeric(12,2) NOT NULL,
    due_date          date
);

-- FK pendente da comissão para orçamento (origem venda)
ALTER TABLE comissao ADD CONSTRAINT fk_comissao_orcamento
    FOREIGN KEY (orcamento_id) REFERENCES orcamento(id);

-- ----------------------------------------------------------------------------
-- 7. ESTOQUE
-- ----------------------------------------------------------------------------
CREATE TABLE categoria_estoque (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id  bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    nome        varchar(120) NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now(),
    UNIQUE (clinica_id, nome)
);

CREATE TABLE item_estoque (
    id                       bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id               bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    categoria_id             bigint REFERENCES categoria_estoque(id),
    fornecedor_id            bigint REFERENCES fornecedor(id),
    nome                     varchar(255) NOT NULL,
    sku                      varchar(100),
    unidade                  estoque_unidade NOT NULL DEFAULT 'un',
    saldo_atual              numeric(12,2) NOT NULL DEFAULT 0,
    estoque_minimo           numeric(12,2) DEFAULT 0,
    estoque_maximo           numeric(12,2),
    custo                    numeric(12,2) DEFAULT 0,
    validade_apos_aberto_dias int,
    ativo                    boolean NOT NULL DEFAULT true,
    created_at               timestamptz NOT NULL DEFAULT now(),
    updated_at               timestamptz NOT NULL DEFAULT now(),
    UNIQUE (clinica_id, sku)
);

-- FKs de produto agora que item_estoque existe
ALTER TABLE item_pacote ADD CONSTRAINT fk_item_pacote_produto FOREIGN KEY (produto_id) REFERENCES item_estoque(id);
ALTER TABLE evento_item ADD CONSTRAINT fk_evento_item_produto FOREIGN KEY (produto_id) REFERENCES item_estoque(id);

CREATE TABLE material_atendimento (
    id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id      bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    procedimento_id bigint NOT NULL REFERENCES procedimento(id) ON DELETE CASCADE,
    item_estoque_id bigint NOT NULL REFERENCES item_estoque(id),
    quantidade      numeric(12,2) NOT NULL,
    custo_unitario  numeric(12,2) NOT NULL
);

CREATE TABLE movimentacao_estoque (
    id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id      bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    item_id         bigint NOT NULL REFERENCES item_estoque(id),
    tipo            movimentacao_tipo NOT NULL,
    origem          movimentacao_origem NOT NULL,
    quantidade      numeric(12,2) NOT NULL,
    valor_unitario  numeric(12,2) DEFAULT 0,
    saldo_apos      numeric(12,2),
    data            timestamptz NOT NULL DEFAULT now(),
    observacoes     text,
    usuario_id      bigint REFERENCES usuario(id),
    created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_mov_item_data ON movimentacao_estoque (clinica_id, item_id, data);

CREATE TABLE contagem_estoque (
    id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id    bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    uuid          uuid NOT NULL DEFAULT gen_random_uuid(),
    tipo          contagem_tipo NOT NULL,
    status        contagem_status NOT NULL DEFAULT 'rascunho',
    data          timestamptz NOT NULL DEFAULT now(),
    responsavel_id bigint REFERENCES usuario(id),
    observacao    text,
    ajuste_aplicado boolean NOT NULL DEFAULT false,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now(),
    UNIQUE (clinica_id, uuid)
);

CREATE TABLE item_contagem (
    id               bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id       bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    contagem_id      bigint NOT NULL REFERENCES contagem_estoque(id) ON DELETE CASCADE,
    item_id          bigint NOT NULL REFERENCES item_estoque(id),
    saldo_sistema    numeric(12,2) NOT NULL,
    contado          numeric(12,2) NOT NULL DEFAULT 0,
    ajuste_gerado_id bigint REFERENCES movimentacao_estoque(id),
    UNIQUE (contagem_id, item_id)
);

CREATE TABLE item_aberto (
    id                   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id           bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    item_id              bigint NOT NULL REFERENCES item_estoque(id),
    unidade              estoque_unidade NOT NULL,
    data_abertura        date NOT NULL,
    hora_abertura        time,
    quantidade_inicial   numeric(12,2) NOT NULL,
    quantidade_utilizada numeric(12,2) NOT NULL DEFAULT 0,
    validade_apos_aberto date,
    status               item_aberto_status NOT NULL DEFAULT 'aberto',
    observacoes          text,
    responsavel_id       bigint REFERENCES usuario(id),
    created_at           timestamptz NOT NULL DEFAULT now(),
    updated_at           timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 8. COMUNICAÇÃO
-- ----------------------------------------------------------------------------
CREATE TABLE canal_comunicacao (
    id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id      bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    nome            varchar(120) NOT NULL,
    tipo            canal_tipo NOT NULL,
    identificador   varchar(255) NOT NULL,
    status          canal_status NOT NULL DEFAULT 'active',
    status_conexao  canal_status_conexao NOT NULL DEFAULT 'disconnected',
    padrao          boolean NOT NULL DEFAULT false,
    provedor        varchar(80),
    config          jsonb,
    ultima_conexao_em timestamptz,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),
    UNIQUE (clinica_id, tipo, identificador)
);

CREATE TABLE modelo_mensagem (
    id                    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id            bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    gatilho               mensagem_gatilho NOT NULL,
    titulo                varchar(120) NOT NULL,
    descricao             varchar(500),
    icone                 varchar(60),
    ativo                 boolean NOT NULL DEFAULT false,
    antecedencia_valor    int,
    antecedencia_unidade  antecedencia_unidade,
    antecedencia_horario  time,
    created_at            timestamptz NOT NULL DEFAULT now(),
    updated_at            timestamptz NOT NULL DEFAULT now(),
    UNIQUE (clinica_id, gatilho)
);

CREATE TABLE canal_modelo (
    id                  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id          bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    modelo_id           bigint NOT NULL REFERENCES modelo_mensagem(id) ON DELETE CASCADE,
    canal               canal_tipo NOT NULL,
    ativo               boolean NOT NULL DEFAULT false,
    assunto             varchar(255),
    conteudo            text NOT NULL,
    template_externo_id varchar(120),
    UNIQUE (modelo_id, canal)
);

CREATE TABLE envio_mensagem (
    id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clinica_id    bigint NOT NULL REFERENCES clinica(id) ON DELETE CASCADE,
    modelo_id     bigint REFERENCES modelo_mensagem(id),
    paciente_id   bigint NOT NULL REFERENCES paciente(id),
    canal         canal_tipo NOT NULL,
    status        envio_status NOT NULL DEFAULT 'agendado',
    agendado_para timestamptz,
    enviado_em    timestamptz,
    payload       jsonb,
    created_at    timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 9. VIEWS (ContaReceber / ContaPagar como escopos do livro-caixa)
-- ----------------------------------------------------------------------------
CREATE VIEW vw_contas_a_receber AS
    SELECT * FROM lancamento_financeiro WHERE tipo = 'RECEITA';

CREATE VIEW vw_contas_a_pagar AS
    SELECT * FROM lancamento_financeiro WHERE tipo = 'DESPESA';

-- ----------------------------------------------------------------------------
-- 10. ROW-LEVEL SECURITY (isolamento por tenant)
--     Aplicar a TODA tabela com clinica_id. A app seta:  SET app.current_tenant = '<id>';
-- ----------------------------------------------------------------------------
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'preferencia_sistema','paciente','profissional','fornecedor','etiqueta','contato_etiqueta','sala',
    'categoria_procedimento','ficha_atendimento','campo_ficha','procedimento','procedimento_profissional',
    'pacote','item_pacote','modelo_documento',
    'evento','evento_profissional','evento_item','lista_espera',
    'conta_financeira','categoria_financeira','metodo_pagamento','lancamento_financeiro','comissao',
    'carteira','wallet_transaction','pacote_contratado','orcamento','item_orcamento','condicao_pagamento',
    'categoria_estoque','item_estoque','material_atendimento','movimentacao_estoque','contagem_estoque',
    'item_contagem','item_aberto',
    'canal_comunicacao','modelo_mensagem','canal_modelo','envio_mensagem'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY;', t);
    EXECUTE format($p$
      CREATE POLICY tenant_isolation ON %I
        USING (clinica_id = current_setting('app.current_tenant', true)::bigint)
        WITH CHECK (clinica_id = current_setting('app.current_tenant', true)::bigint);
    $p$, t);
  END LOOP;
END $$;

-- Índice de tenant em todas as tabelas de negócio (o filtro mais quente).
-- (Postgres cria índice nas FKs? Não automaticamente — criar manualmente os mais usados.)
CREATE INDEX idx_paciente_clinica       ON paciente (clinica_id);
CREATE INDEX idx_profissional_clinica   ON profissional (clinica_id);
CREATE INDEX idx_fornecedor_clinica     ON fornecedor (clinica_id);
CREATE INDEX idx_procedimento_clinica   ON procedimento (clinica_id);
CREATE INDEX idx_orcamento_clinica      ON orcamento (clinica_id);
CREATE INDEX idx_item_estoque_clinica   ON item_estoque (clinica_id);
CREATE INDEX idx_comissao_clinica_status ON comissao (clinica_id, status);
CREATE INDEX idx_envio_clinica_status   ON envio_mensagem (clinica_id, status);

-- FIM
