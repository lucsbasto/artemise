import { Breadcrumb } from "@/components/ui/breadcrumb";
import { AbaPacotes } from "@/components/ficha/aba-pacotes";

export default function Page() {
  return (
    <>
      <Breadcrumb items={["Contatos", "Listagem", "Paciente", "Pacotes"]} />
      <div className="mt-4">
        <AbaPacotes />
      </div>
    </>
  );
}
