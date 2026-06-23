import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PacotesView } from "@/components/pacotes/pacotes-view";
import { pacotes } from "@/lib/mock";

export default function PacotesPage() {
  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Configurações", "Pacotes"]} />
      <div className="mt-4">
        <PacotesView pacotes={pacotes} />
      </div>
    </div>
  );
}
