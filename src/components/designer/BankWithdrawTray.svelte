<script lang="ts">
  import { formatIDR } from '@/lib/utils/format';
  import { Button } from '@/components/ui';
  import type { BankAccount } from '@/types';

  export let availableBalance: number = 0;
  export let balance: number = 0;
  export let minPayoutLimit: number = 50000;
  export let settlementDelayDays: number = 7;
  export let activeAccount: BankAccount | null = null;
  export let isLoading: boolean = false;
  export let onOpenWithdrawModal: () => void = () => {};
</script>

<div class="mt-4 p-5 sm:p-6 rounded-3xl bg-card border border-light shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
  <div class="space-y-1">
    <div class="flex items-center gap-2">
      <span class="text-xs font-bold uppercase tracking-wider text-secondary font-heading">
        Saldo Siap Dicairkan
      </span>
      <span class="text-2xs font-mono text-muted bg-nested border border-light px-2 py-0.5 rounded-full">
        Min: {formatIDR(minPayoutLimit)}
      </span>
    </div>

    <p class="text-2xl sm:text-3xl font-black font-mono text-main tracking-tight leading-none">
      {formatIDR(availableBalance)}
    </p>

    <p class="text-2xs text-secondary font-sans mt-0.5">
      {#if availableBalance >= minPayoutLimit}
        Saldo memenuhi batas penarikan dan siap ditransfer ke rekening bank terpilih.
      {:else if availableBalance > 0}
        Belum mencapai batas minimum penarikan ({formatIDR(minPayoutLimit)})
      {:else}
        Tidak ada saldo siap tarik saat ini
      {/if}
    </p>

    {#if availableBalance === 0 && balance > 0}
      <p class="text-2xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">
        * Saldo <strong>{formatIDR(balance)}</strong> dalam masa hold ({settlementDelayDays} hari).
      </p>
    {/if}
  </div>

  <div class="flex-shrink-0">
    <Button
      variant="orange"
      size="md"
      className="w-full sm:w-auto shadow-lg shadow-orange-500/25 px-6 font-bold"
      disabled={!activeAccount || availableBalance < minPayoutLimit || isLoading}
      on:click={onOpenWithdrawModal}
    >
      <span class="material-symbols-outlined text-lg">payments</span>
      <span>
        {#if availableBalance >= minPayoutLimit}
          Tarik {formatIDR(availableBalance)}
        {:else}
          Tarik Dana
        {/if}
      </span>
    </Button>
  </div>
</div>
