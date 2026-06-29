"use client";
import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { selectCols, toRow, type FieldMap } from "@/lib/supabase/resource";

/**
 * Store de coleção ligado direto ao Supabase (PostgREST).
 *
 * A interface pública (`Collection<T>`, `useCollection`, `nextId`) é a mesma do
 * store em memória/HTTP que existia antes — os componentes de UI não mudam. O
 * que troca é a implementação: cada método agora fala com o Supabase via
 * `createClient().from(table)`, usando o `FieldMap` do recurso para mapear
 * camelCase ↔ snake_case (design §5.2).
 *
 * Modelo: `getSnapshot()` devolve um cache local; o primeiro `subscribe`
 * dispara `revalidate()` (SELECT da lista), que preenche o cache e notifica.
 * Cada mutação (`add/update/remove/toggle`) chama o Supabase e revalida.
 *
 * Para sub-recursos sem listagem plana (detalhe rico do profissional, registros
 * por paciente, eventos da agenda — shape divergente), use
 * {@link createLocalCollection}: mesma interface, memória de sessão. A
 * integração desses recursos é faseada (lane M5).
 */
export type WithId = { id: string };

export type Collection<T extends WithId> = {
  getSnapshot: () => T[];
  subscribe: (cb: () => void) => () => void;
  /** Mutações podem ser assíncronas (rede). Os consumidores não precisam aguardar. */
  add: (item: T) => void | Promise<void>;
  update: (id: string, patch: Partial<T>) => void | Promise<void>;
  remove: (id: string) => void | Promise<void>;
  /** Inverte um campo booleano (ex.: `ativo`). */
  toggle: (id: string, key: keyof T) => void | Promise<void>;
  /** Substitui a coleção inteira no cache local (útil p/ reordenar/importar). */
  set: (next: T[]) => void | Promise<void>;
};

/**
 * Opções de recursos compostos. `select` substitui a string padrão (gerada do
 * `FieldMap`) por uma com embeds PostgREST (ex.: `"*, orcamento_itens(*)"`).
 * `transform` reformata a lista bruta de linhas (ex.: contagem de itens, árvore
 * de categorias) — recebe todas as linhas para permitir reshape agregado.
 */
export type CollectionOptions<T> = {
  select?: string;
  transform?: (rows: Record<string, unknown>[]) => T[];
};

/**
 * Cria uma coleção ligada a uma tabela do Supabase.
 * @param table nome da tabela snake_case (ex.: `"pacientes"`).
 * @param map mapa de campos camelCase → coluna snake_case do recurso.
 * @param options `select`/`transform` para recursos com embed ou shape derivado.
 *
 * Expõe `revalidate()` no objeto retornado (além da interface `Collection<T>`)
 * para que sub-recursos compostos disparem a recarga desta coleção a partir de
 * fora (ex.: a coleção de detalhe do profissional refresca a lista de contatos).
 */
export function createCollection<T extends WithId>(
  table: string,
  map: FieldMap,
  options?: CollectionOptions<T>
): Collection<T> & { revalidate: () => Promise<void> } {
  const sel = options?.select ?? selectCols(map);
  let cache: T[] = [];
  const subs = new Set<() => void>();
  const emit = () => subs.forEach((f) => f());

  // Recarrega a lista do Supabase e notifica os assinantes. Erros (incl.
  // sessão expirada / RLS) mantêm o último cache — o tratamento de sessão
  // fica no proxy e nas páginas.
  async function revalidate(): Promise<void> {
    const { data, error } = await createClient()
      .from(table)
      .select(sel)
      .order("criado_em", { ascending: false });
    if (error) return; // mantém o cache atual
    const rows = (data ?? []) as unknown as Record<string, unknown>[];
    cache = options?.transform ? options.transform(rows) : (rows as unknown as T[]);
    emit();
  }

  return {
    revalidate,
    getSnapshot: () => cache,
    subscribe: (cb) => {
      subs.add(cb);
      void revalidate();
      return () => subs.delete(cb);
    },
    add: async (item) => {
      const row = toRow<T>(map, item);
      // `id` tem DEFAULT no banco; o id temporário (nextId) seria UUID inválido.
      delete row.id;
      const { error } = await createClient().from(table).insert(row);
      if (error) throw error;
      await revalidate();
    },
    update: async (id, patch) => {
      const { error } = await createClient()
        .from(table)
        .update(toRow<T>(map, patch))
        .eq("id", id);
      if (error) throw error;
      await revalidate();
    },
    remove: async (id) => {
      const { error } = await createClient().from(table).delete().eq("id", id);
      if (error) throw error;
      await revalidate();
    },
    toggle: async (id, key) => {
      const k = key as string;
      const col = map[k] ?? k;
      const cur = cache.find((x) => x.id === id) as
        | Record<string, unknown>
        | undefined;
      const { error } = await createClient()
        .from(table)
        .update({ [col]: !cur?.[k] })
        .eq("id", id);
      if (error) throw error;
      await revalidate();
    },
    set: (next) => {
      cache = next;
      emit();
    },
  };
}

/**
 * Coleção em memória de sessão (sem rede), com a mesma interface de
 * {@link Collection}. Para recursos cujo swap p/ Supabase ainda é faseado (M5).
 */
export function createLocalCollection<T extends WithId>(
  seed: T[] = []
): Collection<T> {
  let data: T[] = [...seed];
  const subs = new Set<() => void>();
  const emit = () => subs.forEach((f) => f());

  return {
    getSnapshot: () => data,
    subscribe: (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    add: (item) => {
      data = [item, ...data];
      emit();
    },
    update: (id, patch) => {
      data = data.map((d) => (d.id === id ? { ...d, ...patch } : d));
      emit();
    },
    remove: (id) => {
      data = data.filter((d) => d.id !== id);
      emit();
    },
    toggle: (id, key) => {
      data = data.map((d) => (d.id === id ? { ...d, [key]: !d[key] } : d));
      emit();
    },
    set: (next) => {
      data = next;
      emit();
    },
  };
}

/** Gera id único na sessão (placeholder; o banco gera o id definitivo). */
let _seq = 0;
export function nextId(prefix = "tmp"): string {
  _seq += 1;
  return `${prefix}-${_seq}`;
}

/** Liga um componente a uma coleção. Snapshot estável p/ SSR (seed determinístico). */
export function useCollection<T extends WithId>(store: Collection<T>) {
  const items = React.useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot
  );
  return {
    items,
    add: store.add,
    update: store.update,
    remove: store.remove,
    toggle: store.toggle,
    set: store.set,
  };
}
