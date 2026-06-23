"use client";
import * as React from "react";
import { useCollection, nextId } from "@/lib/data/create-collection";
import { profissionaisStore } from "@/lib/data/stores";
import { ContactsTable } from "./contacts-table";
import { ContactModal } from "./contact-modal";
import type { Contact } from "@/lib/mock";

export function ProfissionaisView() {
  const { items, toggle, remove, add } = useCollection(profissionaisStore);
  const [modalOpen, setModalOpen] = React.useState(false);

  // FAB global (+) abre o modal de novo profissional.
  React.useEffect(() => {
    const onCreate = () => setModalOpen(true);
    window.addEventListener("artemise:criar", onCreate);
    return () => window.removeEventListener("artemise:criar", onCreate);
  }, []);

  function handleSave(data: Omit<Contact, "id">) {
    add({ id: nextId("prof"), ...data });
    setModalOpen(false);
  }

  return (
    <>
      <ContactsTable
        title="Profissionais"
        rows={items}
        onToggle={(c) => toggle(c.id, "ativo")}
        onDelete={(c) => remove(c.id)}
      />

      <ContactModal
        key={String(modalOpen)}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        tipo="Profissional"
        title="Novo profissional"
      />
    </>
  );
}
