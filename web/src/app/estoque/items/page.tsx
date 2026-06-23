import { Breadcrumb } from "@/components/ui/breadcrumb";
import { EstoqueView } from "@/components/estoque/estoque-view";

export default function EstoqueItemsPage() {
  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Estoque", "Controle de estoque"]} />
      <div className="mt-4">
        <EstoqueView />
      </div>
    </div>
  );
}
