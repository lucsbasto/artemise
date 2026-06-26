// Helpers compartilhados do schema multitenant.
//
// Tenancy: shared-schema + RLS. Toda tabela de negócio carrega `clinica_id` e
// recebe 4 policies CRUD (`tenantPolicies`) que filtram pelo tenant do usuário
// logado via `private.user_clinica_ids()` (função SECURITY DEFINER, ver rls.sql).
import { sql } from "drizzle-orm";
import { pgPolicy, timestamp } from "drizzle-orm/pg-core";
import { authenticatedRole } from "drizzle-orm/supabase";

/** Colunas de auditoria padrão. */
export const timestamps = {
  criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow().notNull(),
  atualizadoEm: timestamp("atualizado_em", { withTimezone: true }).defaultNow().notNull(),
};

/** Predicado de tenant reutilizado nas policies (depende da coluna `clinica_id`). */
export const isTenant = sql`clinica_id in (select private.user_clinica_ids())`;

/**
 * 4 policies CRUD que isolam a tabela por tenant para o role `authenticated`.
 * `name` deve ser único por tabela (prefixe com o nome da tabela).
 */
export function tenantPolicies(name: string) {
  return [
    pgPolicy(`${name}_select`, { for: "select", to: authenticatedRole, using: isTenant }),
    pgPolicy(`${name}_insert`, { for: "insert", to: authenticatedRole, withCheck: isTenant }),
    pgPolicy(`${name}_update`, {
      for: "update",
      to: authenticatedRole,
      using: isTenant,
      withCheck: isTenant,
    }),
    pgPolicy(`${name}_delete`, { for: "delete", to: authenticatedRole, using: isTenant }),
  ];
}
