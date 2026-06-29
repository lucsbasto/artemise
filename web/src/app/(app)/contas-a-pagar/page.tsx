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

export default async function ContasAPagarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // TODO(M7): agregar lancamentos_financeiros (contas a pagar) no front.
  const data: ContasResumo = { periodo: "", total: 0, kpis: [], rows: [] };
  return (
    <FinanceTable
      titulo="Contas a pagar"
      breadcrumb={["Financeiro", "Contas a pagar"]}
      periodo={data.periodo}
      kpis={data.kpis}
      rows={data.rows}
      liquidacaoLabel="Pagamento"
    />
  );
}
