import { Breadcrumb } from "@/components/ui/breadcrumb";
import { AbaProcedimentos } from "@/components/ficha/aba-procedimentos";

export default function Page() {
  return (
    <>
      <Breadcrumb items={["Contatos", "Listagem", "Paciente", "Procedimentos"]} />
      <div className="mt-4">
        <AbaProcedimentos />
      </div>
    </>
  );
}
