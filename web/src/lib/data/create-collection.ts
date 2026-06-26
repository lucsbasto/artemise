"use client";
import * as React from "react";
import { apiFetch } from "@/lib/api-client";

/**
 * Store de coleção ligado à API Go.
 *
 * A interface pública (`Collection<T>`, `useCollection`, `nextId`) é a mesma do
 * store em memória que existia antes — os componentes de UI não mudam. O que
 * troca é a implementação: cada método agora fala HTTP com o backend.
 *
 * Modelo: `getSnapshot()` devolve um cache local; o primeiro `subscribe`
 * dispara `revalidate()` (GET da lista), que preenche o cache e notifica. Cada
 * mutação (`add/update/remove/toggle`) chama a API e revalida em seguida.
 *
 * Para sub-recursos sem endpoint de listagem plano (detalhe rico do
 * profissional, registros por paciente, eventos da agenda — cujo shape difere
 * do contrato REST), use {@link createLocalCollection}: mesma interface, porém
 * memória de sessão (a integração desses recursos é faseada — design §8.6).
 */
export type WithId = { id: string };

export type Collection<T extends WithId> = {
  getSnapshot: () => T[];
  subscribe: (cb: () => void) => () => void;
  /** Mutações podem ser assíncronas (HTTP). Os consumidores não precisam aguardar. */
  add: (item: T) => void | Promise<void>;
  update: (id: string, patch: Partial<T>) => void | Promise<void>;
  remove: (id: string) => void | Promise<void>;
  /** Inverte um campo booleano (ex.: `ativo`). */
  toggle: (id: string, key: keyof T) => void | Promise<void>;
  /** Substitui a coleção inteira no cache local (útil p/ reordenar/importar). */
  set: (next: T[]) => void | Promise<void>;
};

/** Envelope padrão das rotas de listagem (design §5.1). */
type ListEnvelope<T> = { items: T[] };

/**
 * Cria uma coleção ligada a um recurso REST.
 * @param endpoint path do recurso sob `/api` (ex.: `"/pacientes"`).
 * @param seed hidratação inicial (SSR); o cache é revalidado no client.
 */
export function createCollection<T extends WithId>(
  endpoint: string,
  seed: T[] = []
): Collection<T> {
  let cache: T[] = seed;
  const subs = new Set<() => void>();
  const emit = () => subs.forEach((f) => f());

  // Recarrega a lista do backend e notifica os assinantes. Erros (incl.
  // AuthError) mantêm o último cache — o tratamento de sessão fica nas páginas.
  async function revalidate(): Promise<void> {
    try {
      const { items } = await apiFetch<ListEnvelope<T>>(endpoint);
      cache = items;
      emit();
    } catch {
      // mantém o cache atual; runtime/erro tratado na camada de página
    }
  }

  return {
    getSnapshot: () => cache,
    subscribe: (cb) => {
      subs.add(cb);
      void revalidate();
      return () => subs.delete(cb);
    },
    add: async (item) => {
      await apiFetch(endpoint, { method: "POST", body: JSON.stringify(item) });
      await revalidate();
    },
    update: async (id, patch) => {
      await apiFetch(`${endpoint}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      await revalidate();
    },
    remove: async (id) => {
      await apiFetch(`${endpoint}/${id}`, { method: "DELETE" });
      await revalidate();
    },
    toggle: async (id, key) => {
      await apiFetch(`${endpoint}/${id}/toggle`, {
        method: "PATCH",
        body: JSON.stringify({ key }),
      });
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
 * {@link Collection}. Para recursos cujo swap p/ API ainda é faseado.
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

/** Gera id único na sessão (placeholder; o backend gera o id definitivo). */
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
