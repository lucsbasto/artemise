import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.ComponentProps<"span"> & { tone?: "neutral" | "brand" | "success" | "warning" }) {
  const tones: Record<string, string> = {
    neutral: "bg-background text-muted border-border",
    brand: "bg-brand-50 text-brand border-brand-100",
    success: "bg-green-50 text-success border-green-100",
    warning: "bg-amber-50 text-warning border-amber-100",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
