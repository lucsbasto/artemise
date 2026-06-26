import { ComissoesView } from "@/components/financeiro/comissoes-view";
import { loadServer } from "@/lib/data/server-load";
import type { Comissao } from "@/lib/mock";

type ComissoesData = { comissoes: Comissao[]; periodo: string };

export default async function ComissoesPage() {
  const data = await loadServer<ComissoesData>("/financeiro/comissoes");
  return <ComissoesView comissoes={data.comissoes} periodo={data.periodo} />;
}
