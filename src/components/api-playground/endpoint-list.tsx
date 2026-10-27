import { useTranslation } from 'react-i18next';
import { colors } from '../../theme';
import { endpoints, type EndpointId } from './endpoints';
import { tint } from './styles';
import { MethodBadge, Panel, PanelLabel } from './ui';

interface EndpointListProps {
  selected: EndpointId;
  onSelect: (endpoint: EndpointId) => void;
  sessionActive: boolean;
}

export function EndpointList({
  selected,
  onSelect,
  sessionActive,
}: EndpointListProps) {
  const { t } = useTranslation();

  return (
    <Panel className="flex flex-col gap-3">
      <PanelLabel>{t('portfolio.playground.endpoints')}</PanelLabel>

      <div
        className="font-mono text-[10px] uppercase tracking-widest"
        style={{ color: colors.muted }}
      >
        {t('portfolio.playground.group')}
      </div>

      <div className="space-y-2">
        {endpoints.map((endpoint) => {
          const isSelected = endpoint.id === selected;

          return (
            <button
              key={endpoint.id}
              type="button"
              onClick={() => onSelect(endpoint.id)}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-sm text-left text-sm transition-colors cursor-pointer"
              style={{
                backgroundColor: isSelected ? tint(colors.accent) : colors.bg,
                border: `1px solid ${isSelected ? colors.accent : colors.border}`,
                color: colors.text,
              }}
            >
              <MethodBadge method={endpoint.method} />
              <span className="flex-1 truncate">
                {t(`portfolio.playground.endpointNames.${endpoint.id}`)}
              </span>
              {endpoint.successStatus !== 200 && (
                <span
                  className="px-1.5 rounded-sm font-mono text-[10px]"
                  style={{
                    backgroundColor: colors.border,
                    color: colors.muted,
                  }}
                >
                  {endpoint.successStatus}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Session */}
      <div
        className="mt-auto pt-3 font-mono text-[11px] leading-relaxed"
        style={{ borderTop: `1px solid ${colors.border}`, color: colors.muted }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: sessionActive ? colors.comment : colors.muted,
            }}
          />
          x-user-id
        </div>
        <div style={{ color: colors.comment }}>
          //{' '}
          {sessionActive
            ? t('portfolio.playground.session.active')
            : t('portfolio.playground.session.pending')}
        </div>
      </div>
    </Panel>
  );
}
