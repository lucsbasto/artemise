"use client";
import * as React from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export type RowAction = { label: string; onClick: () => void; danger?: boolean };

const MENU_W = 160; // px (w-40)

/**
 * Menu kebab (⋮) de ações por linha.
 * Posicionado via `fixed` ancorado no botão — escapa do `overflow` da tabela
 * (que antes recortava/escondia o menu). Abre para CIMA e para a DIREITA.
 * Fecha ao clicar fora, rolar a página ou redimensionar.
 */
export function RowActions({ actions }: { actions: RowAction[] }) {
  const [coords, setCoords] = React.useState<{ left: number; bottom: number } | null>(null);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const open = coords !== null;

  const close = React.useCallback(() => setCoords(null), []);

  function toggle() {
    if (open) return close();
    const r = btnRef.current!.getBoundingClientRect();
    setCoords({
      // direita: alinha a borda esquerda do menu ao botão, sem estourar a viewport
      left: Math.min(r.left, window.innerWidth - MENU_W - 8),
      // cima: base do menu na borda superior do botão
      bottom: window.innerHeight - r.top + 4,
    });
  }

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!btnRef.current?.contains(e.target as Node) && !menuRef.current?.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        className="text-muted-2 hover:text-foreground"
        aria-label="Ações"
      >
        <MoreVertical className="ml-auto size-4" />
      </button>
      {open && (
        <div
          ref={menuRef}
          style={{ position: "fixed", left: coords.left, bottom: coords.bottom, width: MENU_W }}
          className="z-50 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-lg"
        >
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={() => {
                close();
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
    </>
  );
}
