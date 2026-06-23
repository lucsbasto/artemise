import { FinanceTable } from "@/components/financeiro/finance-table";
import { contasReceber } from "@/lib/mock";

export default function ContasAReceberPage() {
  return (
    <FinanceTable
      titulo="Contas a receber"
      breadcrumb={["Financeiro", "Contas a receber"]}
      periodo={contasReceber.periodo}
      kpis={contasReceber.kpis}
      rows={contasReceber.rows}
      liquidacaoLabel="Recebimento"
    />
  );
}
