import { Breadcrumb } from "@/components/ui/breadcrumb";
import { FichasView } from "@/components/configuracoes/fichas-view";

export default function FichasAtendimentosPage() {
  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Configurações", "Fichas de atendimentos"]} />
      <div className="mt-4">
        <FichasView />
      </div>
    </div>
  );
}
