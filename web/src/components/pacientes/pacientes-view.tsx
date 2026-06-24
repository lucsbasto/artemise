"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { useCollection, nextId } from "@/lib/data/create-collection";
import { pacientesStore } from "@/lib/data/stores";
import { PatientsTable } from "./patients-table";
import { PacienteModal, type NovoPaciente } from "./paciente-modal";

export function PacientesView() {
  const { items, add } = useCollection(pacientesStore);
  const [modalOpen, setModalOpen] = React.useState(false);

  // FAB global (+) abre o modal de novo paciente.
  React.useEffect(() => {
    const onCreate = () => setModalOpen(true);
    window.addEventListener("artemise:criar", onCreate);
    return () => window.removeEventListener("artemise:criar", onCreate);
  }, []);

  function handleSave(data: NovoPaciente) {
    add({ id: nextId("pac"), ...data });
    setModalOpen(false);
  }

  return (
    <>
      <Card className="overflow-hidden">
        <PatientsTable patients={items} />
      </Card>

      <PacienteModal
        key={String(modalOpen)}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}
