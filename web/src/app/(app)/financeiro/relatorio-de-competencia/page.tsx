import { redirect } from "next/navigation";
import { CompetenciaView } from "@/components/financeiro/competencia-view";
import { createClient } from "@/lib/supabase/server";
import type { CompetenciaData } from "@/lib/mock";

export default async function CompetenciaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // TODO(M7): agregar lancamentos_financeiros por competência no front.
  const data: CompetenciaData = { mes: "", total: 0, kpis: [], rows: [] };
  return <CompetenciaView data={data} />;
}
