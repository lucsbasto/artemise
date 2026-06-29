"use client";
/**
 * Coleção do cadastro rico do profissional (detalhe + horários + comissões +
 * procedimentos) ligada ao Supabase (design §6, lane M5).
 *
 * Leitura: embed PostgREST sobre `profissionais`
 *   `*, profissional_detalhe(*), profissional_horarios(*), profissional_comissoes(*), profissional_procedimentos(procedimento_id)`
 * achatado no shape `Profissional` (camelCase).
 *
 * Escrita composta: a linha base vai para `profissionais` (mesma tabela do
 * `profissionaisStore` de contatos) e o detalhe/horários/comissões/procedimentos
 * numa única transação via RPC `salvar_detalhe_profissional`. Cada mutação
 * revalida esta coleção e a coleção base de contatos (`base.revalidate()`) para
 * mantê-las em sincronia.
 *
 * Mantém a interface `Collection<Profissional>` — os componentes de UI não mudam.
 */
import { createClient } from "@/lib/supabase/client";
import type { Collection } from "./create-collection";
import type { Conselho, Profissional, VinculoTrabalho } from "@/lib/mock";

const SELECT =
  "*, profissional_detalhe(*), profissional_horarios(*), profissional_comissoes(*), profissional_procedimentos(procedimento_id)";

type Row = Record<string, unknown>;

/** Achata a linha embed do PostgREST no shape plano `Profissional` (camelCase). */
function fromRow(row: Row): Profissional {
  const d = (row.profissional_detalhe ?? {}) as Row;
  const horarios = (row.profissional_horarios ?? []) as Row[];
  const comissoes = (row.profissional_comissoes ?? []) as Row[];
  const procs = (row.profissional_procedimentos ?? []) as Row[];
  return {
    id: row.id as string,
    nome: (row.nome ?? "") as string,
    avatarTone: (row.avatar_tone ?? "brand") as "brand" | "green",
    cpf: (d.cpf ?? "") as string,
    dataNascimento: (d.data_nascimento ?? "") as string,
    telefone: (d.telefone ?? "") as string,
    email: (d.email ?? "") as string,
    ativo: !!row.ativo,
    conselho: (d.conselho ?? "Outro") as Conselho,
    registro: (d.registro ?? "") as string,
    ufRegistro: (d.uf_registro ?? "") as string,
    especialidade: (d.especialidade ?? "") as string,
    certificacoes: (d.certificacoes ?? []) as string[],
    vinculo: (d.vinculo ?? "Autônomo") as VinculoTrabalho,
    procedimentoIds: procs.map((p) => p.procedimento_id as string),
    horarios: horarios.map((h) => ({
      diaSemana: Number(h.dia_semana),
      inicio: h.inicio as string,
      fim: h.fim as string,
    })),
    comissoes: comissoes.map((c) => ({
      procedimentoId: (c.procedimento_id ?? null) as string | null,
      tipo: c.tipo as "percentual" | "fixo",
      valor: Number(c.valor),
    })),
    chavePix: (d.chave_pix ?? "") as string,
    perfilAcesso: (d.perfil_acesso ?? "profissional") as Profissional["perfilAcesso"],
  };
}

/** Payload `p_detalhe` (jsonb camelCase) esperado pela RPC. */
function detalheJson(p: Profissional) {
  return {
    cpf: p.cpf,
    dataNascimento: p.dataNascimento,
    telefone: p.telefone,
    email: p.email,
    conselho: p.conselho,
    registro: p.registro,
    ufRegistro: p.ufRegistro,
    especialidade: p.especialidade,
    certificacoes: p.certificacoes,
    vinculo: p.vinculo,
    chavePix: p.chavePix,
    perfilAcesso: p.perfilAcesso,
  };
}

/** Colunas da linha base em `profissionais` (projeção do contato). */
function baseRow(p: Profissional) {
  return {
    nome: p.nome,
    tipo: "Profissional",
    etiquetas: p.especialidade ? [p.especialidade] : [],
    identificador: p.telefone,
    ativo: p.ativo,
    avatar_tone: p.avatarTone,
  };
}

type Refreshable = { revalidate: () => Promise<void> };

/**
 * @param base coleção de contatos de profissionais (`profissionaisStore`); só
 *   precisamos de `revalidate()` para refrescar a lista após mutar o detalhe.
 */
export function createProfissionalDetalheCollection(
  base: Refreshable
): Collection<Profissional> & Refreshable {
  let cache: Profissional[] = [];
  const subs = new Set<() => void>();
  const emit = () => subs.forEach((f) => f());

  async function revalidate(): Promise<void> {
    const { data, error } = await createClient()
      .from("profissionais")
      .select(SELECT)
      .order("criado_em", { ascending: false });
    if (error) return; // mantém o cache atual
    cache = ((data ?? []) as Row[]).map(fromRow);
    emit();
  }

  // Refresca esta coleção e a lista base de contatos após cada mutação.
  const refreshAll = () => Promise.all([revalidate(), base.revalidate()]);

  async function saveDetalhe(id: string, p: Profissional): Promise<void> {
    const { error } = await createClient().rpc("salvar_detalhe_profissional", {
      p_profissional_id: id,
      p_detalhe: detalheJson(p),
      p_horarios: p.horarios,
      p_comissoes: p.comissoes,
      p_proc_ids: p.procedimentoIds,
    });
    if (error) throw error;
  }

  return {
    revalidate,
    getSnapshot: () => cache,
    subscribe: (cb) => {
      subs.add(cb);
      void revalidate();
      return () => subs.delete(cb);
    },
    add: async (item) => {
      const supabase = createClient();
      // 1) cria a linha base e captura o id gerado no banco (DEFAULT uuid).
      const { data, error } = await supabase
        .from("profissionais")
        .insert(baseRow(item))
        .select("id")
        .single();
      if (error) throw error;
      // 2) grava detalhe/horários/comissões/procedimentos na transação da RPC.
      await saveDetalhe((data as Row).id as string, item);
      await refreshAll();
    },
    update: async (id, patch) => {
      const cur = cache.find((x) => x.id === id);
      const merged = { ...(cur as Profissional), ...patch, id };
      const { error } = await createClient()
        .from("profissionais")
        .update(baseRow(merged))
        .eq("id", id);
      if (error) throw error;
      await saveDetalhe(id, merged);
      await refreshAll();
    },
    remove: async (id) => {
      // ON DELETE CASCADE limpa detalhe/horários/comissões/procedimentos.
      const { error } = await createClient().from("profissionais").delete().eq("id", id);
      if (error) throw error;
      await refreshAll();
    },
    toggle: async (id, key) => {
      const cur = cache.find((x) => x.id === id);
      if (!cur) return;
      // só campos do contato (ex.: `ativo`) vivem na linha base.
      const col = key === "ativo" ? "ativo" : (key as string);
      const { error } = await createClient()
        .from("profissionais")
        .update({ [col]: !cur[key] })
        .eq("id", id);
      if (error) throw error;
      await refreshAll();
    },
    set: (next) => {
      cache = next;
      emit();
    },
  };
}
