// Financeiro: contas, categorias (árvore), métodos de pagamento, lançamentos
// (ledger receita/despesa unificado) e comissões. Specs 12-23.
import {
  boolean,
  date,
  foreignKey,
  numeric,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { timestamps, tenantPolicies } from "./_helpers";
import { clinicaFk } from "./tenancy";
import { pacientes, profissionais } from "./cadastros";
import {
  contaIconEnum,
  financeStatusEnum,
  financeTipoEnum,
  metodoPgtoEnum,
} from "./_enums";

/* ---------- Contas financeiras (spec 20) ---------- */
export const contasFinanceiras = pgTable(
  "contas_financeiras",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    nome: text().notNull(),
    tipo: text().notNull(), // Caixa | Conta Corrente | Carteira
    saldoInicial: numeric("saldo_inicial", { precision: 14, scale: 2 }).notNull().default("0"),
    icon: contaIconEnum().notNull().default("bank"),
    ...timestamps,
  },
  () => tenantPolicies("contas_financeiras")
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
    tipo: text().notNull(), // Dinheiro | PIX | Cartão | Boleto | Transferência
    marca: text(),
    ativo: boolean().notNull().default(true),
    ...timestamps,
  },
  () => tenantPolicies("metodos_pagamento")
);

/* ---------- Lançamentos (títulos a receber/pagar — specs 13-18) ----------
   Ledger único: contas a receber (13), a pagar (14), extrato (15),
   competência (16), fluxo de caixa (17/18) são views/agregações sobre esta tabela. */
export const lancamentos = pgTable(
  "lancamentos",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    descricao: text().notNull(),
    tipo: financeTipoEnum().notNull(), // receita | despesa
    situacao: financeStatusEnum().notNull().default("Em aberto"),
    valor: numeric({ precision: 14, scale: 2 }).notNull(),
    vencimento: date().notNull(),
    execucao: date(), // liquidação (recebimento/pagamento); null = não liquidado
    metodo: metodoPgtoEnum(),
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
  () => tenantPolicies("lancamentos")
);

/* ---------- Comissões (spec 23) ---------- */
export const comissoes = pgTable(
  "comissoes",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    profissionalId: uuid("profissional_id")
      .notNull()
      .references(() => profissionais.id, { onDelete: "cascade" }),
    referencia: text().notNull(), // procedimento/título de origem
    data: date().notNull(),
    base: numeric({ precision: 14, scale: 2 }).notNull(),
    percentual: numeric({ precision: 5, scale: 2 }),
    valor: numeric({ precision: 14, scale: 2 }).notNull(),
    situacao: financeStatusEnum().notNull().default("Em aberto"),
    ...timestamps,
  },
  () => tenantPolicies("comissoes")
);
