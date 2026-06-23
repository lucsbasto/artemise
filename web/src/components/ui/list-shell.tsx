"use client";
import * as React from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

/**
 * Chrome de listagem genérico (header título+contador+Exportar/Ações em lote,
 * barra de filtros, rodapé de paginação). Usado pelas tabelas do lote 3.
 * Não substitui ContactsTable/FinanceTable (mantidos como estão).
 */
export function ListShell({
  title,
  count,
  showCount = true,
  batchActions = true,
  hideSearch = false,
  headerAction,
  filtersExtra,
  children,
}: {
  title: string;
  count: number;
  showCount?: boolean;
  batchActions?: boolean;
  hideSearch?: boolean;
  /** Substitui os botões padrão (Ações em lote / Exportar) no canto direito do header. */
  headerAction?: React.ReactNode;
  filtersExtra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface shadow-sm">
      {/* header */}
      <div className="flex items-center gap-2 px-5 pt-5">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {showCount && (
          <span className="text-sm text-muted-2">
            {count} {count === 1 ? "registro" : "registros"}
          </span>
        )}
        <div className="ml-auto flex items-center gap-2">
          {headerAction ?? (
            <>
              {batchActions && (
                <button
                  disabled
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-background px-3 text-sm font-medium text-muted disabled:opacity-50"
                >
                  Ações em lote <ChevronDown className="size-4" />
                </button>
              )}
              <button className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-foreground hover:bg-background">
                Exportar <ChevronDown className="size-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* filtros */}
      <div className="flex flex-wrap items-center gap-2 px-5 py-4">
        <button className="text-sm font-medium text-brand hover:underline">+ Adicionar filtro</button>
        {filtersExtra}
        {!hideSearch && (
          <div className="relative ml-auto">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
            <input
              placeholder="Buscar"
              className="h-9 w-64 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none placeholder:text-muted-2 focus:border-brand"
            />
          </div>
        )}
      </div>

      {/* corpo (tabela ou empty-state) */}
      {children}

      {/* rodapé paginação */}
      <div className="flex items-center justify-between px-5 py-4">
        <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted">
          25 por página <ChevronDown className="size-4" />
        </button>
        <div className="flex items-center gap-1">
          <PagBtn disabled>
            <ChevronsLeft className="size-4" />
          </PagBtn>
          <PagBtn disabled>
            <ChevronLeft className="size-4" />
          </PagBtn>
          <button className="grid size-9 place-items-center rounded-lg bg-brand text-sm font-medium text-white">
            1
          </button>
          <PagBtn disabled>
            <ChevronRight className="size-4" />
          </PagBtn>
          <PagBtn disabled>
            <ChevronsRight className="size-4" />
          </PagBtn>
        </div>
      </div>
    </div>
  );
}

function PagBtn({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      disabled={disabled}
      className="grid size-9 place-items-center rounded-lg bg-background text-muted-2 disabled:opacity-40"
    >
      {children}
    </button>
  );
}
