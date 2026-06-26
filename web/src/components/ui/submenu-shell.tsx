"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export type SubItem = {
  label: string;
  /** Ausente = item "Em breve" (desabilitado). */
  href?: string;
  /** Casa rota exata em vez de prefixo. */
  exact?: boolean;
  /** Prefixo de rota p/ marcar ativo, quando difere de `href`. */
  match?: string;
};

/**
 * Submenu de módulo responsivo (R-RSP-SUB).
 * - `md:`+ — coluna lateral (`md:w-48 lg:w-56`), comportamento atual.
 * - `< md` — vira `<select>` nativo no topo do conteúdo (router.push no change).
 */
export function SubmenuShell({ title, items }: { title: string; items: SubItem[] }) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (it: SubItem) => {
    if (!it.href) return false;
    const target = it.match ?? it.href;
    return it.exact ? pathname === target : pathname.startsWith(target);
  };
  const active = items.find(isActive);

  return (
    <>
      {/* celular: seletor no topo (R-RSP-SUB-1) */}
      <div className="border-b border-border bg-surface p-3 md:hidden">
        <label htmlFor="submenu-select" className="sr-only">
          {title}
        </label>
        <div className="relative">
          <select
            id="submenu-select"
            value={active?.href ?? ""}
            onChange={(e) => {
              if (e.target.value) router.push(e.target.value);
            }}
            className="h-10 w-full appearance-none rounded-lg border border-border bg-surface px-3 pr-9 text-sm font-medium text-foreground outline-none focus:border-brand"
          >
            {!active && (
              <option value="" disabled>
                {title}
              </option>
            )}
            {items.map((it) => (
              <option key={it.label} value={it.href ?? ""} disabled={!it.href}>
                {it.label}
                {!it.href ? " · Em breve" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* tablet/desktop: coluna lateral (R-RSP-SUB-2) */}
      <nav className="hidden shrink-0 border-r border-border bg-surface p-3 md:block md:w-48 lg:w-56">
        <h2 className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-2">
          {title}
        </h2>
        <ul className="flex flex-col gap-0.5">
          {items.map((it) => {
            const on = isActive(it);
            const inner = (
              <span
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm transition-colors",
                  on
                    ? "bg-brand font-medium text-white"
                    : it.href
                      ? "text-foreground hover:bg-background"
                      : "cursor-not-allowed text-muted-2/70"
                )}
              >
                {it.label}
                {!it.href && (
                  <span className="ml-1 text-xs text-muted-2/60">· Em breve</span>
                )}
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
    </>
  );
}
