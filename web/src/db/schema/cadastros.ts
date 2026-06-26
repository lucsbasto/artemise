// Cadastros base: pacientes, profissionais (+ sub-tabelas), fornecedores,
// procedimentos, categorias, pacotes, fichas de atendimento, modelos de documento.
// Specs 07, 10, 11, 32, 33, 34, 35, 36.
import {
  boolean,
  date,
  integer,
  numeric,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { timestamps, tenantPolicies } from "./_helpers";
import { clinicaFk, profiles } from "./tenancy";
import {
  categoriaProcEnum,
  comissaoTipoEnum,
  conselhoEnum,
  perfilAcessoEnum,
  vinculoEnum,
} from "./_enums";

/* ---------- Pacientes (spec 07/08) ---------- */
export const pacientes = pgTable(
  "pacientes",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    nome: text().notNull(),
    tipo: text().notNull().default("Paciente"),
    etiquetas: text().array().notNull().default([]),
    telefone: text(), // identificador
    cpf: text(),
    email: text(),
    sexo: text(),
    dataNascimento: date("data_nascimento"),
    endereco: text(),
    observacoes: text(),
    recebeNotificacoes: boolean("recebe_notificacoes").notNull().default(false),
    ativo: boolean().notNull().default(true),
    ...timestamps,
  },
  () => tenantPolicies("pacientes")
);

/* ---------- Profissionais (spec 10 — contato + cadastro completo) ---------- */
export const profissionais = pgTable(
  "profissionais",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    // vínculo opcional com um usuário logável da plataforma
    profileId: uuid("profile_id").references(() => profiles.id, { onDelete: "set null" }),
    nome: text().notNull(),
    cpf: text(),
    dataNascimento: date("data_nascimento"),
    telefone: text(),
    email: text(),
    ativo: boolean().notNull().default(true),
    // habilitação
    conselho: conselhoEnum(),
    registro: text(),
    ufRegistro: text("uf_registro"),
    especialidade: text(),
    certificacoes: text().array().notNull().default([]),
    // atuação / financeiro / acesso
    vinculo: vinculoEnum(),
    chavePix: text("chave_pix"),
    perfilAcesso: perfilAcessoEnum("perfil_acesso").notNull().default("profissional"),
    ...timestamps,
  },
  () => tenantPolicies("profissionais")
);

/** Janela de trabalho por dia da semana (0=Dom..6=Sáb). */
export const profissionalHorarios = pgTable(
  "profissional_horarios",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    profissionalId: uuid("profissional_id")
      .notNull()
      .references(() => profissionais.id, { onDelete: "cascade" }),
    diaSemana: integer("dia_semana").notNull(),
    inicio: text().notNull(), // "HH:mm"
    fim: text().notNull(),
    ...timestamps,
  },
  () => tenantPolicies("profissional_horarios")
);

/** M2M: procedimentos que o profissional executa. */
export const profissionalProcedimentos = pgTable(
  "profissional_procedimentos",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    profissionalId: uuid("profissional_id")
      .notNull()
      .references(() => profissionais.id, { onDelete: "cascade" }),
    procedimentoId: uuid("procedimento_id")
      .notNull()
      .references(() => procedimentos.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  () => tenantPolicies("profissional_procedimentos")
);

/** Regra de comissão (procedimento específico ou padrão quando procedimentoId nulo). */
export const comissaoRegras = pgTable(
  "comissao_regras",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    profissionalId: uuid("profissional_id")
      .notNull()
      .references(() => profissionais.id, { onDelete: "cascade" }),
    procedimentoId: uuid("procedimento_id").references(() => procedimentos.id, {
      onDelete: "cascade",
    }),
    tipo: comissaoTipoEnum().notNull(),
    valor: numeric({ precision: 12, scale: 2 }).notNull(), // % (0-100) ou R$
    ...timestamps,
  },
  () => tenantPolicies("comissao_regras")
);

/* ---------- Fornecedores (spec 11) ---------- */
export const fornecedores = pgTable(
  "fornecedores",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    nome: text().notNull(),
    tipo: text().notNull().default("Fornecedor"),
    etiquetas: text().array().notNull().default([]),
    telefone: text(),
    documento: text(),
    email: text(),
    ativo: boolean().notNull().default(true),
    ...timestamps,
  },
  () => tenantPolicies("fornecedores")
);

/* ---------- Categorias de procedimento (spec 33) ---------- */
export const categoriasProcedimento = pgTable(
  "categorias_procedimento",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    nome: text().notNull(),
    ativo: boolean().notNull().default(true),
    ...timestamps,
  },
  () => tenantPolicies("categorias_procedimento")
);

/* ---------- Procedimentos (catálogo — spec 32) ---------- */
export const procedimentos = pgTable(
  "procedimentos",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    nome: text().notNull(),
    categoria: categoriaProcEnum(),
    categoriaId: uuid("categoria_id").references(() => categoriasProcedimento.id, {
      onDelete: "set null",
    }),
    duracaoMin: integer("duracao_min").notNull().default(60),
    valor: numeric({ precision: 12, scale: 2 }).notNull().default("0"),
    cor: text(), // hex da paleta do modal
    ativo: boolean().notNull().default(true),
    usaMapa: boolean("usa_mapa").notNull().default(false), // injetáveis → MapaInjetaveis
    ...timestamps,
  },
  () => tenantPolicies("procedimentos")
);

/* ---------- Pacotes (spec 34) ---------- */
export const pacotes = pgTable(
  "pacotes",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    descricao: text().notNull(),
    valorTotal: numeric("valor_total", { precision: 12, scale: 2 }).notNull().default("0"),
    validade: text().notNull().default("Ilimitado"),
    ativo: boolean().notNull().default(true),
    ...timestamps,
  },
  () => tenantPolicies("pacotes")
);

/** Itens (procedimentos/produtos) que compõem o pacote. */
export const pacoteItens = pgTable(
  "pacote_itens",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    pacoteId: uuid("pacote_id")
      .notNull()
      .references(() => pacotes.id, { onDelete: "cascade" }),
    nome: text().notNull(),
    quantidade: integer().notNull().default(1),
    valorUnitario: numeric("valor_unitario", { precision: 12, scale: 2 }).notNull().default("0"),
    ...timestamps,
  },
  () => tenantPolicies("pacote_itens")
);

/* ---------- Fichas de atendimento (spec 35) ---------- */
export const fichasAtendimento = pgTable(
  "fichas_atendimento",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    nome: text().notNull(),
    ativo: boolean().notNull().default(true),
    ...timestamps,
  },
  () => tenantPolicies("fichas_atendimento")
);

/* ---------- Modelos de atestados e prescrições (spec 36) ---------- */
export const modelosDocumento = pgTable(
  "modelos_documento",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    nome: text().notNull(),
    tipo: text().notNull(),
    corpo: text(), // HTML do editor WYSIWYG
    ativo: boolean().notNull().default(true),
    ...timestamps,
  },
  () => tenantPolicies("modelos_documento")
);
