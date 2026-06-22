"use client";
import * as React from "react";
import { Search, MoreVertical, MessageCircle, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Settings } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import type { Contact } from "@/lib/mock";

function Avatar({ nome, tone }: { nome: string; tone: "brand" | "green" }) {
  const initials = nome
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold",
        tone === "green" ? "bg-green-100 text-green-700" : "bg-brand-100 text-brand"
      )}
    >
      {initials}
    </span>
  );
}

export function ContactsTable({
  title,
  rows,
}: {
  title: string;
  rows: Contact[];
}) {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const allSelected = rows.length > 0 && selected.size === rows.length;

  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)));
  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="rounded-[var(--radius-card)] bg-surface border border-border shadow-sm">
      {/* header */}
      <div className="flex items-center gap-2 px-5 pt-5">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <span className="text-sm text-muted-2">
          {rows.length} {rows.length === 1 ? "registro" : "registros"}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            disabled={selected.size === 0}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-background px-3 text-sm font-medium text-muted disabled:opacity-50"
          >
            Ações em lote <ChevronDown className="size-4" />
          </button>
          <button className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-foreground hover:bg-background">
            Exportar <ChevronDown className="size-4" />
          </button>
        </div>
      </div>

      {/* filtros */}
      <div className="flex items-center gap-2 px-5 py-4">
        <button className="text-sm font-medium text-brand hover:underline">+ Adicionar filtro</button>
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
          <input
            placeholder="Buscar"
            className="h-9 w-64 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none placeholder:text-muted-2 focus:border-brand"
          />
        </div>
      </div>

      {/* tabela */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-border text-left text-muted-2">
              <th className="w-10 px-5 py-3">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="size-4 accent-brand" />
              </th>
              <th className="py-3 font-medium">Nome ◆</th>
              <th className="py-3 font-medium">Etiquetas</th>
              <th className="py-3 font-medium">Identificador</th>
              <th className="py-3 font-medium">Ativo</th>
              <th className="w-10 px-5 py-3 text-right">
                <Settings className="ml-auto size-4" />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-b-0">
                <td className="px-5 py-3">
                  <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggleOne(c.id)} className="size-4 accent-brand" />
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <Avatar nome={c.nome} tone={c.avatarTone} />
                    <div>
                      <p className="font-medium text-foreground">{c.nome}</p>
                      <p className="text-xs text-muted-2">{c.tipo}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-muted-2">{c.etiquetas.join(", ")}</td>
                <td className="py-3">
                  <span className="flex items-center gap-1.5 text-foreground">
                    {c.identificador}
                    <MessageCircle className="size-4 text-green-500" />
                  </span>
                </td>
                <td className="py-3">
                  <Toggle defaultOn={c.ativo} tone="success" />
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="text-muted-2 hover:text-foreground">
                    <MoreVertical className="ml-auto size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* rodapé */}
      <div className="flex items-center justify-between px-5 py-4">
        <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted">
          25 por página <ChevronDown className="size-4" />
        </button>
        <div className="flex items-center gap-1">
          <PagBtn disabled><ChevronsLeft className="size-4" /></PagBtn>
          <PagBtn disabled><ChevronLeft className="size-4" /></PagBtn>
          <button className="grid size-9 place-items-center rounded-lg bg-brand text-sm font-medium text-white">1</button>
          <PagBtn disabled><ChevronRight className="size-4" /></PagBtn>
          <PagBtn disabled><ChevronsRight className="size-4" /></PagBtn>
        </div>
      </div>
    </div>
  );
}

function PagBtn({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <button disabled={disabled} className="grid size-9 place-items-center rounded-lg bg-background text-muted-2 disabled:opacity-40">
      {children}
    </button>
  );
}
