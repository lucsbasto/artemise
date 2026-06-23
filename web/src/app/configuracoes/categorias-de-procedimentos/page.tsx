import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CategoriasProcView } from "@/components/configuracoes/categorias-proc-view";

export default function CategoriasProcedimentosPage() {
  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Configurações", "Categorias de procedimentos"]} />
      <div className="mt-4">
        <CategoriasProcView />
      </div>
    </div>
  );
}
