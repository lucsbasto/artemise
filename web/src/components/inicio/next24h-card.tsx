"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Appointment } from "@/lib/mock";

/**
 * Card "Agendamentos das próximas 24h".
 * Clicar no título leva à agenda completa; clicar num item abre o detalhe.
 */
export function Next24hCard({ items }: { items: Appointment[] }) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <button type="button" onClick={() => router.push("/agenda")} className="text-left">
          <CardTitle className="hover:text-brand transition-colors">
            Agendamentos das próximas 24h
          </CardTitle>
        </button>
      </CardHeader>
      <CardContent>
        {items.map((a) => (
          <button
            key={a.paciente}
            type="button"
            onClick={() => router.push("/agenda?detalhe=1")}
            className="block w-full rounded-lg border-l-4 border-brand bg-brand-50/50 px-3 py-2 text-left transition-colors hover:bg-brand-50"
          >
            <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <span className="size-1.5 rounded-full bg-brand" />
              {a.paciente}
            </p>
            <p className="text-sm text-muted">{a.procedimento}</p>
            <p className="text-xs text-muted-2">{a.horario}</p>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
