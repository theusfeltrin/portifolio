import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ApiError,
  createTransaction,
  getTransaction,
  hasUserId,
  listTransactions,
} from '../../api';
import type {
  TransactionListResponse,
  TransactionResponse,
} from '../../types/transactions';
import { EndpointList } from './endpoint-list';
import {
  buildPath,
  endpoints,
  hasErrors,
  initialForms,
  parseCreateForm,
  parseGetForm,
  parseListForm,
  type EndpointId,
  type FieldErrors,
  type PlaygroundForms,
} from './endpoints';
import { RequestPanel } from './request-panel';
import { ResponsePanel, type PlaygroundResult } from './response-panel';

type SuccessBody = TransactionResponse | TransactionListResponse;

const MAX_KNOWN_IDS = 20;

export function ApiPlayground() {
  const { t } = useTranslation();

  const [selected, setSelected] = useState<EndpointId>('create');
  const [forms, setForms] = useState<PlaygroundForms>(initialForms);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<PlaygroundResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [retryIn, setRetryIn] = useState(0);
  const [knownIds, setKnownIds] = useState<string[]>([]);
  const [sessionActive, setSessionActive] = useState(hasUserId);

  const endpoint = endpoints.find((item) => item.id === selected)!;

  // 429: bloqueia novos envios até `retryAfter` expirar
  useEffect(() => {
    if (retryIn <= 0) return;
    const timer = setTimeout(() => setRetryIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [retryIn]);

  const handleSelect = (id: EndpointId) => {
    setSelected(id);
    setErrors({});
  };

  const handleChange = <K extends keyof PlaygroundForms>(
    form: K,
    field: keyof PlaygroundForms[K],
    value: string,
  ) => {
    setForms((prev) => ({
      ...prev,
      [form]: { ...prev[form], [field]: value },
    }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const rememberIds = (body: SuccessBody) => {
    const ids = 'data' in body ? [body.data.id] : body.items.map((i) => i.id);
    setKnownIds((prev) =>
      [...new Set([...ids, ...prev])].slice(0, MAX_KNOWN_IDS),
    );
  };

  const execute = async (
    id: EndpointId,
    request: string,
    call: () => Promise<SuccessBody>,
  ) => {
    const { method, successStatus } = endpoints.find((e) => e.id === id)!;
    const label = `${method} ${request}`;

    setLoading(true);
    const startedAt = performance.now();

    try {
      const body = await call();
      const durationMs = performance.now() - startedAt;
      setResult({
        kind: 'success',
        status: successStatus,
        body,
        request: label,
        durationMs,
      });
      rememberIds(body);
    } catch (err) {
      const durationMs = performance.now() - startedAt;

      if (!(err instanceof ApiError)) {
        setResult({ kind: 'network', request: label, durationMs });
        return;
      }

      setResult({
        kind: 'error',
        status: err.status,
        body: err.body,
        request: label,
        durationMs,
      });

      const { details, retryAfter } = err.body;
      if (details) {
        setErrors(
          Object.fromEntries(
            Object.entries(details).map(([field, messages]) => [
              field,
              messages[0],
            ]),
          ),
        );
      }
      if (err.body.error === 'RATE_LIMIT_EXCEEDED') {
        setRetryIn(Math.ceil(retryAfter ?? 60));
      }
    } finally {
      setLoading(false);
      setSessionActive(hasUserId());
    }
  };

  const sendList = (list: PlaygroundForms['list']) => {
    const { value, errors } = parseListForm(list, t);
    setErrors(errors);
    if (hasErrors(errors)) return;

    execute('list', buildPath('list', { ...forms, list }), () =>
      listTransactions(value.page, value.pageSize),
    );
  };

  const handleSend = () => {
    if (loading || retryIn > 0) return;

    switch (selected) {
      case 'create': {
        const { value, errors } = parseCreateForm(forms.create, t);
        setErrors(errors);
        if (hasErrors(errors)) return;

        // cada envio gera uma Idempotency-Key nova dentro do client
        execute('create', buildPath('create', forms), async () => ({
          data: await createTransaction(value),
        }));
        return;
      }
      case 'list':
        sendList(forms.list);
        return;
      case 'get': {
        const { value, errors } = parseGetForm(forms.get, t);
        setErrors(errors);
        if (hasErrors(errors)) return;

        execute('get', buildPath('get', forms), async () => ({
          data: await getTransaction(value),
        }));
        return;
      }
    }
  };

  const handleInspect = (id: string) => {
    setSelected('get');
    setForms((prev) => ({ ...prev, get: { id } }));
    setErrors({});
  };

  const handlePageChange = (page: number) => {
    if (loading || retryIn > 0) return;

    const list = { ...forms.list, page: String(page) };
    setSelected('list');
    setForms((prev) => ({ ...prev, list }));
    sendList(list);
  };

  return (
    <div className="grid gap-4 md:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[200px_minmax(0,1fr)_minmax(0,1fr)]">
      <EndpointList
        selected={selected}
        onSelect={handleSelect}
        sessionActive={sessionActive}
      />

      <RequestPanel
        endpoint={endpoint}
        forms={forms}
        errors={errors}
        knownIds={knownIds}
        loading={loading}
        retryIn={retryIn}
        onChange={handleChange}
        onSend={handleSend}
      />

      <div className="md:col-span-2 lg:col-span-1 flex flex-col">
        <ResponsePanel
          result={result}
          loading={loading}
          onInspect={handleInspect}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
