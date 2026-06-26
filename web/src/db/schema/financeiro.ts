// Financeiro: contas, categorias (árvore), métodos de pagamento, lançamentos
// (ledger receita/despesa unificado) e comissões. Specs 12-23.
import {
  boolean,
  date,
  foreignKey,
  index,
  numeric,
  pgTable,
  text,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { timestamps, tenantPolicies } from "./_helpers";
import { clinicaFk } from "./tenancy";
import { pacientes, profissionais } from "./cadastros";
import { contaIconEnum, financeStatusEnum, financeTipoEnum } from "./_enums";

/* ---------- Contas financeiras (spec 20) ---------- */
export const contasFinanceiras = pgTable(
  "contas_financeiras",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    nome: text().notNull(),
    tipo: text().notNull(),
    saldoInicial: numeric("saldo_inicial", { precision: 14, scale: 2 }).notNull().default("0"),
    icon: contaIconEnum().notNull().default("bank"),
    ...timestamps,
  },
  (t) => [
    unique("contas_financeiras_clinica_id_id_uq").on(t.clinicaId, t.id),
    ...tenantPolicies("contas_financeiras"),
  ]
);

/* ---------- Categorias de contas (árvore self-ref — spec 21) ---------- */
export const categoriasConta = pgTable(
  "categorias_conta",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    descricao: text().notNull(),
    ativo: boolean().notNull().default(true),
    parentId: uuid("parent_id"),
    ...timestamps,
  },
  (t) => [
    unique("categorias_conta_clinica_id_id_uq").on(t.clinicaId, t.id),
    // self-ref cascade simples (mesmo tenant por construção; cascade = clinica-safe).
    foreignKey({
      columns: [t.parentId],
      foreignColumns: [t.id],
      name: "categorias_conta_parent_fk",
    }).onDelete("cascade"),
    ...tenantPolicies("categorias_conta"),
  ]
);

/* ---------- Métodos de pagamento (spec 22) ---------- */
export const metodosPagamento = pgTable(
  "metodos_pagamento",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    descricao: text().notNull(),
    tipo: text().notNull(),
    marca: text(),
    ativo: boolean().notNull().default(true),
    ...timestamps,
  },
  (t) => [
    unique("metodos_pagamento_clinica_id_id_uq").on(t.clinicaId, t.id),
    ...tenantPolicies("metodos_pagamento"),
  ]
);

/* ---------- Lançamentos (títulos a receber/pagar — specs 13-18) ----------
   Ledger único: contas a receber (13), a pagar (14), extrato (15),
   competência (16), fluxo de caixa (17/18) são views/agregações sobre esta tabela.
   Refs opcionais = FK simples set-null (cascade-safe); same-tenant validado no app. */
export const lancamentos = pgTable(
  "lancamentos",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    descricao: text().notNull(),
    tipo: financeTipoEnum().notNull(),
    situacao: financeStatusEnum().notNull().default("Em aberto"),
    valor: numeric({ precision: 14, scale: 2 }).notNull(),
    vencimento: date().notNull(),
    execucao: date(), // liquidação; null = não liquidado
    categoriaContaId: uuid("categoria_conta_id").references(() => categoriasConta.id, {
      onDelete: "set null",
    }),
    contaFinanceiraId: uuid("conta_financeira_id").references(() => contasFinanceiras.id, {
      onDelete: "set null",
    }),
    metodoPagamentoId: uuid("metodo_pagamento_id").references(() => metodosPagamento.id, {
      onDelete: "set null",
    }),
    pacienteId: uuid("paciente_id").references(() => pacientes.id, { onDelete: "set null" }),
    profissionalId: uuid("profissional_id").references(() => profissionais.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  (t) => [
    index("lancamentos_clinica_id_idx").on(t.clinicaId),
    index("lancamentos_clinica_vencimento_idx").on(t.clinicaId, t.vencimento),
    index("lancamentos_paciente_id_idx").on(t.pacienteId),
    ...tenantPolicies("lancamentos"),
  ]
);

/* ---------- Comissões (spec 23) ---------- */
export const comissoes = pgTable(
  "comissoes",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    profissionalId: uuid("profissional_id").notNull(),
    referencia: text().notNull(),
    data: date().notNull(),
    base: numeric({ precision: 14, scale: 2 }).notNull(),
    percentual: numeric({ precision: 5, scale: 2 }),
    valor: numeric({ precision: 14, scale: 2 }).notNull(),
    situacao: financeStatusEnum().notNull().default("Em aberto"),
    ...timestamps,
  },
  (t) => [
    foreignKey({
      columns: [t.clinicaId, t.profissionalId],
      foreignColumns: [profissionais.clinicaId, profissionais.id],
      name: "comissoes_profissional_fk",
    }).onDelete("cascade"),
    index("comissoes_clinica_id_idx").on(t.clinicaId),
    ...tenantPolicies("comissoes"),
  ]
);
