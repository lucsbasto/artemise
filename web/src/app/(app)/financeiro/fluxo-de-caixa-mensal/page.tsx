import { FluxoCaixaView } from "@/components/financeiro/fluxo-caixa-view";
import { loadServer } from "@/lib/data/server-load";
import type { CashflowPoint } from "@/lib/mock";

export default async function FluxoMensalPage() {
  const points = await loadServer<CashflowPoint[]>(
    "/financeiro/fluxo?granularidade=mes"
  );
  return (
    <FluxoCaixaView
      granularidade="mes"
      titulo="Fluxo de caixa mensal"
      points={points}
    />
  );
}
