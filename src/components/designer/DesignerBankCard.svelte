<script lang="ts">
  import { Building2, Plus } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import BankActionConfirmModal from './BankActionConfirmModal.svelte';
  import BankCardFace from './BankCardFace.svelte';
  import BankWithdrawTray from './BankWithdrawTray.svelte';
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

  // Calculate circular 3D stack offset relative to currently active account
  function getStackOffset(accountId: string, activeId: string | undefined, list: BankAccount[]): number {
    if (!activeId || accountId === activeId) return 0;
    const activeIdx = list.findIndex((a) => a.id === activeId);
    const myIdx = list.findIndex((a) => a.id === accountId);
    if (activeIdx === -1 || myIdx === -1) return 0;
    return (myIdx - activeIdx + list.length) % list.length;
  }

  const triggerSetPrimaryModal = (acc: BankAccount) => {
    targetActionAccount = acc; confirmType = 'set-primary'; showConfirmModal = true;
  };
  const triggerDeleteModal = (acc: BankAccount) => {
    targetActionAccount = acc; confirmType = 'delete'; showConfirmModal = true;
  };

  const handleSwipeToBack = () => {
    if (accountsList.length <= 1) return;
    const currentIndex = accountsList.findIndex((a) => a.id === activeAccount?.id);
    const nextIndex = (currentIndex + 1) % accountsList.length;
    onSelectAccount(accountsList[nextIndex].id);
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

<div class="h-full flex flex-col justify-between">
  <!-- Multiple Accounts Quick Switcher Bar -->
  {#if accountsList.length > 0}
    <div class="flex items-center justify-between gap-2 mb-6 px-1">
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
        {#each accountsList as acc}
          <button
            type="button"
            class="px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 {activeAccount?.id === acc.id ? 'bg-orange text-white shadow-xs' : 'bg-card border border-light text-secondary hover:text-main hover:bg-nested/60'}"
            on:click={() => onSelectAccount(acc.id)}
          >
            <span>{acc.bankName}</span>
            <span class="text-xs opacity-80">••{acc.accountNumber.slice(-4)}</span>
            {#if acc.isPrimary}
              <span class="text-xs font-black bg-white/20 px-1 py-0.2 rounded-xs">Utama</span>
            {/if}
          </button>
        {/each}
      </div>

      <div class="flex items-center gap-2 flex-shrink-0">
        <span class="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-nested border border-light text-secondary">
          {accountsList.length}/3 Rekening
        </span>
        {#if accountsList.length < 3}
          <Button
            type="button"
            size="xs"
            variant="outline"
            class="px-2.5 py-1 rounded-xl text-xs font-bold text-orange border border-dashed border-orange/40 hover:bg-orange/10 transition-all flex items-center gap-1 h-auto"
            title="Tambah Rekening Bank Baru (Maks. 3)"
            on:click={onOpenBankModal}
          >
            <Plus size={13} />
            <span>Tambah</span>
          </Button>
        {/if}
      </div>
    </div>
  {/if}

  {#if isLoading && accountsList.length === 0}
    <div class="h-full bg-card border border-light rounded-3xl p-8 text-center animate-pulse space-y-4 shadow-xl flex flex-col justify-center min-h-[290px]">
      <div class="h-8 bg-nested rounded-xl w-1/4 mx-auto"></div>
      <div class="h-6 bg-nested rounded-lg w-1/2 mx-auto"></div>
      <div class="h-12 bg-nested rounded-2xl w-1/3 mx-auto mt-4"></div>
    </div>
  {:else if activeAccount}
    <!-- Stacked 3D Cards Container (Swipe / Stack Carousel) -->
    <div
      class="relative w-full transition-all duration-300 {accountsList.length > 2 ? 'pt-12' : accountsList.length === 2 ? 'pt-7' : ''}"
      style="perspective: 1200px;"
    >
      <div class="relative w-full">
        <!-- Invisible layout spacer to reserve responsive natural card height -->
        <div class="invisible pointer-events-none select-none p-6 sm:p-7 border border-transparent" aria-hidden="true">
          <div class="min-h-[190px]"></div>
        </div>

        <!-- Unified Stack Cards (Stable keyed DOM instances for 60fps spring transitions on click & swipe) -->
        {#each accountsList as acc (acc.id)}
          {@const isActive = acc.id === activeAccount?.id}
          {@const stackOffset = getStackOffset(acc.id, activeAccount?.id, accountsList)}
          <div
            class="absolute inset-0 transition-opacity duration-300"
            style="z-index: {isActive ? 30 : 15 - stackOffset};"
          >
            <BankCardFace
              account={acc}
              {isActive}
              {stackOffset}
              totalCards={accountsList.length}
              onSelect={() => onSelectAccount(acc.id)}
              onSwipeToBack={handleSwipeToBack}
              onTriggerSetPrimary={triggerSetPrimaryModal}
              onTriggerDelete={triggerDeleteModal}
              canDelete={accountsList.length > 1}
            />
          </div>
        {/each}
      </div>
    </div>

    <!-- Lower Withdrawal Tray -->
    {#if showWithdrawSection}
      <BankWithdrawTray
        {availableBalance}
        {balance}
        {minPayoutLimit}
        {settlementDelayDays}
        {activeAccount}
        {isLoading}
        {onOpenWithdrawModal}
      />
    {/if}
  {:else}
    <!-- Empty State -->
    <div class="relative flex-1 min-h-[290px] overflow-hidden rounded-3xl bg-card border-2 border-dashed border-orange/35 p-8 text-center text-main shadow-xl flex flex-col items-center justify-center">
      <div class="w-14 h-14 rounded-2xl bg-orange/15 border border-orange/30 text-orange flex items-center justify-center mb-3 shadow-xs">
        <Building2 size={26} />
      </div>
      <h3 class="text-lg font-bold text-main font-heading">Hubungkan Rekening Bank Tujuan</h3>
      <p class="text-xs text-muted mt-1 max-w-md leading-relaxed font-sans">
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
