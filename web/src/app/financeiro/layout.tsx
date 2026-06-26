import { FinanceiroSubmenu } from "@/components/financeiro/financeiro-submenu";

export default function FinanceiroLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col md:flex-row">
      <FinanceiroSubmenu />
      <div className="min-w-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
