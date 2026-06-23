import { Breadcrumb } from "@/components/ui/breadcrumb";
import { AbaInformacoes } from "@/components/ficha/aba-informacoes";

export default function Page() {
  return (
    <>
      <Breadcrumb items={["Contatos", "Listagem", "Paciente", "Informações"]} />
      <div className="mt-4">
        <AbaInformacoes />
      </div>
    </>
  );
}
