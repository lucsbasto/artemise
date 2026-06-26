CREATE TYPE "public"."agenda_status" AS ENUM('Agendado', 'Confirmado', 'Não compareceu', 'Concluído', 'Cancelado');--> statement-breakpoint
CREATE TYPE "public"."agenda_tipo" AS ENUM('Agendamento', 'Bloqueio', 'Lembrete', 'Evento');--> statement-breakpoint
CREATE TYPE "public"."categoria_proc" AS ENUM('Facial', 'Corporal', 'Injetáveis', 'Estética');--> statement-breakpoint
CREATE TYPE "public"."comissao_tipo" AS ENUM('percentual', 'fixo');--> statement-breakpoint
CREATE TYPE "public"."conselho" AS ENUM('CRM', 'CRO', 'CREFITO', 'COREN', 'CRBM', 'CRF', 'Outro');--> statement-breakpoint
CREATE TYPE "public"."conta_icon" AS ENUM('bank', 'cash', 'wallet');--> statement-breakpoint
CREATE TYPE "public"."estoque_mov_tipo" AS ENUM('entrada', 'saida', 'ajuste');--> statement-breakpoint
CREATE TYPE "public"."finance_status" AS ENUM('Recebido', 'Pago', 'Em atraso', 'Em aberto');--> statement-breakpoint
CREATE TYPE "public"."finance_tipo" AS ENUM('receita', 'despesa');--> statement-breakpoint
CREATE TYPE "public"."membership_role" AS ENUM('owner', 'admin', 'recepcao', 'profissional');--> statement-breakpoint
CREATE TYPE "public"."metodo_pgto" AS ENUM('pix', 'dinheiro', 'cartao', 'boleto', 'transferencia');--> statement-breakpoint
CREATE TYPE "public"."perfil_acesso" AS ENUM('admin', 'recepcao', 'profissional');--> statement-breakpoint
CREATE TYPE "public"."pessoa_tipo" AS ENUM('fisica', 'juridica');--> statement-breakpoint
CREATE TYPE "public"."status_registro_proc" AS ENUM('realizado', 'agendado', 'cancelado');--> statement-breakpoint
CREATE TYPE "public"."vinculo_trabalho" AS ENUM('CLT', 'PJ', 'Autônomo', 'Sócio');--> statement-breakpoint
CREATE TABLE "clinicas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"pessoa_tipo" "pessoa_tipo" DEFAULT 'juridica' NOT NULL,
	"documento" text,
	"email" text,
	"telefone" text,
	"logo_url" text,
	"endereco_comercial" jsonb,
	"endereco_cobranca" jsonb,
	"preferencias" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clinicas" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"clinica_id" uuid NOT NULL,
	"role" "membership_role" DEFAULT 'profissional' NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "memberships_profile_clinica_uq" UNIQUE("profile_id","clinica_id")
);
--> statement-breakpoint
ALTER TABLE "memberships" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"email" text,
	"avatar_url" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "categorias_procedimento" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "categorias_procedimento" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "comissao_regras" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"profissional_id" uuid NOT NULL,
	"procedimento_id" uuid,
	"tipo" "comissao_tipo" NOT NULL,
	"valor" numeric(12, 2) NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comissao_regras" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "fichas_atendimento" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "fichas_atendimento" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "fornecedores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"tipo" text DEFAULT 'Fornecedor' NOT NULL,
	"etiquetas" text[] DEFAULT '{}' NOT NULL,
	"telefone" text,
	"documento" text,
	"email" text,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "fornecedores" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "modelos_documento" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"tipo" text NOT NULL,
	"corpo" text,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "modelos_documento" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pacientes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"tipo" text DEFAULT 'Paciente' NOT NULL,
	"etiquetas" text[] DEFAULT '{}' NOT NULL,
	"telefone" text,
	"cpf" text,
	"email" text,
	"sexo" text,
	"data_nascimento" date,
	"endereco" text,
	"observacoes" text,
	"recebe_notificacoes" boolean DEFAULT false NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pacientes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pacote_itens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"pacote_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"quantidade" integer DEFAULT 1 NOT NULL,
	"valor_unitario" numeric(12, 2) DEFAULT '0' NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pacote_itens" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pacotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"descricao" text NOT NULL,
	"valor_total" numeric(12, 2) DEFAULT '0' NOT NULL,
	"validade" text DEFAULT 'Ilimitado' NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pacotes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "procedimentos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"categoria" "categoria_proc",
	"categoria_id" uuid,
	"duracao_min" integer DEFAULT 60 NOT NULL,
	"valor" numeric(12, 2) DEFAULT '0' NOT NULL,
	"cor" text,
	"ativo" boolean DEFAULT true NOT NULL,
	"usa_mapa" boolean DEFAULT false NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "procedimentos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profissionais" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"profile_id" uuid,
	"nome" text NOT NULL,
	"cpf" text,
	"data_nascimento" date,
	"telefone" text,
	"email" text,
	"ativo" boolean DEFAULT true NOT NULL,
	"conselho" "conselho",
	"registro" text,
	"uf_registro" text,
	"especialidade" text,
	"certificacoes" text[] DEFAULT '{}' NOT NULL,
	"vinculo" "vinculo_trabalho",
	"chave_pix" text,
	"perfil_acesso" "perfil_acesso" DEFAULT 'profissional' NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profissionais" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profissional_horarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"profissional_id" uuid NOT NULL,
	"dia_semana" integer NOT NULL,
	"inicio" text NOT NULL,
	"fim" text NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profissional_horarios" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profissional_procedimentos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"profissional_id" uuid NOT NULL,
	"procedimento_id" uuid NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profissional_procedimentos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "estoque_itens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"sku" text,
	"categoria" text NOT NULL,
	"unidade" text DEFAULT 'un' NOT NULL,
	"saldo" numeric(14, 3) DEFAULT '0' NOT NULL,
	"minimo" numeric(14, 3) DEFAULT '0' NOT NULL,
	"custo" numeric(12, 2) DEFAULT '0' NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "estoque_itens" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "estoque_movimentos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"tipo" "estoque_mov_tipo" NOT NULL,
	"quantidade" numeric(14, 3) NOT NULL,
	"motivo" text,
	"referencia_id" uuid,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "estoque_movimentos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "agendamentos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"tipo" "agenda_tipo" DEFAULT 'Agendamento' NOT NULL,
	"status" "agenda_status" DEFAULT 'Agendado' NOT NULL,
	"paciente_id" uuid,
	"profissional_id" uuid,
	"procedimento_id" uuid,
	"inicio" timestamp with time zone NOT NULL,
	"fim" timestamp with time zone NOT NULL,
	"duracao_min" integer,
	"valor" numeric(12, 2),
	"recorrencia" text DEFAULT 'Não se repete' NOT NULL,
	"observacao" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "agendamentos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "categorias_conta" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"descricao" text NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"parent_id" uuid,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "categorias_conta" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "comissoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"profissional_id" uuid NOT NULL,
	"referencia" text NOT NULL,
	"data" date NOT NULL,
	"base" numeric(14, 2) NOT NULL,
	"percentual" numeric(5, 2),
	"valor" numeric(14, 2) NOT NULL,
	"situacao" "finance_status" DEFAULT 'Em aberto' NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comissoes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "contas_financeiras" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"tipo" text NOT NULL,
	"saldo_inicial" numeric(14, 2) DEFAULT '0' NOT NULL,
	"icon" "conta_icon" DEFAULT 'bank' NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contas_financeiras" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "lancamentos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"descricao" text NOT NULL,
	"tipo" "finance_tipo" NOT NULL,
	"situacao" "finance_status" DEFAULT 'Em aberto' NOT NULL,
	"valor" numeric(14, 2) NOT NULL,
	"vencimento" date NOT NULL,
	"execucao" date,
	"metodo" "metodo_pgto",
	"categoria_conta_id" uuid,
	"conta_financeira_id" uuid,
	"metodo_pagamento_id" uuid,
	"paciente_id" uuid,
	"profissional_id" uuid,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lancamentos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "metodos_pagamento" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"descricao" text NOT NULL,
	"tipo" text NOT NULL,
	"marca" text,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "metodos_pagamento" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "carteiras" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"paciente_id" uuid NOT NULL,
	"saldo" numeric(14, 2) DEFAULT '0' NOT NULL,
	"cashback" numeric(14, 2) DEFAULT '0' NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "carteiras" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "orcamento_itens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"orcamento_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"quantidade" integer DEFAULT 1 NOT NULL,
	"valor_unitario" numeric(12, 2) DEFAULT '0' NOT NULL,
	"desconto_valor" numeric(12, 2) DEFAULT '0' NOT NULL,
	"desconto_percentual" boolean DEFAULT false NOT NULL,
	"total" numeric(14, 2) DEFAULT '0' NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orcamento_itens" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "orcamentos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"paciente_id" uuid,
	"cliente_nome" text NOT NULL,
	"vendedor_nome" text,
	"desconto" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total" numeric(14, 2) DEFAULT '0' NOT NULL,
	"condicoes_pagamento" text,
	"data" date NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orcamentos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "registros_procedimento" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"paciente_id" uuid NOT NULL,
	"procedimento_id" uuid,
	"profissional_id" uuid,
	"procedimento_nome" text NOT NULL,
	"profissional_nome" text,
	"data" date NOT NULL,
	"status" "status_registro_proc" DEFAULT 'agendado' NOT NULL,
	"valor" numeric(12, 2) DEFAULT '0' NOT NULL,
	"observacoes" text,
	"usa_mapa" boolean DEFAULT false NOT NULL,
	"mapa" jsonb,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "registros_procedimento" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "modelos_mensagem" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinica_id" uuid NOT NULL,
	"chave" text NOT NULL,
	"icone" text NOT NULL,
	"titulo" text NOT NULL,
	"descricao" text,
	"canais" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"corpo" text,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "modelos_mensagem" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categorias_procedimento" ADD CONSTRAINT "categorias_procedimento_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comissao_regras" ADD CONSTRAINT "comissao_regras_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comissao_regras" ADD CONSTRAINT "comissao_regras_profissional_id_profissionais_id_fk" FOREIGN KEY ("profissional_id") REFERENCES "public"."profissionais"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comissao_regras" ADD CONSTRAINT "comissao_regras_procedimento_id_procedimentos_id_fk" FOREIGN KEY ("procedimento_id") REFERENCES "public"."procedimentos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fichas_atendimento" ADD CONSTRAINT "fichas_atendimento_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fornecedores" ADD CONSTRAINT "fornecedores_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modelos_documento" ADD CONSTRAINT "modelos_documento_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pacientes" ADD CONSTRAINT "pacientes_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pacote_itens" ADD CONSTRAINT "pacote_itens_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pacote_itens" ADD CONSTRAINT "pacote_itens_pacote_id_pacotes_id_fk" FOREIGN KEY ("pacote_id") REFERENCES "public"."pacotes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pacotes" ADD CONSTRAINT "pacotes_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "procedimentos" ADD CONSTRAINT "procedimentos_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "procedimentos" ADD CONSTRAINT "procedimentos_categoria_id_categorias_procedimento_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias_procedimento"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profissionais" ADD CONSTRAINT "profissionais_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profissionais" ADD CONSTRAINT "profissionais_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profissional_horarios" ADD CONSTRAINT "profissional_horarios_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profissional_horarios" ADD CONSTRAINT "profissional_horarios_profissional_id_profissionais_id_fk" FOREIGN KEY ("profissional_id") REFERENCES "public"."profissionais"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profissional_procedimentos" ADD CONSTRAINT "profissional_procedimentos_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profissional_procedimentos" ADD CONSTRAINT "profissional_procedimentos_profissional_id_profissionais_id_fk" FOREIGN KEY ("profissional_id") REFERENCES "public"."profissionais"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profissional_procedimentos" ADD CONSTRAINT "profissional_procedimentos_procedimento_id_procedimentos_id_fk" FOREIGN KEY ("procedimento_id") REFERENCES "public"."procedimentos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "estoque_itens" ADD CONSTRAINT "estoque_itens_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "estoque_movimentos" ADD CONSTRAINT "estoque_movimentos_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "estoque_movimentos" ADD CONSTRAINT "estoque_movimentos_item_id_estoque_itens_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."estoque_itens"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_paciente_id_pacientes_id_fk" FOREIGN KEY ("paciente_id") REFERENCES "public"."pacientes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_profissional_id_profissionais_id_fk" FOREIGN KEY ("profissional_id") REFERENCES "public"."profissionais"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_procedimento_id_procedimentos_id_fk" FOREIGN KEY ("procedimento_id") REFERENCES "public"."procedimentos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categorias_conta" ADD CONSTRAINT "categorias_conta_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categorias_conta" ADD CONSTRAINT "categorias_conta_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categorias_conta"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comissoes" ADD CONSTRAINT "comissoes_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comissoes" ADD CONSTRAINT "comissoes_profissional_id_profissionais_id_fk" FOREIGN KEY ("profissional_id") REFERENCES "public"."profissionais"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contas_financeiras" ADD CONSTRAINT "contas_financeiras_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lancamentos" ADD CONSTRAINT "lancamentos_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lancamentos" ADD CONSTRAINT "lancamentos_categoria_conta_id_categorias_conta_id_fk" FOREIGN KEY ("categoria_conta_id") REFERENCES "public"."categorias_conta"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lancamentos" ADD CONSTRAINT "lancamentos_conta_financeira_id_contas_financeiras_id_fk" FOREIGN KEY ("conta_financeira_id") REFERENCES "public"."contas_financeiras"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lancamentos" ADD CONSTRAINT "lancamentos_metodo_pagamento_id_metodos_pagamento_id_fk" FOREIGN KEY ("metodo_pagamento_id") REFERENCES "public"."metodos_pagamento"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lancamentos" ADD CONSTRAINT "lancamentos_paciente_id_pacientes_id_fk" FOREIGN KEY ("paciente_id") REFERENCES "public"."pacientes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lancamentos" ADD CONSTRAINT "lancamentos_profissional_id_profissionais_id_fk" FOREIGN KEY ("profissional_id") REFERENCES "public"."profissionais"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metodos_pagamento" ADD CONSTRAINT "metodos_pagamento_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carteiras" ADD CONSTRAINT "carteiras_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carteiras" ADD CONSTRAINT "carteiras_paciente_id_pacientes_id_fk" FOREIGN KEY ("paciente_id") REFERENCES "public"."pacientes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orcamento_itens" ADD CONSTRAINT "orcamento_itens_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orcamento_itens" ADD CONSTRAINT "orcamento_itens_orcamento_id_orcamentos_id_fk" FOREIGN KEY ("orcamento_id") REFERENCES "public"."orcamentos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orcamentos" ADD CONSTRAINT "orcamentos_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orcamentos" ADD CONSTRAINT "orcamentos_paciente_id_pacientes_id_fk" FOREIGN KEY ("paciente_id") REFERENCES "public"."pacientes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registros_procedimento" ADD CONSTRAINT "registros_procedimento_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registros_procedimento" ADD CONSTRAINT "registros_procedimento_paciente_id_pacientes_id_fk" FOREIGN KEY ("paciente_id") REFERENCES "public"."pacientes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registros_procedimento" ADD CONSTRAINT "registros_procedimento_procedimento_id_procedimentos_id_fk" FOREIGN KEY ("procedimento_id") REFERENCES "public"."procedimentos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registros_procedimento" ADD CONSTRAINT "registros_procedimento_profissional_id_profissionais_id_fk" FOREIGN KEY ("profissional_id") REFERENCES "public"."profissionais"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modelos_mensagem" ADD CONSTRAINT "modelos_mensagem_clinica_id_clinicas_id_fk" FOREIGN KEY ("clinica_id") REFERENCES "public"."clinicas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "clinicas_select" ON "clinicas" AS PERMISSIVE FOR SELECT TO "authenticated" USING (id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "clinicas_insert" ON "clinicas" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "clinicas_update" ON "clinicas" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (id in (select private.user_clinica_ids())) WITH CHECK (id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "clinicas_delete" ON "clinicas" AS PERMISSIVE FOR DELETE TO "authenticated" USING (id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "memberships_select" ON "memberships" AS PERMISSIVE FOR SELECT TO "authenticated" USING (profile_id = (select auth.uid()) or clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "memberships_insert" ON "memberships" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (profile_id = (select auth.uid()) or clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "memberships_update" ON "memberships" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "memberships_delete" ON "memberships" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "profiles_select_self" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = id);--> statement-breakpoint
CREATE POLICY "profiles_insert_self" ON "profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = id);--> statement-breakpoint
CREATE POLICY "profiles_update_self" ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = id);--> statement-breakpoint
CREATE POLICY "categorias_procedimento_select" ON "categorias_procedimento" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "categorias_procedimento_insert" ON "categorias_procedimento" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "categorias_procedimento_update" ON "categorias_procedimento" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "categorias_procedimento_delete" ON "categorias_procedimento" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "comissao_regras_select" ON "comissao_regras" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "comissao_regras_insert" ON "comissao_regras" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "comissao_regras_update" ON "comissao_regras" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "comissao_regras_delete" ON "comissao_regras" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "fichas_atendimento_select" ON "fichas_atendimento" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "fichas_atendimento_insert" ON "fichas_atendimento" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "fichas_atendimento_update" ON "fichas_atendimento" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "fichas_atendimento_delete" ON "fichas_atendimento" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "fornecedores_select" ON "fornecedores" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "fornecedores_insert" ON "fornecedores" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "fornecedores_update" ON "fornecedores" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "fornecedores_delete" ON "fornecedores" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "modelos_documento_select" ON "modelos_documento" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "modelos_documento_insert" ON "modelos_documento" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "modelos_documento_update" ON "modelos_documento" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "modelos_documento_delete" ON "modelos_documento" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "pacientes_select" ON "pacientes" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "pacientes_insert" ON "pacientes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "pacientes_update" ON "pacientes" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "pacientes_delete" ON "pacientes" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "pacote_itens_select" ON "pacote_itens" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "pacote_itens_insert" ON "pacote_itens" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "pacote_itens_update" ON "pacote_itens" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "pacote_itens_delete" ON "pacote_itens" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "pacotes_select" ON "pacotes" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "pacotes_insert" ON "pacotes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "pacotes_update" ON "pacotes" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "pacotes_delete" ON "pacotes" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "procedimentos_select" ON "procedimentos" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "procedimentos_insert" ON "procedimentos" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "procedimentos_update" ON "procedimentos" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "procedimentos_delete" ON "procedimentos" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "profissionais_select" ON "profissionais" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "profissionais_insert" ON "profissionais" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "profissionais_update" ON "profissionais" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "profissionais_delete" ON "profissionais" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "profissional_horarios_select" ON "profissional_horarios" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "profissional_horarios_insert" ON "profissional_horarios" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "profissional_horarios_update" ON "profissional_horarios" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "profissional_horarios_delete" ON "profissional_horarios" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "profissional_procedimentos_select" ON "profissional_procedimentos" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "profissional_procedimentos_insert" ON "profissional_procedimentos" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "profissional_procedimentos_update" ON "profissional_procedimentos" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "profissional_procedimentos_delete" ON "profissional_procedimentos" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "estoque_itens_select" ON "estoque_itens" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "estoque_itens_insert" ON "estoque_itens" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "estoque_itens_update" ON "estoque_itens" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "estoque_itens_delete" ON "estoque_itens" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "estoque_movimentos_select" ON "estoque_movimentos" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "estoque_movimentos_insert" ON "estoque_movimentos" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "estoque_movimentos_update" ON "estoque_movimentos" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "estoque_movimentos_delete" ON "estoque_movimentos" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "agendamentos_select" ON "agendamentos" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "agendamentos_insert" ON "agendamentos" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "agendamentos_update" ON "agendamentos" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "agendamentos_delete" ON "agendamentos" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "categorias_conta_select" ON "categorias_conta" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "categorias_conta_insert" ON "categorias_conta" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "categorias_conta_update" ON "categorias_conta" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "categorias_conta_delete" ON "categorias_conta" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "comissoes_select" ON "comissoes" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "comissoes_insert" ON "comissoes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "comissoes_update" ON "comissoes" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "comissoes_delete" ON "comissoes" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "contas_financeiras_select" ON "contas_financeiras" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "contas_financeiras_insert" ON "contas_financeiras" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "contas_financeiras_update" ON "contas_financeiras" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "contas_financeiras_delete" ON "contas_financeiras" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "lancamentos_select" ON "lancamentos" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "lancamentos_insert" ON "lancamentos" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "lancamentos_update" ON "lancamentos" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "lancamentos_delete" ON "lancamentos" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "metodos_pagamento_select" ON "metodos_pagamento" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "metodos_pagamento_insert" ON "metodos_pagamento" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "metodos_pagamento_update" ON "metodos_pagamento" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "metodos_pagamento_delete" ON "metodos_pagamento" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "carteiras_select" ON "carteiras" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "carteiras_insert" ON "carteiras" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "carteiras_update" ON "carteiras" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "carteiras_delete" ON "carteiras" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "orcamento_itens_select" ON "orcamento_itens" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "orcamento_itens_insert" ON "orcamento_itens" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "orcamento_itens_update" ON "orcamento_itens" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "orcamento_itens_delete" ON "orcamento_itens" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "orcamentos_select" ON "orcamentos" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "orcamentos_insert" ON "orcamentos" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "orcamentos_update" ON "orcamentos" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "orcamentos_delete" ON "orcamentos" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "registros_procedimento_select" ON "registros_procedimento" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "registros_procedimento_insert" ON "registros_procedimento" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "registros_procedimento_update" ON "registros_procedimento" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "registros_procedimento_delete" ON "registros_procedimento" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "modelos_mensagem_select" ON "modelos_mensagem" AS PERMISSIVE FOR SELECT TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "modelos_mensagem_insert" ON "modelos_mensagem" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "modelos_mensagem_update" ON "modelos_mensagem" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids())) WITH CHECK (clinica_id in (select private.user_clinica_ids()));--> statement-breakpoint
CREATE POLICY "modelos_mensagem_delete" ON "modelos_mensagem" AS PERMISSIVE FOR DELETE TO "authenticated" USING (clinica_id in (select private.user_clinica_ids()));