import { redirect } from "next/navigation";
import { CompetenciaView } from "@/components/financeiro/competencia-view";
import { createClient } from "@/lib/supabase/server";
import {
  extratoKPIs,
  extratoFinanceKpis,
  toCompetenciaRow,
  mesNomeAno,
  startOfMonth,
  endOfMonth,
  toISODate,
  type LancamentoSource,
  type Lookup,
} from "@/lib/financeiro-calc";
import type { CompetenciaData } from "@/lib/mock";

const LANCAMENTO_COLS =
  "tipo, situacao, valor, vencimento, descricao, pacienteId:paciente_id, fornecedorId:fornecedor_id";

export default async function CompetenciaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const now = new Date();
  const inicio = startOfMonth(now);
  const fim = endOfMonth(now);

  const [lancRes, pacRes, fornRes] = await Promise.all([
    supabase
      .from("lancamentos_financeiros")
      .select(LANCAMENTO_COLS)
      .gte("vencimento", toISODate(inicio))
      .lte("vencimento", toISODate(fim))
      .order("vencimento", { ascending: true })
      .order("criado_em", { ascending: true }),
    supabase.from("pacientes").select("id, nome"),
    supabase.from("fornecedores").select("id, nome"),
  ]);

  const contatos: Lookup = {};
  for (const r of (pacRes.data ?? []) as { id: string; nome: string }[]) contatos[r.id] = r.nome;
  for (const r of (fornRes.data ?? []) as { id: string; nome: string }[]) contatos[r.id] = r.nome;

  const lancs = (lancRes.data ?? []) as LancamentoSource[];
  const rows = lancs.map((l) => toCompetenciaRow(l, contatos));
  const data: CompetenciaData = {
    mes: mesNomeAno(inicio),
    total: rows.length,
    kpis: extratoFinanceKpis(extratoKPIs(lancs)),
    rows,
  };
  return <CompetenciaView data={data} />;
}
