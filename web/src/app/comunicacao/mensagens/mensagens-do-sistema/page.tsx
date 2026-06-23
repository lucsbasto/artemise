import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CardModeloMensagem } from "@/components/comunicacao/card-modelo-mensagem";
import { modelosMensagens } from "@/lib/mock";

export default function ModelosMensagensPage() {
  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Comunicação", "Modelos de mensagens"]} />
      <h1 className="mt-4 text-lg font-semibold text-foreground">Mensagens do sistema</h1>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modelosMensagens.map((m) => (
          <CardModeloMensagem key={m.id} modelo={m} />
        ))}
      </div>
    </div>
  );
}
