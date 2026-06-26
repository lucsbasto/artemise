import { FinanceTable } from "@/components/financeiro/finance-table";
import { loadServer } from "@/lib/data/server-load";
import type { FinanceKpi, FinanceRow } from "@/lib/mock";

type ContasResumo = {
  periodo: string;
  total: number;
  kpis: FinanceKpi[];
  rows: FinanceRow[];
};

export default async function ContasAReceberPage() {
  const data = await loadServer<ContasResumo>("/financeiro/contas-receber");
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
