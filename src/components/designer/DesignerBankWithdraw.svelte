<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { formatIDR } from '@/lib/utils/format';
  import { Building2 } from 'lucide-svelte';
  import type { BankAccount, PayoutHistoryItem } from '@/types';
  import { Button } from '@/components/ui';
  import DesignerBankModal from './DesignerBankModal.svelte';
  import DesignerWithdrawModal from './DesignerWithdrawModal.svelte';
  import DesignerPayoutHistoryTable from './DesignerPayoutHistoryTable.svelte';

  export let balance: number;
  export let availableBalance: number;
  export let settlementDelayDays = 7;

  let bankAccount: BankAccount | null = null;
  let showBankModal = false;
  let showWithdrawModal = false;

  // Form fields for Bank Account
  let inputBankName = 'BCA';
  let inputAccountNumber = '';
  let inputHolderName = '';

  // Form fields for Withdrawal
  let withdrawAmount = '';
  let withdrawError = '';
  let isWithdrawing = false;
  let withdrawSuccess = false;

  // Global loading/error state
  let isLoading = false;
  let apiError = '';

  // Payout request history
  let payoutHistory: PayoutHistoryItem[] = [];
  let isLoadingPayouts = false;
  let minPayoutLimit = 50000;

  async function fetchPayoutHistory() {
    isLoadingPayouts = true;
    try {
      const res = await fetch('/api/designer/payout');
      const result = await res.json();
      if (result.success && result.data) {
        payoutHistory = result.data.payouts || [];
        minPayoutLimit = result.data.minPayoutLimit || 50000;
      }
    } catch (err) {
      console.error('Failed to fetch payout history:', err);
    } finally {
      isLoadingPayouts = false;
    }
  }

  let pollingInterval: ReturnType<typeof setInterval> | null = null;

  async function pollStatus() {
    try {
      const res = await fetch('/api/designer/payout/status');
      const result = await res.json();
      if (res.ok && result.success && result.data) {
        payoutHistory = result.data.payouts || [];
        if (result.data.wallet) {
          balance = Number(result.data.wallet.balance);
          availableBalance = Number(result.data.wallet.availableBalance);
        }

        const stillProcessing = payoutHistory.some(p => p.status.toLowerCase() === 'processing');
        if (!stillProcessing) {
          stopPolling();
        }
      }
    } catch (err) {
      console.error('Error during status polling:', err);
    }
  }

  function checkAndStartPolling() {
    if (typeof window === 'undefined') return;
    const hasProcessing = payoutHistory.some(p => p.status.toLowerCase() === 'processing');
    if (hasProcessing) {
      if (!pollingInterval) {
        pollingInterval = setInterval(pollStatus, 4000);
      }
    } else {
      stopPolling();
    }
  }

  function stopPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  }

  $: {
    if (payoutHistory) {
      checkAndStartPolling();
    }
  }

  onDestroy(() => {
    stopPolling();
  });

  onMount(async () => {
    isLoading = true;
    apiError = '';
    try {
      const res = await fetch('/api/designer/bank-account');
      const result = await res.json();
      if (result.success && result.data) {
        bankAccount = {
          id: result.data.id,
          bankName: result.data.bankName,
          accountNumber: result.data.accountNumber,
          holderName: result.data.accountHolder
        };
      }
      await fetchPayoutHistory();
    } catch (err) {
      apiError = 'Gagal memuat data rekening bank';
    } finally {
      isLoading = false;
    }
  });

  const openBankModal = () => {
    if (bankAccount) {
      inputBankName = bankAccount.bankName;
      inputAccountNumber = bankAccount.accountNumber;
      inputHolderName = bankAccount.holderName;
    } else {
      inputBankName = 'BCA';
      inputAccountNumber = '';
      inputHolderName = '';
    }
    apiError = '';
    showBankModal = true;
  };

  const saveBankAccount = async () => {
    if (!inputAccountNumber.trim() || !inputHolderName.trim()) {
      alert('Semua kolom wajib diisi!');
      return;
    }

    isLoading = true;
    apiError = '';

    try {
      const res = await fetch('/api/designer/bank-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankName: inputBankName,
          accountNumber: inputAccountNumber.trim(),
          accountHolder: inputHolderName.trim()
        })
      });

      const result = await res.json();
      if (res.ok && result.success) {
        bankAccount = {
          id: result.data.id,
          bankName: result.data.bankName,
          accountNumber: result.data.accountNumber,
          holderName: result.data.accountHolder
        };
        showBankModal = false;
      } else {
        apiError = result.error?.message || 'Gagal menyimpan rekening bank';
        alert(apiError);
      }
    } catch (err) {
      apiError = 'Terjadi kesalahan koneksi saat menyimpan';
      alert(apiError);
    } finally {
      isLoading = false;
    }
  };

  const handleWithdraw = async () => {
    const amountNum = parseInt(withdrawAmount.replace(/[^0-9]/g, ''));
    if (isNaN(amountNum) || amountNum <= 0) {
      withdrawError = 'Masukkan nominal penarikan yang valid.';
      return;
    }
    if (amountNum < minPayoutLimit) {
      withdrawError = `Minimum penarikan adalah Rp ${minPayoutLimit.toLocaleString('id-ID')}.`;
      return;
    }
    if (amountNum > availableBalance) {
      withdrawError = 'Saldo tersedia tidak mencukupi.';
      return;
    }
    if (!bankAccount?.id) {
      withdrawError = 'Rekening bank tujuan belum diatur.';
      return;
    }

    withdrawError = '';
    isWithdrawing = true;

    try {
      const res = await fetch('/api/designer/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountNum,
          bankAccountId: bankAccount.id
        })
      });

      const result = await res.json();
      if (res.ok && result.success) {
        isWithdrawing = false;
        withdrawSuccess = true;
        
        balance = Math.max(0, balance - amountNum);
        availableBalance = Math.max(0, availableBalance - amountNum);
        
        const mockMutation = {
          id: result.data.id,
          amount: amountNum,
          balanceAfter: balance,
          type: 'DEBIT' as const,
          description: `Penarikan dana ke ${bankAccount.bankName} (${bankAccount.accountNumber})`,
          referenceId: result.data.id,
          createdAt: result.data.createdAt
        };
        
        window.dispatchEvent(new CustomEvent('designer_balance_updated', {
          detail: {
            balance,
            availableBalance,
            mutation: mockMutation
          }
        }));

        await fetchPayoutHistory();
      } else {
        withdrawError = result.error?.message || 'Gagal mengajukan penarikan dana.';
      }
    } catch (err) {
      withdrawError = 'Terjadi kesalahan koneksi saat memproses penarikan.';
    } finally {
      isWithdrawing = false;
    }
  };

  const closeWithdrawModal = () => {
    showWithdrawModal = false;
    withdrawSuccess = false;
      withdrawAmount = '';
    withdrawError = '';
  };
</script>

<div class="mb-6">
  <!-- Unified Single Master Bank & Withdrawal Card -->
  {#if isLoading && !bankAccount}
    <div class="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center animate-pulse space-y-4 shadow-xl">
      <div class="h-8 bg-slate-900 rounded-xl w-1/4 mx-auto"></div>
      <div class="h-6 bg-slate-900 rounded-lg w-1/2 mx-auto"></div>
      <div class="h-12 bg-slate-900 rounded-2xl w-1/3 mx-auto mt-4"></div>
    </div>
  {:else if bankAccount}
    <!-- Authentic Black & Orange Bank Card Motif with Integrated Payout Action -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-orange/30 p-6 sm:p-8 text-white shadow-2xl shadow-black/30 group hover:border-orange/50 transition-all duration-300">
      <!-- Ambient Orange & Blue Glow Arcs -->
      <div class="absolute -right-16 -top-16 w-60 h-60 rounded-full bg-orange/20 blur-3xl pointer-events-none"></div>
      <div class="absolute -left-12 -bottom-12 w-52 h-52 rounded-full bg-orange/10 blur-2xl pointer-events-none"></div>

      <!-- Subtle Bank Card Circuit & Radial Dot Motif -->
      <div class="absolute inset-0 bg-[radial-gradient(theme(colors.orange.DEFAULT)_1px,transparent_1px)] [background-size:18px_18px] opacity-10 pointer-events-none"></div>
      <div class="absolute right-4 bottom-24 w-44 h-44 opacity-15 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.2" class="text-white w-full h-full">
          <circle cx="50" cy="50" r="40" stroke-dasharray="3 3" />
          <circle cx="50" cy="50" r="28" />
          <circle cx="50" cy="50" r="16" stroke-dasharray="2 2" />
          <path d="M10 50 Q 50 10 90 50 Q 50 90 10 50" />
        </svg>
      </div>

      <!-- Card Content Layer -->
      <div class="relative z-10">
        <!-- Top Row: EMV Chip + NFC + Bank Badge + Ganti Rekening -->
        <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div class="flex items-center gap-3">
            <!-- Realistic Metallic Gold EMV Chip -->
            <div class="w-11 h-8 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 border border-amber-300/60 shadow-sm relative overflow-hidden flex items-center justify-center flex-shrink-0">
              <div class="w-full h-full border border-amber-900/30 rounded-[3px] grid grid-cols-2 gap-0.5 opacity-70">
                <div class="border-r border-b border-amber-900/40"></div>
                <div class="border-b border-amber-900/40"></div>
                <div class="border-r border-amber-900/40"></div>
                <div></div>
              </div>
            </div>

            <!-- Contactless NFC Wave Icon -->
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white/60">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1.5-2.5" />
              <path d="M5.5 17.5A6.5 6.5 0 0 0 12 11c0-3.59-1.5-5.5-4-6.5" />
              <path d="M2.5 20.5A10.5 10.5 0 0 0 13 10c0-5.8-2.5-9-6.5-10.5" />
            </svg>
          </div>

          <!-- Bank Name & Action Button -->
          <div class="flex items-center gap-2.5">
            <div class="inline-flex items-center gap-1.5 bg-orange/20 border border-orange/35 text-white px-3.5 py-1.5 rounded-full text-xs font-black font-mono uppercase tracking-wider backdrop-blur-md">
              <span class="w-2 h-2 rounded-full bg-orange animate-pulse"></span>
              <span>{bankAccount.bankName}</span>
            </div>

            <Button
              variant="secondary"
              size="xs"
              className="!bg-white/10 !text-white !border-white/20 hover:!bg-white/20 rounded-full font-bold"
              title="Ganti Rekening Bank"
              on:click={openBankModal}
            >
              <span class="material-symbols-outlined text-xs">edit</span>
              <span>Ganti Rekening</span>
            </Button>
          </div>
        </div>

        <!-- Middle Row: Spaced Card Number & Card Holder -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end mb-8">
          <div>
            <span class="text-[10px] text-white/50 font-bold uppercase tracking-widest font-heading block mb-1">
              Nomor Rekening Terdaftar
            </span>
            <p class="font-mono text-xl sm:text-2xl font-black tracking-widest text-white drop-shadow-sm">
              •••• &nbsp;•••• &nbsp;•••• &nbsp;<span class="text-orange-light font-black">{bankAccount.accountNumber.length > 4 ? bankAccount.accountNumber.slice(-4) : bankAccount.accountNumber}</span>
            </p>
          </div>

          <div class="flex items-end justify-between sm:justify-end gap-4">
            <div class="space-y-0.5 min-w-0 sm:text-right">
              <span class="text-[10px] text-white/50 uppercase tracking-widest font-bold font-heading block">
                Pemilik Rekening
              </span>
              <p class="text-xs sm:text-sm font-bold text-white uppercase truncate font-mono tracking-wide">
                {bankAccount.holderName}
              </p>
            </div>

            <!-- Dual Overlapping Mastercard-style Circles -->
            <div class="flex items-center -space-x-2.5 opacity-90 flex-shrink-0">
              <div class="w-7 h-7 rounded-full bg-orange shadow-xs"></div>
              <div class="w-7 h-7 rounded-full bg-amber-400/90 backdrop-blur-xs shadow-xs"></div>
            </div>
          </div>
        </div>

        <!-- Integrated Lower Tray: Saldo Siap Tarik + Payout Action -->
        <div class="pt-5 border-t border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-5 bg-black/40 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-5 sm:p-7 rounded-b-3xl backdrop-blur-md">
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

            <p class="text-2xs text-white/60 font-sans mt-1">
              {#if availableBalance >= minPayoutLimit}
                Saldo memenuhi batas penarikan dan siap ditransfer
              {:else if availableBalance > 0}
                Belum mencapai batas minimum penarikan ({formatIDR(minPayoutLimit)})
              {:else}
                Tidak ada saldo siap tarik saat ini
              {/if}
            </p>

            {#if availableBalance === 0 && balance > 0}
              <p class="text-2xs text-amber-300/90 font-medium">
                * Saldo <strong>{formatIDR(balance)}</strong> dalam masa hold ({settlementDelayDays} hari) dan akan aktif otomatis.
              </p>
            {/if}
          </div>

          <div class="flex-shrink-0">
            <Button
              variant="orange"
              size="md"
              className="w-full sm:w-auto shadow-lg shadow-orange-500/25 px-6 font-bold"
              disabled={!bankAccount || availableBalance < minPayoutLimit || isLoading}
              on:click={() => showWithdrawModal = true}
            >
              <span class="material-symbols-outlined text-lg">payments</span>
              <span>
                {#if availableBalance >= minPayoutLimit}
                  Tarik {formatIDR(availableBalance)}
                {:else}
                  Tarik Dana ke Bank
                {/if}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <!-- Empty Bank Card Slot with Dark Blueprint style -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-dashed border-orange/35 p-8 text-center text-white shadow-xl flex flex-col items-center justify-center">
      <div class="w-14 h-14 rounded-2xl bg-orange/15 border border-orange/30 text-orange flex items-center justify-center mb-3 shadow-xs">
        <Building2 size={26} />
      </div>
      <h3 class="text-lg font-bold text-white font-heading">Hubungkan Rekening Bank Tujuan</h3>
      <p class="text-xs text-slate-300 mt-1 max-w-md leading-relaxed font-sans">
        Daftarkan nomor rekening bank di Indonesia untuk menerima pencairan komisi penjualan template secara instan.
      </p>
      <div class="mt-5">
        <Button
          variant="orange"
          size="md"
          className="shadow-lg shadow-orange-500/25 px-6 font-bold"
          on:click={openBankModal}
        >
          <span class="material-symbols-outlined text-lg">add_link</span>
          <span>Hubungkan Rekening Sekarang</span>
        </Button>
      </div>
    </div>
  {/if}
</div>

<!-- Modals -->
<DesignerBankModal
  showModal={showBankModal}
  {bankAccount}
  bind:inputBankName
  bind:inputAccountNumber
  bind:inputHolderName
  {isLoading}
  {apiError}
  onSave={saveBankAccount}
  onClose={() => showBankModal = false}
/>

<DesignerWithdrawModal
  showModal={showWithdrawModal}
  {withdrawSuccess}
  {bankAccount}
  {balance}
  {availableBalance}
  bind:withdrawAmount
  {withdrawError}
  {isWithdrawing}
  {minPayoutLimit}
  onWithdraw={handleWithdraw}
  onClose={closeWithdrawModal}
/>

<!-- Payout History Table -->
<DesignerPayoutHistoryTable
  {payoutHistory}
  isLoading={isLoadingPayouts}
/>
