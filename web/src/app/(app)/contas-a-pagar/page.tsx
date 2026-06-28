import { FinanceTable } from "@/components/financeiro/finance-table";
import { loadServer } from "@/lib/data/server-load";
import type { FinanceKpi, FinanceRow } from "@/lib/mock";

type ContasResumo = {
  periodo: string;
  total: number;
  kpis: FinanceKpi[];
  rows: FinanceRow[];
};

export default async function ContasAPagarPage() {
  const data = await loadServer<ContasResumo>("/financeiro/contas-pagar");
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
