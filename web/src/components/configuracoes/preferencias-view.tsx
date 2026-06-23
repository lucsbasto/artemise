"use client";
import * as React from "react";
import { Toggle } from "@/components/ui/toggle";
import { Select } from "@/components/ui/field";

/** Linha de preferência: rótulo + descrição à esquerda, controle à direita. */
function PrefRow({
  label,
  desc,
  children,
}: {
  label: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-border py-4 last:border-b-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-2">{desc}</p>
      </div>
      <div className="w-64 shrink-0">{children}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col">
      <h3 className="border-b border-border pb-2 text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </section>
  );
}

function one(value: string) {
  return (
    <Select defaultValue={value}>
      <option value={value}>{value}</option>
    </Select>
  );
}

/** Tela 30 — Preferências do sistema. Auto-save inline (mock, sem persistência). */
export function PreferenciasView() {
  return (
    <div className="flex flex-col gap-8">
      <Section title="Geral">
        <PrefRow
          label="Fuso horário"
          desc="Fuso horário da localidade da clínica. (Padrão: (GMT-03:00) São Paulo)"
        >
          {one("(GMT-03:00) São Paulo")}
        </PrefRow>
        <PrefRow label="Moeda" desc="Moeda padrão da localidade da clínica. (Padrão: BRL - R$)">
          {one("BRL - R$")}
        </PrefRow>
      </Section>

      <Section title="Financeiro">
        <PrefRow
          label="Ocultar dados financeiros"
          desc="Se habilitado, esconde as informações financeiras da página inicial. (Padrão: Desabilitado)"
        >
          <div className="flex justify-end">
            <Toggle />
          </div>
        </PrefRow>
        <PrefRow
          label="Usar DRE"
          desc="Se habilitado, o sistema irá habilitar as categorias do DRE. (Padrão: Desabilitado)"
        >
          <div className="flex justify-end">
            <Toggle />
          </div>
        </PrefRow>
        <PrefRow
          label="Usar abertura de caixa"
          desc="Se habilitado, o sistema irá habilitar a abertura de caixa. (Padrão: Desabilitado)"
        >
          <div className="flex justify-end">
            <Toggle />
          </div>
        </PrefRow>
        <PrefRow
          label="Mostrar apenas movimentações de Dinheiro no caixa"
          desc="Se habilitado, apenas movimentações com método 'Dinheiro' serão exibidas no resumo do caixa. (Padrão: Desabilitado)"
        >
          <div className="flex justify-end">
            <Toggle />
          </div>
        </PrefRow>
        <PrefRow
          label="Conciliação bancária"
          desc="Se habilitado, o sistema irá habilitar a conciliação bancária. (Padrão: Desabilitado)"
        >
          <div className="flex justify-end">
            <Toggle />
          </div>
        </PrefRow>
        <PrefRow
          label="Categoria de receitas"
          desc="Categoria padrão para entradas no financeiro. (Padrão: Receitas de serviços)"
        >
          {one("Receitas de serviços")}
        </PrefRow>
        <PrefRow
          label="Método de receitas"
          desc="Método de pagamento padrão para entradas no financeiro. (Padrão: Dinheiro)"
        >
          {one("PIX")}
        </PrefRow>
        <PrefRow
          label="Método de despesas"
          desc="Método de pagamento padrão para saídas no financeiro. (Padrão: Dinheiro)"
        >
          {one("PIX")}
        </PrefRow>
        <PrefRow label="Conta de receitas" desc="Conta padrão para entradas no financeiro.">
          {one("Banco padrão")}
        </PrefRow>
        <PrefRow label="Conta de despesas" desc="Conta padrão para saídas no financeiro.">
          {one("Banco padrão")}
        </PrefRow>
        <PrefRow
          label="Categoria de transferências"
          desc="Categoria padrão para transferências no financeiro. (Padrão: Transferências)"
        >
          {one("Transferências")}
        </PrefRow>
      </Section>
    </div>
  );
}
