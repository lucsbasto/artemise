"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Toggle({
  defaultOn = false,
  tone = "brand",
}: {
  defaultOn?: boolean;
  tone?: "brand" | "success";
}) {
  const [on, setOn] = React.useState(defaultOn);
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
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
