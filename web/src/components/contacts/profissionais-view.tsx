"use client";
import * as React from "react";
import { useCollection } from "@/lib/data/create-collection";
import { profissionaisStore, profissionaisDetalheStore } from "@/lib/data/stores";
import { ContactsTable } from "./contacts-table";
import { ProfissionalModal, type NovoProfissional } from "./profissional-modal";

export function ProfissionaisView() {
  // A tabela de contatos lê a lista base; o cadastro rico (detalhe) cuida de
  // criar/excluir/togglar — ele cria a linha base na mesma tabela `profissionais`
  // e revalida ambas as coleções (design §6).
  const { items } = useCollection(profissionaisStore);
  const detalhe = useCollection(profissionaisDetalheStore);
  const [modalOpen, setModalOpen] = React.useState(false);

  // FAB global (+) abre o modal de novo profissional.
  React.useEffect(() => {
    const onCreate = () => setModalOpen(true);
    window.addEventListener("artemise:criar", onCreate);
    return () => window.removeEventListener("artemise:criar", onCreate);
  }, []);

  // Cria a linha base + detalhe via RPC numa transação (id gerado no banco).
  function handleSave(data: NovoProfissional) {
    detalhe.add({ id: "", ...data });
    setModalOpen(false);
  }

  // Exclui a linha base (CASCADE limpa o detalhe) e revalida as coleções.
  function handleDelete(id: string) {
    detalhe.remove(id);
  }

  return (
    <>
      <ContactsTable
        title="Profissionais"
        rows={items}
        hrefBase="/profissionais"
        onToggle={(c) => detalhe.toggle(c.id, "ativo")}
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
