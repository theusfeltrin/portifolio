import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme';
import {
  buildCurl,
  buildPath,
  transactionTypes,
  type Endpoint,
  type FieldErrors,
  type PlaygroundForms,
} from './endpoints';
import { inputStyle } from './styles';
import { MethodBadge, Panel, PanelLabel } from './ui';

interface RequestPanelProps {
  endpoint: Endpoint;
  forms: PlaygroundForms;
  errors: FieldErrors;
  knownIds: string[];
  loading: boolean;
  retryIn: number;
  onChange: <K extends keyof PlaygroundForms>(
    endpoint: K,
    field: keyof PlaygroundForms[K],
    value: string,
  ) => void;
  onSend: () => void;
}

export function RequestPanel({
  endpoint,
  forms,
  errors,
  knownIds,
  loading,
  retryIn,
  onChange,
  onSend,
}: RequestPanelProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const curl = buildCurl(endpoint, forms, t);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(curl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard indisponível (ex.: contexto não seguro)
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend();
  };

  const sendLabel = loading
    ? t('portfolio.playground.sending')
    : retryIn > 0
      ? t('portfolio.playground.retryIn', { seconds: retryIn })
      : t('portfolio.playground.send');

  return (
    <Panel>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <PanelLabel>{t('portfolio.playground.request')}</PanelLabel>

        {/* Method + path */}
        <div
          className="flex items-center gap-3 px-3 py-2 rounded-sm"
          style={{ backgroundColor: colors.bg }}
        >
          <MethodBadge method={endpoint.method} />
          <span
            className="font-mono text-sm truncate"
            style={{ color: colors.text }}
          >
            {buildPath(endpoint.id, forms)}
          </span>
        </div>

        {/* Params */}
        {endpoint.id === 'create' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field name="type" error={errors.type}>
                <select
                  id="type"
                  value={forms.create.type}
                  onChange={(e) => onChange('create', 'type', e.target.value)}
                  className={fieldClassName}
                  style={inputStyle}
                >
                  {transactionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </Field>

              <Field name="amount" error={errors.amount}>
                <input
                  id="amount"
                  inputMode="decimal"
                  value={forms.create.amount}
                  onChange={(e) => onChange('create', 'amount', e.target.value)}
                  placeholder="250.50"
                  className={fieldClassName}
                  style={inputStyle}
                />
              </Field>
            </div>

            <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-3">
              <Field name="currency" error={errors.currency}>
                <input
                  id="currency"
                  value={forms.create.currency}
                  onChange={(e) =>
                    onChange('create', 'currency', e.target.value.toUpperCase())
                  }
                  maxLength={3}
                  placeholder="BRL"
                  className={fieldClassName}
                  style={inputStyle}
                />
              </Field>

              <Field name="description" optional error={errors.description}>
                <input
                  id="description"
                  value={forms.create.description}
                  onChange={(e) =>
                    onChange('create', 'description', e.target.value)
                  }
                  maxLength={255}
                  placeholder={t(
                    'portfolio.playground.placeholders.description',
                  )}
                  className={fieldClassName}
                  style={inputStyle}
                />
              </Field>
            </div>

            <Field name="metadata" optional error={errors.metadata}>
              <textarea
                id="metadata"
                rows={2}
                value={forms.create.metadata}
                onChange={(e) => onChange('create', 'metadata', e.target.value)}
                placeholder='{ "origem": "web" }'
                className={`${fieldClassName} resize-none`}
                style={inputStyle}
              />
            </Field>
          </div>
        )}

        {endpoint.id === 'list' && (
          <div className="grid grid-cols-2 gap-3">
            <Field name="page" error={errors.page}>
              <input
                id="page"
                type="number"
                min={1}
                step={1}
                value={forms.list.page}
                onChange={(e) => onChange('list', 'page', e.target.value)}
                className={fieldClassName}
                style={inputStyle}
              />
            </Field>

            <Field name="pageSize" error={errors.pageSize}>
              <input
                id="pageSize"
                type="number"
                min={1}
                max={100}
                step={1}
                value={forms.list.pageSize}
                onChange={(e) => onChange('list', 'pageSize', e.target.value)}
                className={fieldClassName}
                style={inputStyle}
              />
            </Field>
          </div>
        )}

        {endpoint.id === 'get' && (
          <Field name="id" error={errors.id}>
            <input
              id="id"
              list="known-transaction-ids"
              value={forms.get.id}
              onChange={(e) => onChange('get', 'id', e.target.value)}
              placeholder={t('portfolio.playground.placeholders.id')}
              className={fieldClassName}
              style={inputStyle}
              autoComplete="off"
              spellCheck={false}
            />
            <datalist id="known-transaction-ids">
              {knownIds.map((id) => (
                <option key={id} value={id} />
              ))}
            </datalist>
          </Field>
        )}

        {/* cURL */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <PanelLabel>curl</PanelLabel>
            <button
              type="button"
              onClick={handleCopy}
              className="font-mono text-xs cursor-pointer"
              style={{ color: copied ? colors.comment : colors.accent }}
            >
              {copied
                ? t('portfolio.playground.copied')
                : t('portfolio.playground.copy')}
            </button>
          </div>

          <pre
            className="px-3 py-2.5 rounded-sm font-mono text-xs leading-relaxed overflow-x-auto"
            style={{ ...inputStyle, color: colors.text }}
          >
            {curl}
          </pre>
        </div>

        <button
          type="submit"
          disabled={loading || retryIn > 0}
          className="w-full px-6 py-2.5 font-mono text-sm rounded-sm transition active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
          style={{ backgroundColor: colors.accent, color: '#fff' }}
        >
          {sendLabel}
        </button>
      </form>
    </Panel>
  );
}

const fieldClassName =
  'w-full rounded-sm px-3 py-2 font-mono text-sm focus:outline-none';

function Field({
  name,
  optional = false,
  error,
  children,
}: {
  name: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={name}
        className="block font-mono text-xs mb-1.5"
        style={{ color: colors.muted }}
      >
        <span style={{ color: colors.accent }}>$</span> {name}
        {optional && <span style={{ color: colors.border }}>?</span>}:
      </label>

      {children}

      {error && (
        <p
          className="mt-1 font-mono text-[11px]"
          style={{ color: colors.string }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
