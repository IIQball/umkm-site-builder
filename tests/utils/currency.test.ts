import { describe, it, expect } from 'vitest';
import { formatIDR, formatSmartIDR } from '@/lib/currency';

describe('formatSmartIDR', () => {
  it('retains exact 0s for values under 1.000.000 to maximize precision', () => {
    expect(formatSmartIDR(0)).toBe('Rp 0');
    expect(formatSmartIDR(5000)).toBe('Rp 5.000');
    expect(formatSmartIDR(50000)).toBe('Rp 50.000');
    expect(formatSmartIDR(800000)).toBe('Rp 800.000');
    expect(formatSmartIDR(999999)).toBe('Rp 999.999');
  });

  it('compacts millions (Juta) smartly to prevent card horizontal overflow', () => {
    expect(formatSmartIDR(1000000)).toBe('Rp 1 Juta');
    expect(formatSmartIDR(8000000)).toBe('Rp 8 Juta');
    expect(formatSmartIDR(8500000)).toBe('Rp 8,5 Juta');
    expect(formatSmartIDR(150000000)).toBe('Rp 150 Juta');
  });

  it('compacts billions (Miliar) and trillions cleanly', () => {
    expect(formatSmartIDR(1000000000)).toBe('Rp 1 Miliar');
    expect(formatSmartIDR(8000000000)).toBe('Rp 8 Miliar');
    expect(formatSmartIDR(8500000000)).toBe('Rp 8,5 Miliar');
    expect(formatSmartIDR(1000000000000)).toBe('Rp 1 Triliun');
  });

  it('handles string numbers and currency strings gracefully', () => {
    expect(formatSmartIDR('800000')).toBe('Rp 800.000');
    expect(formatSmartIDR('8000000')).toBe('Rp 8 Juta');
    expect(formatSmartIDR('Rp 8.000.000.000')).toBe('Rp 8 Miliar');
  });

  it('standard formatIDR still produces pure non-compact integers', () => {
    expect(formatIDR(800000)).toBe('Rp 800.000');
    expect(formatIDR(8000000)).toBe('Rp 8.000.000');
    expect(formatIDR(8000000000)).toBe('Rp 8.000.000.000');
  });
});
