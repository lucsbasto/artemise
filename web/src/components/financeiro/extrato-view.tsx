"use client";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings,
  MoreVertical,
  Smartphone,
  Banknote,
  CreditCard,
  FileText,
  ArrowLeftRight,
} from "lucide-react";
import { cn, brl } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { FinanceKpiCards } from "@/components/financeiro/finance-kpi-cards";
import type { ExtratoData, MetodoPgto } from "@/lib/mock";

const METODO_ICON: Record<MetodoPgto, React.ElementType> = {
  pix: Smartphone,
  dinheiro: Banknote,
  cartao: CreditCard,
  boleto: FileText,
  transferencia: ArrowLeftRight,
};

const METODO_LABEL: Record<MetodoPgto, string> = {
  pix: "PIX",
  dinheiro: "Dinheiro",
  cartao: "Cartão",
  boleto: "Boleto",
  transferencia: "Transferência",
};

function PagBtn({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      disabled={disabled}
      className="grid size-9 place-items-center rounded-lg bg-background text-muted-2 disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function ExtratoView({ data }: { data: ExtratoData }) {
  return (
    <div className="mx-auto max-w-[1200px] p-5">
      <Breadcrumb items={["Financeiro", "Extrato de movimentação"]} />

      <div className="mt-4 rounded-[var(--radius-card)] bg-surface border border-border shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2 px-5 pt-5">
          <h2 className="text-base font-semibold text-foreground">Extrato de movimentação</h2>
          <span className="text-sm text-muted-2">{data.total} registros</span>
          <button className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-foreground hover:bg-background">
            Exportar <ChevronDown className="size-4" />
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2 px-5 py-4">
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-sm text-foreground">
            <span className="text-muted">Período de liquidação:</span>&nbsp;{data.periodo}
          </span>
          <button className="text-sm font-medium text-brand hover:underline">+ Adicionar filtro</button>
          <div className="relative ml-auto">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
            <input
              placeholder="Buscar"
              className="h-9 w-64 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none placeholder:text-muted-2 focus:border-brand"
            />
          </div>
        </div>

        {/* KPIs */}
        <FinanceKpiCards kpis={data.kpis} />

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-2">
                <th className="py-3 pl-5 pr-4 font-medium whitespace-nowrap">Vencimento ◆</th>
                <th className="py-3 pr-4 font-medium whitespace-nowrap">Execução ◆</th>
                <th className="py-3 pr-4 font-medium">Descrição ◆</th>
                <th className="py-3 pr-4 font-medium">Categoria ◆</th>
                <th className="py-3 pr-4 font-medium text-center">Método ◆</th>
                <th className="py-3 pr-4 font-medium text-center">Situação ◆</th>
                <th className="py-3 pr-4 font-medium text-right whitespace-nowrap">Valor líquido (R$) ◆</th>
                <th className="w-10 px-2 py-3 text-right">
                  <Settings className="ml-auto size-4" />
                </th>
                <th className="w-10 px-2 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, i) => {
                const Icon = METODO_ICON[row.metodo];
                return (
                  <tr key={i} className={cn("border-b border-border last:border-b-0", row.atrasado && "bg-red-50/30")}>
                    <td
                      className={cn(
                        "py-3 pl-5 pr-4 text-foreground whitespace-nowrap",
                        row.atrasado ? "border-l-2 border-l-red-500" : "border-l-2 border-l-transparent"
                      )}
                    >
                      {row.vencimento}
                    </td>
                    <td className="py-3 pr-4 text-foreground whitespace-nowrap">{row.execucao ?? "—"}</td>
                    <td className="py-3 pr-4 text-foreground max-w-[220px] truncate">{row.descricao}</td>
                    <td className="py-3 pr-4 text-muted max-w-[110px] truncate" title={row.categoria}>
                      {row.categoria}
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <span title={METODO_LABEL[row.metodo]}>
                        <Icon className="mx-auto size-4 text-muted-2" />
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <StatusBadge status={row.situacao} />
                    </td>
                    <td
                      className={cn(
                        "py-3 pr-4 text-right font-medium tabular-nums whitespace-nowrap",
                        row.tipo === "receita" ? "text-success" : "text-danger"
                      )}
                    >
                      {brl(row.valor).replace(/R\$ ?/, "")}
                    </td>
                    <td className="px-2 py-3" />
                    <td className="px-2 py-3">
                      <button className="text-muted-2 hover:text-foreground">
                        <MoreVertical className="size-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Rodapé paginação */}
        <div className="flex items-center justify-between px-5 py-4">
          <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-muted">
            25 por página <ChevronDown className="size-4" />
          </button>
          <div className="flex items-center gap-1">
            <PagBtn disabled><ChevronsLeft className="size-4" /></PagBtn>
            <PagBtn disabled><ChevronLeft className="size-4" /></PagBtn>
            <button className="grid size-9 place-items-center rounded-lg bg-brand text-sm font-medium text-white">1</button>
            <PagBtn><ChevronRight className="size-4" /></PagBtn>
            <PagBtn><ChevronsRight className="size-4" /></PagBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
