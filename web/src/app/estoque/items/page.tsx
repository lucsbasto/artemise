import { itensEstoque, estoqueSummary } from "@/lib/mock";
import { EstoqueView } from "@/components/estoque/estoque-view";

export default function EstoqueItemsPage() {
  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <EstoqueView rows={itensEstoque} summary={estoqueSummary} />
    </div>
  );
}
