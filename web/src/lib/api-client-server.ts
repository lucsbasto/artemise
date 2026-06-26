import "server-only";
import { cookies } from "next/headers";
import { ApiError, AuthError, API_BASE_URL } from "./api-client";

/**
 * Variante de {@link apiFetch} para Server Components (design §8.4).
 *
 * Em vez de `credentials: "include"` (indisponível server-side), lê o cookie
 * de sessão do request corrente via `next/headers` e o encaminha no header
 * `Cookie`. Usa `cache: "no-store"` — dados de clínica são sempre frescos.
 */
export async function apiFetchServer<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const cookieHeader = (await cookies()).toString();

  const res = await fetch(`${API_BASE_URL}/api${path}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...init?.headers,
    },
    ...init,
  });

  if (!res.ok) {
    const body: { error?: string } = await res.json().catch(() => ({}));
    if (res.status === 401) {
      throw new AuthError(body.error ?? "Não autenticado");
    }
    throw new ApiError(res.status, body.error ?? "Erro desconhecido", body);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}
