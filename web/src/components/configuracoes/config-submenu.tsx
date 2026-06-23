"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type SubItem = { label: string; href?: string };

const ITEMS: SubItem[] = [
  { label: "Preferências do sistema", href: "/configuracoes/preferencias-do-sistema" },
  { label: "Dados da clínica", href: "/configuracoes/dados-da-clinica" },
  { label: "Assinatura" },
  { label: "Procedimentos", href: "/configuracoes/procedimentos" },
  { label: "Categorias de procedimentos", href: "/configuracoes/categorias-de-procedimentos" },
  { label: "Pacotes", href: "/configuracoes/pacotes" },
  { label: "Salas de atendimento" },
  { label: "Fichas de atendimentos", href: "/configuracoes/fichas-de-atendimentos" },
  { label: "Modelos de atestados e prescrições", href: "/configuracoes/modelos-de-atestados-e-prescricoes" },
  { label: "Etiquetas" },
  { label: "Horários de funcionamento" },
];

export function ConfigSubmenu() {
  const pathname = usePathname();
  return (
    <nav className="w-60 shrink-0 border-r border-border bg-surface p-3">
      <h2 className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-2">
        Configurações
      </h2>
      <ul className="flex flex-col gap-0.5">
        {ITEMS.map((it) => {
          const active = !!it.href && pathname === it.href;
          const inner = (
            <span
              className={cn(
                "block rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-brand text-white font-medium"
                  : it.href
                  ? "text-foreground hover:bg-background"
                  : "cursor-not-allowed text-muted-2/70"
              )}
            >
              {it.label}
              {!it.href && <span className="ml-1 text-xs text-muted-2/60">· Em breve</span>}
            </span>
          );
          return (
            <li key={it.label}>
              {it.href ? <Link href={it.href}>{inner}</Link> : inner}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
