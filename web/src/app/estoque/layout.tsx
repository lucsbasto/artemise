import { EstoqueSubmenu } from "@/components/estoque/estoque-submenu";

export default function EstoqueLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col md:flex-row">
      <EstoqueSubmenu />
      <div className="min-w-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
