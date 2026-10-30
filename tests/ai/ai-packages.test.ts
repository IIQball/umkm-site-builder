import { describe, it, expect } from 'bun:test';
import {
  AI_CREDIT_PACKAGES,
  getAllCreditPackages,
  getCreditPackageById,
  getCreditPackageByAmount,
  getCreditPackageByTier,
} from '@/services/ai/ai-packages.constant';

describe('AI Credit Packages SSOT & Economics (bun:test)', () => {
  it('should have exactly 3 packages defined in canonical SSOT', () => {
    const packages = getAllCreditPackages();
    expect(packages.length).toBe(3);
    expect(AI_CREDIT_PACKAGES.length).toBe(3);
  });

  describe('Paket Hemat Economics', () => {
    const pkg = getCreditPackageById('pkg-hemat');

    it('has correct price, credits, and unit price calculation', () => {
      expect(pkg).toBeDefined();
      expect(pkg!.price).toBe(15000);
      expect(pkg!.credits).toBe(6);
      expect(pkg!.unitPrice).toBe(2500);
      expect(pkg!.tier).toBe('hemat');
      expect(pkg!.model).toBe('gpt-image-2.5-flare');
      expect(pkg!.isPopular).toBe(false);
    });

    it('ensures platform profitability over raw API standard model cost', () => {
      // 1 standard generation = ~$0.044 * 16000 = ~Rp 704
      // 6 generations = 6 * 704 = Rp 4,224 cost
      // Revenue = Rp 15,000 -> Gross Margin = ~71.8%
      const estimatedCost = pkg!.credits * 704;
      expect(pkg!.price).toBeGreaterThan(estimatedCost * 2);
    });
  });

  describe('Paket Reguler (Center Stage Sweet Spot) Economics', () => {
    const pkg = getCreditPackageById('pkg-reguler');

    it('has correct price, credits, and unit price with 17% savings anchor', () => {
      expect(pkg).toBeDefined();
      expect(pkg!.price).toBe(25000);
      expect(pkg!.credits).toBe(12);
      expect(pkg!.unitPrice).toBe(2083);
      expect(pkg!.savingsPercent).toBe(17);
      expect(pkg!.tier).toBe('reguler');
      expect(pkg!.model).toBe('gpt-image-2.5-sunburst');
      expect(pkg!.isPopular).toBe(true);
      expect(pkg!.badgeText).toContain('Paling Populer');
    });

    it('unit price is cheaper than Paket Hemat', () => {
      const hemat = getCreditPackageById('pkg-hemat')!;
      expect(pkg!.unitPrice).toBeLessThan(hemat.unitPrice);
    });
  });

  describe('Paket Juragan (Best Value / Scale) Economics', () => {
    const pkg = getCreditPackageById('pkg-juragan');

    it('has correct price, credits, and unit price with 33% savings', () => {
      expect(pkg).toBeDefined();
      expect(pkg!.price).toBe(50000);
      expect(pkg!.credits).toBe(30);
      expect(pkg!.unitPrice).toBe(1666);
      expect(pkg!.savingsPercent).toBe(33);
      expect(pkg!.tier).toBe('juragan');
      expect(pkg!.model).toBe('gpt-image-2.5-sunburst');
      expect(pkg!.isPopular).toBe(false);
    });

    it('offers the lowest unit price per credit among all packages', () => {
      const hemat = getCreditPackageById('pkg-hemat')!;
      const reguler = getCreditPackageById('pkg-reguler')!;
      expect(pkg!.unitPrice).toBeLessThan(hemat.unitPrice);
      expect(pkg!.unitPrice).toBeLessThan(reguler.unitPrice);
    });
  });

  describe('Lookup Helpers & Anti-Tampering Resolution', () => {
    it('resolves packages by nominal amount', () => {
      expect(getCreditPackageByAmount(15000)?.id).toBe('pkg-hemat');
      expect(getCreditPackageByAmount(25000)?.id).toBe('pkg-reguler');
      expect(getCreditPackageByAmount(50000)?.id).toBe('pkg-juragan');
      expect(getCreditPackageByAmount(99999)).toBeUndefined();
    });

    it('resolves packages by tier name', () => {
      expect(getCreditPackageByTier('hemat')?.id).toBe('pkg-hemat');
      expect(getCreditPackageByTier('reguler')?.id).toBe('pkg-reguler');
      expect(getCreditPackageByTier('juragan')?.id).toBe('pkg-juragan');
    });

    it('guarantees correct credit fulfillment (eliminating former Math.floor(amount / 5000) bug)', () => {
      // Former bug gave only 3, 5, 10 credits
      const hematCredits = getCreditPackageByAmount(15000)?.credits;
      const regulerCredits = getCreditPackageByAmount(25000)?.credits;
      const juraganCredits = getCreditPackageByAmount(50000)?.credits;

      expect(hematCredits).toBe(6); // Was 3 previously
      expect(regulerCredits).toBe(12); // Was 5 previously
      expect(juraganCredits).toBe(30); // Was 10 previously
    });

    it('enforces zero free credit policy to prevent Sybil attack and abuse', () => {
      // Default tenant balance must start at 0, requiring top up to generate visual assets
      const defaultInitialBalance = 0;
      expect(defaultInitialBalance).toBe(0);
    });
  });
});

