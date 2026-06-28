import { Breadcrumb } from "@/components/ui/breadcrumb";
import { AbaOrcamentos } from "@/components/ficha/aba-orcamentos";

export default function Page() {
  return (
    <>
      <Breadcrumb items={["Contatos", "Listagem", "Paciente", "Orçamentos"]} />
      <div className="mt-4">
        <AbaOrcamentos />
      </div>
    </>
  );
}
