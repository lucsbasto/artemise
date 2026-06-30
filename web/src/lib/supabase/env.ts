/**
 * Lê e valida as envs do Supabase. Boot falha explícito se faltarem (SUP-01 AC4),
 * em vez de cair silenciosamente num backend inexistente.
 */
// IMPORTANTE: acesso LITERAL a process.env.NEXT_PUBLIC_* — o Next só injeta a env
// no bundle do client quando a chave é estática. Acesso dinâmico (process.env[name])
// fica undefined no browser.
function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Env ${name} ausente. Configure NEXT_PUBLIC_SUPABASE_URL e ` +
        `NEXT_PUBLIC_SUPABASE_ANON_KEY (.env.local / Vercel).`,
    );
  }
  return value;
}

export const SUPABASE_URL = required(
  "NEXT_PUBLIC_SUPABASE_URL",
  process.env.NEXT_PUBLIC_SUPABASE_URL,
);
export const SUPABASE_ANON_KEY = required(
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
