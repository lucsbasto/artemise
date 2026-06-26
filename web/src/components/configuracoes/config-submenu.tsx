import { SubmenuShell, type SubItem } from "@/components/ui/submenu-shell";

const ITEMS: SubItem[] = [
  { label: "Preferências do sistema", href: "/configuracoes/preferencias-do-sistema", exact: true },
  { label: "Dados da clínica", href: "/configuracoes/dados-da-clinica", exact: true },
  { label: "Assinatura" },
  { label: "Procedimentos", href: "/configuracoes/procedimentos", exact: true },
  { label: "Categorias de procedimentos", href: "/configuracoes/categorias-de-procedimentos", exact: true },
  { label: "Pacotes", href: "/configuracoes/pacotes", exact: true },
  { label: "Salas de atendimento" },
  { label: "Fichas de atendimentos", href: "/configuracoes/fichas-de-atendimentos", exact: true },
  { label: "Modelos de atestados e prescrições", href: "/configuracoes/modelos-de-atestados-e-prescricoes", exact: true },
  { label: "Etiquetas" },
  { label: "Horários de funcionamento" },
];

export function ConfigSubmenu() {
  return <SubmenuShell title="Configurações" items={ITEMS} />;
}
