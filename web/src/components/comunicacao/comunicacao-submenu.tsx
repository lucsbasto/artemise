"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type SubItem = { label: string; href?: string; match?: string };

const ITEMS: SubItem[] = [
  { label: "Canais de atendimento", href: "/comunicacao/canais-de-comunicacao", match: "/comunicacao/canais-de-comunicacao" },
  { label: "Modelos de mensagens", href: "/comunicacao/mensagens/mensagens-do-sistema", match: "/comunicacao/mensagens" },
  { label: "Central de notificações" },
];

export function ComunicacaoSubmenu() {
  const pathname = usePathname();
  return (
    <nav className="w-60 shrink-0 border-r border-border bg-surface p-3">
      <h2 className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-2">
        Comunicação
      </h2>
      <ul className="flex flex-col gap-0.5">
        {ITEMS.map((it) => {
          const active = !!it.match && pathname.startsWith(it.match);
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
