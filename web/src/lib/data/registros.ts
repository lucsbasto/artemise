"use client";
/**
 * Registro de procedimento COM mapa de injetáveis (baixa/estorno de estoque).
 *
 * A baixa atômica não pode rodar no browser (race → saldo corrompido), então
 * passa por RPCs Postgres que fazem `SELECT ... FOR UPDATE`, calculam o delta
 * (novo − anterior) e validam o saldo numa transação (design §8):
 *  - `registrar_procedimento`  → cria/edita o registro e aplica a baixa.
 *  - `excluir_registro_procedimento` → estorna as unidades e apaga o registro.
 *
 * Registros SEM mapa continuam pelo `registrosProcedimentoStore` (CRUD direto).
 * Após cada RPC revalidamos `registrosProcedimentoStore` (lista) e `estoqueStore`
 * (saldo) para a UI refletir o estado novo.
 */
import { createClient } from "@/lib/supabase/client";
import { estoqueStore, registrosProcedimentoStore } from "./stores";
import type { FichaInjetaveis, RegistroProcedimento } from "@/lib/mock";

export type RegistroData = Omit<RegistroProcedimento, "id" | "pacienteId">;

/** Saldo insuficiente em estoque (equivale ao 409 antigo). Nenhuma baixa parcial. */
export class SaldoInsuficienteError extends Error {
  constructor() {
    super("Saldo insuficiente em estoque");
    this.name = "SaldoInsuficienteError";
  }
}

/**
 * Normaliza a data para `YYYY-MM-DD` (coluna DATE). Aceita `DD/MM/AAAA` (digitado
 * na UI) e ISO já vindo do banco; vazio vira `null` (evita cast quebrado).
 */
function toISODate(data: string): string | null {
  const s = data.trim();
  if (!s) return null;
  const br = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s);
  return br ? `${br[3]}-${br[2]}-${br[1]}` : s;
}

/** Payload `p_registro` (jsonb camelCase) esperado pela RPC. */
function registroJson(data: RegistroData) {
  return {
    procedimento: data.procedimento,
    profissional: data.profissional,
    data: toISODate(data.data),
    status: data.status,
    valor: data.valor,
    observacoes: data.observacoes,
    usaMapa: data.usaMapa ?? false,
  };
}

async function revalidar(): Promise<void> {
  await Promise.all([
    registrosProcedimentoStore.revalidate(),
    estoqueStore.revalidate(),
  ]);
}

function lancarErro(message: string | undefined): never {
  if (message?.includes("SALDO_INSUFICIENTE")) throw new SaldoInsuficienteError();
  throw new Error(message ?? "Não foi possível salvar o procedimento.");
}

/**
 * Cria (registroId nulo) ou edita um registro com mapa, aplicando a baixa/estorno
 * de estoque na transação da RPC. `mapa` ausente envia pontos vazios (estorna o
 * anterior). Revalida lista e estoque ao concluir.
 */
export async function salvarRegistroComMapa(args: {
  pacienteId: string;
  registro: RegistroData;
  mapa: FichaInjetaveis;
  registroId?: string;
}): Promise<void> {
  const { error } = await createClient().rpc("registrar_procedimento", {
    p_paciente_id: args.pacienteId,
    p_registro: registroJson(args.registro),
    p_mapa: args.mapa,
    p_registro_id: args.registroId ?? null,
  });
  if (error) lancarErro(error.message);
  await revalidar();
}

/** Exclui um registro com mapa, estornando as unidades ao estoque. */
export async function excluirRegistroComMapa(registroId: string): Promise<void> {
  const { error } = await createClient().rpc("excluir_registro_procedimento", {
    p_registro_id: registroId,
  });
  if (error) lancarErro(error.message);
  await revalidar();
}
