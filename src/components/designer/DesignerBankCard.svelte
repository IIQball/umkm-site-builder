<script lang="ts">
  import { Building2, Plus, Star, Trash2 } from 'lucide-svelte';
  import { formatIDR } from '@/lib/utils/format';
  import { Button } from '@/components/ui';
  import { getBankBrandConfig } from './bankBranding.helpers';
  import BankCardOrnament from './BankCardOrnament.svelte';
  import BankActionConfirmModal from './BankActionConfirmModal.svelte';
  import type { BankAccount } from '@/types';

  export let bankAccount: BankAccount | null = null;
  export let bankAccounts: BankAccount[] = [];
  export let selectedAccountId: string = '';
  export let isLoading: boolean = false;
  export let balance: number = 0;
  export let availableBalance: number = 0;
  export let minPayoutLimit: number = 50000;
  export let settlementDelayDays: number = 7;
  export let showWithdrawSection: boolean = true;
  export let onOpenBankModal: () => void;
  export let onOpenWithdrawModal: () => void = () => {};
  export let onSetPrimary: (accountId: string) => void = () => {};
  export let onDeleteAccount: (accountId: string) => void = () => {};
  export let onSelectAccount: (accountId: string) => void = () => {};

  let showConfirmModal = false;
  let confirmType: 'set-primary' | 'delete' = 'set-primary';
  let targetActionAccount: BankAccount | null = null;

  $: accountsList = bankAccounts.length > 0 ? bankAccounts : (bankAccount ? [bankAccount] : []);
  $: activeAccount = accountsList.find((a) => a.id === selectedAccountId) || accountsList[0] || null;

  $: resolvedHolderName = (
    activeAccount?.accountHolder ||
    activeAccount?.holderName ||
    (activeAccount as any)?.accountHolderName ||
    'Belum Diatur'
  ).toUpperCase();

  $: brandConfig = getBankBrandConfig(activeAccount?.bankName || activeAccount?.bankCode);

  $: lastFourDigits =
    activeAccount?.accountNumber && activeAccount.accountNumber.length > 4
      ? activeAccount.accountNumber.slice(-4)
      : activeAccount?.accountNumber || '••••';

  const triggerSetPrimaryModal = (acc: BankAccount) => {
    targetActionAccount = acc; confirmType = 'set-primary'; showConfirmModal = true;
  };
  const triggerDeleteModal = (acc: BankAccount) => {
    targetActionAccount = acc; confirmType = 'delete'; showConfirmModal = true;
  };

  const handleConfirmAction = () => {
    if (!targetActionAccount) return;
    if (confirmType === 'set-primary') {
      onSetPrimary(targetActionAccount.id);
    } else {
      onDeleteAccount(targetActionAccount.id);
    }
    showConfirmModal = false;
  };
</script>

<div class="h-full flex flex-col">
  <!-- Multiple Accounts Switcher Bar -->
  {#if accountsList.length > 0}
    <div class="flex items-center justify-between gap-2 mb-3 px-1">
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
        {#each accountsList as acc}
          <button
            type="button"
            class="px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 {activeAccount?.id === acc.id ? 'bg-orange text-white shadow-xs' : 'bg-card border border-light text-secondary hover:text-main hover:bg-nested/60'}"
            on:click={() => onSelectAccount(acc.id)}
          >
            <span>{acc.bankName}</span>
            <span class="text-3xs opacity-80">••{acc.accountNumber.slice(-4)}</span>
            {#if acc.isPrimary}
              <span class="text-3xs font-black bg-white/20 px-1 py-0.2 rounded-xs">Utama</span>
            {/if}
          </button>
        {/each}
      </div>

      <div class="flex items-center gap-2 flex-shrink-0">
        <span class="text-3xs font-mono font-bold px-2 py-0.5 rounded-full bg-nested border border-light text-secondary">
          {accountsList.length}/3 Rekening
        </span>
        {#if accountsList.length < 3}
          <button
            type="button"
            class="px-2.5 py-1 rounded-xl text-xs font-bold text-orange border border-dashed border-orange/40 hover:bg-orange/10 transition-all flex items-center gap-1 cursor-pointer"
            title="Tambah Rekening Bank Baru (Maks. 3)"
            on:click={onOpenBankModal}
          >
            <Plus size={13} />
            <span>Tambah</span>
          </button>
        {/if}
      </div>
    </div>
  {/if}

  {#if isLoading && accountsList.length === 0}
    <div class="h-full bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center animate-pulse space-y-4 shadow-xl flex flex-col justify-center">
      <div class="h-8 bg-slate-900 rounded-xl w-1/4 mx-auto"></div>
      <div class="h-6 bg-slate-900 rounded-lg w-1/2 mx-auto"></div>
      <div class="h-12 bg-slate-900 rounded-2xl w-1/3 mx-auto mt-4"></div>
    </div>
  {:else if activeAccount}
    <div class="relative flex-1 min-h-[300px] flex flex-col justify-between overflow-hidden rounded-3xl {brandConfig.gradientClass} border {brandConfig.borderClass} p-6 sm:p-8 text-white shadow-2xl shadow-black/40 group transition-all duration-300">
      <!-- Dynamic Ambient Glows -->
      <div class="absolute -right-16 -top-16 w-60 h-60 rounded-full {brandConfig.glowClass} blur-3xl pointer-events-none"></div>
      <div class="absolute -left-12 -bottom-12 w-52 h-52 rounded-full {brandConfig.glowClass} blur-2xl pointer-events-none opacity-60"></div>
      <div class="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:18px_18px] opacity-20 pointer-events-none"></div>

      <!-- Bank Ornament Vector -->
      <BankCardOrnament bankCode={activeAccount.bankName || activeAccount.bankCode} />

      <div class="relative z-10 flex flex-col justify-between h-full">
        <div>
          <!-- Top Row: Chip + Bank Logo & Actions -->
          <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div class="flex items-center gap-3">
              <!-- Smart Chip Visual -->
              <div class="w-12 h-9 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 border border-amber-300/60 shadow-sm relative overflow-hidden flex items-center justify-center flex-shrink-0">
                <div class="w-full h-full border border-amber-900/30 rounded-[3px] grid grid-cols-2 gap-0.5 opacity-70">
                  <div class="border-r border-b border-amber-900/40"></div>
                  <div class="border-b border-amber-900/40"></div>
                  <div class="border-r border-amber-900/40"></div>
                  <div></div>
                </div>
              </div>

              <!-- Contactless Symbol -->
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white/70">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1.5-2.5" />
                <path d="M5.5 17.5A6.5 6.5 0 0 0 12 11c0-3.59-1.5-5.5-4-6.5" />
                <path d="M2.5 20.5A10.5 10.5 0 0 0 13 10c0-5.8-2.5-9-6.5-10.5" />
              </svg>

              {#if activeAccount.isPrimary}
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-3xs font-extrabold uppercase tracking-wide bg-amber-400/20 text-amber-300 border border-amber-400/30 backdrop-blur-xs">
                  <Star size={10} class="fill-amber-300 text-amber-300" />
                  <span>Rekening Utama</span>
                </span>
              {/if}
            </div>

            <div class="flex items-center gap-2">
              {#if brandConfig.logoPath}
                <img
                  src={brandConfig.logoPath}
                  alt={brandConfig.name}
                  class="h-10 sm:h-12 w-auto max-w-[120px] object-contain rounded-lg shadow-sm drop-shadow-xs"
                />
              {:else}
                <div class="inline-flex items-center {brandConfig.badgeClass} border px-3 py-1 rounded-full text-xs font-black font-mono uppercase">
                  <span>{brandConfig.name || activeAccount.bankName}</span>
                </div>
              {/if}

              <!-- Account Actions: Trigger Modal from components/ui -->
              {#if !activeAccount.isPrimary}
                <button
                  type="button"
                  class="px-2.5 py-1 rounded-full text-3xs font-bold text-white border border-white/30 hover:border-white bg-white/10 hover:bg-white/20 backdrop-blur-xs transition-all cursor-pointer"
                  title="Jadikan Sebagai Rekening Utama"
                  on:click={() => triggerSetPrimaryModal(activeAccount)}
                >
                  Jadikan Utama
                </button>
              {/if}

              {#if accountsList.length > 1}
                <button
                  type="button"
                  class="p-1.5 rounded-full text-red-200 border border-red-400/30 hover:border-red-400 bg-red-500/10 hover:bg-red-500/20 backdrop-blur-xs transition-all cursor-pointer"
                  title="Hapus Rekening Ini"
                  on:click={() => triggerDeleteModal(activeAccount)}
                >
                  <Trash2 size={13} />
                </button>
              {/if}
            </div>
          </div>

          <!-- Middle Row: Account Number -->
          <div class="w-full my-4 sm:my-5">
            <span class="text-[10px] text-white/50 font-bold uppercase tracking-widest font-heading block mb-1">
              Nomor Rekening
            </span>
            <p class="whitespace-nowrap font-mono tracking-widest text-lg sm:text-xl font-black text-white drop-shadow-sm">
              •••• &nbsp;•••• &nbsp;•••• &nbsp;<span class="{brandConfig.accentTextClass} font-black">{lastFourDigits}</span>
            </p>
          </div>

          <!-- Cardholder Details -->
          <div class="mb-5 sm:mb-6">
            <span class="text-[10px] text-white/50 uppercase tracking-widest font-bold font-heading block">
              Pemilik Rekening Terverifikasi
            </span>
            <p class="text-xs sm:text-sm font-bold text-white uppercase truncate font-mono tracking-wide mt-0.5 drop-shadow-xs">
              {resolvedHolderName}
            </p>
          </div>
        </div>

        <!-- Lower Tray (Withdrawal Section) -->
        {#if showWithdrawSection}
          <div class="pt-5 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/40 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-5 sm:p-6 rounded-b-3xl backdrop-blur-md mt-auto">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold uppercase tracking-wider text-white/80 font-heading">
                  Saldo Siap Dicairkan
                </span>
                <span class="text-3xs font-mono text-white/60 bg-white/10 border border-white/10 px-2 py-0.5 rounded-full">
                  Min: {formatIDR(minPayoutLimit)}
                </span>
              </div>

              <p class="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight leading-none">
                {formatIDR(availableBalance)}
              </p>

              <p class="text-2xs text-white/60 font-sans mt-0.5">
                {#if availableBalance >= minPayoutLimit}
                  Saldo memenuhi batas penarikan dan siap ditransfer
                {:else if availableBalance > 0}
                  Belum mencapai batas minimum penarikan ({formatIDR(minPayoutLimit)})
                {:else}
                  Tidak ada saldo siap tarik saat ini
                {/if}
              </p>

              {#if availableBalance === 0 && balance > 0}
                <p class="text-2xs text-amber-300/90 font-medium mt-0.5">
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
        {/if}
      </div>
    </div>
  {:else}
    <!-- Empty State -->
    <div class="relative flex-1 min-h-[290px] overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-dashed border-orange/35 p-8 text-center text-white shadow-xl flex flex-col items-center justify-center">
      <div class="w-14 h-14 rounded-2xl bg-orange/15 border border-orange/30 text-orange flex items-center justify-center mb-3 shadow-xs">
        <Building2 size={26} />
      </div>
      <h3 class="text-lg font-bold text-white font-heading">Hubungkan Rekening Bank Tujuan</h3>
      <p class="text-xs text-slate-300 mt-1 max-w-md leading-relaxed font-sans">
        Daftarkan hingga 3 nomor rekening bank resmi untuk pencairan dana dan komisi Anda.
      </p>
      <div class="mt-5">
        <Button
          variant="orange"
          size="md"
          className="shadow-lg shadow-orange-500/25 px-6 font-bold"
          on:click={onOpenBankModal}
        >
          <span class="material-symbols-outlined text-lg">add_link</span>
          <span>Hubungkan Rekening Sekarang</span>
        </Button>
      </div>
    </div>
  {/if}
</div>

<!-- Modal Validasi Aksi Rekening dari components/ui -->
<BankActionConfirmModal
  bind:open={showConfirmModal}
  type={confirmType}
  account={targetActionAccount}
  onConfirm={handleConfirmAction}
  onClose={() => (showConfirmModal = false)}
/>
