"use client";
/**
 * Stores de coleção (memória de sessão) seedados do mock.
 * Componentes consomem via `useCollection(store)`; mutações refletem em todos
 * os assinantes. Troca p/ backend = reimplementar create-collection com fetch.
 */
import { createCollection } from "./create-collection";
import {
  profissionais,
  profissionaisDetalhe,
  fornecedores,
  patients,
  procedimentos,
  pacotes,
  itensEstoque,
  contasFinanceirasList,
  categoriasContas,
  metodosPagamento,
  fichasAtendimento,
  modelosDocumento,
  registrosProcedimento,
  weekEvents,
  type WeekEvent,
} from "@/lib/mock";

export const profissionaisStore = createCollection(profissionais);
// Cadastro rico do profissional (espelha o id da linha de contato).
export const profissionaisDetalheStore = createCollection(profissionaisDetalhe);
export const fornecedoresStore = createCollection(fornecedores);
export const pacientesStore = createCollection(patients);
export const procedimentosStore = createCollection(procedimentos);
export const pacotesStore = createCollection(pacotes);
export const estoqueStore = createCollection(itensEstoque);
export const contasFinanceirasStore = createCollection(contasFinanceirasList);
export const categoriasContasStore = createCollection(categoriasContas);
export const metodosPagamentoStore = createCollection(metodosPagamento);
export const fichasAtendimentoStore = createCollection(fichasAtendimento);
export const modelosDocumentoStore = createCollection(modelosDocumento);
// Procedimentos lançados na ficha de cada paciente (filtrar por pacienteId).
export const registrosProcedimentoStore = createCollection(registrosProcedimento);

/* ---------- Eventos da agenda (calendário) ---------- */
export type WeekEventItem = WeekEvent & { id: string };
export const eventosStore = createCollection<WeekEventItem>(
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
export const orcamentosStore = createCollection<Orcamento>([]);
