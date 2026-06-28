import { Breadcrumb } from "@/components/ui/breadcrumb";
import { MensagensGrid } from "@/components/comunicacao/mensagens-grid";
import { modelosMensagens } from "@/lib/mock";

export default function ModelosMensagensPage() {
  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Comunicação", "Modelos de mensagens"]} />
      <h1 className="mt-4 text-lg font-semibold text-foreground">Mensagens do sistema</h1>
      <MensagensGrid modelos={modelosMensagens} />
    </div>
  );
}
