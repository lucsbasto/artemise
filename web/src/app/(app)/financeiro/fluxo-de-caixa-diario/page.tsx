import { redirect } from "next/navigation";
import { FluxoCaixaView } from "@/components/financeiro/fluxo-caixa-view";
import { createClient } from "@/lib/supabase/server";
import {
  cashflowPorDia,
  startOfMonth,
  endOfMonth,
  toISODate,
  type LancamentoSource,
} from "@/lib/financeiro-calc";

const LANCAMENTO_COLS = "tipo, situacao, valor, vencimento";

export default async function FluxoDiarioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const now = new Date();
  const { data } = await supabase
    .from("lancamentos_financeiros")
    .select(LANCAMENTO_COLS)
    .gte("vencimento", toISODate(startOfMonth(now)))
    .lte("vencimento", toISODate(endOfMonth(now)));

  const points = cashflowPorDia((data ?? []) as LancamentoSource[], now);
  return (
    <FluxoCaixaView
      granularidade="dia"
      titulo="Fluxo de caixa diário"
      points={points}
    />
  );
}
