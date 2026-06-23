import { RelatorioCategoriasView } from "@/components/financeiro/relatorio-categorias-view";
import { receitasReport, despesasReport, periodoCategorias } from "@/lib/mock";

export default function RelatorioCategoriasPage() {
  return (
    <RelatorioCategoriasView
      receitas={receitasReport}
      despesas={despesasReport}
      periodoLabel={periodoCategorias}
    />
  );
}
