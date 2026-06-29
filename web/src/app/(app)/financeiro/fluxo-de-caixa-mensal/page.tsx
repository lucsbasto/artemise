import { redirect } from "next/navigation";
import { FluxoCaixaView } from "@/components/financeiro/fluxo-caixa-view";
import { createClient } from "@/lib/supabase/server";
import type { CashflowPoint } from "@/lib/mock";

export default async function FluxoMensalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // TODO(M7): encadear saldo mensal de lancamentos_financeiros no front.
  const points: CashflowPoint[] = [];
  return (
    <FluxoCaixaView
      granularidade="mes"
      titulo="Fluxo de caixa mensal"
      points={points}
    />
  );
}
