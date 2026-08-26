<script lang="ts">
  import { formatIDR } from '@/lib/utils/format';
  import { X, Loader2, ArrowRight, ArrowDownLeft, Landmark } from 'lucide-svelte';
  import type { BankAccount } from '@/types/finance';

  export let availableBalance: number;
  export let bankAccount: BankAccount | null;
  export let isOpen: boolean;
  export let onClose: () => void;
  export let onWithdraw: (amount: number) => Promise<void>;

  let withdrawAmount = '';
  let withdrawError = '';
  let isSubmitting = false;

  $: numericAmount = parseInt(String(withdrawAmount).replace(/[^0-9]/g, ''), 10) || 0;

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  }

  function setAmount(amt: number) {
    withdrawAmount = String(Math.min(amt, availableBalance));
    withdrawError = '';
  }

  async function handleWithdraw() {
    if (numericAmount < 50000) {
      withdrawError = 'Jumlah penarikan minimal Rp 50.000';
      return;
    }
    if (numericAmount > availableBalance) {
      withdrawError = 'Jumlah penarikan melebihi saldo tersedia';
      return;
    }
    if (!bankAccount) {
      withdrawError = 'Rekening bank tujuan belum dipilih/diatur';
      return;
    }

    isSubmitting = true;
    withdrawError = '';
    try {
      await onWithdraw(numericAmount);
      withdrawAmount = '';
      onClose();
    } catch (e: any) {
      withdrawError = e.message || 'Gagal memproses penarikan';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
  <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
    <div
      class="bg-card border border-light w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5 animate-scale-in"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-center justify-between border-b border-light pb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <ArrowDownLeft size={16} />
          </div>
          <h3 class="font-bold text-sm text-main">Tarik Saldo Komisi</h3>
        </div>
        <button
          type="button"
          on:click={onClose}
          class="p-1 rounded-lg text-muted hover:text-main hover:bg-nested transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      <div class="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
        <span class="text-xs text-secondary font-medium">Saldo Siap Ditarik (Eligible)</span>
        <h4 class="text-2xl font-black text-primary">{formatIDR(availableBalance)}</h4>
      </div>

      {#if withdrawError}
        <div class="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-medium">
          {withdrawError}
        </div>
      {/if}

      <div class="space-y-4 text-xs">
        <div>
          <label for="payout-amount-input" class="block font-semibold text-main mb-1.5">Nominal Penarikan (Rp)</label>
          <div class="relative">
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-muted text-xs">Rp</span>
            <input
              id="payout-amount-input"
              type="number"
              bind:value={withdrawAmount}
              placeholder="Minimal 50.000"
              min="50000"
              max={availableBalance}
              class="w-full pl-10 pr-3.5 py-2.5 bg-nested border border-light rounded-xl font-mono text-sm font-bold text-main placeholder:font-normal placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <!-- Quick amount buttons -->
          <div class="flex items-center gap-1.5 mt-2 flex-wrap">
            {#each [50000, 100000, 250000, 500000] as chipAmount}
              {#if chipAmount <= availableBalance}
                <button
                  type="button"
                  on:click={() => setAmount(chipAmount)}
                  class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-nested border border-light text-secondary hover:text-primary hover:border-primary/40 transition-colors cursor-pointer"
                >
                  {formatIDR(chipAmount)}
                </button>
              {/if}
            {/each}
            {#if availableBalance >= 50000}
              <button
                type="button"
                on:click={() => setAmount(availableBalance)}
                class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
              >
                Semua Saldo
              </button>
            {/if}
          </div>
        </div>

        {#if bankAccount}
          <div class="p-3.5 rounded-xl bg-nested border border-light text-xs space-y-1">
            <div class="flex items-center gap-1.5 text-muted font-medium text-[11px]">
              <Landmark size={13} />
              <span>Rekening Tujuan Pencairan:</span>
            </div>
            <p class="font-bold text-main">{bankAccount.bankName} - {bankAccount.accountNumber}</p>
            <p class="text-[11px] text-secondary font-medium uppercase">{bankAccount.holderName || bankAccount.accountHolder || '-'}</p>
          </div>
        {:else}
          <div class="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl text-xs">
            Belum ada rekening bank yang tersimpan. Harap simpan rekening bank terlebih dahulu.
          </div>
        {/if}
      </div>

      <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-light">
        <button
          type="button"
          on:click={onClose}
          class="px-4 py-2 rounded-xl text-xs font-semibold bg-nested text-secondary hover:text-main hover:bg-nested/80 transition-colors cursor-pointer"
        >
          Batal
        </button>
        <button
          type="button"
          on:click={handleWithdraw}
          disabled={isSubmitting || !bankAccount || availableBalance < 50000 || numericAmount < 50000 || numericAmount > availableBalance}
          class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
        >
          {#if isSubmitting}
            <Loader2 size={14} class="animate-spin" />
          {/if}
          <span>Ajukan Penarikan</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  </div>
{/if}
