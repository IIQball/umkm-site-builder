/**
 * Formatting utilities
 */

export function formatIDR(amount: number | bigint | string): string {
  const numericValue = typeof amount === 'bigint' ? Number(amount) : Number(amount) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue);
}

export function formatCurrency(amount: number): string {
  return formatIDR(amount);
}

/**
 * Format raw number or digit string to IDR thousand-separated format (e.g. 50000 -> "50.000")
 */
export function formatPriceInput(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '';
  const digits = String(value).replace(/\D/g, '');
  if (!digits) return '';
  return new Intl.NumberFormat('id-ID').format(Number(digits));
}

/**
 * Parse thousand-separated IDR string or raw value into pure integer (e.g. "50.000" -> 50000)
 */
export function parsePriceInput(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const digits = String(value).replace(/\D/g, '');
  const parsed = Number(digits);
  return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : 0;
}

