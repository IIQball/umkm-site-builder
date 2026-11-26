<script lang="ts">
  import { StatCard } from '@/components/ui';
  import { formatSmartIDR, formatIDR } from '@/lib/currency';
  import type { AiCostTrendsSummary } from '@/types/admin/ai-cost-trends.types';

  export let summary: AiCostTrendsSummary;
  export let budgetStatus: {
    variant: 'success' | 'warning' | 'error' | 'slate';
    text: string;
  };
  export let isMonthlyView: boolean = false;
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <!-- Card 1: Nilai Biaya per 1% Kuota Deposit -->
  <StatCard
    label="BIAYA PER 1% KUOTA"
    value={formatSmartIDR(summary.costPerPercentUsageIdr)}
    rawValue={summary.costPerPercentUsageIdr}
    valueSuffix="/ 1%"
    icon="payments"
    cardTheme="default"
    badge="Unit Kuota"
    footerText={`Limit Deposit: ${formatIDR(summary.monthlyDepositLimitIdr)}`}
    delayClass="delay-75"
  />

  <!-- Card 2: Anggaran Terpakai (%) -->
  <StatCard
    label="ANGGARAN TERPAKAI"
    value={`${summary.budgetUsedPercentage}%`}
    rawValue={summary.budgetUsedPercentage}
    icon="pie_chart"
    cardTheme="default"
    badge={budgetStatus.text}
    badgeCls={budgetStatus.variant === 'error'
      ? '!text-error !border-error/20'
      : budgetStatus.variant === 'warning'
        ? '!text-warning !border-warning/20'
        : '!text-success !border-success/20'}
    footerText={`Terpakai: ${formatIDR(summary.totalSpentIdr)} • Sisa: ${formatIDR(summary.remainingDepositIdr)}`}
    delayClass="delay-100"
  />

  <!-- Card 3: Rata-rata Harian / Bulanan (Bukan Fluktuasi) -->
  <StatCard
    label={isMonthlyView ? "RATA-RATA BULANAN" : "RATA-RATA HARIAN"}
    value={formatSmartIDR(summary.averageDailyCostIdr)}
    rawValue={summary.averageDailyCostIdr}
    valueSuffix={isMonthlyView ? "/ bulan" : "/ hari"}
    icon="trending_up"
    cardTheme="default"
    badge="Rata-rata"
    footerText={`Biaya Tertinggi: ${formatIDR(summary.peakDailyCostIdr)}`}
    delayClass="delay-150"
  />
</div>
