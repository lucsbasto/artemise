import { redirect } from "next/navigation";
import { ExtratoView } from "@/components/financeiro/extrato-view";
import { createClient } from "@/lib/supabase/server";
import {
  extratoKPIs,
  extratoFinanceKpis,
  toExtratoRow,
  periodoLabel,
  startOfMonth,
  endOfMonth,
  toISODate,
  type LancamentoSource,
  type Lookup,
} from "@/lib/financeiro-calc";
import type { ExtratoData } from "@/lib/mock";

const LANCAMENTO_COLS =
  "tipo, situacao, valor, vencimento, liquidacao, descricao, categoriaId:categoria_id, metodoId:metodo_id, pacienteId:paciente_id, fornecedorId:fornecedor_id";

function lookup(rows: { id: string; valor: string }[] | null): Lookup {
  const out: Lookup = {};
  for (const r of rows ?? []) out[r.id] = r.valor;
  return out;
}

export default async function ExtratoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const now = new Date();
  const inicio = startOfMonth(now);
  const fim = endOfMonth(now);

  const [lancRes, catRes, metRes] = await Promise.all([
    supabase
      .from("lancamentos_financeiros")
      .select(LANCAMENTO_COLS)
      .gte("vencimento", toISODate(inicio))
      .lte("vencimento", toISODate(fim))
      .order("vencimento", { ascending: true })
      .order("criado_em", { ascending: true }),
    supabase.from("categorias_contas").select("id, valor:descricao"),
    supabase.from("metodos_pagamento").select("id, valor:tipo"),
  ]);

  const lancs = (lancRes.data ?? []) as LancamentoSource[];
  const categorias = lookup(catRes.data);
  const metodos = lookup(metRes.data);

  const rows = lancs.map((l) => toExtratoRow(l, categorias, metodos));
  const data: ExtratoData = {
    periodo: periodoLabel(inicio, fim),
    total: rows.length,
    kpis: extratoFinanceKpis(extratoKPIs(lancs)),
    rows,
  };
  return <ExtratoView data={data} />;
}
