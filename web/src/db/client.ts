import "server-only";
// Cliente Drizzle (Postgres/Supabase).
//
// Dois modos de acesso:
//  - `db`      → conexão admin. Use em server actions/rotas APÓS resolver o tenant
//                manualmente, ou para tarefas de sistema (seed, webhooks). NÃO aplica RLS
//                por si só; sempre filtre por clinica_id.
//  - `withTenant(claims, cb)` → executa `cb` dentro de uma transação que troca o role
//                para `authenticated` e injeta as claims do JWT, fazendo o RLS valer
//                (auth.uid() e private.user_clinica_ids() passam a funcionar).
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL não definida (ver web/.env.example).");
}

// `prepare: false` é exigido pelo pooler transaction-mode do Supabase.
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema, casing: "snake_case" });
export type DB = typeof db;

/** Claims mínimas esperadas do JWT do Supabase. */
export type JwtClaims = { sub: string; role?: string } & Record<string, unknown>;

/**
 * Executa `cb` com RLS aplicado para o usuário das `claims`.
 * Troca o role da transação para `authenticated` e seta `request.jwt.claims`,
 * de modo que as policies (auth.uid(), private.user_clinica_ids()) sejam avaliadas.
 */
export async function withTenant<T>(
  claims: JwtClaims,
  cb: (tx: Parameters<Parameters<DB["transaction"]>[0]>[0]) => Promise<T>
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(
      sql`select set_config('request.jwt.claims', ${JSON.stringify(claims)}, true)`
    );
    await tx.execute(sql`select set_config('role', 'authenticated', true)`);
    return cb(tx);
  });
}
