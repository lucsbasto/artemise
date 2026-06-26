// Cadastros base: pacientes, profissionais (+ sub-tabelas), fornecedores,
// procedimentos, categorias, pacotes, fichas de atendimento, modelos de documento.
// Specs 07, 10, 11, 32, 33, 34, 35, 36.
//
// Padrão multitenant:
//  - Tabelas "pai" ganham unique(clinica_id, id) → alvo de FK composta same-tenant
//    e serve de índice do clinica_id (coluna líder).
//  - Tabelas "filho" referenciam o pai por FK COMPOSTA (clinica_id, pai_id), o que
//    impede anexar um filho a um pai de outro tenant (S3 da revisão).
import {
  boolean,
  date,
  foreignKey,
  index,
  integer,
  numeric,
  pgTable,
  text,
  unique,
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
    telefone: text(),
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
  (t) => [unique("pacientes_clinica_id_id_uq").on(t.clinicaId, t.id), ...tenantPolicies("pacientes")]
);

/* ---------- Profissionais (spec 10 — contato + cadastro completo) ---------- */
export const profissionais = pgTable(
  "profissionais",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    profileId: uuid("profile_id").references(() => profiles.id, { onDelete: "set null" }),
    nome: text().notNull(),
    cpf: text(),
    dataNascimento: date("data_nascimento"),
    telefone: text(),
    email: text(),
    ativo: boolean().notNull().default(true),
    conselho: conselhoEnum(),
    registro: text(),
    ufRegistro: text("uf_registro"),
    especialidade: text(),
    certificacoes: text().array().notNull().default([]),
    vinculo: vinculoEnum(),
    chavePix: text("chave_pix"),
    perfilAcesso: perfilAcessoEnum("perfil_acesso").notNull().default("profissional"),
    ...timestamps,
  },
  (t) => [
    unique("profissionais_clinica_id_id_uq").on(t.clinicaId, t.id),
    ...tenantPolicies("profissionais"),
  ]
);

/** Janela de trabalho por dia da semana (0=Dom..6=Sáb). */
export const profissionalHorarios = pgTable(
  "profissional_horarios",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    profissionalId: uuid("profissional_id").notNull(),
    diaSemana: integer("dia_semana").notNull(),
    inicio: text().notNull(),
    fim: text().notNull(),
    ...timestamps,
  },
  (t) => [
    foreignKey({
      columns: [t.clinicaId, t.profissionalId],
      foreignColumns: [profissionais.clinicaId, profissionais.id],
      name: "profissional_horarios_profissional_fk",
    }).onDelete("cascade"),
    index("profissional_horarios_clinica_id_idx").on(t.clinicaId),
    ...tenantPolicies("profissional_horarios"),
  ]
);

/** M2M: procedimentos que o profissional executa. */
export const profissionalProcedimentos = pgTable(
  "profissional_procedimentos",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    profissionalId: uuid("profissional_id").notNull(),
    procedimentoId: uuid("procedimento_id").notNull(),
    ...timestamps,
  },
  (t) => [
    foreignKey({
      columns: [t.clinicaId, t.profissionalId],
      foreignColumns: [profissionais.clinicaId, profissionais.id],
      name: "profissional_procedimentos_profissional_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [t.clinicaId, t.procedimentoId],
      foreignColumns: [procedimentos.clinicaId, procedimentos.id],
      name: "profissional_procedimentos_procedimento_fk",
    }).onDelete("cascade"),
    unique("profissional_procedimentos_uq").on(t.profissionalId, t.procedimentoId),
    ...tenantPolicies("profissional_procedimentos"),
  ]
);

/** Regra de comissão (procedimento específico ou padrão quando procedimentoId nulo). */
export const comissaoRegras = pgTable(
  "comissao_regras",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    profissionalId: uuid("profissional_id").notNull(),
    procedimentoId: uuid("procedimento_id"),
    tipo: comissaoTipoEnum().notNull(),
    valor: numeric({ precision: 12, scale: 2 }).notNull(),
    ...timestamps,
  },
  (t) => [
    foreignKey({
      columns: [t.clinicaId, t.profissionalId],
      foreignColumns: [profissionais.clinicaId, profissionais.id],
      name: "comissao_regras_profissional_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [t.clinicaId, t.procedimentoId],
      foreignColumns: [procedimentos.clinicaId, procedimentos.id],
      name: "comissao_regras_procedimento_fk",
    }).onDelete("cascade"),
    index("comissao_regras_clinica_id_idx").on(t.clinicaId),
    ...tenantPolicies("comissao_regras"),
  ]
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
  (t) => [
    index("fornecedores_clinica_id_idx").on(t.clinicaId),
    ...tenantPolicies("fornecedores"),
  ]
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
  (t) => [
    unique("categorias_procedimento_clinica_id_id_uq").on(t.clinicaId, t.id),
    ...tenantPolicies("categorias_procedimento"),
  ]
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
    cor: text(),
    ativo: boolean().notNull().default(true),
    usaMapa: boolean("usa_mapa").notNull().default(false),
    ...timestamps,
  },
  (t) => [
    unique("procedimentos_clinica_id_id_uq").on(t.clinicaId, t.id),
    // categoria_id é FK simples set-null (ref opcional). Same-tenant não é forçado no
    // banco aqui — validar no app (write via withTenant). Composta exigiria cascade.
    ...tenantPolicies("procedimentos"),
  ]
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
  (t) => [unique("pacotes_clinica_id_id_uq").on(t.clinicaId, t.id), ...tenantPolicies("pacotes")]
);

/** Itens (procedimentos/produtos) que compõem o pacote. */
export const pacoteItens = pgTable(
  "pacote_itens",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    pacoteId: uuid("pacote_id").notNull(),
    nome: text().notNull(),
    quantidade: integer().notNull().default(1),
    valorUnitario: numeric("valor_unitario", { precision: 12, scale: 2 }).notNull().default("0"),
    ...timestamps,
  },
  (t) => [
    foreignKey({
      columns: [t.clinicaId, t.pacoteId],
      foreignColumns: [pacotes.clinicaId, pacotes.id],
      name: "pacote_itens_pacote_fk",
    }).onDelete("cascade"),
    index("pacote_itens_clinica_id_idx").on(t.clinicaId),
    ...tenantPolicies("pacote_itens"),
  ]
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
  (t) => [
    index("fichas_atendimento_clinica_id_idx").on(t.clinicaId),
    ...tenantPolicies("fichas_atendimento"),
  ]
);

/* ---------- Modelos de atestados e prescrições (spec 36) ---------- */
export const modelosDocumento = pgTable(
  "modelos_documento",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    nome: text().notNull(),
    tipo: text().notNull(),
    corpo: text(),
    ativo: boolean().notNull().default(true),
    ...timestamps,
  },
  (t) => [
    index("modelos_documento_clinica_id_idx").on(t.clinicaId),
    ...tenantPolicies("modelos_documento"),
  ]
);
