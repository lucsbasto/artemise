import { ComunicacaoSubmenu } from "@/components/comunicacao/comunicacao-submenu";

export default function ComunicacaoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      <ComunicacaoSubmenu />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
