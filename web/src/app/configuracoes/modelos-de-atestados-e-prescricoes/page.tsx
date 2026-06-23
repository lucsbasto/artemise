import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ModelosView } from "@/components/configuracoes/modelos-view";

export default function ModelosAtestadosPage() {
  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Configurações", "Modelos de atestados e prescrições"]} />
      <div className="mt-4">
        <ModelosView />
      </div>
    </div>
  );
}
