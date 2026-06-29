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
import type { FieldMap } from "@/lib/supabase/resource";
import {
  weekEvents,
  type WeekEvent,
  type Contact,
  type Profissional,
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

// `filhos` (árvore) é computado da coluna parent_id — montagem fica na lane M7.
const CATEGORIA_CONTA_MAP: FieldMap = {
  id: "id",
  descricao: "descricao",
  ativo: "ativo",
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
// Cadastro rico do profissional (detalhe + horários + comissões + procedimentos).
// Permanece local até a lane M5 ligar a RPC `salvar_detalhe_profissional`.
export const profissionaisDetalheStore = createLocalCollection<Profissional>();
export const fornecedoresStore = createCollection<Contact>("fornecedores", CONTACT_MAP);
export const pacientesStore = createCollection<Patient>("pacientes", PACIENTE_MAP);
export const procedimentosStore = createCollection<Procedimento>("procedimentos", PROCEDIMENTO_MAP);
export const pacotesStore = createCollection<Pacote>("pacotes", PACOTE_MAP);
export const estoqueStore = createCollection<ItemEstoque>("itens_estoque", ITEM_ESTOQUE_MAP);
export const contasFinanceirasStore =
  createCollection<ContaFinanceira>("contas_financeiras", CONTA_FINANCEIRA_MAP);
export const categoriasContasStore =
  createCollection<CategoriaConta>("categorias_contas", CATEGORIA_CONTA_MAP);
export const metodosPagamentoStore =
  createCollection<MetodoPagamento>("metodos_pagamento", METODO_PAGAMENTO_MAP);
export const fichasAtendimentoStore =
  createCollection<FichaAtendimento>("fichas_atendimento", FICHA_ATENDIMENTO_MAP);
export const modelosDocumentoStore =
  createCollection<ModeloDocumento>("modelos_documento", MODELO_DOCUMENTO_MAP);
// Procedimentos lançados na ficha de cada paciente (sub-recurso por paciente).
// Permanece local até a lane M5/M6 (baixa de estoque via RPC).
export const registrosProcedimentoStore =
  createLocalCollection<RegistroProcedimento>();

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
// `itens` é a contagem de orcamento_itens (computada) — sem coluna própria; a
// listagem com itens embed fica para a lane M5.
const ORCAMENTO_MAP: FieldMap = {
  id: "id",
  cliente: "cliente",
  vendedor: "vendedor",
  total: "total",
  data: "data",
};
export const orcamentosStore = createCollection<Orcamento>("orcamentos", ORCAMENTO_MAP);
