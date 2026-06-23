"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Submenu interno do módulo Agenda (spec §3.3). Item ativo derivado da rota.
const items = [
  { label: "Agenda", href: "/agenda" },
  { label: "Visão geral", href: "/agenda/visao-geral" },
  { label: "Relatório de agendamentos", href: "/agenda/relatorio" },
  { label: "Eventos", href: "/agenda/eventos" },
];

export function AgendaSubmenu() {
  const pathname = usePathname();
  return (
    <aside className="w-52 shrink-0 border-r border-border bg-surface py-4">
      <nav className="flex flex-col gap-0.5 px-2">
        {items.map((item) => {
          const ativo = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                ativo
                  ? "bg-brand-50 text-brand"
                  : "text-muted hover:bg-background hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
