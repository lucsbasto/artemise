// Estoque: itens + ledger de movimentos (entrada/saída/ajuste). Specs 24-27.
import { numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps, tenantPolicies } from "./_helpers";
import { clinicaFk } from "./tenancy";
import { estoqueMovTipoEnum } from "./_enums";

export const estoqueItens = pgTable(
  "estoque_itens",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    nome: text().notNull(),
    sku: text(),
    categoria: text().notNull(), // Injetáveis | Material de atendimento | Revenda
    unidade: text().notNull().default("un"),
    saldo: numeric({ precision: 14, scale: 3 }).notNull().default("0"),
    minimo: numeric({ precision: 14, scale: 3 }).notNull().default("0"),
    custo: numeric({ precision: 12, scale: 2 }).notNull().default("0"),
    ...timestamps,
  },
  () => tenantPolicies("estoque_itens")
);

/** Movimento de estoque (giro/contagem/abertura de item, baixa por procedimento). */
export const estoqueMovimentos = pgTable(
  "estoque_movimentos",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    itemId: uuid("item_id")
      .notNull()
      .references(() => estoqueItens.id, { onDelete: "cascade" }),
    tipo: estoqueMovTipoEnum().notNull(),
    quantidade: numeric({ precision: 14, scale: 3 }).notNull(),
    motivo: text(), // ex.: baixa de procedimento, contagem, abertura
    referenciaId: uuid("referencia_id"), // ex.: registro_procedimento que gerou a baixa
    ...timestamps,
  },
  () => tenantPolicies("estoque_movimentos")
);
