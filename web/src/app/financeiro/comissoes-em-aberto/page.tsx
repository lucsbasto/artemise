import { ComissoesView } from "@/components/financeiro/comissoes-view";
import { comissoes, periodoComissoes } from "@/lib/mock";

export default function ComissoesPage() {
  return <ComissoesView comissoes={comissoes} periodo={periodoComissoes} />;
}
