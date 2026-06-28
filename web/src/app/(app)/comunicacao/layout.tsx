import { ComunicacaoSubmenu } from "@/components/comunicacao/comunicacao-submenu";

export default function ComunicacaoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col md:flex-row">
      <ComunicacaoSubmenu />
      <div className="min-w-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
