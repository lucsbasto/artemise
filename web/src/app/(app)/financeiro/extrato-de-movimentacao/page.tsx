import { ExtratoView } from "@/components/financeiro/extrato-view";
import { loadServer } from "@/lib/data/server-load";
import type { ExtratoData } from "@/lib/mock";

export default async function ExtratoPage() {
  const data = await loadServer<ExtratoData>("/financeiro/extrato");
  return <ExtratoView data={data} />;
}
