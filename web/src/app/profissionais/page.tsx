import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ContactsTable } from "@/components/contacts/contacts-table";
import { profissionais } from "@/lib/mock";

export default function ProfissionaisPage() {
  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Contatos", "Profissionais"]} />
      <div className="mt-4">
        <ContactsTable title="Profissionais" rows={profissionais} />
      </div>
    </div>
  );
}
