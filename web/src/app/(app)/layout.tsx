import { redirect } from "next/navigation";
import { AppShell } from "@/components/shell/app-shell";
import { createClient } from "@/lib/supabase/server";

/**
 * Guarda em profundidade: o proxy.ts já redireciona sem sessão, mas a doc do
 * Supabase recomenda revalidar com getUser() no Server Component que protege
 * a área logada (não confiar só no proxy/middleware).
 */
export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return <AppShell>{children}</AppShell>;
}
