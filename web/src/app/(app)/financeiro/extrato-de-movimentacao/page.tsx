import { redirect } from "next/navigation";
import { ExtratoView } from "@/components/financeiro/extrato-view";
import { createClient } from "@/lib/supabase/server";
import type { ExtratoData } from "@/lib/mock";

export default async function ExtratoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // TODO(M7): agregar extrato de lancamentos_financeiros no front.
  const data: ExtratoData = { periodo: "", total: 0, kpis: [], rows: [] };
  return <ExtratoView data={data} />;
}
