"use client";
import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn, brl } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Pie100 } from "@/components/charts/donut";
import { PeriodSelector } from "@/components/financeiro/period-selector";
import { percentual, totalNode, totalGrupo } from "@/lib/financeiro-calc";
import type { CategoriaReportNode } from "@/lib/mock";

function GrupoTabela({
  titulo,
  nodes,
  despesa,
}: {
  titulo: string;
  nodes: CategoriaReportNode[];
  despesa?: boolean;
}) {
  const [open, setOpen] = React.useState<Set<string>>(new Set(nodes.map((n) => n.nome)));
  const total = totalGrupo(nodes);
  const sign = despesa ? -1 : 1;
  const valorCls = despesa ? "text-danger" : "text-success";

  const toggle = (nome: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(nome)) next.delete(nome);
      else next.add(nome);
      return next;
    });

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-foreground">{titulo}</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-2">
            <th className="py-2 pr-4 font-medium">Categorias</th>
            <th className="py-2 pr-4 font-medium text-center w-28">Percentual</th>
            <th className="py-2 pr-2 font-medium text-right w-36">Valor</th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((node) => {
            const nodeTotal = totalNode(node);
            const isOpen = open.has(node.nome);
            return (
              <React.Fragment key={node.nome}>
                <tr className="border-b border-border">
                  <td className="py-2 pr-4">
                    <button onClick={() => toggle(node.nome)} className="inline-flex items-center gap-1.5 text-foreground">
                      {isOpen ? <ChevronDown className="size-4 text-muted-2" /> : <ChevronRight className="size-4 text-muted-2" />}
                      {node.nome}
                    </button>
                  </td>
                  <td className="py-2 pr-4 text-center text-muted">{percentual(nodeTotal, total)}%</td>
                  <td className={cn("py-2 pr-2 text-right tabular-nums", valorCls)}>{brl(sign * nodeTotal)}</td>
                </tr>
                {isOpen &&
                  node.filhos?.map((f) => (
                    <tr key={node.nome + f.nome} className="border-b border-border">
                      <td className="py-2 pl-8 pr-4 text-muted">{f.nome}</td>
                      <td className="py-2 pr-4 text-center text-muted">{percentual(f.valor, total)}%</td>
                      <td className={cn("py-2 pr-2 text-right tabular-nums", valorCls)}>{brl(sign * f.valor)}</td>
                    </tr>
                  ))}
              </React.Fragment>
            );
          })}
          <tr className="font-semibold">
            <td className="py-2 pr-4 text-foreground">Total</td>
            <td className="py-2 pr-4 text-center text-muted">100%</td>
            <td className={cn("py-2 pr-2 text-right tabular-nums", valorCls)}>{brl(sign * total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function RelatorioCategoriasView({
  receitas,
  despesas,
  periodoLabel,
}: {
  receitas: CategoriaReportNode[];
  despesas: CategoriaReportNode[];
  periodoLabel: string;
}) {
  const segReceitas = receitas.map((n) => ({ nome: n.nome, valor: totalNode(n), cor: n.cor }));
  const segDespesas = despesas.map((n) => ({ nome: n.nome, valor: totalNode(n), cor: n.cor }));

  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Financeiro", "Relatório de categorias"]} />

      <div className="mt-4 rounded-[var(--radius-card)] bg-surface border border-border shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2 px-5 pt-5">
          <h2 className="text-base font-semibold text-foreground">Relatório de categorias</h2>
          <button className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-foreground hover:bg-background">
            Exportar <ChevronDown className="size-4" />
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2 px-5 py-4">
          <PeriodSelector label={periodoLabel} />
        </div>

        {/* Donuts */}
        <div className="grid gap-6 px-5 py-4 sm:grid-cols-2">
          {[
            { titulo: "Receitas", seg: segReceitas },
            { titulo: "Despesas", seg: segDespesas },
          ].map((g) => (
            <div key={g.titulo} className="flex flex-col items-center gap-4">
              <span className="text-sm font-semibold text-foreground">{g.titulo}</span>
              <div className="flex items-center gap-6">
                <Pie100 segments={g.seg} size={150} />
                <ul className="space-y-2">
                  {g.seg.map((s) => (
                    <li key={s.nome} className="flex items-center gap-2 text-sm text-muted">
                      <span className="inline-block size-2.5 rounded-sm" style={{ background: s.cor }} />
                      {s.nome}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Tabelas */}
        <div className="grid gap-8 border-t border-border px-5 py-5 lg:grid-cols-2">
          <GrupoTabela titulo="Receitas" nodes={receitas} />
          <GrupoTabela titulo="Despesas" nodes={despesas} despesa />
        </div>
      </div>
    </div>
  );
}
