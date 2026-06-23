"use client";
import * as React from "react";

/**
 * Store de coleção em memória (sessão) — seed a partir do mock.
 * Camada de troca p/ backend: hoje muta um array local; amanhã cada método
 * vira uma chamada de API. Os componentes só dependem do hook, não do array.
 *
 * Reset no reload é esperado (decisão: "memória da sessão").
 */
export type WithId = { id: string };

export type Collection<T extends WithId> = {
  getSnapshot: () => T[];
  subscribe: (cb: () => void) => () => void;
  add: (item: T) => void;
  update: (id: string, patch: Partial<T>) => void;
  remove: (id: string) => void;
  /** Inverte um campo booleano (ex.: `ativo`). */
  toggle: (id: string, key: keyof T) => void;
  /** Substitui a coleção inteira (útil p/ reordenar/importar). */
  set: (next: T[]) => void;
};

export function createCollection<T extends WithId>(seed: T[]): Collection<T> {
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

/** Gera id único na sessão (substituível pelo id do backend). */
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
