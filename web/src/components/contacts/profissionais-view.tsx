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

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        aria-label="Novo profissional"
        className="fixed bottom-6 right-6 z-30 grid size-14 place-items-center rounded-full bg-brand text-white shadow-lg hover:bg-brand-600 transition-colors"
      >
        <span className="text-2xl leading-none">+</span>
      </button>

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
