import { Breadcrumb } from "@/components/ui/breadcrumb";
import { AbaCarteira } from "@/components/ficha/aba-carteira";

export default function Page() {
  return (
    <>
      <Breadcrumb items={["Contatos", "Listagem", "Paciente", "Carteira"]} />
      <div className="mt-4">
        <AbaCarteira />
      </div>
    </>
  );
}
