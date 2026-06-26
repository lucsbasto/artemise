// Ficha do paciente: registros de procedimento (com mapa de injetáveis em jsonb),
// orçamentos (+ itens) e carteira. Specs 08, 09.
import {
  boolean,
  date,
  foreignKey,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { timestamps, tenantPolicies } from "./_helpers";
import { clinicaFk } from "./tenancy";
import { pacientes, procedimentos, profissionais } from "./cadastros";
import { statusRegistroProcEnum } from "./_enums";

/* ---------- Registro de procedimento na ficha (executado/agendado) ---------- */
export const registrosProcedimento = pgTable(
  "registros_procedimento",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    pacienteId: uuid("paciente_id").notNull(),
    // refs ao catálogo são opcionais (snapshot do nome preserva histórico) → set-null simples.
    procedimentoId: uuid("procedimento_id").references(() => procedimentos.id, {
      onDelete: "set null",
    }),
    profissionalId: uuid("profissional_id").references(() => profissionais.id, {
      onDelete: "set null",
    }),
    procedimentoNome: text("procedimento_nome").notNull(),
    profissionalNome: text("profissional_nome"),
    data: date().notNull(),
    status: statusRegistroProcEnum().notNull().default("agendado"),
    valor: numeric({ precision: 12, scale: 2 }).notNull().default("0"),
    observacoes: text(),
    usaMapa: boolean("usa_mapa").notNull().default(false),
    mapa: jsonb(), // FichaInjetaveis serializável (pontos/rastreio/relatorio)
    ...timestamps,
  },
  (t) => [
    // registro pertence ao paciente (same-tenant garantido pela composta cascade).
    foreignKey({
      columns: [t.clinicaId, t.pacienteId],
      foreignColumns: [pacientes.clinicaId, pacientes.id],
      name: "registros_procedimento_paciente_fk",
    }).onDelete("cascade"),
    index("registros_procedimento_paciente_id_idx").on(t.pacienteId),
    ...tenantPolicies("registros_procedimento"),
  ]
);

/* ---------- Orçamentos (spec 09) ---------- */
export const orcamentos = pgTable(
  "orcamentos",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    pacienteId: uuid("paciente_id").references(() => pacientes.id, { onDelete: "set null" }),
    clienteNome: text("cliente_nome").notNull(),
    vendedorNome: text("vendedor_nome"),
    desconto: numeric({ precision: 12, scale: 2 }).notNull().default("0"),
    total: numeric({ precision: 14, scale: 2 }).notNull().default("0"),
    condicoesPagamento: text("condicoes_pagamento"),
    data: date().notNull(),
    ...timestamps,
  },
  (t) => [
    unique("orcamentos_clinica_id_id_uq").on(t.clinicaId, t.id),
    index("orcamentos_clinica_id_idx").on(t.clinicaId),
    ...tenantPolicies("orcamentos"),
  ]
);

/** Linhas do orçamento (procedimentos/produtos). */
export const orcamentoItens = pgTable(
  "orcamento_itens",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    orcamentoId: uuid("orcamento_id").notNull(),
    nome: text().notNull(),
    quantidade: integer().notNull().default(1),
    valorUnitario: numeric("valor_unitario", { precision: 12, scale: 2 }).notNull().default("0"),
    descontoValor: numeric("desconto_valor", { precision: 12, scale: 2 }).notNull().default("0"),
    descontoPercentual: boolean("desconto_percentual").notNull().default(false),
    total: numeric({ precision: 14, scale: 2 }).notNull().default("0"),
    ...timestamps,
  },
  (t) => [
    foreignKey({
      columns: [t.clinicaId, t.orcamentoId],
      foreignColumns: [orcamentos.clinicaId, orcamentos.id],
      name: "orcamento_itens_orcamento_fk",
    }).onDelete("cascade"),
    index("orcamento_itens_clinica_id_idx").on(t.clinicaId),
    ...tenantPolicies("orcamento_itens"),
  ]
);

/* ---------- Carteira do paciente (saldo/cashback) — 1:1 ---------- */
export const carteiras = pgTable(
  "carteiras",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    pacienteId: uuid("paciente_id").notNull(),
    saldo: numeric({ precision: 14, scale: 2 }).notNull().default("0"),
    cashback: numeric({ precision: 14, scale: 2 }).notNull().default("0"),
    ...timestamps,
  },
  (t) => [
    foreignKey({
      columns: [t.clinicaId, t.pacienteId],
      foreignColumns: [pacientes.clinicaId, pacientes.id],
      name: "carteiras_paciente_fk",
    }).onDelete("cascade"),
    unique("carteiras_paciente_uq").on(t.clinicaId, t.pacienteId),
    ...tenantPolicies("carteiras"),
  ]
);
