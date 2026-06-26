import { CompetenciaView } from "@/components/financeiro/competencia-view";
import { loadServer } from "@/lib/data/server-load";
import type { CompetenciaData } from "@/lib/mock";

export default async function CompetenciaPage() {
  const data = await loadServer<CompetenciaData>("/financeiro/competencia");
  return <CompetenciaView data={data} />;
}
