"use client";
/**
 * Stores de coleção ligados à API Go.
 *
 * Cada store mapeia um recurso REST (`createCollection("/path")`). Componentes
 * consomem via `useCollection(store)` sem saber se a fonte é rede ou memória —
 * a interface `Collection<T>` é idêntica à do antigo store em memória.
 *
 * Recursos faseados (detalhe rico do profissional, registros por paciente,
 * eventos da agenda) permanecem em memória de sessão via
 * `createLocalCollection` até que seu contrato específico seja ligado (design §8.6).
 */
import { createCollection, createLocalCollection } from "./create-collection";
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

export const profissionaisStore = createCollection<Contact>("/profissionais");
// Cadastro rico do profissional (espelha o id da linha de contato).
// Detalhe vem de GET /profissionais/{id}; mantido local até o wiring por id.
export const profissionaisDetalheStore = createLocalCollection<Profissional>();
export const fornecedoresStore = createCollection<Contact>("/fornecedores");
export const pacientesStore = createCollection<Patient>("/pacientes");
export const procedimentosStore = createCollection<Procedimento>("/procedimentos");
export const pacotesStore = createCollection<Pacote>("/pacotes");
export const estoqueStore = createCollection<ItemEstoque>("/itens-estoque");
export const contasFinanceirasStore =
  createCollection<ContaFinanceira>("/contas-financeiras");
export const categoriasContasStore =
  createCollection<CategoriaConta>("/categorias-contas");
export const metodosPagamentoStore =
  createCollection<MetodoPagamento>("/metodos-pagamento");
export const fichasAtendimentoStore =
  createCollection<FichaAtendimento>("/fichas-atendimento");
export const modelosDocumentoStore =
  createCollection<ModeloDocumento>("/modelos-documento");
// Procedimentos lançados na ficha de cada paciente (sub-recurso por paciente).
export const registrosProcedimentoStore =
  createLocalCollection<RegistroProcedimento>();

/* ---------- Eventos da agenda (calendário) ---------- */
// Shape (WeekEvent) difere do contrato /eventos-agenda; transformação faseada.
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
export const orcamentosStore = createCollection<Orcamento>("/orcamentos");
