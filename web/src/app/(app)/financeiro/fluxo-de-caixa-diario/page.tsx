import { redirect } from "next/navigation";
import { FluxoCaixaView } from "@/components/financeiro/fluxo-caixa-view";
import { createClient } from "@/lib/supabase/server";
import type { CashflowPoint } from "@/lib/mock";

export default async function FluxoDiarioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // TODO(M7): encadear saldo diário de lancamentos_financeiros no front.
  const points: CashflowPoint[] = [];
  return (
    <FluxoCaixaView
      granularidade="dia"
      titulo="Fluxo de caixa diário"
      points={points}
    />
  );
}
