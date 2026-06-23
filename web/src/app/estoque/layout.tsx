import { EstoqueSubmenu } from "@/components/estoque/estoque-submenu";

export default function EstoqueLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      <EstoqueSubmenu />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
