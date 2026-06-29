/**
 * Mapeamento camelCase (TS) ↔ snake_case (colunas Postgres) por recurso (SUP-10).
 *
 * O Go entregava JSON camelCase; o PostgREST devolve nomes de coluna. Cada
 * recurso declara um `FieldMap` (tsKey -> dbColumn). O `select` usa alias do
 * PostgREST (`tsKey:db_col`) para receber já em camelCase; o write converte de
 * volta para snake_case. Ver design §5.1.
 */
export type FieldMap = Record<string, string>;

/**
 * Gera a string de `select` com alias PostgREST a partir do mapa.
 * Colunas idênticas saem sem alias (`id`), divergentes como `tsKey:db_col`.
 */
export function selectCols(map: FieldMap): string {
  return Object.entries(map)
    .map(([ts, db]) => (ts === db ? ts : `${ts}:${db}`))
    .join(",");
}

/**
 * Converte um payload camelCase em uma linha snake_case para insert/update.
 * Apenas chaves presentes no mapa são incluídas — campos computados (ex.: a
 * contagem `itens` de orçamento, a árvore `filhos` de categorias) são
 * descartados por não terem coluna. O chamador remove o `id` em inserts (a
 * coluna tem DEFAULT no banco).
 */
export function toRow<T>(map: FieldMap, partial: Partial<T>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k in partial) {
    if (k in map) out[map[k]] = (partial as Record<string, unknown>)[k];
  }
  return out;
}
