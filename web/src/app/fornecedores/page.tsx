import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ContactsTable } from "@/components/contacts/contacts-table";
import { fornecedores } from "@/lib/mock";

export default function FornecedoresPage() {
  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Contatos", "Fornecedores"]} />
      <div className="mt-4">
        <ContactsTable title="Fornecedores" rows={fornecedores} />
      </div>
    </div>
  );
}
