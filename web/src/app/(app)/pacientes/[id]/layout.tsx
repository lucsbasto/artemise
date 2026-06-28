import { FichaSidebar } from "@/components/ficha/ficha-sidebar";

export default function FichaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      <FichaSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[900px] p-5">{children}</div>
      </div>
    </div>
  );
}
