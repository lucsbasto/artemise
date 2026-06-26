import { SubmenuShell, type SubItem } from "@/components/ui/submenu-shell";

const ITEMS: SubItem[] = [
  {
    label: "Canais de atendimento",
    href: "/comunicacao/canais-de-comunicacao",
    match: "/comunicacao/canais-de-comunicacao",
  },
  {
    label: "Modelos de mensagens",
    href: "/comunicacao/mensagens/mensagens-do-sistema",
    match: "/comunicacao/mensagens",
  },
  { label: "Central de notificações" },
];

export function ComunicacaoSubmenu() {
  return <SubmenuShell title="Comunicação" items={ITEMS} />;
}
