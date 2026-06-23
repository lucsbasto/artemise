import { ExtratoView } from "@/components/financeiro/extrato-view";
import { extrato } from "@/lib/mock";

export default function ExtratoPage() {
  return <ExtratoView data={extrato} />;
}
