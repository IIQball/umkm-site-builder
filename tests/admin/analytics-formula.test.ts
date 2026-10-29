import { describe, it, expect } from 'vitest';
import {
  calculateBudgetUsedPercentage,
  calculateCostPerPercentUsage,
} from '@/services/ai/cost-trends.service';
import {
  computeBarChartLayout,
  getBudgetUsageStatus,
} from '@/components/admin/ai/costTrendChart.helpers';
import type { AiDailyCostPoint } from '@/types/admin/ai-cost-trends.types';

describe('Admin Analytics Formula & Chart Reactivity Tests', () => {
  describe('Formula: Persentase Anggaran Terpakai (calculateBudgetUsedPercentage)', () => {
    it('kalkulasi proporsional standar dengan nilai valid', () => {
      expect(calculateBudgetUsedPercentage(250000, 1000000)).toBe(25);
      expect(calculateBudgetUsedPercentage(500000, 1000000)).toBe(50);
      expect(calculateBudgetUsedPercentage(1000000, 1000000)).toBe(100);
    });

    it('pembulatan presisi hingga 2 desimal', () => {
      expect(calculateBudgetUsedPercentage(100000, 300000)).toBe(33.33);
      expect(calculateBudgetUsedPercentage(1, 3)).toBe(33.33);
      expect(calculateBudgetUsedPercentage(2, 3)).toBe(66.67);
    });

    it('kondisi over-budget (> 100% penggunaan anggaran)', () => {
      expect(calculateBudgetUsedPercentage(1500000, 1000000)).toBe(150);
      expect(calculateBudgetUsedPercentage(3500000, 1000000)).toBe(350);
      expect(calculateBudgetUsedPercentage(10000000, 1000000)).toBe(1000);
    });

    it('proteksi pembagian nol (depositLimit bernilai 0)', () => {
      expect(calculateBudgetUsedPercentage(500000, 0)).toBe(0);
      expect(calculateBudgetUsedPercentage(0, 0)).toBe(0);
    });

    it('proteksi saat total pengeluaran bernilai 0', () => {
      expect(calculateBudgetUsedPercentage(0, 1000000)).toBe(0);
    });

    it('proteksi input negatif pada spent maupun limit', () => {
      expect(calculateBudgetUsedPercentage(-50000, 1000000)).toBe(0);
      expect(calculateBudgetUsedPercentage(50000, -1000000)).toBe(0);
      expect(calculateBudgetUsedPercentage(-50000, -1000000)).toBe(0);
    });

    it('proteksi nilai non-finite (NaN, Infinity, -Infinity)', () => {
      expect(calculateBudgetUsedPercentage(NaN, 1000000)).toBe(0);
      expect(calculateBudgetUsedPercentage(50000, NaN)).toBe(0);
      expect(calculateBudgetUsedPercentage(Infinity, 1000000)).toBe(0);
      expect(calculateBudgetUsedPercentage(50000, Infinity)).toBe(0);
      expect(calculateBudgetUsedPercentage(-Infinity, 1000000)).toBe(0);
    });

    it('skala nominal besar (miliaran/triliunan rupiah) tanpa overflow', () => {
      const spent = 12500000000; // 12.5 Miliar
      const limit = 50000000000; // 50 Miliar
      expect(calculateBudgetUsedPercentage(spent, limit)).toBe(25);
    });

    it('micro-spending dengan rasio sangat kecil dibulatkan aman', () => {
      // 1 IDR dari 1.000.000 IDR = 0.0001% -> dibulatkan 0.00% (0)
      expect(calculateBudgetUsedPercentage(1, 1000000)).toBe(0);
      // 100 IDR dari 1.000.000 IDR = 0.01%
      expect(calculateBudgetUsedPercentage(100, 1000000)).toBe(0.01);
    });
  });

  describe('Formula: Harga per 1% Usage (calculateCostPerPercentUsage)', () => {
    it('kalkulasi akurat dari total pengeluaran dan persentase terpakai', () => {
      // Rp 250.000 untuk 25% penggunaan -> Rp 10.000 per 1%
      expect(calculateCostPerPercentUsage(250000, 25)).toBe(10000);
      // Rp 500.000 untuk 50% penggunaan -> Rp 10.000 per 1%
      expect(calculateCostPerPercentUsage(500000, 50)).toBe(10000);
    });

    it('konsistensi proporsional: harga per 1% setara depositLimit / 100', () => {
      const depositLimit = 2500000;
      const spent = 750000;
      const pct = calculateBudgetUsedPercentage(spent, depositLimit);
      const costPer1Pct = calculateCostPerPercentUsage(spent, pct, depositLimit);
      expect(costPer1Pct).toBe(depositLimit / 100);
    });

    it('fallback ke 1% deposit limit saat usage belum berjalan (0% terpakai)', () => {
      // Belum ada transaksi (0 IDR, 0%), estimasi unit price mengacu ke limit
      expect(calculateCostPerPercentUsage(0, 0, 1000000)).toBe(10000);
      expect(calculateCostPerPercentUsage(0, 0, 5000000)).toBe(50000);
    });

    it('proteksi pembagian nol saat usage 0 dan deposit limit 0 atau tidak ada', () => {
      expect(calculateCostPerPercentUsage(0, 0)).toBe(0);
      expect(calculateCostPerPercentUsage(0, 0, 0)).toBe(0);
    });

    it('kalkulasi valid pada kondisi over-budget (> 100%)', () => {
      // Rp 1.500.000 untuk 150% -> Rp 10.000 per 1%
      expect(calculateCostPerPercentUsage(1500000, 150)).toBe(10000);
      // Rp 3.000.000 untuk 200% -> Rp 15.000 per 1%
      expect(calculateCostPerPercentUsage(3000000, 200)).toBe(15000);
    });

    it('proteksi nilai negatif dan non-finite (NaN, Infinity)', () => {
      expect(calculateCostPerPercentUsage(-10000, -10, -50000)).toBe(0);
      expect(calculateCostPerPercentUsage(NaN, NaN, NaN)).toBe(0);
      expect(calculateCostPerPercentUsage(Infinity, 25)).toBe(0);
      expect(calculateCostPerPercentUsage(250000, Infinity)).toBe(0);
      expect(calculateCostPerPercentUsage(0, 0, Infinity)).toBe(0);
    });

    it('fallback ketika totalSpent mikro menghasilkan persentase 0', () => {
      const depositLimit = 1000000;
      const spent = 1;
      const pct = calculateBudgetUsedPercentage(spent, depositLimit); // 0
      const costPer1Pct = calculateCostPerPercentUsage(spent, pct, depositLimit);
      expect(costPer1Pct).toBe(10000);
    });

    it('skala nominal besar (miliaran rupiah) terhitung presisi', () => {
      const spent = 10000000000; // 10 Miliar
      const pct = 20; // 20%
      expect(calculateCostPerPercentUsage(spent, pct)).toBe(500000000);
    });
  });

  describe('Frontend: Reaktivitas Layout Grafik saat Window Diubah Ukurannya', () => {
    const mockDailyPoints: AiDailyCostPoint[] = [
      {
        date: '2026-10-21',
        label: '21 Okt',
        costIdr: 15000,
        costUsd: 0.95,
        tokens: 2100,
        executionCount: 5,
        successCount: 5,
        failedCount: 0,
      },
      {
        date: '2026-10-22',
        label: '22 Okt',
        costIdr: 45000,
        costUsd: 2.85,
        tokens: 6500,
        executionCount: 12,
        successCount: 11,
        failedCount: 1,
      },
      {
        date: '2026-10-23',
        label: '23 Okt',
        costIdr: 0,
        costUsd: 0,
        tokens: 0,
        executionCount: 0,
        successCount: 0,
        failedCount: 0,
      },
      {
        date: '2026-10-24',
        label: '24 Okt',
        costIdr: 80000,
        costUsd: 5.1,
        tokens: 12000,
        executionCount: 20,
        successCount: 20,
        failedCount: 0,
      },
    ];

    describe('Viewport Mobile (320px - 480px)', () => {
      const mobileWidths = [320, 375, 414, 480];

      it.each(mobileWidths)('menjaga usableWidth minimal dan koordinat bar valid pada width %ipx', (width) => {
        const layout = computeBarChartLayout(mockDailyPoints, width, 240);

        expect(layout.usableWidth).toBeGreaterThanOrEqual(100);
        expect(layout.usableHeight).toBe(240 - layout.padTop - layout.padBottom);
        expect(layout.bars).toHaveLength(mockDailyPoints.length);

        // Bar width minimal 4px agar tetap terlihat & bisa disentuh di layar kecil
        for (const bar of layout.bars) {
          expect(bar.width).toBeGreaterThanOrEqual(4);
          expect(bar.width).toBeLessThanOrEqual(36);
          expect(bar.x).toBeGreaterThanOrEqual(layout.padLeft);
          expect(bar.x + bar.width).toBeLessThanOrEqual(layout.padLeft + layout.usableWidth + 1);
        }
      });

      it('menjaga urutan koordinat X bar tetap strictly ascending di mobile', () => {
        const layout = computeBarChartLayout(mockDailyPoints, 375, 240);
        for (let i = 1; i < layout.bars.length; i++) {
          expect(layout.bars[i].x).toBeGreaterThan(layout.bars[i - 1].x);
        }
      });
    });

    describe('Viewport Layar Lebar / Desktop (768px - 1920px)', () => {
      const wideWidths = [768, 1024, 1440, 1920];

      it.each(wideWidths)('membatasi barWidth maksimal 36px agar proporsi visual elegan pada width %ipx', (width) => {
        const layout = computeBarChartLayout(mockDailyPoints, width, 240);

        expect(layout.usableWidth).toBe(width - layout.padLeft - layout.padRight);
        for (const bar of layout.bars) {
          // Tidak boleh meledak melebihi batas 36px pada layar ultrawide
          expect(bar.width).toBeLessThanOrEqual(36);
          expect(bar.width).toBeGreaterThanOrEqual(4);
        }
      });

      it('memposisikan batang di tengah slot (centered alignment) saat slotWidth melebar', () => {
        const layout = computeBarChartLayout(mockDailyPoints, 1440, 240);
        const slotWidth = layout.usableWidth / mockDailyPoints.length;

        layout.bars.forEach((bar, i) => {
          const expectedSlotStart = layout.padLeft + i * slotWidth;
          const expectedCenteredX = expectedSlotStart + (slotWidth - bar.width) / 2;
          expect(bar.x).toBeCloseTo(expectedCenteredX, 1);
        });
      });
    });

    describe('Tooltip & Axis Boundary Integrity', () => {
      it('persentase posisi tooltip selalu berada dalam rentang [0%, 100%]', () => {
        const testWidths = [320, 375, 480, 800, 1440, 1920];

        for (const w of testWidths) {
          const layout = computeBarChartLayout(mockDailyPoints, w, 240);
          for (const bar of layout.bars) {
            const tooltipRatio = (bar.x / layout.svgWidth) * 100;
            expect(tooltipRatio).toBeGreaterThan(0);
            expect(tooltipRatio).toBeLessThan(100);
          }
        }
      });

      it('menghasilkan 3 yTicks terformat dengan benar', () => {
        const layout = computeBarChartLayout(mockDailyPoints, 800, 240);
        expect(layout.yTicks).toHaveLength(3);
        expect(layout.yTicks[0].y).toBe(layout.padTop + 4);
        expect(layout.yTicks[2].y).toBe(layout.baselineY + 4);
        expect(layout.yTicks[2].label).toBe('Rp 0');
      });

      it('bar dengan cost 0 memiliki height 0 dan bar > 0 memiliki min height 4px', () => {
        const layout = computeBarChartLayout(mockDailyPoints, 800, 240);
        const zeroBar = layout.bars.find((b) => b.costIdr === 0);
        const positiveBar = layout.bars.find((b) => b.costIdr > 0);

        expect(zeroBar?.height).toBe(0);
        expect(positiveBar?.height).toBeGreaterThanOrEqual(4);
      });
    });

    describe('Reaktivitas Status Badge Budget (getBudgetUsageStatus)', () => {
      it('reaktif memetakan status sesuai persentase penggunaan anggaran', () => {
        expect(getBudgetUsageStatus(0).variant).toBe('slate');
        expect(getBudgetUsageStatus(0).text).toBe('Belum Terpakai');

        expect(getBudgetUsageStatus(25).variant).toBe('success');
        expect(getBudgetUsageStatus(25).text).toBe('Aman');
        expect(getBudgetUsageStatus(69.9).variant).toBe('success');

        expect(getBudgetUsageStatus(70).variant).toBe('warning');
        expect(getBudgetUsageStatus(70).text).toBe('Mendekati Batas');
        expect(getBudgetUsageStatus(90).variant).toBe('warning');

        expect(getBudgetUsageStatus(90.1).variant).toBe('error');
        expect(getBudgetUsageStatus(90.1).text).toBe('Kritis / Habis');
        expect(getBudgetUsageStatus(150).variant).toBe('error');
      });
    });
  });
});

