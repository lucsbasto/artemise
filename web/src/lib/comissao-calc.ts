// Cálculo de comissão — porta de backend/internal/domain/comissao.go +
// a consolidação de backend/internal/store/financeiro.go (Comissoes).
// Funções puras, testáveis sem React (golden em comissao.go _test.go).
import type { Comissao } from "@/lib/mock";
import { num } from "@/lib/financeiro-calc";

/** Regra de comissão de um profissional (procedimentoId nil = regra padrão). */
export type RegraComissao = {
  procedimentoId?: string | null;
  tipo: "percentual" | "fixo";
  valor: number | string;
};

/** Registro realizado usado no cálculo (subset de registros_procedimento). */
export type RegistroComissao = {
  profissionalId?: string | null;
  procedimentoId?: string | null;
  valor: number | string;
  profissional: string;
};

/**
 * Valor de comissão de um lançamento. Prioridade: regra específica do
 * procedimento > regra padrão (procedimentoId nil). Sem regra aplicável → 0.
 * Porta direta de domain.CalcComissao (design §6.3).
 */
export function calcComissao(base: number, regras: RegraComissao[], procedimentoId: string): number {
  let padrao: RegraComissao | undefined;
  for (const r of regras) {
    if (r.procedimentoId != null && r.procedimentoId === procedimentoId) {
      return aplicar(base, r);
    }
    if (r.procedimentoId == null) padrao = r;
  }
  return padrao ? aplicar(base, padrao) : 0;
}

function aplicar(base: number, r: RegraComissao): number {
  const valor = num(r.valor);
  return r.tipo === "percentual" ? (base * valor) / 100 : valor;
}

/** Comissão consolidada por profissional (porta de store.Comissoes). */
export type ComissaoConsolidada = {
  profissionalId: string;
  profissional: string;
  base: number;
  comissao: number;
  quantidade: number;
};

/**
 * Consolida a comissão por profissional sobre os registros realizados.
 * Preserva a ordem de primeira aparição do profissional (como o Go).
 */
export function consolidarComissoes(
  registros: RegistroComissao[],
  regrasPorProf: Record<string, RegraComissao[]>,
): ComissaoConsolidada[] {
  const porProf: Record<string, ComissaoConsolidada> = {};
  const ordem: string[] = [];
  for (const reg of registros) {
    const pid = reg.profissionalId ?? "";
    let acc = porProf[pid];
    if (!acc) {
      acc = { profissionalId: pid, profissional: reg.profissional, base: 0, comissao: 0, quantidade: 0 };
      porProf[pid] = acc;
      ordem.push(pid);
    }
    const base = num(reg.valor);
    acc.base += base;
    acc.comissao += calcComissao(base, regrasPorProf[pid] ?? [], reg.procedimentoId ?? "");
    acc.quantidade += 1;
  }
  return ordem.map((pid) => porProf[pid]);
}

/**
 * Consolidação → linhas da tela "Comissões em aberto". A ComissoesView atual só
 * usa `length`/`periodo`, mas mantemos o shape completo para quando renderizar.
 */
export function toComissoes(consolidadas: ComissaoConsolidada[]): Comissao[] {
  return consolidadas.map((c) => ({
    profissional: c.profissional,
    referencia: `${c.quantidade} ${c.quantidade === 1 ? "procedimento" : "procedimentos"}`,
    data: "",
    base: c.base,
    percentual: c.base > 0 ? Math.round((c.comissao / c.base) * 100) : 0,
    valor: c.comissao,
    status: "Em aberto",
  }));
}
