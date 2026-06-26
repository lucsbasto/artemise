import { ConfigSubmenu } from "@/components/configuracoes/config-submenu";

export default function ConfiguracoesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col md:flex-row">
      <ConfigSubmenu />
      <div className="min-w-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
