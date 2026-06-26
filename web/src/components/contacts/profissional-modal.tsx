"use client";
import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useCollection } from "@/lib/data/create-collection";
import { procedimentosStore } from "@/lib/data/stores";
import type { Profissional, Conselho, VinculoTrabalho } from "@/lib/mock";

export type NovoProfissional = Omit<Profissional, "id">;

const CONSELHOS: Conselho[] = ["CRM", "CRO", "CREFITO", "COREN", "CRBM", "CRF", "Outro"];
const VINCULOS: VinculoTrabalho[] = ["CLT", "PJ", "Autônomo", "Sócio"];

/** Modal de cadastro de profissional: identificação, habilitação, atuação e financeiro. */
export function ProfissionalModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: NovoProfissional) => void;
}) {
  const { items: procedimentos } = useCollection(procedimentosStore);
  // identificação
  const [nome, setNome] = React.useState("");
  const [cpf, setCpf] = React.useState("");
  const [dataNascimento, setDataNascimento] = React.useState("");
  const [telefone, setTelefone] = React.useState("");
  const [email, setEmail] = React.useState("");
  // habilitação
  const [conselho, setConselho] = React.useState<Conselho>("CRBM");
  const [registro, setRegistro] = React.useState("");
  const [ufRegistro, setUfRegistro] = React.useState("");
  const [especialidade, setEspecialidade] = React.useState("");
  const [certificacoes, setCertificacoes] = React.useState("");
  // atuação
  const [vinculo, setVinculo] = React.useState<VinculoTrabalho>("Autônomo");
  const [procedimentoIds, setProcedimentoIds] = React.useState<string[]>([]);
  // financeiro
  const [comissao, setComissao] = React.useState("40");
  const [chavePix, setChavePix] = React.useState("");
  // acesso
  const [perfilAcesso, setPerfilAcesso] = React.useState<Profissional["perfilAcesso"]>("profissional");

  function toggleProc(id: string) {
    setProcedimentoIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  function salvar() {
    if (!nome.trim()) return;
    onSave({
      nome: nome.trim(),
      avatarTone: "brand",
      cpf: cpf.trim(),
      dataNascimento: dataNascimento.trim(),
      telefone: telefone.trim() || "-",
      email: email.trim(),
      ativo: true,
      conselho,
      registro: registro.trim(),
      ufRegistro: ufRegistro.trim().toUpperCase(),
      especialidade: especialidade.trim(),
      certificacoes: certificacoes
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      vinculo,
      procedimentoIds,
      horarios: [], // editável numa etapa futura
      comissoes: [{ procedimentoId: null, tipo: "percentual", valor: Number(comissao) || 0 }],
      chavePix: chavePix.trim(),
      perfilAcesso,
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Novo profissional"
      size="lg"
      footer={
        <Button variant="brand" className="px-8" onClick={salvar}>
          Salvar
        </Button>
      }
    >
      {/* Identificação */}
      <span className="text-sm font-semibold text-foreground">Identificação</span>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nome completo" required className="sm:col-span-2">
          <Input placeholder="Digite o nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        </Field>
        <Field label="CPF">
          <Input placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} />
        </Field>
        <Field label="Data de nascimento">
          <Input placeholder="dd/mm/aaaa" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
        </Field>
        <Field label="Telefone">
          <Input placeholder="+55 (00) 00000-0000" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        </Field>
        <Field label="Email">
          <Input type="email" placeholder="email@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
      </div>

      {/* Habilitação */}
      <span className="mt-6 block text-sm font-semibold text-foreground">Habilitação profissional</span>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Conselho">
          <Select value={conselho} onChange={(e) => setConselho(e.target.value as Conselho)}>
            {CONSELHOS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </Field>
        <Field label="Nº de registro">
          <Input placeholder="00000" value={registro} onChange={(e) => setRegistro(e.target.value)} />
        </Field>
        <Field label="UF do registro">
          <Input placeholder="TO" maxLength={2} value={ufRegistro} onChange={(e) => setUfRegistro(e.target.value)} />
        </Field>
        <Field label="Especialidade">
          <Input placeholder="Biomedicina Estética" value={especialidade} onChange={(e) => setEspecialidade(e.target.value)} />
        </Field>
        <Field label="Certificações" hint className="sm:col-span-2">
          <Input
            placeholder="Toxina Botulínica, Preenchimento, Laser (separe por vírgula)"
            value={certificacoes}
            onChange={(e) => setCertificacoes(e.target.value)}
          />
        </Field>
      </div>

      {/* Atuação */}
      <span className="mt-6 block text-sm font-semibold text-foreground">Atuação</span>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Vínculo">
          <Select value={vinculo} onChange={(e) => setVinculo(e.target.value as VinculoTrabalho)}>
            {VINCULOS.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </Select>
        </Field>
        <Field label="Perfil de acesso">
          <Select value={perfilAcesso} onChange={(e) => setPerfilAcesso(e.target.value as Profissional["perfilAcesso"])}>
            <option value="profissional">Profissional</option>
            <option value="recepção">Recepção</option>
            <option value="admin">Admin</option>
          </Select>
        </Field>
        <Field label="Procedimentos que executa" className="sm:col-span-2">
          <div className="flex flex-wrap gap-2">
            {procedimentos.map((p) => {
              const on = procedimentoIds.includes(p.id);
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => toggleProc(p.id)}
                  className={
                    "rounded-full border px-3 py-1 text-xs transition-colors " +
                    (on
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-border bg-surface text-muted-2 hover:border-brand")
                  }
                >
                  {p.nome}
                </button>
              );
            })}
          </div>
        </Field>
      </div>

      {/* Financeiro */}
      <span className="mt-6 block text-sm font-semibold text-foreground">Financeiro</span>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Comissão padrão (%)">
          <Input type="number" min={0} max={100} value={comissao} onChange={(e) => setComissao(e.target.value)} />
        </Field>
        <Field label="Chave PIX">
          <Input placeholder="email, telefone ou CPF" value={chavePix} onChange={(e) => setChavePix(e.target.value)} />
        </Field>
      </div>
    </Modal>
  );
}
