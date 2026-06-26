// Núcleo de tenancy/identidade: clinicas (tenant), profiles (1:1 auth.users),
// memberships (profile↔clinica + role). Specs 30/31.
import { sql } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  index,
  jsonb,
  pgPolicy,
  pgTable,
  text,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { authenticatedRole, authUsers } from "drizzle-orm/supabase";
import { timestamps } from "./_helpers";
import { membershipRoleEnum, pessoaTipoEnum } from "./_enums";

/** Tenant raiz. Dados da clínica (spec 31) + preferências do sistema (spec 30). */
export const clinicas = pgTable(
  "clinicas",
  {
    id: uuid().primaryKey().defaultRandom(),
    nome: text().notNull(),
    pessoaTipo: pessoaTipoEnum("pessoa_tipo").notNull().default("juridica"),
    documento: text(), // CPF (física) ou CNPJ (jurídica)
    email: text(),
    telefone: text(),
    logoUrl: text("logo_url"),
    enderecoComercial: jsonb("endereco_comercial"),
    enderecoCobranca: jsonb("endereco_cobranca"),
    preferencias: jsonb().notNull().default(sql`'{}'::jsonb`), // toggles Geral/Financeiro (spec 30)
    ...timestamps,
  },
  () => [
    // Vê clínicas das quais é membro. Criar só via RPC create_clinica (insert=false).
    pgPolicy("clinicas_select", {
      for: "select",
      to: authenticatedRole,
      using: sql`id in (select private.user_clinica_ids())`,
    }),
    pgPolicy("clinicas_insert", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`false`,
    }),
    // Editar config: só admin/owner. Deletar: só owner (cascade apaga tudo).
    pgPolicy("clinicas_update", {
      for: "update",
      to: authenticatedRole,
      using: sql`(select private.user_is_admin(id))`,
      withCheck: sql`(select private.user_is_admin(id))`,
    }),
    pgPolicy("clinicas_delete", {
      for: "delete",
      to: authenticatedRole,
      using: sql`(select private.user_is_owner(id))`,
    }),
  ]
);

/** Perfil do usuário — espelha auth.users (Supabase). */
export const profiles = pgTable(
  "profiles",
  {
    id: uuid().primaryKey().notNull(), // = auth.users.id
    nome: text().notNull(),
    email: text(),
    avatarUrl: text("avatar_url"),
    ...timestamps,
  },
  (t) => [
    foreignKey({
      columns: [t.id],
      foreignColumns: [authUsers.id],
      name: "profiles_id_fk",
    }).onDelete("cascade"),
    pgPolicy("profiles_select_self", {
      for: "select",
      to: authenticatedRole,
      using: sql`(select auth.uid()) = id`,
    }),
    pgPolicy("profiles_insert_self", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`(select auth.uid()) = id`,
    }),
    pgPolicy("profiles_update_self", {
      for: "update",
      to: authenticatedRole,
      using: sql`(select auth.uid()) = id`,
      withCheck: sql`(select auth.uid()) = id`,
    }),
  ]
);

/** Vínculo usuário↔clínica. Resolve o tenant ativo (base do RLS). */
export const memberships = pgTable(
  "memberships",
  {
    id: uuid().primaryKey().defaultRandom(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    clinicaId: uuid("clinica_id")
      .notNull()
      .references(() => clinicas.id, { onDelete: "cascade" }),
    role: membershipRoleEnum().notNull().default("profissional"),
    ativo: boolean().notNull().default(true),
    ...timestamps,
  },
  (t) => [
    unique("memberships_profile_clinica_uq").on(t.profileId, t.clinicaId),
    index("memberships_clinica_id_idx").on(t.clinicaId),
    // Vê o próprio vínculo ou vínculos de clínicas das quais participa.
    pgPolicy("memberships_select", {
      for: "select",
      to: authenticatedRole,
      using: sql`profile_id = (select auth.uid()) or clinica_id in (select private.user_clinica_ids())`,
    }),
    // Gerenciar membros: só admin/owner. Onboarding (1º owner) é via RPC create_clinica
    // (SECURITY DEFINER), que contorna estas policies. Sem self-insert aqui → sem join arbitrário.
    pgPolicy("memberships_insert", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`(select private.user_is_admin(clinica_id))`,
    }),
    pgPolicy("memberships_update", {
      for: "update",
      to: authenticatedRole,
      using: sql`(select private.user_is_admin(clinica_id))`,
      withCheck: sql`(select private.user_is_admin(clinica_id))`,
    }),
    pgPolicy("memberships_delete", {
      for: "delete",
      to: authenticatedRole,
      using: sql`(select private.user_is_admin(clinica_id))`,
    }),
  ]
);

/** Coluna `clinica_id` com FK + cascade — usada por toda tabela de negócio. */
export const clinicaFk = () =>
  uuid("clinica_id")
    .notNull()
    .references(() => clinicas.id, { onDelete: "cascade" });
