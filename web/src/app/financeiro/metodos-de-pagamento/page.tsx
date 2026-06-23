import { MetodosPagamentoView } from "@/components/financeiro/metodos-pagamento-view";
import { metodosPagamento } from "@/lib/mock";

export default function MetodosPagamentoPage() {
  return <MetodosPagamentoView metodos={metodosPagamento} />;
}
