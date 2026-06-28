import { Breadcrumb } from "@/components/ui/breadcrumb";
import { DadosClinicaForm } from "@/components/configuracoes/dados-clinica-form";

export default function DadosClinicaPage() {
  return (
    <div className="mx-auto max-w-[1000px] p-5">
      <Breadcrumb items={["Configurações", "Dados da clínica"]} />
      <div className="mt-4">
        <DadosClinicaForm />
      </div>
    </div>
  );
}
