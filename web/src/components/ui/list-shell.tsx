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
 * Chrome de listagem genérico (header título+contador, barra de filtros,
 * rodapé de paginação).
 *
 * Dois modos:
 * - **Estático** (sem props de controle): paginação/busca decorativas (legado).
 * - **Controlado** (passando `onQueryChange`/`onPageChange`/...): busca, troca de
 *   página e itens-por-página funcionais. Use com `useListControls`.
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
  // --- controle opcional ---
  query,
  onQueryChange,
  searchPlaceholder = "Buscar",
  page,
  pageCount,
  onPageChange,
  perPage,
  onPerPageChange,
  perPageOptions = [10, 25, 50, 100],
  total,
  from,
  to,
}: {
  title: string;
  count: number;
  showCount?: boolean;
  batchActions?: boolean;
  hideSearch?: boolean;
  headerAction?: React.ReactNode;
  filtersExtra?: React.ReactNode;
  children: React.ReactNode;
  query?: string;
  onQueryChange?: (q: string) => void;
  searchPlaceholder?: string;
  page?: number;
  pageCount?: number;
  onPageChange?: (p: number) => void;
  perPage?: number;
  onPerPageChange?: (n: number) => void;
  perPageOptions?: number[];
  total?: number;
  from?: number;
  to?: number;
}) {
  const controlled = onPageChange != null && page != null && pageCount != null;
  const curPage = page ?? 1;
  const pages = pageCount ?? 1;

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
        <div className="ml-auto flex flex-wrap items-center gap-2">
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
          <div className="relative ml-auto w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
            <input
              placeholder={searchPlaceholder}
              value={onQueryChange ? query ?? "" : undefined}
              onChange={onQueryChange ? (e) => onQueryChange(e.target.value) : undefined}
              className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none placeholder:text-muted-2 focus:border-brand sm:w-64"
            />
          </div>
        )}
      </div>

      {/* corpo (tabela ou empty-state) */}
      {children}

      {/* rodapé paginação */}
      <div className="flex flex-wrap items-center justify-between gap-y-2 px-5 py-4">
        {controlled && onPerPageChange ? (
          <div className="relative">
            <select
              value={perPage}
              onChange={(e) => onPerPageChange(Number(e.target.value))}
              className="h-9 appearance-none rounded-lg border border-border bg-surface pl-3 pr-8 text-sm text-muted outline-none focus:border-brand"
            >
              {perPageOptions.map((n) => (
                <option key={n} value={n}>
                  {n} por página
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
          </div>
        ) : (
          <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted">
            {perPage ?? 25} por página <ChevronDown className="size-4" />
          </button>
        )}

        <div className="flex items-center gap-3">
          {controlled && total != null && (
            <span className="text-sm text-muted-2">
              Mostrando {from ?? 0} a {to ?? 0} de {total}
            </span>
          )}
          <div className="flex items-center gap-1">
            <PagBtn
              disabled={!controlled || curPage <= 1}
              onClick={controlled ? () => onPageChange!(1) : undefined}
            >
              <ChevronsLeft className="size-4" />
            </PagBtn>
            <PagBtn
              disabled={!controlled || curPage <= 1}
              onClick={controlled ? () => onPageChange!(curPage - 1) : undefined}
            >
              <ChevronLeft className="size-4" />
            </PagBtn>
            <button className="grid size-9 place-items-center rounded-lg bg-brand text-sm font-medium text-white">
              {curPage}
            </button>
            <PagBtn
              disabled={!controlled || curPage >= pages}
              onClick={controlled ? () => onPageChange!(curPage + 1) : undefined}
            >
              <ChevronRight className="size-4" />
            </PagBtn>
            <PagBtn
              disabled={!controlled || curPage >= pages}
              onClick={controlled ? () => onPageChange!(pages) : undefined}
            >
              <ChevronsRight className="size-4" />
            </PagBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function PagBtn({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="grid size-9 place-items-center rounded-lg bg-background text-muted-2 transition-colors hover:enabled:text-foreground disabled:opacity-40"
    >
      {children}
    </button>
  );
}
