"use client";
import * as React from "react";
import { Eye, EyeOff, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { brl } from "@/lib/utils";
import { balance } from "@/lib/mock";

/** Card de balanço com botão de olho que oculta/exibe os valores. */
export function BalancoCard() {
  const [oculto, setOculto] = React.useState(false);
  const v = (n: number) => (oculto ? "••••••" : brl(n));

  return (
    <Card>
      <CardHeader>
        <CardTitle info>Balanço</CardTitle>
        <button
          type="button"
          onClick={() => setOculto((o) => !o)}
          aria-label={oculto ? "Mostrar valores" : "Ocultar valores"}
          className="text-brand hover:text-brand-600 transition-colors"
        >
          {oculto ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xl font-semibold text-success">{v(balance.saldoRealizado)}</p>
          <p className="text-xs text-muted-2">de {v(balance.saldoPrevisto)} previstos</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="flex items-center gap-1 text-sm text-muted">
              Entradas: <ExternalLink className="size-3 text-brand" />
            </p>
            <p className="font-semibold text-success">{v(balance.entradasRealizadas)}</p>
            <p className="text-xs text-muted-2">de {v(balance.entradasPrevistas)} previsto</p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-sm text-muted">
              Saídas: <ExternalLink className="size-3 text-brand" />
            </p>
            <p className="font-semibold text-danger">{v(balance.saidasRealizadas)}</p>
            <p className="text-xs text-muted-2">de {v(balance.saidasPrevistas)} previsto</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
