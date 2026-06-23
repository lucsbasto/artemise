import { ContasFinanceirasView } from "@/components/financeiro/contas-financeiras-view";
import { contasFinanceirasList } from "@/lib/mock";

export default function ContasFinanceirasPage() {
  return <ContasFinanceirasView contas={contasFinanceirasList} />;
}
