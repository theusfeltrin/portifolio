import type { TFunction } from 'i18next';
import { API_BASE_URL, buildListQuery } from '../../api';
import type {
  CreateTransactionInput,
  TransactionType,
} from '../../types/transactions';

export type EndpointId = 'create' | 'list' | 'get';
export type HttpMethod = 'GET' | 'POST';

export interface Endpoint {
  id: EndpointId;
  method: HttpMethod;
  successStatus: number;
}

export const endpoints: Endpoint[] = [
  { id: 'create', method: 'POST', successStatus: 201 },
  { id: 'list', method: 'GET', successStatus: 200 },
  { id: 'get', method: 'GET', successStatus: 200 },
];

export const transactionTypes: TransactionType[] = [
  'DEPOSIT',
  'WITHDRAWAL',
  'TRANSFER',
];

export interface CreateForm {
  type: TransactionType;
  amount: string;
  currency: string;
  description: string;
  metadata: string;
}

export interface ListForm {
  page: string;
  pageSize: string;
}

export interface GetForm {
  id: string;
}

export interface PlaygroundForms {
  create: CreateForm;
  list: ListForm;
  get: GetForm;
}

export const initialForms: PlaygroundForms = {
  create: {
    type: 'DEPOSIT',
    amount: '250.50',
    currency: 'BRL',
    description: '',
    metadata: '',
  },
  list: { page: '1', pageSize: '10' },
  get: { id: '' },
};

export type FieldErrors = Partial<Record<string, string>>;

interface Parsed<T> {
  value: T;
  errors: FieldErrors;
}

const CURRENCY_PATTERN = /^[A-Z]{3}$/;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseInteger(value: string): number {
  return value.trim() === '' ? NaN : Number(value);
}

/** Sempre monta o corpo (usado também no preview do cURL); só envie se `errors` estiver vazio. */
export function parseCreateForm(
  form: CreateForm,
  t: TFunction,
): Parsed<CreateTransactionInput> {
  const errors: FieldErrors = {};

  const amount =
    form.amount.trim() === '' ? NaN : Number(form.amount.replace(',', '.'));
  if (!Number.isFinite(amount) || amount <= 0) {
    errors.amount = t('portfolio.playground.validation.amount');
  }

  const currency = form.currency.trim().toUpperCase();
  if (!CURRENCY_PATTERN.test(currency)) {
    errors.currency = t('portfolio.playground.validation.currency');
  }

  const value: CreateTransactionInput = { type: form.type, amount, currency };

  const description = form.description.trim();
  if (description.length > 255) {
    errors.description = t('portfolio.playground.validation.description');
  }
  if (description) value.description = description;

  if (form.metadata.trim()) {
    try {
      const metadata: unknown = JSON.parse(form.metadata);
      if (isPlainObject(metadata)) value.metadata = metadata;
      else errors.metadata = t('portfolio.playground.validation.metadata');
    } catch {
      errors.metadata = t('portfolio.playground.validation.metadata');
    }
  }

  return { value, errors };
}

export function parseListForm(
  form: ListForm,
  t: TFunction,
): Parsed<{ page: number; pageSize: number }> {
  const errors: FieldErrors = {};

  const page = parseInteger(form.page);
  if (!Number.isInteger(page) || page < 1) {
    errors.page = t('portfolio.playground.validation.page');
  }

  const pageSize = parseInteger(form.pageSize);
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
    errors.pageSize = t('portfolio.playground.validation.pageSize');
  }

  return { value: { page, pageSize }, errors };
}

export function parseGetForm(form: GetForm, t: TFunction): Parsed<string> {
  const id = form.id.trim();
  const errors: FieldErrors = UUID_PATTERN.test(id)
    ? {}
    : { id: t('portfolio.playground.validation.id') };

  return { value: id, errors };
}

export function buildPath(endpoint: EndpointId, forms: PlaygroundForms) {
  switch (endpoint) {
    case 'create':
      return '/transactions';
    case 'list': {
      const page = parseInteger(forms.list.page);
      const pageSize = parseInteger(forms.list.pageSize);
      return `/transactions?${buildListQuery(page || 1, pageSize || 20)}`;
    }
    case 'get':
      return `/transactions/${forms.get.id.trim() || ':id'}`;
  }
}

/** cURL equivalente à requisição atual, sem expor a API key nem o x-user-id. */
export function buildCurl(
  endpoint: Endpoint,
  forms: PlaygroundForms,
  t: TFunction,
): string {
  const lines = [
    `curl -X ${endpoint.method} "${API_BASE_URL}${buildPath(endpoint.id, forms)}"`,
    '  -H "x-api-key: $API_KEY"',
    '  -H "x-user-id: $USER_ID"',
  ];

  if (endpoint.id === 'create') {
    const body = JSON.stringify(parseCreateForm(forms.create, t).value);
    lines.push(
      '  -H "Content-Type: application/json"',
      '  -H "Idempotency-Key: $(uuidgen)"',
      `  -d '${body.replaceAll("'", "'\\''")}'`,
    );
  }

  return lines.join(' \\\n');
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
