import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PreferenciasView } from "@/components/configuracoes/preferencias-view";

export default function PreferenciasSistemaPage() {
  return (
    <div className="mx-auto max-w-[1000px] p-5">
      <Breadcrumb items={["Configurações", "Preferências do sistema"]} />
      <h1 className="mt-4 text-lg font-semibold text-foreground">Preferências do sistema</h1>
      <div className="mt-6">
        <PreferenciasView />
      </div>
    </div>
  );
}
