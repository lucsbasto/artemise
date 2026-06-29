/**
 * Lê e valida as envs do Supabase. Boot falha explícito se faltarem (SUP-01 AC4),
 * em vez de cair silenciosamente num backend inexistente.
 */
function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(
      `Env ${name} ausente. Configure NEXT_PUBLIC_SUPABASE_URL e ` +
        `NEXT_PUBLIC_SUPABASE_ANON_KEY (.env.local / Vercel).`,
    );
  }
  return v;
}

export const SUPABASE_URL = required("NEXT_PUBLIC_SUPABASE_URL");
export const SUPABASE_ANON_KEY = required("NEXT_PUBLIC_SUPABASE_ANON_KEY");
