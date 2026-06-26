// Comunicação: modelos de mensagens do sistema (spec 29).
import { boolean, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps, tenantPolicies } from "./_helpers";
import { clinicaFk } from "./tenancy";

export const modelosMensagem = pgTable(
  "modelos_mensagem",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    chave: text().notNull(), // ex.: aniversario, boas-vindas
    icone: text().notNull(),
    titulo: text().notNull(),
    descricao: text(),
    canais: jsonb().notNull().default([]), // CanalMensagem[]
    corpo: text(), // conteúdo personalizado
    ativo: boolean().notNull().default(true),
    ...timestamps,
  },
  () => tenantPolicies("modelos_mensagem")
);
