/**
 * Formatting utilities
 */

import { formatIDR as curFormatIDR, formatCurrencyInput, parseCurrencyInput } from '../currency';

export const formatIDR = curFormatIDR;

export function formatCurrency(amount: number): string {
  return formatIDR(amount);
}

export function formatPriceInput(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '';
  return formatCurrencyInput(value);
}

export function parsePriceInput(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  return parseCurrencyInput(value);
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

