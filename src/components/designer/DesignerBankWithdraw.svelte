<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { formatIDR } from '@/lib/utils/format';
  import { Building2, ArrowUpRight, AlertTriangle, Info } from 'lucide-svelte';
  import type { BankAccount, PayoutHistoryItem } from '@/types';
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

<div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
  <!-- Bank Account Settings Card -->
  <div class="bg-card border border-light rounded-2xl p-6 shadow-sm flex flex-col justify-between">
    <div>
      <div class="flex items-center gap-2 mb-3">
        <div class="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <Building2 size={16} />
        </div>
        <h3 class="text-sm font-bold text-main">Rekening Bank Tujuan</h3>
      </div>
      
      {#if isLoading && !bankAccount}
        <div class="bg-nested border border-dashed border-light rounded-xl p-5 text-center my-2 animate-pulse space-y-2">
          <div class="h-4 bg-nested rounded w-1/3 mx-auto"></div>
          <div class="h-3 bg-nested rounded w-1/2 mx-auto"></div>
        </div>
      {:else if bankAccount}
        <div class="bg-nested border border-light rounded-xl p-4 space-y-2 mt-2">
          <div class="flex justify-between items-center">
            <span class="text-xs font-extrabold uppercase tracking-widest text-muted">Bank</span>
            <span class="text-xs font-bold text-main">{bankAccount.bankName}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs font-extrabold uppercase tracking-widest text-muted">Nomor Rekening</span>
            <span class="text-xs font-semibold text-main font-mono">{bankAccount.accountNumber}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs font-extrabold uppercase tracking-widest text-muted">Nama Pemilik</span>
            <span class="text-xs font-semibold text-main">{bankAccount.holderName}</span>
          </div>
        </div>
      {:else}
        <div class="bg-warning/10 border border-dashed border-warning/20 rounded-xl p-5 text-center my-2 text-warning">
          <div class="w-6 h-6 mx-auto mb-1 flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
          <p class="text-xs font-medium">Belum ada rekening bank terhubung.</p>
          <p class="text-xs text-warning/80 mt-0.5">Hubungkan rekening terlebih dahulu untuk melakukan penarikan dana.</p>
        </div>
      {/if}
    </div>

    <div class="mt-4 pt-3 border-t border-light flex gap-2">
      <button
        type="button"
        on:click={openBankModal}
        disabled={isLoading}
        class="btn btn-sm text-xs font-bold text-main bg-nested hover:bg-nested/80 rounded-xl py-2 px-4 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {bankAccount ? 'Ganti Rekening' : 'Hubungkan Rekening'}
      </button>
    </div>
  </div>

  <!-- Withdraw Funds Card -->
  <div class="bg-card border border-light rounded-2xl p-6 shadow-sm flex flex-col justify-between">
    <div>
      <div class="flex items-center gap-2 mb-3">
        <div class="w-8 h-8 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center text-success">
          <ArrowUpRight size={16} />
        </div>
        <h3 class="text-sm font-bold text-main">Tarik Dana Ke Rekening</h3>
      </div>
      
      <p class="text-xs text-secondary leading-relaxed my-2">
        Tarik akumulasi saldo hasil penjualan template langsung ke rekening bank terdaftar Anda. Proses transfer memakan waktu maksimal 1-2 hari kerja.
      </p>

      {#if availableBalance === 0 && balance > 0}
        <div class="bg-warning/10 border border-warning/20 rounded-xl p-3 flex justify-between items-center mt-3 mb-2">
          <span class="text-xs font-bold text-warning">Saldo Mengendap</span>
          <span class="text-sm font-black text-warning font-mono">{formatIDR(balance)}</span>
        </div>
      {/if}

      <div class="bg-success/10 border border-success/20 rounded-xl p-3 flex justify-between items-center mt-3">
        <span class="text-xs font-bold text-success">Saldo Tersedia</span>
        <span class="text-sm font-black text-success font-mono">{formatIDR(availableBalance)}</span>
      </div>

      {#if availableBalance === 0 && balance > 0}
        <div class="mt-3 p-3 bg-info/10 border border-info/20 rounded-xl flex gap-2">
          <div class="w-4 h-4 text-info flex-shrink-0 flex items-center justify-center">
            <Info size={14} />
          </div>
          <p class="text-xs text-info leading-normal mb-0">
            Dana Anda sebesar {formatIDR(balance)} sedang dalam masa penahanan (settlement hold {settlementDelayDays} hari) dan akan otomatis masuk ke Saldo Tersedia setelah masa hold selesai.
          </p>
        </div>
      {/if}
    </div>

    <div class="mt-4 pt-3 border-t border-light">
      <button
        type="button"
        disabled={!bankAccount || availableBalance < minPayoutLimit || isLoading}
        on:click={() => showWithdrawModal = true}
        class="btn btn-primary w-full text-xs font-bold text-white disabled:bg-nested disabled:text-muted rounded-xl py-2 px-4 transition-colors text-center cursor-pointer"
      >
        {#if !bankAccount}
          Hubungkan Rekening Terlebih Dahulu
        {:else if availableBalance === 0 && balance > 0}
          {balance >= minPayoutLimit ? 'Menunggu Masa Settlement' : 'Saldo Minimum Penarikan Kurang'}
        {:else if availableBalance < minPayoutLimit}
          Saldo Minimum Penarikan Kurang
        {:else}
          Tarik Dana
        {/if}
      </button>
    </div>
  </div>
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
