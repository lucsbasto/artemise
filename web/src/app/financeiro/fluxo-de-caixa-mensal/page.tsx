import { FluxoCaixaView } from "@/components/financeiro/fluxo-caixa-view";
import { fluxoMensalPoints } from "@/lib/mock";

export default function FluxoMensalPage() {
  return (
    <FluxoCaixaView
      granularidade="mes"
      titulo="Fluxo de caixa mensal"
      points={fluxoMensalPoints}
    />
  );
}
