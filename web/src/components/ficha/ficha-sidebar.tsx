"use client";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { MessageCircle, MoreVertical, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { fichaAbas, idadeFrom } from "@/lib/mock";
import { useCollection } from "@/lib/data/create-collection";
import { pacientesStore } from "@/lib/data/stores";

function initials(nome: string) {
  const parts = nome.replace(/\(.*?\)/g, "").trim().split(" ").filter(Boolean);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : (parts[0]?.[0] ?? "?").toUpperCase();
}

export function FichaSidebar() {
  const pathname = usePathname();
  const params = useParams<{ id: string }>();
  const { items } = useCollection(pacientesStore);
  const paciente = items.find((p) => p.id === params.id) ?? items[0];

  if (!paciente) {
    return (
      <aside className="w-72 shrink-0 border-r border-border bg-surface p-6 text-sm text-muted">
        Paciente não encontrado.
      </aside>
    );
  }

  const base = `/pacientes/${paciente.id}`;
  const idade = idadeFrom(paciente.dataNascimento);
  const isExemplo = paciente.nome.includes("exemplo");

  return (
    <aside className="w-72 shrink-0 border-r border-border bg-surface">
      {/* painel do paciente */}
      <div className="flex flex-col items-center gap-2 border-b border-border px-5 py-6 text-center">
        <div className="relative">
          <span className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-brand text-xl font-semibold text-white ring-2 ring-brand/30">
            {initials(paciente.nome)}
          </span>
          {isExemplo && (
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-full border border-border bg-background px-2 text-[10px] font-semibold uppercase tracking-wide text-muted-2">
              Exemplo
            </span>
          )}
          <span className="absolute -bottom-1 right-0 grid size-6 place-items-center rounded-full bg-amber-400 text-white">
            <AlertTriangle className="size-3.5" strokeWidth={2.25} />
          </span>
        </div>

        <h1 className="mt-1 text-sm font-semibold leading-snug text-foreground">
          {paciente.nome}
        </h1>
        <div className="text-xs text-muted">
          <p>
            {[paciente.sexo, idade != null ? `${idade} anos` : null]
              .filter(Boolean)
              .join(" • ") || "—"}
          </p>
          <p>{paciente.identificador}</p>
          {paciente.cpf && <p>{paciente.cpf}</p>}
        </div>
        <span className="mt-1 inline-flex items-center rounded-full bg-brand-100/60 px-2.5 py-0.5 text-xs font-medium text-brand">
          Paciente
        </span>

        <div className="mt-2 flex w-full items-center gap-2">
          <button className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-500 px-3 text-sm font-medium text-white hover:bg-green-600">
            <MessageCircle className="size-4" /> Enviar mensagem
          </button>
          <button
            aria-label="Mais ações"
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-muted hover:bg-background"
          >
            <MoreVertical className="size-4" />
          </button>
        </div>
      </div>

      {/* menu de abas */}
      <nav className="p-3">
        <ul className="flex flex-col gap-0.5">
          {fichaAbas.map((aba) => {
            const href = `${base}/${aba.slug}`;
            const active = pathname === href;
            return (
              <li key={aba.slug}>
                <Link
                  href={href}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-brand font-medium text-white"
                      : "text-foreground hover:bg-background"
                  )}
                >
                  {aba.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
