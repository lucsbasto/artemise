import { FluxoCaixaView } from "@/components/financeiro/fluxo-caixa-view";
import { loadServer } from "@/lib/data/server-load";
import type { CashflowPoint } from "@/lib/mock";

export default async function FluxoDiarioPage() {
  const points = await loadServer<CashflowPoint[]>(
    "/financeiro/fluxo?granularidade=dia"
  );
  return (
    <FluxoCaixaView
      granularidade="dia"
      titulo="Fluxo de caixa diário"
      points={points}
    />
  );
}
