"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { useCollection, nextId } from "@/lib/data/create-collection";
import { pacientesStore } from "@/lib/data/stores";
import { PatientsTable } from "./patients-table";
import { ContactModal } from "@/components/contacts/contact-modal";
import type { Contact } from "@/lib/mock";

export function PacientesView() {
  const { items, add } = useCollection(pacientesStore);
  const [modalOpen, setModalOpen] = React.useState(false);

  // FAB global (+) abre o modal de novo paciente.
  React.useEffect(() => {
    const onCreate = () => setModalOpen(true);
    window.addEventListener("artemise:criar", onCreate);
    return () => window.removeEventListener("artemise:criar", onCreate);
  }, []);

  function handleSave(data: Omit<Contact, "id">) {
    // Patient não tem avatarTone — descarta o campo extra do modal de contato.
    add({
      id: nextId("pac"),
      nome: data.nome,
      tipo: data.tipo,
      etiquetas: data.etiquetas,
      identificador: data.identificador,
      ativo: data.ativo,
    });
    setModalOpen(false);
  }

  return (
    <>
      <Card className="overflow-hidden">
        <PatientsTable patients={items} />
      </Card>

      <ContactModal
        key={String(modalOpen)}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        tipo="Paciente"
        title="Novo paciente"
      />
    </>
  );
}
