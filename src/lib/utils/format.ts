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

