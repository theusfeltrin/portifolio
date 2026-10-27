import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme';
import type {
  ApiErrorBody,
  Pagination,
  Transaction,
  TransactionListResponse,
  TransactionResponse,
} from '../../types/transactions';
import { JsonView } from './json-view';
import { statusColor, transactionTypeColors } from './styles';
import { Badge, Panel, PanelLabel } from './ui';

export type PlaygroundResult = {
  request: string;
  durationMs: number;
} & (
  | {
      kind: 'success';
      status: number;
      body: TransactionResponse | TransactionListResponse;
    }
  | { kind: 'error'; status: number; body: ApiErrorBody }
  | { kind: 'network' }
);

const statusTexts: Record<number, string> = {
  200: 'OK',
  201: 'Created',
  400: 'Bad Request',
  401: 'Unauthorized',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
};

type Tab = 'json' | 'preview';

interface ResponsePanelProps {
  result: PlaygroundResult | null;
  loading: boolean;
  onInspect: (id: string) => void;
  onPageChange: (page: number) => void;
}

export function ResponsePanel({
  result,
  loading,
  onInspect,
  onPageChange,
}: ResponsePanelProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('json');

  const status = result && result.kind !== 'network' ? result.status : null;
  const showTabs = result?.kind === 'success';

  return (
    <Panel className="flex-1 flex flex-col gap-3 min-h-80">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <PanelLabel>{t('portfolio.playground.response')}</PanelLabel>

        <span
          className="font-mono text-xs"
          style={{ color: statusColor(status) }}
        >
          {loading
            ? t('portfolio.playground.loading')
            : !result
              ? t('portfolio.playground.ready')
              : result.kind === 'network'
                ? t('portfolio.playground.networkError')
                : `${result.status} ${statusTexts[result.status] ?? ''}`}
        </span>

        {result && !loading && (
          <span
            className="ml-auto font-mono text-[11px]"
            style={{ color: colors.muted }}
          >
            {Math.round(result.durationMs)}ms
          </span>
        )}
      </div>

      {result && !loading && (
        <div
          className="font-mono text-[11px] truncate"
          style={{ color: colors.comment }}
        >
          // {result.request}
        </div>
      )}

      {showTabs && !loading && (
        <div className="flex gap-4 font-mono text-xs">
          {(['json', 'preview'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className="pb-1 cursor-pointer"
              style={{
                color: tab === item ? colors.text : colors.muted,
                borderBottom: `1px solid ${tab === item ? colors.accent : 'transparent'}`,
              }}
            >
              {t(`portfolio.playground.tabs.${item}`)}
            </button>
          ))}
        </div>
      )}

      {/* Body */}
      <div
        className="relative flex-1 min-h-60 rounded-sm"
        style={{
          backgroundColor: colors.bg,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div className="absolute inset-0 overflow-auto p-3">
          <ResponseBody
            result={result}
            loading={loading}
            tab={tab}
            onInspect={onInspect}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </Panel>
  );
}

function ResponseBody({
  result,
  loading,
  tab,
  onInspect,
  onPageChange,
}: {
  result: PlaygroundResult | null;
  loading: boolean;
  tab: Tab;
  onInspect: (id: string) => void;
  onPageChange: (page: number) => void;
}) {
  const { t } = useTranslation();

  if (loading || !result) {
    return (
      <p className="font-mono text-xs" style={{ color: colors.comment }}>
        //{' '}
        {loading
          ? t('portfolio.playground.loading')
          : t('portfolio.playground.placeholder')}
      </p>
    );
  }

  if (result.kind === 'network') {
    return (
      <p className="font-mono text-xs" style={{ color: colors.string }}>
        // {t('portfolio.playground.errors.NETWORK')}
      </p>
    );
  }

  if (result.kind === 'error') {
    return (
      <div className="space-y-3">
        <p
          className="font-mono text-xs"
          style={{ color: statusColor(result.status) }}
        >
          //{' '}
          {t(`portfolio.playground.errors.${result.body.error}`, {
            defaultValue: result.body.message,
            seconds: result.body.retryAfter,
          })}
        </p>
        <JsonView value={result.body} />
      </div>
    );
  }

  if (tab === 'json') return <JsonView value={result.body} />;

  if ('data' in result.body) {
    return (
      <TransactionRow transaction={result.body.data} onInspect={onInspect} />
    );
  }

  return (
    <TransactionList
      items={result.body.items}
      pagination={result.body.pagination}
      onInspect={onInspect}
      onPageChange={onPageChange}
    />
  );
}

function TransactionList({
  items,
  pagination,
  onInspect,
  onPageChange,
}: {
  items: Transaction[];
  pagination: Pagination;
  onInspect: (id: string) => void;
  onPageChange: (page: number) => void;
}) {
  const { t } = useTranslation();
  const { page, totalPages, total } = pagination;

  return (
    <div className="space-y-2">
      {items.length === 0 && (
        <p className="font-mono text-xs" style={{ color: colors.comment }}>
          // {t('portfolio.playground.preview.empty')}
        </p>
      )}

      {items.map((transaction) => (
        <TransactionRow
          key={transaction.id}
          transaction={transaction}
          onInspect={onInspect}
        />
      ))}

      <div
        className="flex items-center justify-between pt-2 font-mono text-[11px]"
        style={{ color: colors.muted }}
      >
        <span>{t('portfolio.playground.preview.total', { count: total })}</span>

        <div className="flex items-center gap-3">
          <PageButton
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            ‹
          </PageButton>
          <span>
            {page}/{totalPages}
          </span>
          <PageButton
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            ›
          </PageButton>
        </div>
      </div>
    </div>
  );
}

function PageButton({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="px-1.5 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
      style={{ color: colors.accent }}
    >
      {children}
    </button>
  );
}

function TransactionRow({
  transaction,
  onInspect,
}: {
  transaction: Transaction;
  onInspect: (id: string) => void;
}) {
  const { t, i18n } = useTranslation();

  const amount = new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency: transaction.currency,
  }).format(transaction.amount);

  const createdAt = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(transaction.created_at));

  return (
    <button
      type="button"
      onClick={() => onInspect(transaction.id)}
      title={t('portfolio.playground.preview.inspect')}
      className="w-full p-2.5 rounded-sm text-left cursor-pointer transition-colors"
      style={{
        backgroundColor: colors.panel,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div className="flex items-center gap-2">
        <Badge
          label={transaction.type}
          color={transactionTypeColors[transaction.type]}
        />
        <span
          className="ml-auto font-mono text-sm"
          style={{ color: colors.text }}
        >
          {amount}
        </span>
      </div>

      <div
        className="flex items-center gap-2 mt-1.5 font-mono text-[11px]"
        style={{ color: colors.muted }}
      >
        <span className="truncate">{transaction.description ?? '—'}</span>
        <span className="ml-auto shrink-0">{createdAt}</span>
      </div>
    </button>
  );
}
