import "server-only";
import { redirect } from "next/navigation";
import { AuthError } from "@/lib/api-client";
import { apiFetchServer } from "@/lib/api-client-server";

/**
 * Carrega dados na camada de Server Component, redirecionando para `/login`
 * quando a sessão é inválida (design §8.4). Demais erros propagam para o
 * error boundary da rota.
 */
export async function loadServer<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  try {
    return await apiFetchServer<T>(path, init);
  } catch (err) {
    if (err instanceof AuthError) redirect("/login");
    throw err;
  }
}
