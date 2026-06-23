import { FluxoCaixaView } from "@/components/financeiro/fluxo-caixa-view";
import { fluxoDiarioPoints } from "@/lib/mock";

export default function FluxoDiarioPage() {
  return (
    <FluxoCaixaView
      granularidade="dia"
      titulo="Fluxo de caixa diário"
      periodoLabel="Junho de 2026"
      points={fluxoDiarioPoints}
    />
  );
}
