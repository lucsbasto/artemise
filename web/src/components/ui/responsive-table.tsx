import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Wrapper de tabela responsiva (R-RSP-TBL, DEC-1).
 * - `md:`+ — rola horizontal se precisar (`overflow-x-auto`).
 * - `< md` — a classe `.rtable` (em globals.css) colapsa a `<table>` em cards
 *   rótulo→valor; cada `<td>` usa `data-label="…"` (vazio em ações/checkbox).
 */
export function ResponsiveTable({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("rtable md:overflow-x-auto", className)}>{children}</div>;
}
