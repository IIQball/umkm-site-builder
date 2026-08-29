<script lang="ts">
  import { CheckCircle2 } from 'lucide-svelte';
  import { formatIDR, formatPriceInput, parsePriceInput } from '@/lib/utils/format';
  import type { BankAccount } from '@/types';
  import { Modal, Button, Input } from '@/components/ui';

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
</script>

<Modal
  bind:open={showModal}
  title={withdrawSuccess ? '' : 'Tarik Dana'}
  size="sm"
  on:close={onClose}
>
  {#if withdrawSuccess}
    <div class="text-center py-4 space-y-4">
      <div class="w-12 h-12 rounded-full bg-success/10 border border-success/20 text-success flex items-center justify-center mx-auto shadow-2xs">
        <CheckCircle2 size={24} />
      </div>
      <div class="space-y-1">
        <h4 class="text-sm font-bold text-main font-heading">Permintaan Penarikan Dikirim</h4>
        <p class="text-xs text-secondary px-2 leading-relaxed">
          Dana sedang diproses dan akan masuk ke rekening {bankAccount?.bankName} ({bankAccount?.accountNumber}) Anda dalam 1-2 hari kerja.
        </p>
      </div>
      <Button
        variant="primary"
        fullWidth
        on:click={onClose}
      >
        Selesai
      </Button>
    </div>
  {:else}
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-3 bg-nested border border-light rounded-2xl p-3 text-center">
        <div class="space-y-0.5">
          <span class="text-label-caps text-muted block">Saldo Aktif</span>
          <p class="text-xs font-black text-main font-mono">{formatIDR(balance)}</p>
        </div>
        <div class="space-y-0.5 border-l border-light">
          <span class="text-label-caps text-success block">Siap Tarik</span>
          <p class="text-xs font-black text-success font-mono">{formatIDR(availableBalance)}</p>
        </div>
      </div>

      <div class="space-y-2">
        <Input
          label="Nominal Penarikan"
          placeholder="0"
          value={withdrawAmount}
          on:input={handleInput}
          disabled={isWithdrawing}
          error={withdrawError}
          className="font-mono font-bold"
        >
          <span slot="prefix" class="text-xs font-bold text-muted select-none">Rp</span>
        </Input>
        
        <div class="flex gap-2 pt-1">
          <button
            type="button"
            on:click={() => withdrawAmount = formatPriceInput(Math.floor(availableBalance * 0.5))}
            class="text-xs font-bold bg-nested border border-light text-secondary px-3 py-1.5 rounded-xl hover:bg-nested/80 cursor-pointer transition-colors active:scale-[0.98] font-heading"
          >
            50%
          </button>
          <button
            type="button"
            on:click={() => withdrawAmount = formatPriceInput(availableBalance)}
            class="text-xs font-bold bg-nested border border-light text-secondary px-3 py-1.5 rounded-xl hover:bg-nested/80 cursor-pointer transition-colors active:scale-[0.98] font-heading"
          >
            100%
          </button>
        </div>
      </div>
    </div>
  {/if}

  <svelte:fragment slot="footer">
    {#if !withdrawSuccess}
      <Button
        variant="secondary"
        size="sm"
        disabled={isWithdrawing}
        on:click={onClose}
      >
        Batal
      </Button>
      <Button
        variant="primary"
        size="sm"
        disabled={isConfirmDisabled}
        loading={isWithdrawing}
        on:click={onWithdraw}
      >
        Konfirmasi
      </Button>
    {/if}
  </svelte:fragment>
</Modal>

