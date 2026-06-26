import { SubmenuShell, type SubItem } from "@/components/ui/submenu-shell";

// Submenu interno do módulo Agenda. Item ativo por rota exata.
const ITEMS: SubItem[] = [
  { label: "Agenda", href: "/agenda", exact: true },
  { label: "Visão geral", href: "/agenda/visao-geral", exact: true },
  { label: "Relatório de agendamentos", href: "/agenda/relatorio", exact: true },
  { label: "Eventos", href: "/agenda/eventos", exact: true },
];

export function AgendaSubmenu() {
  return <SubmenuShell title="Agenda" items={ITEMS} />;
}
