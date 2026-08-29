<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { formatIDR } from '@/lib/utils/format';
  import { Building2, AlertTriangle, Info } from 'lucide-svelte';
  import type { BankAccount, PayoutHistoryItem } from '@/types';
  import { Card, Badge, Button } from '@/components/ui';
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
  <!-- Bank Account + Withdraw Card -->
  <Card variant="bordered" padding="lg" radius="3xl" topBeam="indigo-500" className="group">
    <div>
      <div class="flex items-start justify-between gap-3 mb-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0 shadow-xs">
            <Building2 size={20} />
          </div>
          <div>
            <h3 class="text-heading-md text-main font-bold leading-tight">Rekening Bank Tujuan</h3>
            <p class="text-2xs text-muted mt-0.5">Penampung transfer payout komisi penjualan</p>
          </div>
        </div>
        {#if bankAccount}
          <Badge variant="emerald" dot pulse size="sm">
            Terhubung
          </Badge>
        {:else}
          <Badge variant="amber" size="sm">
            Belum Diatur
          </Badge>
        {/if}
      </div>

      {#if isLoading && !bankAccount}
        <div class="bg-nested border border-dashed border-light rounded-2xl p-8 text-center my-3 animate-pulse space-y-3">
          <div class="h-5 bg-nested rounded-lg w-1/3 mx-auto"></div>
          <div class="h-4 bg-nested rounded-lg w-1/2 mx-auto"></div>
        </div>
      {:else if bankAccount}
        <!-- Realistic Luxurious ATM / Debit Card Mockup -->
        <div class="bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-5 md:p-6 my-2 relative overflow-hidden shadow-lg border border-white/10 group-hover:shadow-indigo-500/20 transition-all duration-300">
          <!-- Card Decorative Shapes & Hologram shine -->
          <div class="absolute -right-12 -top-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>
          <div class="absolute -left-10 -bottom-10 w-36 h-36 bg-blue-500/15 rounded-full blur-2xl pointer-events-none"></div>

          <!-- Top Row: Bank Badge + Contactless Icon -->
          <div class="flex items-center justify-between relative z-10 mb-6">
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 bg-white/15 backdrop-blur-md rounded-lg text-xs font-black tracking-widest text-white border border-white/20 uppercase font-heading">
                {bankAccount.bankName}
              </span>
              <span class="text-3xs text-white/60 font-semibold tracking-wider uppercase font-heading">KARTU DEBIT</span>
            </div>
            <!-- Contactless Icon SVG -->
            <svg class="w-6 h-6 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8.5 16.5a5 5 0 0 1 0-9"></path>
              <path d="M12 19a8.5 8.5 0 0 0 0-14"></path>
              <path d="M15.5 21.5a12 12 0 0 0 0-19"></path>
            </svg>
          </div>

          <!-- Middle Row: Golden EMV Chip + Masked Account Number -->
          <div class="flex items-center gap-4 relative z-10 mb-5">
            <!-- EMV Chip graphic -->
            <div class="w-10 h-8 rounded-md bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border border-amber-200/80 p-1 flex flex-col justify-between shadow-inner flex-shrink-0">
              <div class="w-full h-0.5 bg-amber-700/50"></div>
              <div class="w-full h-0.5 bg-amber-700/50"></div>
            </div>
            <p class="font-mono text-base md:text-lg font-bold tracking-widest text-white/95 truncate">
              •••• •••• •••• {bankAccount.accountNumber.length > 4 ? bankAccount.accountNumber.slice(-4) : bankAccount.accountNumber}
            </p>
          </div>

          <!-- Bottom Row: Cardholder Name + Status Badge -->
          <div class="flex items-end justify-between relative z-10 pt-2 border-t border-white/10">
            <div>
              <span class="text-4xs text-white/60 uppercase tracking-widest font-bold block font-heading">Pemilik Rekening</span>
              <p class="text-xs md:text-sm font-extrabold uppercase tracking-wider text-white truncate max-w-[200px]">
                {bankAccount.holderName}
              </p>
            </div>
            <div class="text-right">
              <span class="text-4xs text-emerald-400 font-bold uppercase tracking-wider block font-heading">Masa Berlaku</span>
              <span class="text-xs font-mono text-white/80">Aktif</span>
            </div>
          </div>
        </div>
      {:else}
        <!-- Empty Bank Card Slot -->
        <div class="bg-amber-500/5 border-2 border-dashed border-amber-500/30 rounded-2xl p-6 text-center my-3 text-warning flex flex-col items-center justify-center">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
            <AlertTriangle size={24} />
          </div>
          <p class="text-sm font-bold text-main">Belum Ada Rekening Terdaftar</p>
          <p class="text-xs text-secondary mt-1 max-w-xs leading-relaxed">
            Hubungkan rekening bank Anda untuk menerima pembayaran komisi hasil penjualan template secara otomatis.
          </p>
        </div>
      {/if}

      <!-- Settlement info alert -->
      {#if availableBalance === 0 && balance > 0}
        <div class="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex gap-2.5 items-start">
          <div class="w-5 h-5 text-info flex-shrink-0 flex items-center justify-center mt-0.5">
            <Info size={16} />
          </div>
          <p class="text-2xs text-info leading-normal mb-0">
            Total saldo Anda sebesar <strong>{formatIDR(balance)}</strong> sedang dalam masa settlement delay ({settlementDelayDays} hari). Saldo akan otomatis berpindah ke <strong>Saldo Siap Tarik</strong> setelah masa verifikasi selesai.
          </p>
        </div>
      {/if}
    </div>

    <!-- Footer: Edit bank + Tarik Dana buttons -->
    <div class="mt-4 pt-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <p class="text-2xs text-muted">
        {bankAccount ? 'Nomor rekening terenkripsi & aman · 1-2 hari kerja' : 'Mendukung semua bank di Indonesia'}
      </p>
      <div class="flex items-center gap-2 flex-shrink-0">
        <Button
          variant="secondary"
          size="sm"
          disabled={isLoading}
          on:click={openBankModal}
        >
          <span class="material-symbols-outlined text-sm">{bankAccount ? 'edit' : 'add_link'}</span>
          <span>{bankAccount ? 'Ganti Rekening' : 'Hubungkan Rekening'}</span>
        </Button>
        <Button
          variant="primary"
          size="sm"
          disabled={!bankAccount || availableBalance < minPayoutLimit || isLoading}
          on:click={() => showWithdrawModal = true}
        >
          <span class="material-symbols-outlined text-sm">payments</span>
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
  </Card>
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
