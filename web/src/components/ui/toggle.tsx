"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Toggle({
  defaultOn = false,
  checked,
  onChange,
  tone = "brand",
}: {
  defaultOn?: boolean;
  /** Modo controlado: passe `checked` + `onChange`. Sem eles, usa estado interno. */
  checked?: boolean;
  onChange?: (next: boolean) => void;
  tone?: "brand" | "success";
}) {
  const [internal, setInternal] = React.useState(defaultOn);
  const isControlled = checked != null;
  const on = isControlled ? checked : internal;

  function handle() {
    const next = !on;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={handle}
      className={cn(
        "relative h-5 w-9 rounded-full transition-colors",
        on ? (tone === "success" ? "bg-success" : "bg-brand") : "bg-gray-300"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform",
          on && "translate-x-4"
        )}
      />
    </button>
  );
}
