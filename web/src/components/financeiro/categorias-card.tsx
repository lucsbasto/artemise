"use client";
import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pie100 } from "@/components/charts/donut";
import { cn } from "@/lib/utils";
import { categoriasReceita } from "@/lib/mock";

export function CategoriasCard() {
  const [tipo, setTipo] = React.useState<"Receita" | "Despesa">("Receita");

  // In a real app, despesa segments would come from a different data source.
  // For mock purposes, same data regardless of toggle.
  const segments = categoriasReceita;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle info>Categorias</CardTitle>
        {/* Segmented toggle */}
        <div className="flex rounded-lg border border-border bg-background p-0.5 text-sm">
          <button
            onClick={() => setTipo("Receita")}
            className={cn(
              "rounded-md px-3 py-1 font-medium transition-colors",
              tipo === "Receita"
                ? "bg-success text-white"
                : "text-muted-2 hover:text-muted"
            )}
          >
            Receita
          </button>
          <button
            onClick={() => setTipo("Despesa")}
            className={cn(
              "rounded-md px-3 py-1 font-medium transition-colors",
              tipo === "Despesa"
                ? "bg-danger text-white"
                : "text-muted-2 hover:text-muted"
            )}
          >
            Despesa
          </button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center gap-4">
        <Pie100 segments={segments} size={160} />
        {/* Legend */}
        <div className="w-full space-y-2">
          {segments.map((s) => (
            <div key={s.nome} className="flex items-center gap-2 text-sm">
              <span
                className="inline-block size-2.5 shrink-0 rounded-full"
                style={{ background: s.cor }}
              />
              <span className="text-muted">{s.nome}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
