import { FichaSidebar } from "@/components/ficha/ficha-sidebar";
import { fichaPaciente } from "@/lib/mock";

export default function FichaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      <FichaSidebar paciente={fichaPaciente} />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[900px] p-5">{children}</div>
      </div>
    </div>
  );
}
