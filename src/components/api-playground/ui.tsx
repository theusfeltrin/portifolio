import { colors } from '../../theme';
import type { HttpMethod } from './endpoints';
import { methodColors, tint } from './styles';

export function Panel({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-sm p-4 ${className}`}
      style={{
        backgroundColor: colors.panel,
        border: `1px solid ${colors.border}`,
      }}
    >
      {children}
    </div>
  );
}

export function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-mono text-[11px] uppercase tracking-widest"
      style={{ color: colors.muted }}
    >
      {children}
    </span>
  );
}

export function Badge({
  label,
  color,
  className = '',
}: {
  label: string;
  color: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex justify-center shrink-0 px-2 py-0.5 rounded-sm font-mono text-[10px] font-semibold ${className}`}
      style={{ backgroundColor: tint(color), color }}
    >
      {label}
    </span>
  );
}

export function MethodBadge({ method }: { method: HttpMethod }) {
  return <Badge label={method} color={methodColors[method]} className="w-12" />;
}
