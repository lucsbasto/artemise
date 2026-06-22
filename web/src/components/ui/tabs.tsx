"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Tabs de texto controladas — estado local, só visual (sem troca de dados real). */
export function TextTabs({
  tabs,
  initial,
  className,
}: {
  tabs: string[];
  initial?: string;
  className?: string;
}) {
  const [active, setActive] = React.useState(initial ?? tabs[0]);
  return (
    <div className={cn("flex items-center gap-4 text-sm", className)}>
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => setActive(t)}
          className={cn(
            "relative pb-1 transition-colors",
            active === t
              ? "text-brand font-medium after:absolute after:-bottom-px after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-brand"
              : "text-muted-2 hover:text-muted"
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/** Tabs de ícones (seção Relatórios). */
export function IconTabs({
  icons,
  className,
}: {
  icons: React.ReactNode[];
  className?: string;
}) {
  const [active, setActive] = React.useState(0);
  return (
    <div className={cn("flex items-center gap-6", className)}>
      {icons.map((ic, i) => (
        <button
          key={i}
          onClick={() => setActive(i)}
          className={cn(
            "relative pb-2 transition-colors",
            active === i
              ? "text-brand after:absolute after:-bottom-px after:left-1/2 after:h-0.5 after:w-5 after:-translate-x-1/2 after:rounded-full after:bg-brand"
              : "text-muted-2 hover:text-muted"
          )}
        >
          {ic}
        </button>
      ))}
    </div>
  );
}
