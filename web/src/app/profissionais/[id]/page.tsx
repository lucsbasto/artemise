import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProfissionalDetalhe } from "@/components/contacts/profissional-detalhe";

export default async function ProfissionalDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-[900px] p-5">
      <Breadcrumb items={["Contatos", "Profissionais", "Ficha"]} />
      <div className="mt-4">
        <ProfissionalDetalhe id={id} />
      </div>
    </div>
  );
}
