"use client";
import * as React from "react";
import { useCollection, nextId } from "@/lib/data/create-collection";
import { profissionaisStore, profissionaisDetalheStore } from "@/lib/data/stores";
import { ContactsTable } from "./contacts-table";
import { ProfissionalModal, type NovoProfissional } from "./profissional-modal";

export function ProfissionaisView() {
  const { items, toggle, remove, add } = useCollection(profissionaisStore);
  const detalhe = useCollection(profissionaisDetalheStore);
  const [modalOpen, setModalOpen] = React.useState(false);

  // FAB global (+) abre o modal de novo profissional.
  React.useEffect(() => {
    const onCreate = () => setModalOpen(true);
    window.addEventListener("artemise:criar", onCreate);
    return () => window.removeEventListener("artemise:criar", onCreate);
  }, []);

  // Persiste o cadastro rico e projeta a linha de contato (mesmo id).
  function handleSave(data: NovoProfissional) {
    const id = nextId("prof");
    detalhe.add({ id, ...data });
    add({
      id,
      nome: data.nome,
      tipo: "Profissional",
      etiquetas: data.especialidade ? [data.especialidade] : [],
      identificador: data.telefone,
      ativo: data.ativo,
      avatarTone: data.avatarTone,
    });
    setModalOpen(false);
  }

  // Remove das duas coleções mantendo-as em sincronia.
  function handleDelete(id: string) {
    remove(id);
    detalhe.remove(id);
  }

  return (
    <>
      <ContactsTable
        title="Profissionais"
        rows={items}
        hrefBase="/profissionais"
        onToggle={(c) => toggle(c.id, "ativo")}
        onDelete={(c) => handleDelete(c.id)}
      />

      <ProfissionalModal
        key={String(modalOpen)}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}
