"use client";
import * as React from "react";

export type SortDir = "asc" | "desc";

export type ListControlsOptions<T> = {
  /** Campos varridos pela busca textual. */
  searchFields?: (keyof T)[];
  /** Predicados de filtro ativos (ex.: por status). Combinados com AND. */
  filters?: ((item: T) => boolean)[];
  /** Ordenação opcional. */
  sortKey?: keyof T | null;
  sortDir?: SortDir;
  /** Itens por página inicial. */
  perPage?: number;
};

/**
 * Busca + filtro + ordenação + paginação client-side sobre um array.
 * Usado pelas listagens para deixá-las funcionais sem backend.
 */
export function useListControls<T>(rows: T[], opts: ListControlsOptions<T> = {}) {
  const { searchFields = [], filters = [], sortKey = null, sortDir = "asc", perPage: perPage0 = 25 } = opts;

  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(perPage0);

  // filtro textual
  const searched = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || searchFields.length === 0) return rows;
    return rows.filter((r) =>
      searchFields.some((f) => String(r[f] ?? "").toLowerCase().includes(q))
    );
  }, [rows, query, searchFields]);

  // filtros adicionais (predicados)
  const filtered = React.useMemo(
    () => (filters.length ? searched.filter((r) => filters.every((fn) => fn(r))) : searched),
    [searched, filters]
  );

  // ordenação
  const sorted = React.useMemo(() => {
    if (!sortKey) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") return av - bv;
      return String(av).localeCompare(String(bv), "pt-BR");
    });
    if (sortDir === "desc") arr.reverse();
    return arr;
  }, [filtered, sortKey, sortDir]);

  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));

  // mantém a página exibida dentro dos limites quando o total/filtro muda
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * perPage;
  const pageRows = sorted.slice(start, start + perPage);

  // contadores p/ "Mostrando X a Y de Z"
  const from = total === 0 ? 0 : start + 1;
  const to = Math.min(start + perPage, total);

  function changePerPage(n: number) {
    setPerPage(n);
    setPage(1);
  }
  function clear() {
    setQuery("");
    setPage(1);
  }

  return {
    // dados
    rows: pageRows,
    total,
    from,
    to,
    // busca
    query,
    setQuery: (q: string) => {
      setQuery(q);
      setPage(1);
    },
    // paginação
    page: safePage,
    pageCount,
    perPage,
    setPage,
    setPerPage: changePerPage,
    canPrev: safePage > 1,
    canNext: safePage < pageCount,
    clear,
  };
}
