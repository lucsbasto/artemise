"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type SubItem = { label: string; href: string };

const ITEMS: SubItem[] = [
  { label: "Visão geral", href: "/financeiro" },
  { label: "Extrato de movimentação", href: "/financeiro/extrato-de-movimentacao" },
  { label: "Relatório de competência", href: "/financeiro/relatorio-de-competencia" },
  { label: "Fluxo de caixa diário", href: "/financeiro/fluxo-de-caixa-diario" },
  { label: "Fluxo de caixa mensal", href: "/financeiro/fluxo-de-caixa-mensal" },
  { label: "Relatório de categorias", href: "/financeiro/relatorio-de-categorias" },
  { label: "Contas financeiras", href: "/financeiro/contas" },
  { label: "Categorias de contas", href: "/financeiro/categorias-de-contas" },
  { label: "Métodos de pagamento", href: "/financeiro/metodos-de-pagamento" },
  { label: "Contas a receber", href: "/contas-a-receber" },
  { label: "Contas a pagar", href: "/contas-a-pagar" },
  { label: "Comissões em aberto", href: "/financeiro/comissoes-em-aberto" },
];

export function FinanceiroSubmenu() {
  const pathname = usePathname();
  return (
    <nav className="w-56 shrink-0 border-r border-border bg-surface p-3">
      <h2 className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-2">
        Financeiro
      </h2>
      <ul className="flex flex-col gap-0.5">
        {ITEMS.map((it) => {
          // "Visão geral" só ativa em /financeiro exato; demais por prefixo.
          const active =
            it.href === "/financeiro"
              ? pathname === "/financeiro"
              : pathname.startsWith(it.href);
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-brand text-white font-medium"
                    : "text-foreground hover:bg-background"
                )}
              >
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
