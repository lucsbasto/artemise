import { SubmenuShell, type SubItem } from "@/components/ui/submenu-shell";

const ITEMS: SubItem[] = [
  { label: "Controle de estoque", href: "/estoque/items" },
  { label: "Giro de estoque", href: "/estoque/giro" },
  { label: "Contagem de estoque", href: "/estoque/contagem-estoque" },
  { label: "Itens abertos", href: "/estoque/itens-aberto" },
  { label: "Compras" },
  { label: "Marcas" },
];

export function EstoqueSubmenu() {
  return <SubmenuShell title="Estoque" items={ITEMS} />;
}
