import { Breadcrumb } from "@/components/ui/breadcrumb";
import { AbaLinhaDoTempo } from "@/components/ficha/aba-linha-do-tempo";

export default function Page() {
  return (
    <>
      <Breadcrumb items={["Contatos", "Listagem", "Paciente", "Linha do tempo"]} />
      <div className="mt-4">
        <AbaLinhaDoTempo />
      </div>
    </>
  );
}
