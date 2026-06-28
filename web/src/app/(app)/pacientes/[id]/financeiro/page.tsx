import { Breadcrumb } from "@/components/ui/breadcrumb";
import { AbaFinanceiro } from "@/components/ficha/aba-financeiro";

export default function Page() {
  return (
    <>
      <Breadcrumb items={["Contatos", "Listagem", "Paciente", "Financeiro"]} />
      <div className="mt-4">
        <AbaFinanceiro />
      </div>
    </>
  );
}
