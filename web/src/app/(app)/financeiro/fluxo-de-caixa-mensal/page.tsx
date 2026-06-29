import { redirect } from "next/navigation";
import { FluxoCaixaView } from "@/components/financeiro/fluxo-caixa-view";
import { createClient } from "@/lib/supabase/server";
import {
  cashflowPorMes,
  startOfYear,
  endOfYear,
  toISODate,
  type LancamentoSource,
} from "@/lib/financeiro-calc";

const LANCAMENTO_COLS = "tipo, situacao, valor, vencimento";

export default async function FluxoMensalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const now = new Date();
  const { data } = await supabase
    .from("lancamentos_financeiros")
    .select(LANCAMENTO_COLS)
    .gte("vencimento", toISODate(startOfYear(now)))
    .lte("vencimento", toISODate(endOfYear(now)));

  const points = cashflowPorMes((data ?? []) as LancamentoSource[], now);
  return (
    <FluxoCaixaView
      granularidade="mes"
      titulo="Fluxo de caixa mensal"
      points={points}
    />
  );
}
