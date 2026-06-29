import { redirect } from "next/navigation";
import { FinanceTable } from "@/components/financeiro/finance-table";
import { createClient } from "@/lib/supabase/server";
import type { FinanceKpi, FinanceRow } from "@/lib/mock";

type ContasResumo = {
  periodo: string;
  total: number;
  kpis: FinanceKpi[];
  rows: FinanceRow[];
};

export default async function ContasAReceberPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // TODO(M7): agregar lancamentos_financeiros (contas a receber) no front.
  const data: ContasResumo = { periodo: "", total: 0, kpis: [], rows: [] };
  return (
    <FinanceTable
      titulo="Contas a receber"
      breadcrumb={["Financeiro", "Contas a receber"]}
      periodo={data.periodo}
      kpis={data.kpis}
      rows={data.rows}
      liquidacaoLabel="Recebimento"
    />
  );
}
