"use client";
import { useCollection } from "@/lib/data/create-collection";
import { fornecedoresStore } from "@/lib/data/stores";
import { ContactsTable } from "./contacts-table";

export function FornecedoresView() {
  const { items, toggle, remove } = useCollection(fornecedoresStore);

  return (
    <ContactsTable
      title="Fornecedores"
      rows={items}
      onToggle={(c) => toggle(c.id, "ativo")}
      onDelete={(c) => remove(c.id)}
    />
  );
}
