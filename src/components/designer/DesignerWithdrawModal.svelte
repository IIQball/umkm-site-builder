<script lang="ts">
  import { CheckCircle2 } from 'lucide-svelte';
  import { formatIDR, formatPriceInput, parsePriceInput } from '@/lib/utils/format';
  import type { BankAccount } from '@/types';
  import { Modal, Button, Input } from '@/components/ui';

  export let showModal = false;
  export let withdrawSuccess = false;
  export let bankAccount: BankAccount | null = null;
  export let bankAccounts: BankAccount[] = [];
  export let selectedBankAccountId = '';
  export let balance = 0;
  export let availableBalance = 0;
  export let withdrawAmount = '';
  export let withdrawError = '';
  export let isWithdrawing = false;
  export let minPayoutLimit = 50000;
  export let onWithdraw: (targetAccountId: string) => void = () => {};
  export let onClose: () => void = () => {};

  $: accountsList = bankAccounts.length > 0 ? bankAccounts : (bankAccount ? [bankAccount] : []);
  $: activeAccount = accountsList.find((a) => a.id === selectedBankAccountId) || accountsList[0] || null;

  $: if (showModal && accountsList.length > 0 && !selectedBankAccountId) {
    const primary = accountsList.find((a) => a.isPrimary) || accountsList[0];
    selectedBankAccountId = primary?.id || '';
  }

  function handleInputChange(e: CustomEvent<Event> | Event) {
    const detail = (e as CustomEvent).detail;
    const target = (detail?.target || e.target) as HTMLInputElement | null;
    const rawVal = target ? target.value : withdrawAmount;

    if (!rawVal) {
      withdrawAmount = '';
      return;
    }

    const cleanDigits = String(rawVal).replace(/\D/g, '');
    if (!cleanDigits) {
      withdrawAmount = '';
      return;
    }

    const num = Number(cleanDigits);
    withdrawAmount = formatPriceInput(num);
  }

  function setPresetAmount(ratio: number) {
    const amount = Math.floor(availableBalance * ratio);
    withdrawAmount = formatPriceInput(amount);
  }

  $: parsedAmount = parsePriceInput(withdrawAmount);
  $: isAmountTooLow = parsedAmount > 0 && parsedAmount < minPayoutLimit;
  $: isAmountTooHigh = parsedAmount > availableBalance;
  $: validationMessage = isAmountTooLow
    ? `Nominal minimal penarikan adalah ${formatIDR(minPayoutLimit)}`
    : isAmountTooHigh
    ? `Nominal melebihi saldo siap dicairkan (${formatIDR(availableBalance)})`
    : withdrawError;
  $: isConfirmDisabled =
    isWithdrawing ||
    !activeAccount ||
    !withdrawAmount ||
    parsedAmount <= 0 ||
    parsedAmount < minPayoutLimit ||
    parsedAmount > availableBalance;
</script>

<Modal bind:open={showModal} size="sm" on:close={onClose}>
  <svelte:fragment slot="header">
    {#if !withdrawSuccess}
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-orange/15 border border-orange/25 text-orange flex items-center justify-center flex-shrink-0 shadow-2xs">
          <span class="material-symbols-outlined text-lg">payments</span>
        </div>
        <div>
          <h3 class="text-base font-extrabold text-main font-heading leading-tight">
            Tarik Dana Saldo
          </h3>
          <p class="text-2xs text-muted mt-0.5">
            Transfer instan ke 1 rekening tujuan terpilih
          </p>
        </div>
      </div>
    {/if}
  </svelte:fragment>

  {#if withdrawSuccess}
    <div class="text-center py-4 space-y-4">
      <div class="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-2xs">
        <CheckCircle2 size={28} />
      </div>
      <div class="space-y-1">
        <h4 class="text-base font-extrabold text-main font-heading">Permintaan Penarikan Terkirim</h4>
        <p class="text-xs text-secondary px-2 leading-relaxed font-sans">
          Dana penarikan sedang diproses otomatis dan akan segera masuk ke rekening{' '}
          <strong class="text-main">
            {activeAccount?.bankName} ({activeAccount?.accountNumber})
          </strong>{' '}
          a.n.{' '}
          <strong class="text-main">
            {activeAccount?.accountHolder || activeAccount?.holderName}
          </strong>.
        </p>
      </div>
      <div class="pt-2">
        <Button
          variant="orange"
          size="md"
          className="w-full justify-center font-bold"
          on:click={onClose}
        >
          Selesai
        </Button>
      </div>
    </div>
  {:else}
    <div class="space-y-4">
      <!-- Balance Status Bar -->
      <div class="grid grid-cols-2 gap-3 bg-slate-900 text-white rounded-2xl p-3.5 text-center shadow-sm">
        <div class="space-y-0.5">
          <span class="text-[10px] text-white/60 font-bold uppercase tracking-wider font-heading block">Total Saldo</span>
          <p class="text-xs sm:text-sm font-black text-white font-mono">{formatIDR(balance)}</p>
        </div>
        <div class="space-y-0.5 border-l border-white/15">
          <span class="text-[10px] text-orange-light font-bold uppercase tracking-wider font-heading block">Siap Dicairkan</span>
          <p class="text-xs sm:text-sm font-black text-orange-light font-mono">{formatIDR(availableBalance)}</p>
        </div>
      </div>

      <!-- Pilih 1 Rekening Tujuan: Sekali tarik hanya bisa ke 1 nomor rekening -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-main font-heading block">
            Rekening Bank Tujuan (1 Rekening)
          </span>
          <span class="text-3xs font-bold text-orange bg-orange/10 px-2 py-0.5 rounded-full">
            1 Penarikan = 1 Rekening
          </span>
        </div>

        {#if accountsList.length > 1}
          <div class="space-y-2">
            {#each accountsList as acc}
              <label
                class="flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all {selectedBankAccountId === acc.id ? 'border-orange bg-orange/5 ring-1 ring-orange/30 shadow-2xs' : 'border-light bg-card hover:bg-nested/60'}"
              >
                <div class="flex items-center gap-3">
                  <input
                    type="radio"
                    name="destination_bank_account"
                    value={acc.id}
                    checked={selectedBankAccountId === acc.id}
                    on:change={() => (selectedBankAccountId = acc.id)}
                    class="text-orange focus:ring-orange h-4 w-4 cursor-pointer"
                  />
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-bold text-main font-mono">{acc.bankName}</span>
                      {#if acc.isPrimary}
                        <span class="text-3xs font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          Utama
                        </span>
                      {/if}
                    </div>
                    <p class="text-2xs font-mono text-secondary mt-0.5">
                      •••• {acc.accountNumber.slice(-4)} &bull; {acc.accountHolder || acc.holderName}
                    </p>
                  </div>
                </div>
                {#if selectedBankAccountId === acc.id}
                  <span class="material-symbols-outlined text-orange text-base">check_circle</span>
                {/if}
              </label>
            {/each}
          </div>
        {:else if activeAccount}
          <div class="p-3 bg-nested/80 border border-light rounded-2xl flex items-center justify-between">
            <div>
              <span class="text-3xs text-muted uppercase font-bold tracking-wider block">Rekening Terdaftar</span>
              <span class="text-xs font-bold font-mono text-main">{activeAccount.bankName} ({activeAccount.accountNumber})</span>
              <p class="text-2xs text-secondary font-mono mt-0.5">{activeAccount.accountHolder || activeAccount.holderName}</p>
            </div>
            <span class="text-3xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
              Terverifikasi
            </span>
          </div>
        {/if}
      </div>

      <!-- Nominal Input -->
      <div class="space-y-2">
        <Input
          label="Nominal Penarikan"
          placeholder="0"
          bind:value={withdrawAmount}
          on:input={handleInputChange}
          disabled={isWithdrawing}
          error={validationMessage}
          className="font-mono font-bold text-base"
        >
          <span slot="prefix" class="text-xs font-bold text-muted select-none">Rp</span>
        </Input>

        <div class="flex items-center justify-between gap-2 pt-1">
          <div class="flex gap-2">
            <button
              type="button"
              on:click={() => setPresetAmount(0.5)}
              class="text-xs font-bold bg-nested border border-light text-main hover:bg-slate-900 hover:text-white dark:hover:bg-primary px-3.5 py-1.5 rounded-xl cursor-pointer transition-all active:scale-[0.98] font-heading shadow-2xs"
            >
              50%
            </button>
            <button
              type="button"
              on:click={() => setPresetAmount(1.0)}
              class="text-xs font-bold bg-nested border border-light text-main hover:bg-orange hover:text-white dark:hover:bg-orange px-3.5 py-1.5 rounded-xl cursor-pointer transition-all active:scale-[0.98] font-heading shadow-2xs"
            >
              100% (Semua)
            </button>
          </div>
          <span class="text-3xs text-muted font-mono font-bold">Min: {formatIDR(minPayoutLimit)}</span>
        </div>
      </div>
    </div>
  {/if}

  <svelte:fragment slot="footer">
    {#if !withdrawSuccess}
      <Button variant="secondary" size="sm" disabled={isWithdrawing} on:click={onClose}>
        Batal
      </Button>
      <Button
        variant="orange"
        size="sm"
        disabled={isConfirmDisabled}
        loading={isWithdrawing}
        on:click={() => onWithdraw(selectedBankAccountId || activeAccount?.id || '')}
      >
        <span class="material-symbols-outlined text-sm">payments</span>
        <span>Konfirmasi Penarikan</span>
      </Button>
    {/if}
  </svelte:fragment>
</Modal>
