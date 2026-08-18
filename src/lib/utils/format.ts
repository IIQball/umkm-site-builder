/**
 * Formatting utilities
 */

export function formatCurrency(amountInCents: number): string {
  const amount = amountInCents / 100;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}
