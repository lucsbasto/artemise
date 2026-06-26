// Agenda: agendamentos (calendário + relatório + eventos/sala de espera unificados).
// Specs 02-06.
import { integer, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { timestamps, tenantPolicies } from "./_helpers";
import { clinicaFk } from "./tenancy";
import { pacientes, procedimentos, profissionais } from "./cadastros";
import { agendaStatusEnum, agendaTipoEnum } from "./_enums";

export const agendamentos = pgTable(
  "agendamentos",
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicaId: clinicaFk(),
    tipo: agendaTipoEnum().notNull().default("Agendamento"),
    status: agendaStatusEnum().notNull().default("Agendado"),
    // relacionamentos (nulos p/ bloqueio/lembrete/evento)
    pacienteId: uuid("paciente_id").references(() => pacientes.id, { onDelete: "set null" }),
    profissionalId: uuid("profissional_id").references(() => profissionais.id, {
      onDelete: "set null",
    }),
    procedimentoId: uuid("procedimento_id").references(() => procedimentos.id, {
      onDelete: "set null",
    }),
    inicio: timestamp({ withTimezone: true }).notNull(),
    fim: timestamp({ withTimezone: true }).notNull(),
    duracaoMin: integer("duracao_min"),
    valor: numeric({ precision: 12, scale: 2 }),
    recorrencia: text().notNull().default("Não se repete"),
    observacao: text(),
    ...timestamps,
  },
  () => tenantPolicies("agendamentos")
);
