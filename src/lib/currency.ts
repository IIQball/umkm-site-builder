/**
 * Universal Currency Masking Helper Utilities
 * Strictly displays pure IDR integers without cents/divisions.
 */

export function formatCurrencyInput(value: string | number): string {
  if (value === null || value === undefined) return '';
  const cleanDigits = String(value).replace(/\D/g, '');
  if (!cleanDigits) return '';
  return new Intl.NumberFormat('id-ID').format(Number(cleanDigits));
}

export function parseCurrencyInput(value: string | number): number {
  if (value === null || value === undefined) return 0;
  const cleanDigits = String(value).replace(/\D/g, '');
  const parsed = Number(cleanDigits);
  return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : 0;
}

export function formatIDR(value: number | bigint | string): string {
  const numericValue = typeof value === 'bigint' ? Number(value) : Number(value) || 0;
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(numericValue);
}
