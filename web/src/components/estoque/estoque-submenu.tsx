"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type SubItem = { label: string; href?: string };

const ITEMS: SubItem[] = [
  { label: "Controle de estoque", href: "/estoque/items" },
  { label: "Giro de estoque", href: "/estoque/giro" },
  { label: "Contagem de estoque", href: "/estoque/contagem-estoque" },
  { label: "Itens abertos", href: "/estoque/itens-aberto" },
  { label: "Compras" },
  { label: "Marcas" },
];

export function EstoqueSubmenu() {
  const pathname = usePathname();
  return (
    <nav className="w-56 shrink-0 border-r border-border bg-surface p-3">
      <h2 className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-2">
        Estoque
      </h2>
      <ul className="flex flex-col gap-0.5">
        {ITEMS.map((it) => {
          const active = !!it.href && pathname.startsWith(it.href);
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
