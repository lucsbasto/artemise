"use client";
import { ChevronRight, Plus, Sparkles } from "lucide-react";
import { currentUser } from "@/lib/mock";

export function FloatingWidgets() {
  return (
    <>
      {/* canto inferior esquerdo */}
      <div className="pointer-events-none fixed bottom-4 left-20 z-20 flex w-72 max-w-[calc(100vw-6rem)] flex-col gap-2">
        <div className="pointer-events-auto rounded-lg bg-gradient-to-r from-orange-500 to-amber-400 px-3 py-2 text-sm font-semibold text-white shadow-md">
          Ei, {currentUser.nome}! Tô aqui guardando o seu desconto! 🙂
        </div>
        <button className="pointer-events-auto flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2 shadow-sm">
          <span className="grid size-9 place-items-center rounded-full border-2 border-green-400 text-xs font-semibold text-green-500">
            0%
          </span>
          <span className="text-sm font-medium text-foreground">Seu progresso</span>
          <ChevronRight className="ml-auto size-4 text-muted-2" />
        </button>
      </div>

      {/* canto inferior direito */}
      <div className="fixed bottom-5 right-5 z-20 flex flex-col items-center gap-3">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("artemise:novo-evento"))}
          className="grid size-12 place-items-center rounded-full bg-brand text-white shadow-lg hover:bg-brand-600"
          aria-label="Criar"
        >
          <Plus className="size-6" />
        </button>
        <button
          className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-400 to-indigo-400 text-white shadow-lg"
          aria-label="Assistente IA"
        >
          <Sparkles className="size-5" />
        </button>
      </div>
    </>
  );
}
