import { redirect } from "next/navigation";
import { ComissoesView } from "@/components/financeiro/comissoes-view";
import { createClient } from "@/lib/supabase/server";
import {
  consolidarComissoes,
  toComissoes,
  type RegistroComissao,
  type RegraComissao,
} from "@/lib/comissao-calc";
import {
  periodoLabel,
  startOfMonth,
  endOfMonth,
  toISODate,
} from "@/lib/financeiro-calc";

export default async function ComissoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const now = new Date();
  const inicio = startOfMonth(now);
  const fim = endOfMonth(now);

  const [regRes, regrasRes] = await Promise.all([
    supabase
      .from("registros_procedimento")
      .select("profissionalId:profissional_id, procedimentoId:procedimento_id, valor, profissional")
      .eq("status", "realizado")
      .gte("data", toISODate(inicio))
      .lte("data", toISODate(fim))
      .not("profissional_id", "is", null),
    supabase
      .from("profissional_comissoes")
      .select("profissionalId:profissional_id, procedimentoId:procedimento_id, tipo, valor"),
  ]);

  const registros = (regRes.data ?? []) as RegistroComissao[];
  const regrasPorProf: Record<string, RegraComissao[]> = {};
  for (const r of (regrasRes.data ?? []) as ({ profissionalId: string } & RegraComissao)[]) {
    (regrasPorProf[r.profissionalId] ??= []).push({
      procedimentoId: r.procedimentoId,
      tipo: r.tipo,
      valor: r.valor,
    });
  }

  const comissoes = toComissoes(consolidarComissoes(registros, regrasPorProf));
  return <ComissoesView comissoes={comissoes} periodo={periodoLabel(inicio, fim)} />;
}
