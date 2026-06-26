// Comunicação: modelos de mensagens do sistema (spec 29).
import { boolean, jsonb, pgTable, text, unique, uuid } from "drizzle-orm/pg-core";
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
    corpo: text(),
    ativo: boolean().notNull().default(true),
    ...timestamps,
  },
  (t) => [
    // 1 modelo por chave por clínica (a unique já indexa o clinica_id na coluna líder).
    unique("modelos_mensagem_clinica_chave_uq").on(t.clinicaId, t.chave),
    ...tenantPolicies("modelos_mensagem"),
  ]
);
