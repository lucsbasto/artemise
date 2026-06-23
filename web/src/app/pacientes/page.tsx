import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PacientesView } from "@/components/pacientes/pacientes-view";

export default function PacientesPage() {
  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Contatos", "Pacientes"]} />

      <div className="mt-4">
        <PacientesView />
      </div>
    </div>
  );
}
