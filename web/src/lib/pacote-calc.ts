// Helpers de cálculo para pacotes (spec §9).

export type DescontoTipo = "R$" | "%";

export type ItemPacoteDraft = {
  nome: string;
  qtd: number;
  valor: number;
  descontoUn: number;
  descontoTipo: DescontoTipo;
};

/** Total por item (spec §9.1). */
export function itemTotal(item: ItemPacoteDraft): number {
  const descontoEfetivo =
    item.descontoTipo === "%"
      ? item.valor * (item.descontoUn / 100)
      : item.descontoUn;
  const valorLiquido = Math.max(0, item.valor - descontoEfetivo);
  return item.qtd * valorLiquido;
}

/** Soma dos totais de todos os itens (spec §9.2). */
export function subtotal(itens: ItemPacoteDraft[]): number {
  return itens.reduce((acc, it) => acc + itemTotal(it), 0);
}

/** Valor total final com desconto global (spec §9.3). */
export function valorTotal(
  itens: ItemPacoteDraft[],
  descontoGlobal: number,
  descontoTipo: DescontoTipo
): number {
  const sub = subtotal(itens);
  const descEfetivo =
    descontoTipo === "%" ? sub * (descontoGlobal / 100) : descontoGlobal;
  return Math.max(0, sub - descEfetivo);
}
