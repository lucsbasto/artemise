"use client";
import { useCollection } from "@/lib/data/create-collection";
import { profissionaisStore } from "@/lib/data/stores";
import { ContactsTable } from "./contacts-table";

export function ProfissionaisView() {
  const { items, toggle, remove } = useCollection(profissionaisStore);

  return (
    <ContactsTable
      title="Profissionais"
      rows={items}
      onToggle={(c) => toggle(c.id, "ativo")}
      onDelete={(c) => remove(c.id)}
    />
  );
}
