<script lang="ts">
  import { TrendingUp, Coins } from 'lucide-svelte';
  import { Card, Badge } from '@/components/ui';
  import { formatSmartIDR } from '@/lib/currency';
  import type { AiCostTrendsSummary } from '@/types/admin/ai-cost-trends.types';

  export let summary: AiCostTrendsSummary;
  export let budgetStatus: {
    variant: 'success' | 'warning' | 'error' | 'slate';
    text: string;
  };
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <!-- Card 1: Harga per 1% Usage (Highlight) -->
  <Card
    variant="bordered"
    radius="2xl"
    class="p-5 relative overflow-hidden bg-gradient-to-br from-indigo-50/50 via-card to-card dark:from-indigo-950/20 shadow-xs border-indigo-200/50 dark:border-indigo-900/50"
  >
    <div class="flex items-start justify-between gap-3">
      <div>
        <span class="text-2xs uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
          Harga per 1% Usage
        </span>
        <div class="flex items-baseline gap-2">
          <span class="text-heading-md font-mono font-black text-main">
            {formatSmartIDR(summary.costPerPercentUsageIdr)}
          </span>
          <span class="text-2xs font-semibold text-secondary">/ 1%</span>
        </div>
      </div>
      <div class="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
        <Coins size={18} />
      </div>
    </div>
    <div class="mt-3 pt-3 border-t border-light flex items-center justify-between text-2xs text-secondary">
      <span>Batas Deposit Bulanan</span>
      <span class="font-mono font-bold text-main">{formatSmartIDR(summary.monthlyDepositLimitIdr)}</span>
    </div>
  </Card>

  <!-- Card 2: Anggaran & Kuota Terpakai (%) -->
  <Card variant="bordered" radius="2xl" class="p-5 shadow-xs">
    <div class="flex items-start justify-between gap-3">
      <div>
        <span class="text-2xs uppercase tracking-wider font-bold text-muted block mb-1">
          Anggaran Terpakai
        </span>
        <div class="flex items-baseline gap-2">
          <span class="text-heading-md font-mono font-black text-main">
            {summary.budgetUsedPercentage}%
          </span>
        </div>
      </div>
      <Badge variant={budgetStatus.variant} size="sm" dot>
        <span>{budgetStatus.text}</span>
      </Badge>
    </div>

    <!-- Progress bar -->
    <div class="mt-3 w-full bg-nested rounded-full h-2 overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-500 {summary.budgetUsedPercentage > 90 ? 'bg-rose-500' : summary.budgetUsedPercentage > 70 ? 'bg-amber-500' : 'bg-indigo-600'}"
        style="width: {Math.min(100, Math.max(summary.budgetUsedPercentage > 0 ? 3 : 0, summary.budgetUsedPercentage))}%;"
      ></div>
    </div>

    <div class="mt-2.5 flex items-center justify-between text-2xs text-secondary">
      <span>Terpakai: {formatSmartIDR(summary.totalSpentIdr)}</span>
      <span>Sisa: {formatSmartIDR(summary.remainingDepositIdr)}</span>
    </div>
  </Card>

  <!-- Card 3: Rata-rata & Biaya Puncak Harian -->
  <Card variant="bordered" radius="2xl" class="p-5 shadow-xs">
    <div class="flex items-start justify-between gap-3">
      <div>
        <span class="text-2xs uppercase tracking-wider font-bold text-muted block mb-1">
          Rata-rata Harian
        </span>
        <div class="flex items-baseline gap-2">
          <span class="text-heading-md font-mono font-black text-main">
            {formatSmartIDR(summary.averageDailyCostIdr)}
          </span>
          <span class="text-2xs text-secondary font-medium">/ hari</span>
        </div>
      </div>
      <div class="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center shrink-0">
        <TrendingUp size={18} />
      </div>
    </div>
    <div class="mt-3 pt-3 border-t border-light flex items-center justify-between text-2xs text-secondary">
      <span>Biaya Tertinggi (Peak)</span>
      <span class="font-mono font-bold text-main">{formatSmartIDR(summary.peakDailyCostIdr)}</span>
    </div>
  </Card>
</div>
