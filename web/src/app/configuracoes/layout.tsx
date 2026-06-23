import { ConfigSubmenu } from "@/components/configuracoes/config-submenu";

export default function ConfiguracoesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      <ConfigSubmenu />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
