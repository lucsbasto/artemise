import { redirect } from "next/navigation";
import { RelatorioCategoriasView } from "@/components/financeiro/relatorio-categorias-view";
import { createClient } from "@/lib/supabase/server";
import type { CategoriaReportNode } from "@/lib/mock";

type CategoriasReport = {
  receitas: CategoriaReportNode[];
  despesas: CategoriaReportNode[];
};

export default async function RelatorioCategoriasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // TODO(M7): agregar categorias_contas + lancamentos (árvore + %) no front.
  const data: CategoriasReport = { receitas: [], despesas: [] };
  return (
    <RelatorioCategoriasView
      receitas={data.receitas}
      despesas={data.despesas}
    />
  );
}
