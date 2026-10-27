import type {
  ApiErrorBody,
  CreateTransactionInput,
  Transaction,
  TransactionListResponse,
  TransactionResponse,
} from '../types/transactions';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const USER_ID_STORAGE_KEY = 'userId';

export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

/**
 * UUID anônimo que identifica o usuário (header `x-user-id`).
 * É criado na primeira requisição (normalmente a primeira transação) e
 * reutilizado enquanto a aba existir.
 */
export function getUserId(): string {
  let userId = sessionStorage.getItem(USER_ID_STORAGE_KEY);
  if (!userId) {
    userId = crypto.randomUUID();
    sessionStorage.setItem(USER_ID_STORAGE_KEY, userId);
  }
  return userId;
}

export function hasUserId(): boolean {
  return sessionStorage.getItem(USER_ID_STORAGE_KEY) !== null;
}

function resetUserId(): void {
  sessionStorage.removeItem(USER_ID_STORAGE_KEY);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('x-api-key', API_KEY);
  headers.set('x-user-id', getUserId());
  if (init.body) headers.set('Content-Type', 'application/json');

  const res = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  const body = await res.json().catch(() => null);

  if (!res.ok) {
    if (body?.error === 'INVALID_USER_ID') resetUserId();
    throw new ApiError(
      res.status,
      body ?? {
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Resposta inválida do servidor.',
      },
    );
  }
  return body as T;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Cria uma transação com idempotência.
 * Passe a mesma `idempotencyKey` apenas para retries da MESMA operação.
 */
export async function createTransaction(
  input: CreateTransactionInput,
  idempotencyKey: string = crypto.randomUUID(),
  maxAttempts = 3,
): Promise<Transaction> {
  // mesmo corpo em todas as tentativas
  const body = JSON.stringify(input);

  for (let attempt = 1; ; attempt++) {
    try {
      const res = await request<TransactionResponse>('/transactions', {
        method: 'POST',
        headers: { 'Idempotency-Key': idempotencyKey },
        body,
      });
      return res.data;
    } catch (err) {
      const retriable =
        // erro de rede
        !(err instanceof ApiError) ||
        err.body.error === 'IDEMPOTENT_REQUEST_IN_PROGRESS';
      if (!retriable || attempt >= maxAttempts) throw err;
      await sleep(500 * 2 ** (attempt - 1));
    }
  }
}

export async function getTransaction(id: string): Promise<Transaction> {
  const res = await request<TransactionResponse>(
    `/transactions/${encodeURIComponent(id)}`,
  );
  return res.data;
}

export function buildListQuery(page: number, pageSize: number): string {
  return new URLSearchParams({
    page: String(Math.max(1, Math.trunc(page))),
    pageSize: String(Math.min(100, Math.max(1, Math.trunc(pageSize)))),
  }).toString();
}

export async function listTransactions(
  page = 1,
  pageSize = 20,
): Promise<TransactionListResponse> {
  return request<TransactionListResponse>(
    `/transactions?${buildListQuery(page, pageSize)}`,
  );
}
