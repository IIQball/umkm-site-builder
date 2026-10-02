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

/**
 * Smart compact currency formatting for StatCards & dashboard summaries.
 * Retains exact 0s for values under 1.000.000 (e.g. Rp 800.000, Rp 50.000) where space permits.
 * Compacts large numbers into 'Juta', 'Miliar', 'Triliun' (e.g. Rp 8 Juta, Rp 8 Miliar)
 * to prevent card overflow while keeping maximum clarity.
 */
export function formatSmartIDR(value: number | bigint | string): string {
  let num: number;
  if (typeof value === 'bigint') {
    num = Number(value);
  } else if (typeof value === 'string') {
    // Strip dots (thousands separator in IDR), replace comma with dot for decimal
    const normalized = value.replace(/\./g, '').replace(/,/g, '.');
    const clean = normalized.replace(/[^0-9.-]/g, '');
    num = Number(clean) || 0;
  } else {
    num = Number(value) || 0;
  }

  const abs = Math.abs(num);

  if (abs >= 1_000_000_000_000) {
    const val = num / 1_000_000_000_000;
    const formatted = val.toLocaleString('id-ID', {
      maximumFractionDigits: val % 1 === 0 ? 0 : 1,
    });
    return `Rp ${formatted} Triliun`;
  }
  if (abs >= 1_000_000_000) {
    const val = num / 1_000_000_000;
    const formatted = val.toLocaleString('id-ID', {
      maximumFractionDigits: val % 1 === 0 ? 0 : 1,
    });
    return `Rp ${formatted} Miliar`;
  }
  if (abs >= 1_000_000) {
    const val = num / 1_000_000;
    const formatted = val.toLocaleString('id-ID', {
      maximumFractionDigits: val % 1 === 0 ? 0 : 1,
    });
    return `Rp ${formatted} Juta`;
  }

  return formatIDR(num);
}
