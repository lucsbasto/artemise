/**
 * Cliente HTTP tipado para a API Go (client components / browser).
 *
 * Camada de troca do mock para backend real: substitui os arrays in-memory
 * por chamadas REST. O cookie de sessão (`session_token`, httpOnly) é enviado
 * automaticamente via `credentials: "include"`.
 *
 * Base URL vem de `NEXT_PUBLIC_API_URL` (default `http://localhost:8080`).
 * Todas as rotas vivem sob `/api` — passe apenas o path do recurso
 * (ex.: `apiFetch("/pacientes")` → `http://localhost:8080/api/pacientes`).
 */

/** 401 — sessão ausente ou expirada. Tratado redirecionando para /login. */
export class AuthError extends Error {
  constructor(message = "Não autenticado") {
    super(message);
    this.name = "AuthError";
  }
}

/** Demais erros 4xx/5xx. Carrega o status e o corpo (já parseado) da resposta. */
export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;
  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

/** Corpo de erro padrão da API (design §5.1). Todos os campos são opcionais. */
type ApiErrorBody = { error?: string; code?: string; field?: string };

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

/**
 * Faz uma request à API e desserializa a resposta JSON.
 * Lança {@link AuthError} em 401 e {@link ApiError} nos demais erros HTTP.
 * Em `204 No Content` resolve para `undefined` (cast para `T`).
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}/api${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!res.ok) {
    const body: ApiErrorBody = await res.json().catch(() => ({}));
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
