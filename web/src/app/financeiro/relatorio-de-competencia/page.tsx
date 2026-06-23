import { CompetenciaView } from "@/components/financeiro/competencia-view";
import { competencia } from "@/lib/mock";

export default function CompetenciaPage() {
  return <CompetenciaView data={competencia} />;
}
