import { FinanceiroSubmenu } from "@/components/financeiro/financeiro-submenu";

export default function FinanceiroLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      <FinanceiroSubmenu />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
