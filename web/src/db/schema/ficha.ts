// Ficha do paciente: registros de procedimento (com mapa de injetáveis em jsonb),
// orçamentos (+ itens) e carteira. Specs 08, 09.
import {
  boolean,
  date,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
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
    pacienteId: uuid("paciente_id")
      .notNull()
      .references(() => pacientes.id, { onDelete: "cascade" }),
    procedimentoId: uuid("procedimento_id").references(() => procedimentos.id, {
      onDelete: "set null",
    }),
    profissionalId: uuid("profissional_id").references(() => profissionais.id, {
      onDelete: "set null",
    }),
    procedimentoNome: text("procedimento_nome").notNull(), // snapshot do nome
    profissionalNome: text("profissional_nome"),
    data: date().notNull(),
    status: statusRegistroProcEnum().notNull().default("agendado"),
    valor: numeric({ precision: 12, scale: 2 }).notNull().default("0"),
    observacoes: text(),
    usaMapa: boolean("usa_mapa").notNull().default(false),
    mapa: jsonb(), // FichaInjetaveis serializável (pontos/rastreio/relatorio)
    ...timestamps,
  },
  () => tenantPolicies("registros_procedimento")
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
  () => tenantPolicies("orcamentos")
);

/** Linhas do orçamento (procedimentos/produtos). */
export const orcamentoItens = pgTable(
  "orcamento_itens",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    orcamentoId: uuid("orcamento_id")
      .notNull()
      .references(() => orcamentos.id, { onDelete: "cascade" }),
    nome: text().notNull(),
    quantidade: integer().notNull().default(1),
    valorUnitario: numeric("valor_unitario", { precision: 12, scale: 2 }).notNull().default("0"),
    descontoValor: numeric("desconto_valor", { precision: 12, scale: 2 }).notNull().default("0"),
    descontoPercentual: boolean("desconto_percentual").notNull().default(false),
    total: numeric({ precision: 14, scale: 2 }).notNull().default("0"),
    ...timestamps,
  },
  () => tenantPolicies("orcamento_itens")
);

/* ---------- Carteira do paciente (saldo/cashback) ---------- */
export const carteiras = pgTable(
  "carteiras",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    pacienteId: uuid("paciente_id")
      .notNull()
      .references(() => pacientes.id, { onDelete: "cascade" }),
    saldo: numeric({ precision: 14, scale: 2 }).notNull().default("0"),
    cashback: numeric({ precision: 14, scale: 2 }).notNull().default("0"),
    ...timestamps,
  },
  () => tenantPolicies("carteiras")
);
