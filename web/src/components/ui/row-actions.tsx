"use client";
import * as React from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export type RowAction = { label: string; onClick: () => void; danger?: boolean };

/** Menu kebab (⋮) de ações por linha. Fecha ao clicar fora. */
export function RowActions({ actions }: { actions: RowAction[] }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-muted-2 hover:text-foreground"
        aria-label="Ações"
      >
        <MoreVertical className="ml-auto size-4" />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 w-40 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-lg">
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={() => {
                setOpen(false);
                a.onClick();
              }}
              className={cn(
                "block w-full px-3 py-2 text-left text-sm hover:bg-background",
                a.danger ? "text-danger" : "text-foreground"
              )}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
