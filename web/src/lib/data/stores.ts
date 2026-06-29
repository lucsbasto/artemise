"use client";
/**
 * Stores de coleção ligados direto ao Supabase.
 *
 * Cada store mapeia uma tabela snake_case (`createCollection(table, MAP)`) com
 * o `FieldMap` que traduz camelCase ↔ coluna (design §5.1). Componentes
 * consomem via `useCollection(store)` sem saber se a fonte é rede ou memória —
 * a interface `Collection<T>` é idêntica.
 *
 * Recursos faseados (detalhe rico do profissional, registros por paciente,
 * eventos da agenda) permanecem em memória de sessão via
 * `createLocalCollection` até a lane M5 ligá-los aos seus contratos próprios.
 */
import { createCollection, createLocalCollection } from "./create-collection";
import { createProfissionalDetalheCollection } from "./profissional-detalhe";
import { subtotal } from "@/lib/pacote-calc";
import type { FieldMap } from "@/lib/supabase/resource";
import {
  weekEvents,
  type WeekEvent,
  type Contact,
  type Patient,
  type Procedimento,
  type Pacote,
  type ItemEstoque,
  type ContaFinanceira,
  type CategoriaConta,
  type MetodoPagamento,
  type FichaAtendimento,
  type ModeloDocumento,
  type RegistroProcedimento,
} from "@/lib/mock";

/* ---------- FieldMaps (tsKey -> coluna snake_case) ---------- */
// Colunas confirmadas em backend/migrations/001_schema.sql. `clinica_id` nunca
// é enviado (DEFAULT auth_clinica_id() + RLS WITH CHECK no banco).

const PACIENTE_MAP: FieldMap = {
  id: "id",
  nome: "nome",
  tipo: "tipo",
  etiquetas: "etiquetas",
  identificador: "identificador",
  ativo: "ativo",
  sexo: "sexo",
  dataNascimento: "data_nascimento",
  cpf: "cpf",
  email: "email",
  endereco: "endereco",
  observacoes: "observacoes",
  recebeNotificacoes: "recebe_notificacoes",
  criadoEm: "criado_em",
};

// profissionais e fornecedores compartilham o shape Contact.
const CONTACT_MAP: FieldMap = {
  id: "id",
  nome: "nome",
  tipo: "tipo",
  etiquetas: "etiquetas",
  identificador: "identificador",
  ativo: "ativo",
  avatarTone: "avatar_tone",
};

const PROCEDIMENTO_MAP: FieldMap = {
  id: "id",
  nome: "nome",
  categoria: "categoria",
  duracaoMin: "duracao_min",
  valor: "valor",
  ativo: "ativo",
  usaMapa: "usa_mapa",
};

const PACOTE_MAP: FieldMap = {
  id: "id",
  descricao: "descricao",
  valorTotal: "valor_total",
  validade: "validade",
  ativo: "ativo",
};

const ITEM_ESTOQUE_MAP: FieldMap = {
  id: "id",
  nome: "nome",
  sku: "sku",
  categoria: "categoria",
  unidade: "unidade",
  saldo: "saldo",
  minimo: "minimo",
  custo: "custo",
};

const CONTA_FINANCEIRA_MAP: FieldMap = {
  id: "id",
  nome: "nome",
  tipo: "tipo",
  saldo: "saldo",
  icon: "icon",
};

// Linhas planas com `parent_id`; a árvore (`filhos`) é montada no client pelo
// `transform` da store (ver `categoriasContasStore`). O map serve só p/ writes.
const CATEGORIA_CONTA_MAP: FieldMap = {
  id: "id",
  descricao: "descricao",
  ativo: "ativo",
};

// Procedimentos lançados na ficha de um paciente (sub-recurso por paciente).
// `mapa` (jsonb) e a baixa de estoque atômica ficam na lane M6 (RPC).
const REGISTRO_PROC_MAP: FieldMap = {
  id: "id",
  pacienteId: "paciente_id",
  procedimento: "procedimento",
  profissional: "profissional",
  data: "data",
  status: "status",
  valor: "valor",
  observacoes: "observacoes",
  usaMapa: "usa_mapa",
  mapa: "mapa",
};

const METODO_PAGAMENTO_MAP: FieldMap = {
  id: "id",
  descricao: "descricao",
  tipo: "tipo",
  marca: "marca",
  ativo: "ativo",
};

const FICHA_ATENDIMENTO_MAP: FieldMap = {
  id: "id",
  nome: "nome",
  ativo: "ativo",
};

const MODELO_DOCUMENTO_MAP: FieldMap = {
  id: "id",
  nome: "nome",
  tipo: "tipo",
  ativo: "ativo",
};

/* ---------- Stores REST (Supabase direto) ---------- */

export const profissionaisStore = createCollection<Contact>("profissionais", CONTACT_MAP);
// Cadastro rico do profissional (detalhe + horários + comissões + procedimentos):
// lê via embed PostgREST e escreve via RPC `salvar_detalhe_profissional`. A linha
// base mora na mesma tabela `profissionais`, então mutações refrescam ambas as
// coleções (passamos `profissionaisStore` p/ revalidar a lista de contatos).
export const profissionaisDetalheStore =
  createProfissionalDetalheCollection(profissionaisStore);
export const fornecedoresStore = createCollection<Contact>("fornecedores", CONTACT_MAP);
export const pacientesStore = createCollection<Patient>("pacientes", PACIENTE_MAP);
export const procedimentosStore = createCollection<Procedimento>("procedimentos", PROCEDIMENTO_MAP);
export const pacotesStore = createCollection<Pacote>("pacotes", PACOTE_MAP);
export const estoqueStore = createCollection<ItemEstoque>("itens_estoque", ITEM_ESTOQUE_MAP);
export const contasFinanceirasStore =
  createCollection<ContaFinanceira>("contas_financeiras", CONTA_FINANCEIRA_MAP);
// Monta a hierarquia que a UI espera: raízes (`parent_id` nulo) com seus
// `filhos`. As linhas chegam planas; o nesting é client-side (design §6).
function montarArvoreCategorias(rows: Record<string, unknown>[]): CategoriaConta[] {
  const node = (r: Record<string, unknown>) => ({
    id: r.id as string,
    descricao: r.descricao as string,
    ativo: !!r.ativo,
  });
  return rows
    .filter((r) => !r.parent_id)
    .map((r) => ({
      ...node(r),
      filhos: rows.filter((c) => c.parent_id === r.id).map(node),
    }));
}
export const categoriasContasStore = createCollection<CategoriaConta>(
  "categorias_contas",
  CATEGORIA_CONTA_MAP,
  { select: "id, descricao, ativo, parent_id, criado_em", transform: montarArvoreCategorias }
);
export const metodosPagamentoStore =
  createCollection<MetodoPagamento>("metodos_pagamento", METODO_PAGAMENTO_MAP);
export const fichasAtendimentoStore =
  createCollection<FichaAtendimento>("fichas_atendimento", FICHA_ATENDIMENTO_MAP);
export const modelosDocumentoStore =
  createCollection<ModeloDocumento>("modelos_documento", MODELO_DOCUMENTO_MAP);
// Procedimentos lançados na ficha de cada paciente. CRUD direto na tabela
// (RLS isola tenant; o componente filtra por `pacienteId`). Registros com
// `mapa` (estoque) gravam o jsonb aqui sem baixa — a baixa atômica via RPC
// `registrar_procedimento` é a lane M6.
export const registrosProcedimentoStore =
  createCollection<RegistroProcedimento>("registros_procedimento", REGISTRO_PROC_MAP);

/* ---------- Eventos da agenda (calendário) ---------- */
// Shape (WeekEvent) difere de eventos_agenda; transformação faseada (M5).
export type WeekEventItem = WeekEvent & { id: string };
export const eventosStore = createLocalCollection<WeekEventItem>(
  weekEvents.map((e, i) => ({ ...e, id: `ev-${i + 1}` }))
);

/* ---------- Orçamentos (por paciente, ficha) ---------- */
export type Orcamento = {
  id: string;
  cliente: string;
  vendedor: string;
  itens: number;
  total: number;
  data: string;
};
// `itens` é a contagem de `orcamento_itens` (embed) e `total` é recalculado dos
// itens reusando `subtotal` de pacote-calc; sem itens, cai p/ a coluna `total`.
const ORCAMENTO_MAP: FieldMap = {
  id: "id",
  cliente: "cliente",
  vendedor: "vendedor",
  total: "total",
  data: "data",
};
function montarOrcamentos(rows: Record<string, unknown>[]): Orcamento[] {
  return rows.map((row) => {
    const itens = (row.orcamento_itens ?? []) as Record<string, unknown>[];
    const total = itens.length
      ? subtotal(
          itens.map((it) => ({
            nome: "",
            qtd: Number(it.qtd) || 0,
            valor: Number(it.valor) || 0,
            descontoUn: Number(it.desconto) || 0,
            descontoTipo: "R$" as const,
          }))
        )
      : Number(row.total ?? 0);
    return {
      id: row.id as string,
      cliente: (row.cliente ?? "") as string,
      vendedor: (row.vendedor ?? "") as string,
      itens: itens.length,
      total,
      data: (row.data ?? "") as string,
    };
  });
}
export const orcamentosStore = createCollection<Orcamento>("orcamentos", ORCAMENTO_MAP, {
  select: "*, orcamento_itens(*)",
  transform: montarOrcamentos,
});
