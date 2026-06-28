import { RelatorioCategoriasView } from "@/components/financeiro/relatorio-categorias-view";
import { loadServer } from "@/lib/data/server-load";
import type { CategoriaReportNode } from "@/lib/mock";

type CategoriasReport = {
  receitas: CategoriaReportNode[];
  despesas: CategoriaReportNode[];
};

export default async function RelatorioCategoriasPage() {
  const data = await loadServer<CategoriasReport>("/financeiro/categorias");
  return (
    <RelatorioCategoriasView
      receitas={data.receitas}
      despesas={data.despesas}
    />
  );
}
