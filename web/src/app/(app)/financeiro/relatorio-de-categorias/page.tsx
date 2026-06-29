import { redirect } from "next/navigation";
import { RelatorioCategoriasView } from "@/components/financeiro/relatorio-categorias-view";
import { createClient } from "@/lib/supabase/server";
import {
  categoriasTree,
  startOfMonth,
  endOfMonth,
  toISODate,
  type LancamentoSource,
  type CategoriaSource,
} from "@/lib/financeiro-calc";

export default async function RelatorioCategoriasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const now = new Date();

  const [catRes, lancRes] = await Promise.all([
    supabase.from("categorias_contas").select("id, descricao, parentId:parent_id"),
    supabase
      .from("lancamentos_financeiros")
      .select("tipo, valor, categoriaId:categoria_id, vencimento")
      .gte("vencimento", toISODate(startOfMonth(now)))
      .lte("vencimento", toISODate(endOfMonth(now))),
  ]);

  const cats = (catRes.data ?? []) as CategoriaSource[];
  const lancs = (lancRes.data ?? []) as LancamentoSource[];

  return (
    <RelatorioCategoriasView
      receitas={categoriasTree(cats, lancs, "receita")}
      despesas={categoriasTree(cats, lancs, "despesa")}
    />
  );
}
