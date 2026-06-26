import { SubmenuShell, type SubItem } from "@/components/ui/submenu-shell";

const ITEMS: SubItem[] = [
  { label: "Visão geral", href: "/financeiro", exact: true },
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
  return <SubmenuShell title="Financeiro" items={ITEMS} />;
}
