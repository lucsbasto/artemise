import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProfissionaisView } from "@/components/contacts/profissionais-view";

export default function ProfissionaisPage() {
  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Contatos", "Profissionais"]} />
      <div className="mt-4">
        <ProfissionaisView />
      </div>
    </div>
  );
}
