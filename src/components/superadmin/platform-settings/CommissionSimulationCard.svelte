<script lang="ts">
  import { formatCurrency } from '@/lib/utils';
  import { Button } from '@/components/ui';

  export let platformFeePercentage: number = 30;
  export let designerShare: number = 70;
  export let samplePrice: number = 100000;
  export let samplePlatformFee: number = 30000;
  export let sampleDesignerShare: number = 70000;
  export let onSelectRatio: (val: number) => void;
</script>

<div class="p-6 rounded-3xl bg-nested/70 border border-light space-y-4 shadow-2xs">
  <div class="flex items-center justify-between">
    <span class="text-xs font-bold font-heading uppercase tracking-wider text-muted">
      Rasio Pembagian Komisi
    </span>
    <div class="flex items-center gap-2">
      <Button
        size="xs"
        variant={platformFeePercentage === 20 ? 'secondary' : 'ghost'}
        class="!rounded-full !px-3 !py-1 !h-auto !min-h-0 text-xs font-bold {platformFeePercentage === 20 ? 'bg-card text-main border-slate-400 dark:border-slate-500 shadow-2xs' : 'bg-card text-secondary border-light hover:text-main'}"
        on:click={() => onSelectRatio(20)}
      >
        20% / 80%
      </Button>
      <Button
        size="xs"
        variant={platformFeePercentage === 30 ? 'secondary' : 'ghost'}
        class="!rounded-full !px-3 !py-1 !h-auto !min-h-0 text-xs font-bold {platformFeePercentage === 30 ? 'bg-card text-main border-slate-400 dark:border-slate-500 shadow-2xs' : 'bg-card text-secondary border-light hover:text-main'}"
        on:click={() => onSelectRatio(30)}
      >
        30% / 70% (Standar)
      </Button>
      <Button
        size="xs"
        variant={platformFeePercentage === 40 ? 'secondary' : 'ghost'}
        class="!rounded-full !px-3 !py-1 !h-auto !min-h-0 text-xs font-bold {platformFeePercentage === 40 ? 'bg-card text-main border-slate-400 dark:border-slate-500 shadow-2xs' : 'bg-card text-secondary border-light hover:text-main'}"
        on:click={() => onSelectRatio(40)}
      >
        40% / 60%
      </Button>
    </div>
  </div>

  <div class="h-3.5 w-full bg-nested border border-light rounded-full overflow-hidden flex shadow-inner">
    <div
      class="bg-primary h-full transition-all duration-300 relative group"
      style="width: {platformFeePercentage}%"
    ></div>
    <div
      class="bg-emerald-500 h-full transition-all duration-300 relative group"
      style="width: {designerShare}%"
    ></div>
  </div>

  <div class="flex items-center justify-between text-xs font-bold font-heading pt-1">
    <span class="text-primary flex items-center gap-1.5 font-sans">
      <span class="w-2 h-2 rounded-full bg-primary"></span>
      Fee Platform: {platformFeePercentage}%
    </span>
    <span class="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-sans">
      <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
      Hak Desainer: {designerShare}%
    </span>
  </div>

  <div class="pt-3 text-xs text-secondary flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-light/60 font-sans">
    <span>Simulasi penjualan template <strong>{formatCurrency(samplePrice)}</strong>:</span>
    <div class="flex items-center gap-3 font-mono font-bold">
      <span class="text-primary">Platform: {formatCurrency(samplePlatformFee)}</span>
      <span class="text-muted">•</span>
      <span class="text-emerald-600 dark:text-emerald-400">Desainer: {formatCurrency(sampleDesignerShare)}</span>
    </div>
  </div>
</div>
