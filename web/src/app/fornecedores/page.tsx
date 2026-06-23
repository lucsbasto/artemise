import { Breadcrumb } from "@/components/ui/breadcrumb";
import { FornecedoresView } from "@/components/contacts/fornecedores-view";

export default function FornecedoresPage() {
  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Contatos", "Fornecedores"]} />
      <div className="mt-4">
        <FornecedoresView />
      </div>
    </div>
  );
}
