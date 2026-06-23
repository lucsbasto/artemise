"use client";
import * as React from "react";
import { Search } from "lucide-react";
import { CardModeloMensagem } from "@/components/comunicacao/card-modelo-mensagem";
import type { ModeloMensagem } from "@/lib/mock";

export function MensagensGrid({ modelos }: { modelos: ModeloMensagem[] }) {
  const [query, setQuery] = React.useState("");

  const filtrados = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return modelos;
    return modelos.filter(
      (m) =>
        m.titulo.toLowerCase().includes(q) ||
        m.descricao.toLowerCase().includes(q)
    );
  }, [modelos, query]);

  return (
    <>
      <div className="relative mt-5 w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar"
          className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none placeholder:text-muted-2 focus:border-brand"
        />
      </div>

      {filtrados.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted-2">Nenhum modelo encontrado.</p>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((m) => (
            <CardModeloMensagem key={m.id} modelo={m} />
          ))}
        </div>
      )}
    </>
  );
}
