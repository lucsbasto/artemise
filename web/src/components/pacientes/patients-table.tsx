"use client";
import * as React from "react";
import { MessageCircle, MoreVertical, Settings, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import type { Patient } from "@/lib/mock";

// ── Avatar com iniciais ──────────────────────────────────────────────────────

function PatientAvatar({ nome }: { nome: string }) {
  const parts = nome.replace(/\(.*?\)/g, "").trim().split(" ").filter(Boolean);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : (parts[0]?.[0] ?? "?").toUpperCase();

  return (
    <span
      aria-hidden
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-brand text-xs font-semibold text-white"
    >
      {initials}
    </span>
  );
}

// ── Linha da tabela ──────────────────────────────────────────────────────────

function PatientRow({ patient }: { patient: Patient }) {
  return (
    <tr className="border-t border-border hover:bg-background/60 transition-colors">
      {/* checkbox */}
      <td className="w-10 px-3 py-3">
        <input
          type="checkbox"
          aria-label={`Selecionar ${patient.nome}`}
          className="size-4 rounded border-border accent-brand"
        />
      </td>

      {/* nome + tipo */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-3">
          <PatientAvatar nome={patient.nome} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground leading-snug">
              {patient.nome}
            </p>
            <p className="text-xs text-muted">{patient.tipo}</p>
          </div>
        </div>
      </td>

      {/* etiquetas */}
      <td className="px-3 py-3">
        <div className="flex flex-wrap gap-1">
          {patient.etiquetas.length === 0 ? null : patient.etiquetas.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-xs text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </td>

      {/* identificador */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-foreground">{patient.identificador}</span>
          <a
            href={`https://wa.me/${patient.identificador.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir WhatsApp"
            className="flex shrink-0 items-center text-green-500 hover:text-green-600"
          >
            <MessageCircle className="size-4" />
          </a>
        </div>
      </td>

      {/* toggle ativo */}
      <td className="px-3 py-3">
        <Toggle defaultOn={patient.ativo} tone="success" />
      </td>

      {/* menu ⋮ */}
      <td className="w-10 px-3 py-3 text-right">
        <button
          aria-label="Ações da linha"
          className="inline-flex size-8 items-center justify-center rounded-md text-muted hover:bg-background hover:text-foreground transition-colors"
        >
          <MoreVertical className="size-4" />
        </button>
      </td>
    </tr>
  );
}

// ── Paginação ────────────────────────────────────────────────────────────────

function PaginationButton({
  children,
  active = false,
  disabled = false,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  return (
    <button
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors",
        active
          ? "bg-brand text-white"
          : "text-muted hover:bg-background hover:text-foreground",
        disabled && "pointer-events-none opacity-40"
      )}
    >
      {children}
    </button>
  );
}

// ── Tabela principal (client) ────────────────────────────────────────────────

export function PatientsTable({ patients }: { patients: Patient[] }) {
  const [allSelected, setAllSelected] = React.useState(false);
  const hasSelection = allSelected;

  const count = patients.length;
  const countLabel = count === 1 ? "1 registro" : `${count} registros`;

  return (
    <div className="flex flex-col gap-0">
      {/* ── Cabeçalho do card ─────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-4">
        {/* título + contador */}
        <div className="flex items-baseline gap-2">
          <h1 className="text-[15px] font-semibold text-foreground">Pacientes</h1>
          <span className="text-sm text-muted">{countLabel}</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!hasSelection}
            aria-disabled={!hasSelection}
            className="gap-1.5"
          >
            Ações em lote
            <ChevronDown className="size-3.5" />
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            Exportar
            <ChevronDown className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* ── Filtros + busca ───────────────────────────────── */}
      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <button className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
          <span className="text-base leading-none">+</span>
          Adicionar filtro
        </button>
        <div className="relative w-56">
          <input
            type="text"
            placeholder="Buscar"
            className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground placeholder:text-muted-2 focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
      </div>

      {/* ── Tabela ───────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-t border-border bg-background/50">
              {/* checkbox selecionar todos */}
              <th className="w-10 px-3 py-2.5">
                <input
                  type="checkbox"
                  aria-label="Selecionar todos"
                  checked={allSelected}
                  onChange={(e) => setAllSelected(e.target.checked)}
                  className="size-4 rounded border-border accent-brand"
                />
              </th>
              <th className="px-3 py-2.5">
                <button className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted hover:text-foreground transition-colors">
                  Nome
                  {/* ◆ — sorting indicator */}
                  <span className="text-brand" aria-hidden>◆</span>
                </button>
              </th>
              <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted">
                Etiquetas
              </th>
              <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted">
                Identificador
              </th>
              <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted">
                Ativo
              </th>
              <th className="w-10 px-3 py-2.5 text-right">
                <button aria-label="Configurar colunas" className="inline-flex items-center justify-center text-muted hover:text-foreground transition-colors">
                  <Settings className="size-4" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <PatientRow key={p.id} patient={p} />
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Rodapé: por página + paginação ───────────────── */}
      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        {/* seletor por página */}
        <div className="relative">
          <select
            className="appearance-none rounded-lg border border-border bg-surface py-1.5 pl-3 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
            defaultValue="25"
          >
            <option value="10">10 por página</option>
            <option value="25">25 por página</option>
            <option value="50">50 por página</option>
            <option value="100">100 por página</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-muted" />
        </div>

        {/* controles de paginação */}
        <div className="flex items-center gap-0.5">
          <PaginationButton aria-label="Primeira página" disabled>
            «
          </PaginationButton>
          <PaginationButton aria-label="Página anterior" disabled>
            ‹
          </PaginationButton>
          <PaginationButton active aria-label="Página 1">
            1
          </PaginationButton>
          <PaginationButton aria-label="Próxima página" disabled>
            ›
          </PaginationButton>
          <PaginationButton aria-label="Última página" disabled>
            »
          </PaginationButton>
        </div>
      </div>
    </div>
  );
}
