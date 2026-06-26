"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import { Header } from "./header";
import { IconSidebar } from "./icon-sidebar";
import { FloatingWidgets } from "./floating-widgets";

export function AppShell({ children }: { children: React.ReactNode }) {
  // Estado dual por breakpoint (R-RSP-SHELL-1):
  // - < md: drawer aberto/fechado (overlay).
  // - md+: sidebar estreita (false) ↔ larga (true), em fluxo.
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // fecha o drawer ao navegar (R-RSP-SHELL-1) — ajuste de estado no render
  // (padrão React p/ derivar de mudança; evita setState em effect)
  const [prevPath, setPrevPath] = React.useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpen(false);
  }

  // Esc fecha o drawer (R-RSP-SHELL-1)
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header onToggleSidebar={() => setOpen((v) => !v)} />
      <div className="flex flex-1 overflow-hidden">
        {/* backdrop só no celular (R-RSP-SHELL-1) */}
        {open && (
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />
        )}
        <IconSidebar open={open} onNavigate={() => setOpen(false)} />
        {/* min-w-0 evita que filhos largos furem o flex e gerem scroll lateral (R-RSP-SHELL-2) */}
        <main className="scroll-thin min-w-0 flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
      <FloatingWidgets />
    </div>
  );
}
