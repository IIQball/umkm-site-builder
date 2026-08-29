<script lang="ts">
  import { X, CheckCircle2 } from 'lucide-svelte';
  import { formatIDR, formatPriceInput, parsePriceInput } from '@/lib/utils/format';
  import type { BankAccount } from '@/types';

  export let showModal = false;
  export let withdrawSuccess = false;
  export let bankAccount: BankAccount | null = null;
  export let balance = 0;
  export let availableBalance = 0;
  export let withdrawAmount = '';
  export let withdrawError = '';
  export let isWithdrawing = false;
  export let minPayoutLimit = 50000;
  export let onWithdraw: () => void = () => {};
  export let onClose: () => void = () => {};

  function handleInput(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    const rawVal = target.value;
    if (!rawVal) {
      withdrawAmount = '';
      return;
    }
    const cleanNum = parsePriceInput(rawVal);
    withdrawAmount = formatPriceInput(cleanNum);
  }

  $: parsedAmount = parsePriceInput(withdrawAmount);
  $: isConfirmDisabled = isWithdrawing || parsedAmount <= 0 || parsedAmount < minPayoutLimit || parsedAmount > availableBalance;

  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return {
      destroy() {
        if (node.parentNode) node.parentNode.removeChild(node);
      }
    };
  }
</script>

{#if showModal}
  <div use:portal class="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-card border border-light rounded-2xl p-6 max-w-sm w-full shadow-2xl relative z-10 animate-fade-in">
      {#if withdrawSuccess}
        <div class="text-center py-6 space-y-4">
          <div class="w-12 h-12 rounded-full bg-success/10 border border-success/20 text-success flex items-center justify-center mx-auto">
            <CheckCircle2 size={24} />
          </div>
          <div class="space-y-1">
            <h4 class="text-sm font-bold text-main">Permintaan Penarikan Dikirim</h4>
            <p class="text-xs text-secondary px-4">
              Dana sedang diproses dan akan masuk ke rekening {bankAccount?.bankName} ({bankAccount?.accountNumber}) Anda dalam 1-2 hari kerja.
            </p>
          </div>
          <button
            type="button"
            on:click={onClose}
            class="w-full bg-primary hover:bg-primary-dark text-xs font-bold text-white rounded-xl py-2.5 px-6 transition-all cursor-pointer active:scale-[0.98]"
          >
            Selesai
          </button>
        </div>
      {:else}
        <div class="space-y-4">
          <div class="flex justify-between items-center pb-2 border-b border-light">
            <h3 class="text-heading-md font-bold text-main m-0">Tarik Dana</h3>
            <button type="button" on:click={onClose} class="text-muted hover:text-main flex items-center cursor-pointer p-1">
              <X size={16} />
            </button>
          </div>

          <div class="grid grid-cols-2 gap-3 bg-nested border border-light rounded-xl p-3 text-center">
            <div class="space-y-0.5">
              <span class="text-label-caps text-muted block">Saldo Aktif</span>
              <p class="text-xs font-black text-main font-mono">{formatIDR(balance)}</p>
            </div>
            <div class="space-y-0.5 border-l border-light">
              <span class="text-label-caps text-success block">Siap Tarik</span>
              <p class="text-xs font-black text-success font-mono">{formatIDR(availableBalance)}</p>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="block text-label-caps text-muted mb-1.5" for="input-amount">Nominal Penarikan</label>
            <div class="relative">
              <span class="absolute left-3.5 top-3 text-xs font-bold text-muted">Rp</span>
              <input
                id="input-amount"
                type="text"
                placeholder="0"
                value={withdrawAmount}
                on:input={handleInput}
                disabled={isWithdrawing}
                class="w-full bg-nested border border-light rounded-xl pl-9 pr-3 py-2.5 text-xs text-main font-mono outline-none focus:border-primary font-bold transition-all focus:ring-1 focus:ring-primary/20"
              />
            </div>
            
            <div class="flex gap-2 pt-1">
              <button
                type="button"
                on:click={() => withdrawAmount = formatPriceInput(Math.floor(availableBalance * 0.5))}
                class="text-xs font-bold bg-nested border border-light text-secondary px-3 py-1.5 rounded-lg hover:bg-nested/80 cursor-pointer transition-colors active:scale-[0.98]"
              >
                50%
              </button>
              <button
                type="button"
                on:click={() => withdrawAmount = formatPriceInput(availableBalance)}
                class="text-xs font-bold bg-nested border border-light text-secondary px-3 py-1.5 rounded-lg hover:bg-nested/80 cursor-pointer transition-colors active:scale-[0.98]"
              >
                100%
              </button>
            </div>
            
            {#if withdrawError}
              <p class="text-xs font-semibold text-error mt-1">{withdrawError}</p>
            {/if}
          </div>

          <div class="flex gap-2 pt-2">
            <button
              type="button"
              on:click={onClose}
              disabled={isWithdrawing}
              class="flex-1 bg-nested hover:bg-nested/80 text-xs font-bold text-secondary rounded-xl py-2.5 px-3 transition-colors border border-light cursor-pointer active:scale-[0.98] disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="button"
              on:click={onWithdraw}
              disabled={isConfirmDisabled}
              class="flex-1 bg-primary hover:bg-primary-dark disabled:bg-nested disabled:text-muted disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold text-white rounded-xl py-2.5 px-3 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              {#if isWithdrawing}
                <span class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Memproses...
              {:else}
                Konfirmasi
              {/if}
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}
