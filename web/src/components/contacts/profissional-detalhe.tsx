"use client";
import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCollection } from "@/lib/data/create-collection";
import { profissionaisDetalheStore, procedimentosStore } from "@/lib/data/stores";

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/** Par rótulo/valor numa grade de informações. */
function Linha({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-2">{label}</span>
      <span className="text-sm text-foreground">{value || "-"}</span>
    </div>
  );
}

export function ProfissionalDetalhe({ id }: { id: string }) {
  const { items } = useCollection(profissionaisDetalheStore);
  const { items: procedimentos } = useCollection(procedimentosStore);
  const prof = items.find((p) => p.id === id);
  const procNome = (pid: string) =>
    procedimentos.find((p) => p.id === pid)?.nome ?? pid;

  if (!prof) {
    return (
      <div className="py-10 text-center text-sm text-muted-2">
        Profissional não encontrado.{" "}
        <Link href="/profissionais" className="text-brand hover:underline">
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* cabeçalho */}
      <div className="flex items-center gap-3">
        <Link
          href="/profissionais"
          className="grid size-8 place-items-center rounded-lg border border-border text-muted-2 hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-foreground">{prof.nome}</h1>
          <p className="text-xs text-muted-2">{prof.especialidade || "Profissional"}</p>
        </div>
        <Badge tone={prof.ativo ? "success" : "neutral"}>{prof.ativo ? "Ativo" : "Inativo"}</Badge>
      </div>

      {/* Identificação */}
      <Card>
        <CardHeader>
          <CardTitle>Identificação</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Linha label="CPF" value={prof.cpf} />
          <Linha label="Nascimento" value={prof.dataNascimento} />
          <Linha label="Telefone" value={prof.telefone} />
          <Linha label="Email" value={prof.email} />
          <Linha label="Vínculo" value={prof.vinculo} />
          <Linha label="Perfil de acesso" value={prof.perfilAcesso} />
        </CardContent>
      </Card>

      {/* Habilitação */}
      <Card>
        <CardHeader>
          <CardTitle>Habilitação profissional</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Linha label="Conselho" value={prof.conselho} />
          <Linha label="Registro" value={`${prof.registro}${prof.ufRegistro ? "/" + prof.ufRegistro : ""}`} />
          <Linha label="Especialidade" value={prof.especialidade} />
          <Linha
            label="Certificações"
            value={
              prof.certificacoes.length ? (
                <span className="flex flex-wrap gap-1">
                  {prof.certificacoes.map((c) => (
                    <Badge key={c} tone="neutral">
                      {c}
                    </Badge>
                  ))}
                </span>
              ) : (
                "-"
              )
            }
          />
        </CardContent>
      </Card>

      {/* Atuação */}
      <Card>
        <CardHeader>
          <CardTitle>Atuação</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Linha
            label="Procedimentos que executa"
            value={
              prof.procedimentoIds.length ? (
                <span className="flex flex-wrap gap-1">
                  {prof.procedimentoIds.map((pid) => (
                    <Badge key={pid} tone="brand">
                      {procNome(pid)}
                    </Badge>
                  ))}
                </span>
              ) : (
                "-"
              )
            }
          />
          <div>
            <span className="text-xs text-muted-2">Horários</span>
            {prof.horarios.length ? (
              <div className="mt-1 flex flex-wrap gap-2">
                {prof.horarios.map((h) => (
                  <span key={h.diaSemana} className="rounded-md bg-surface-2 px-2 py-1 text-xs text-foreground">
                    {DIAS[h.diaSemana]} {h.inicio}–{h.fim}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-sm text-muted-2">Não definido</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Financeiro */}
      <Card>
        <CardHeader>
          <CardTitle>Financeiro</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Linha label="Chave PIX" value={prof.chavePix} />
          <div>
            <span className="text-xs text-muted-2">Comissões</span>
            <div className="mt-1 flex flex-col gap-1">
              {prof.comissoes.map((c, i) => (
                <span key={i} className="text-sm text-foreground">
                  {c.procedimentoId ? procNome(c.procedimentoId) : "Padrão"}:{" "}
                  {c.tipo === "percentual" ? `${c.valor}%` : `R$ ${c.valor}`}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
