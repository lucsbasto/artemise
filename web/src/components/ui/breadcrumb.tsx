import { cn } from "@/lib/utils";

export function Breadcrumb({ items }: { items: string[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm">
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <span key={it} className="flex items-center gap-1.5">
            <span className={cn(last ? "text-muted" : "text-brand")}>{it}</span>
            {!last && <span className="text-muted-2">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
