"use client";
import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterKey = "baixo" | "alto" | "todos";

interface EstoqueIndicatorsProps {
  summary: { baixo: number; alto: number; todos: number };
  active: FilterKey;
  onFilter: (key: FilterKey) => void;
}

const CARDS: { key: FilterKey; label: string; dot: string }[] = [
  { key: "baixo", label: "Estoque baixo", dot: "bg-red-500" },
  { key: "alto",  label: "Estoque alto",  dot: "bg-amber-400" },
  { key: "todos", label: "Todos",         dot: "bg-blue-500" },
];

export function EstoqueIndicators({ summary, active, onFilter }: EstoqueIndicatorsProps) {
  return (
    <div className="flex flex-wrap items-start divide-x divide-border border-y border-border">
      {CARDS.map(({ key, label, dot }) => (
        <button
          key={key}
          type="button"
          onClick={() => onFilter(key)}
          className={cn(
            "flex min-w-[140px] flex-1 flex-col gap-1 px-5 py-3 text-left transition-colors hover:bg-background",
            active === key && "border-b-2 border-b-blue-500"
          )}
        >
          <div className="flex items-center gap-1.5">
            <span className={cn("inline-block size-2 shrink-0 rounded-full", dot)} />
            <span className="text-xs text-muted">{label}</span>
            <Info className="size-3 shrink-0 text-muted-2" />
          </div>
          <span
            className={cn(
              "text-base font-semibold",
              active === key ? "text-brand" : "text-foreground"
            )}
          >
            {summary[key]}
          </span>
        </button>
      ))}
    </div>
  );
}
