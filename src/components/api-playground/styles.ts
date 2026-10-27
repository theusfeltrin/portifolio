import { colors } from '../../theme';
import type { TransactionType } from '../../types/transactions';
import type { HttpMethod } from './endpoints';

export const methodColors: Record<HttpMethod, string> = {
  GET: colors.comment,
  POST: colors.accent,
};

export const transactionTypeColors: Record<TransactionType, string> = {
  DEPOSIT: colors.comment,
  WITHDRAWAL: colors.string,
  TRANSFER: colors.accent,
};

export function statusColor(status: number | null): string {
  if (status === null) return colors.muted;
  if (status < 300) return colors.comment;
  if (status < 500) return colors.number;
  return colors.string;
}

// hex + alpha (~10%) para fundos de badges/itens selecionados
export function tint(color: string): string {
  return `${color}1f`;
}

export const inputStyle = {
  backgroundColor: colors.bg,
  border: `1px solid ${colors.border}`,
  color: colors.text,
};
