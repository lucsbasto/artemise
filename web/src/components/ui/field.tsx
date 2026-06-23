"use client";
import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

/** Label de campo de formulário: rótulo + asterisco (obrigatório) + ícone de ajuda opcional. */
export function Field({
  label,
  required,
  hint,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="flex items-center gap-1 text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-danger">*</span>}
        {hint && <Info className="size-3.5 text-muted-2" />}
      </span>
      {children}
    </label>
  );
}

const inputBase =
  "h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none placeholder:text-muted-2 focus:border-brand";

export function Input(props: React.ComponentProps<"input">) {
  return <input {...props} className={cn(inputBase, props.className)} />;
}

export function Select(props: React.ComponentProps<"select">) {
  return <select {...props} className={cn(inputBase, "bg-surface", props.className)} />;
}
