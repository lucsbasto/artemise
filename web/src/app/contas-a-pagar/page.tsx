import { FinanceTable } from "@/components/financeiro/finance-table";
import { contasPagar } from "@/lib/mock";

export default function ContasAPagarPage() {
  return (
    <FinanceTable
      titulo="Contas a pagar"
      breadcrumb={["Financeiro", "Contas a pagar"]}
      periodo={contasPagar.periodo}
      kpis={contasPagar.kpis}
      rows={contasPagar.rows}
      liquidacaoLabel="Pagamento"
    />
  );
}
