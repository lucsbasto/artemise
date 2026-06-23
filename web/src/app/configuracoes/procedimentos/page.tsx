import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProcedimentosView } from "@/components/procedimentos/procedimentos-view";

export default function ProcedimentosPage() {
  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Configurações", "Procedimentos"]} />
      <div className="mt-4">
        <ProcedimentosView />
      </div>
    </div>
  );
}
