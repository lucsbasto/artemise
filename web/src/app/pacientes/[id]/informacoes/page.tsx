import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PacienteDetalhe } from "@/components/ficha/paciente-detalhe";

export default function Page() {
  return (
    <>
      <Breadcrumb items={["Contatos", "Listagem", "Paciente", "Informações"]} />
      <div className="mt-4">
        <PacienteDetalhe />
      </div>
    </>
  );
}
