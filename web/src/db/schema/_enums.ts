// Enums de domínio (Postgres). Espelham as union types do mock (`src/lib/mock.ts`).
import { pgEnum } from "drizzle-orm/pg-core";

// Identidade / acesso
export const membershipRoleEnum = pgEnum("membership_role", [
  "owner",
  "admin",
  "recepcao",
  "profissional",
]);
export const perfilAcessoEnum = pgEnum("perfil_acesso", ["admin", "recepcao", "profissional"]);
export const pessoaTipoEnum = pgEnum("pessoa_tipo", ["fisica", "juridica"]);

// Profissional (cadastro completo — spec 10)
export const conselhoEnum = pgEnum("conselho", [
  "CRM",
  "CRO",
  "CREFITO",
  "COREN",
  "CRBM",
  "CRF",
  "Outro",
]);
export const vinculoEnum = pgEnum("vinculo_trabalho", ["CLT", "PJ", "Autônomo", "Sócio"]);
export const comissaoTipoEnum = pgEnum("comissao_tipo", ["percentual", "fixo"]);

// Procedimentos / ficha
export const categoriaProcEnum = pgEnum("categoria_proc", [
  "Facial",
  "Corporal",
  "Injetáveis",
  "Estética",
]);
export const statusRegistroProcEnum = pgEnum("status_registro_proc", [
  "realizado",
  "agendado",
  "cancelado",
]);

// Financeiro
export const financeStatusEnum = pgEnum("finance_status", [
  "Recebido",
  "Pago",
  "Em atraso",
  "Em aberto",
]);
export const financeTipoEnum = pgEnum("finance_tipo", ["receita", "despesa"]);
export const metodoPgtoEnum = pgEnum("metodo_pgto", [
  "pix",
  "dinheiro",
  "cartao",
  "boleto",
  "transferencia",
]);
export const contaIconEnum = pgEnum("conta_icon", ["bank", "cash", "wallet"]);

// Agenda
export const agendaStatusEnum = pgEnum("agenda_status", [
  "Agendado",
  "Confirmado",
  "Não compareceu",
  "Concluído",
  "Cancelado",
]);
export const agendaTipoEnum = pgEnum("agenda_tipo", [
  "Agendamento",
  "Bloqueio",
  "Lembrete",
  "Evento",
]);

// Estoque
export const estoqueMovTipoEnum = pgEnum("estoque_mov_tipo", ["entrada", "saida", "ajuste"]);
