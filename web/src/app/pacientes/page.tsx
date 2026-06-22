import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { PatientsTable } from "@/components/pacientes/patients-table";
import { patients } from "@/lib/mock";

export default function PacientesPage() {
  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Contatos", "Pacientes"]} />

      <div className="mt-4">
        <Card className="overflow-hidden">
          <PatientsTable patients={patients} />
        </Card>
      </div>
    </div>
  );
}
