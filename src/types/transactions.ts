export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface Transaction {
  id: string;
  user_id: string;
  idempotency_key: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string | null;
  status: TransactionStatus;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  currency: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

// POST /transactions e GET /transactions/:id
export interface TransactionResponse {
  data: Transaction;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// GET /transactions (sem o wrapper `data`)
export interface TransactionListResponse {
  items: Transaction[];
  pagination: Pagination;
}

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'MISSING_IDEMPOTENCY_KEY'
  | 'INVALID_USER_ID'
  | 'INVALID_AMOUNT'
  | 'UNAUTHORIZED'
  | 'TRANSACTION_NOT_FOUND'
  | 'NOT_FOUND'
  | 'IDEMPOTENT_REQUEST_IN_PROGRESS'
  | 'IDEMPOTENCY_KEY_REUSED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INTERNAL_SERVER_ERROR';

export interface ApiErrorBody {
  error: ApiErrorCode;
  message: string;
  // só em VALIDATION_ERROR: erros por campo
  details?: Record<string, string[]>;
  // só em RATE_LIMIT_EXCEEDED: segundos
  retryAfter?: number;
}
