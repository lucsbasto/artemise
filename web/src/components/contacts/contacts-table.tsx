"use client";
import { MessageCircle, Settings } from "lucide-react";
import { ListShell } from "@/components/ui/list-shell";
import { Toggle } from "@/components/ui/toggle";
import { RowActions } from "@/components/ui/row-actions";
import { useListControls } from "@/lib/use-list-controls";
import { cn } from "@/lib/utils";
import type { Contact } from "@/lib/mock";

interface ContactsTableProps {
  title: string;
  rows: Contact[];
  onToggle?: (c: Contact) => void;
  onDelete?: (c: Contact) => void;
}

function Avatar({ nome, tone }: { nome: string; tone: "brand" | "green" }) {
  const initials = nome
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold",
        tone === "green" ? "bg-green-100 text-green-700" : "bg-brand-100 text-brand"
      )}
    >
      {initials}
    </span>
  );
}

export function ContactsTable({ title, rows, onToggle, onDelete }: ContactsTableProps) {
  const c = useListControls(rows, { searchFields: ["nome", "identificador", "tipo"], perPage: 25 });

  return (
    <ListShell
      title={title}
      count={c.total}
      batchActions={false}
      query={c.query}
      onQueryChange={c.setQuery}
      page={c.page}
      pageCount={c.pageCount}
      onPageChange={c.setPage}
      perPage={c.perPage}
      onPerPageChange={c.setPerPage}
      total={c.total}
      from={c.from}
      to={c.to}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-border text-left text-muted-2">
              <th className="py-3 font-medium px-5">Nome</th>
              <th className="py-3 font-medium">Etiquetas</th>
              <th className="py-3 font-medium">Identificador</th>
              <th className="py-3 font-medium">Ativo</th>
              <th className="w-10 px-5 py-3 text-right">
                <Settings className="ml-auto size-4" />
              </th>
            </tr>
          </thead>
          <tbody>
            {c.rows.map((contact) => (
              <tr key={contact.id} className="border-b border-border last:border-b-0">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar nome={contact.nome} tone={contact.avatarTone} />
                    <div>
                      <p className="font-medium text-foreground">{contact.nome}</p>
                      <p className="text-xs text-muted-2">{contact.tipo}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-muted-2">
                  {contact.etiquetas.length > 0 ? contact.etiquetas.join(", ") : "-"}
                </td>
                <td className="py-3">
                  <span className="flex items-center gap-1.5 text-foreground">
                    {contact.identificador}
                    <MessageCircle className="size-4 text-green-500" />
                  </span>
                </td>
                <td className="py-3">
                  <Toggle checked={contact.ativo} onChange={() => onToggle?.(contact)} tone="success" />
                </td>
                <td className="px-5 py-3 text-right">
                  <RowActions
                    actions={[
                      { label: "Excluir", onClick: () => onDelete?.(contact), danger: true },
                    ]}
                  />
                </td>
              </tr>
            ))}
            {c.rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-2">
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </ListShell>
  );
}
