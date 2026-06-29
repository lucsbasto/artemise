import { redirect } from "next/navigation";
import { FinanceTable } from "@/components/financeiro/finance-table";
import { createClient } from "@/lib/supabase/server";
import {
  contasFinanceKpis,
  toFinanceRow,
  periodoLabel,
  startOfMonth,
  endOfMonth,
  type LancamentoSource,
  type Lookup,
} from "@/lib/financeiro-calc";

const LANCAMENTO_COLS =
  "tipo, situacao, valor, vencimento, liquidacao, descricao, categoriaId:categoria_id";

export default async function ContasAReceberPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const now = new Date();

  const [lancRes, catRes] = await Promise.all([
    supabase
      .from("lancamentos_financeiros")
      .select(LANCAMENTO_COLS)
      .eq("tipo", "receita")
      .order("vencimento", { ascending: true })
      .order("criado_em", { ascending: true }),
    supabase.from("categorias_contas").select("id, descricao"),
  ]);

  const lancs = (lancRes.data ?? []) as LancamentoSource[];
  const categorias: Lookup = {};
  for (const c of (catRes.data ?? []) as { id: string; descricao: string }[]) categorias[c.id] = c.descricao;

  return (
    <FinanceTable
      titulo="Contas a receber"
      breadcrumb={["Financeiro", "Contas a receber"]}
      periodo={periodoLabel(startOfMonth(now), endOfMonth(now))}
      kpis={contasFinanceKpis(lancs, "receita")}
      rows={lancs.map((l) => toFinanceRow(l, categorias))}
      liquidacaoLabel="Recebimento"
    />
  );
}
