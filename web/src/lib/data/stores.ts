"use client";
/**
 * Stores de coleção (memória de sessão) seedados do mock.
 * Componentes consomem via `useCollection(store)`; mutações refletem em todos
 * os assinantes. Troca p/ backend = reimplementar create-collection com fetch.
 */
import { createCollection } from "./create-collection";
import {
  profissionais,
  fornecedores,
  procedimentos,
  pacotes,
  itensEstoque,
  contasFinanceirasList,
  categoriasContas,
  metodosPagamento,
  fichasAtendimento,
  modelosDocumento,
} from "@/lib/mock";

export const profissionaisStore = createCollection(profissionais);
export const fornecedoresStore = createCollection(fornecedores);
export const procedimentosStore = createCollection(procedimentos);
export const pacotesStore = createCollection(pacotes);
export const estoqueStore = createCollection(itensEstoque);
export const contasFinanceirasStore = createCollection(contasFinanceirasList);
export const categoriasContasStore = createCollection(categoriasContas);
export const metodosPagamentoStore = createCollection(metodosPagamento);
export const fichasAtendimentoStore = createCollection(fichasAtendimento);
export const modelosDocumentoStore = createCollection(modelosDocumento);
