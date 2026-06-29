import { redirect } from "next/navigation";
import { ComissoesView } from "@/components/financeiro/comissoes-view";
import { createClient } from "@/lib/supabase/server";
import type { Comissao } from "@/lib/mock";

type ComissoesData = { comissoes: Comissao[]; periodo: string };

export default async function ComissoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // TODO(M7): calcular comissões (registros × profissional_comissoes) no front.
  const data: ComissoesData = { comissoes: [], periodo: "" };
  return <ComissoesView comissoes={data.comissoes} periodo={data.periodo} />;
}
