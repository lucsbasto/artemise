// Funções puras de cálculo financeiro (testáveis em isolado, sem React).
// Padrão de lib/pacote-calc.ts.
import type { CashflowPoint, FluxoRow, ContaFinanceira, CategoriaReportNode } from "@/lib/mock";

/**
 * Encadeia o saldo de uma série de fluxo de caixa.
 * - lucro = entrada - saída (saída chega negativa em CashflowPoint)
 * - saldoFinal = saldoInicial + lucro
 * - saldoInicial[n+1] = saldoFinal[n]
 */
export function fluxoRows(points: CashflowPoint[], saldoInicial = 0): FluxoRow[] {
  let inicial = saldoInicial;
  return points.map((p) => {
    const entrada = p.entradas;
    const saida = Math.abs(p.saidas);
    const lucro = entrada - saida;
    const saldoFinal = inicial + lucro;
    const row: FluxoRow = {
      label: p.label,
      saldoInicial: inicial,
      entrada,
      saida,
      lucro,
      saldoFinal,
    };
    inicial = saldoFinal;
    return row;
  });
}

/** Percentual de uma parte sobre o total. Retorna 0 quando total = 0 (sem NaN). */
export function percentual(valor: number, total: number): number {
  if (!total) return 0;
  return Math.round((Math.abs(valor) / Math.abs(total)) * 100);
}

/** Soma dos saldos das contas. */
export function somaSaldos(contas: ContaFinanceira[]): number {
  return contas.reduce((acc, c) => acc + c.saldo, 0);
}

/** Total de um nó: soma dos filhos quando houver, senão o valor próprio. */
export function totalNode(node: CategoriaReportNode): number {
  if (node.filhos && node.filhos.length) {
    return node.filhos.reduce((acc, f) => acc + f.valor, 0);
  }
  return node.valor;
}

/** Total de um grupo de nós (ex.: todas as receitas). */
export function totalGrupo(nodes: CategoriaReportNode[]): number {
  return nodes.reduce((acc, n) => acc + totalNode(n), 0);
}
