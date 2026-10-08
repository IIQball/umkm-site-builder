/**
 * Formatting utilities
 */

import { formatIDR as curFormatIDR, formatSmartIDR as curFormatSmartIDR, formatCurrencyInput, parseCurrencyInput } from '../currency';

export const formatIDR = curFormatIDR;
export const formatSmartIDR = curFormatSmartIDR;

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

export function formatDate(
  date: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Intl.DateTimeFormat('id-ID', options ?? defaultOptions).format(d);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateSlug(text: string, withSuffix = false): string {
  const base = slugify(text) || 'template';
  if (withSuffix) {
    const suffix = Math.random().toString(36).substring(2, 7);
    return `${base}-${suffix}`;
  }
  return base;
}

export const INDONESIAN_MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
] as const;

export function getPeriodBounds(
  year: number,
  month: number | 'all'
): { start: Date; end: Date } {
  const start =
    month === 'all'
      ? new Date(year, 0, 1, 0, 0, 0, 0)
      : new Date(year, Number(month) - 1, 1, 0, 0, 0, 0);

  const end =
    month === 'all'
      ? new Date(year, 11, 31, 23, 59, 59, 999)
      : new Date(year, Number(month), 0, 23, 59, 59, 999);

  return { start, end };
}

export function filterByPeriod<T>(
  items: T[],
  year: number,
  month: number | 'all',
  getDate: (item: T) => Date | string | null | undefined
): T[] {
  const { start, end } = getPeriodBounds(year, month);
  return items.filter((item) => {
    const raw = getDate(item);
    if (!raw) return false;
    const d = typeof raw === 'string' ? new Date(raw) : raw;
    return d >= start && d <= end;
  });
}

export function computeAvailableYears<T>(
  items: T[],
  getDate: (item: T) => Date | string | null | undefined,
  minYearFallback?: number
): number[] {
  const currentYear = new Date().getFullYear();
  let earliest = minYearFallback || currentYear;
  for (const item of items) {
    const raw = getDate(item);
    if (!raw) continue;
    const d = typeof raw === 'string' ? new Date(raw) : raw;
    const y = d.getFullYear();
    if (!isNaN(y) && y < earliest && y >= 2020) {
      earliest = y;
    }
  }
  const years: number[] = [];
  for (let y = earliest; y <= currentYear; y++) {
    years.push(y);
  }
  return years.sort((a, b) => b - a);
}



