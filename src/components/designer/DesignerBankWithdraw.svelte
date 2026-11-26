<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { BankAccount, PayoutHistoryItem } from '@/types';
  import { formatIDR, parseCurrencyInput } from '@/lib/currency';
  import { apiFetch } from '@/lib/api/parse-response';
  import { toast } from '@/lib/toast';
  import DesignerBankCard from './DesignerBankCard.svelte';
  import DesignerBankModal from './DesignerBankModal.svelte';
  import DesignerWithdrawModal from './DesignerWithdrawModal.svelte';
  import DesignerPayoutHistoryTable from './DesignerPayoutHistoryTable.svelte';
  import DesignerPerformanceCards from './DesignerPerformanceCards.svelte';
  import DesignerPayoutInfoCard from './DesignerPayoutInfoCard.svelte';
  import AdminMerchantGrowthChart from '@/components/admin/growth/AdminMerchantGrowthChart.svelte';
  import type { MerchantGrowthSummary } from '@/components/admin/growth/merchantGrowth.types';
  import {
    createBankAccountApi,
    loadBankAccountsList,
    loadPayoutHistory,
    pollPayoutStatusApi,
    submitPayoutWithdrawal,
  } from './designerWithdraw.helpers';

  export let balance: number, availableBalance: number;
  export let totalNetIncome = 0, totalTemplatesSold = 0, settlementDelayDays = 7;
  export let showPerformanceCards = true, accountType: 'designer' | 'admin' = 'designer';
  export let merchantGrowthData: MerchantGrowthSummary | undefined = undefined;

  let bankAccount: BankAccount | null = null, bankAccounts: BankAccount[] = [], selectedAccountId = '';
  let showBankModal = false, showWithdrawModal = false, isWithdrawing = false, withdrawSuccess = false;
  let inputBankName = 'BCA', inputAccountNumber = '', inputHolderName = '', apiError = '', isLoading = false;
  let withdrawAmount = '', withdrawError = '', minPayoutLimit = 50000;
  let payoutHistory: PayoutHistoryItem[] = [], isLoadingPayouts = false;
  let pollingInterval: ReturnType<typeof setInterval> | null = null;

  async function fetchPayoutHistory() {
    isLoadingPayouts = true;
    try {
      const res = await loadPayoutHistory();
      if (res) {
        payoutHistory = res.payouts;
        if (res.minPayoutLimit) minPayoutLimit = res.minPayoutLimit;
      }
    } catch (err) {
      console.error('Failed to fetch payout history:', err);
    } finally {
      isLoadingPayouts = false;
    }
  }

  async function pollStatus() {
    try {
      const res = await pollPayoutStatusApi();
      if (!res) return;
      payoutHistory = res.payouts;
      if (res.wallet) {
        balance = Number(res.wallet.balance);
        availableBalance = Number(res.wallet.availableBalance);
      }
      if (!payoutHistory.some((p) => p.status.toLowerCase() === 'processing')) stopPolling();
    } catch (err) {
      console.error('Error during status polling:', err);
    }
  }

  function stopPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  }

  function checkAndStartPolling() {
    if (typeof window === 'undefined') return;
    if (payoutHistory.some((p) => p.status.toLowerCase() === 'processing')) {
      if (!pollingInterval) pollingInterval = setInterval(pollStatus, 4000);
    } else {
      stopPolling();
    }
  }

  $: if (payoutHistory) checkAndStartPolling();
  onDestroy(() => stopPolling());

  async function fetchBankAccounts() {
    isLoading = true;
    apiError = '';
    try {
      bankAccounts = await loadBankAccountsList();
      const primary = bankAccounts.find((a) => a.isPrimary) || bankAccounts[0];
      bankAccount = primary || null;
      if (!selectedAccountId || !bankAccounts.some((a) => a.id === selectedAccountId)) {
        selectedAccountId = primary?.id || '';
      }
    } catch (err) {
      console.error('Failed to fetch bank accounts:', err);
      bankAccounts = [];
      bankAccount = null;
      selectedAccountId = '';
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    fetchBankAccounts();
    fetchPayoutHistory();
  });

  const openBankModal = () => {
    inputBankName = 'BCA';
    inputAccountNumber = '';
    inputHolderName = '';
    apiError = '';
    showBankModal = true;
  };

  async function saveBankAccount() {
    if (!inputAccountNumber || !inputHolderName) {
      apiError = 'Semua field wajib diisi';
      return;
    }
    isLoading = true;
    apiError = '';
    try {
      const result = await createBankAccountApi({ bankName: inputBankName, accountNumber: inputAccountNumber, holderName: inputHolderName });
      if (result.success) {
        showBankModal = false;
        toast.success('Rekening bank berhasil disimpan.');
        await fetchBankAccounts();
        if (result.data?.id) selectedAccountId = result.data.id;
      } else {
        apiError = result.message;
        toast.error(apiError);
      }
    } catch {
      apiError = 'Terjadi kesalahan koneksi.';
      toast.error(apiError);
    } finally {
      isLoading = false;
    }
  }

  async function handleSetPrimary(accountId: string) {
    try {
      const res = await apiFetch('/api/designer/bank-account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: accountId }),
        fallbackError: 'Gagal mengatur rekening utama.',
      });
      if (res.success) { toast.success('Rekening utama diperbarui.'); await fetchBankAccounts(); }
      else toast.error(res.message);
    } catch (err) {
      console.error('Failed to set primary account:', err);
      toast.error('Gagal memperbarui rekening utama.');
    }
  }

  async function handleDeleteAccount(accountId: string) {
    try {
      const res = await apiFetch(`/api/designer/bank-account?id=${accountId}`, {
        method: 'DELETE',
        fallbackError: 'Gagal menghapus rekening bank.',
      });
      if (res.success) { toast.success('Rekening bank dihapus.'); await fetchBankAccounts(); }
      else toast.error(res.message);
    } catch (err) {
      console.error('Failed to delete bank account:', err);
      toast.error('Gagal menghapus rekening bank.');
    }
  }

  async function handleWithdraw(targetBankAccountId: string, amountOverride?: number) {
    const targetAccount = bankAccounts.find((a) => a.id === targetBankAccountId) || bankAccount;
    if (!targetAccount) return;

    const amountNum = amountOverride ?? parseCurrencyInput(withdrawAmount);
    if (!amountNum || amountNum < minPayoutLimit) {
      withdrawError = `Jumlah penarikan minimal ${formatIDR(minPayoutLimit)}`;
      return;
    }
    if (amountNum > availableBalance) {
      withdrawError = 'Jumlah penarikan melebihi saldo yang siap ditarik.';
      return;
    }

    const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `po_${Date.now()}`;
    withdrawError = '';
    isWithdrawing = true;
    try {
      const result = await submitPayoutWithdrawal(amountNum, targetAccount.id, idempotencyKey);
      if (result.success && result.data) {
        isWithdrawing = false;
        withdrawSuccess = true;
        toast.success('Permintaan penarikan dana berhasil dikirim.');
        balance = Math.max(0, balance - amountNum);
        availableBalance = Math.max(0, availableBalance - amountNum);
        window.dispatchEvent(new CustomEvent('designer_balance_updated', {
          detail: {
            balance,
            availableBalance,
            mutation: {
              id: result.data.id, amount: amountNum, balanceAfter: balance, type: 'DEBIT' as const,
              description: `Penarikan dana ke ${targetAccount.bankName} (${targetAccount.accountNumber})`,
              referenceId: result.data.id, createdAt: result.data.createdAt,
            },
          },
        }));
        await fetchPayoutHistory();
      } else {
        withdrawError = result.message;
        toast.error(withdrawError);
      }
    } catch {
      withdrawError = 'Terjadi kesalahan koneksi saat memproses penarikan.';
      toast.error(withdrawError);
    } finally {
      isWithdrawing = false;
    }
  }

  const closeWithdrawModal = () => {
    showWithdrawModal = false;
    withdrawSuccess = false;
    withdrawAmount = '';
    withdrawError = '';
  };
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-6">
  {#if showPerformanceCards}
    <div class="lg:col-span-1 h-full"><DesignerPerformanceCards {totalNetIncome} {totalTemplatesSold} /></div>
  {/if}
  <div class="{showPerformanceCards || accountType === 'admin' ? 'lg:col-span-2' : 'lg:col-span-3'} h-full">
    <DesignerBankCard
      {bankAccount} {bankAccounts} {selectedAccountId} {isLoading} {balance} {availableBalance} {minPayoutLimit} {settlementDelayDays}
      onOpenBankModal={openBankModal} onOpenWithdrawModal={() => (showWithdrawModal = true)}
      onSetPrimary={handleSetPrimary} onDeleteAccount={handleDeleteAccount} onSelectAccount={(id) => (selectedAccountId = id)}
    />
  </div>
  {#if accountType === 'admin'}
    <div class="lg:col-span-1 h-full">
      {#if merchantGrowthData}<AdminMerchantGrowthChart growthData={merchantGrowthData} />{:else}<DesignerPayoutInfoCard {minPayoutLimit} {settlementDelayDays} />{/if}
    </div>
  {/if}
</div>

<DesignerBankModal showModal={showBankModal} {bankAccount} {isLoading} {apiError} bind:inputBankName bind:inputAccountNumber bind:inputHolderName onSave={saveBankAccount} onClose={() => (showBankModal = false)} />
<DesignerWithdrawModal showModal={showWithdrawModal} {withdrawSuccess} {bankAccount} {bankAccounts} bind:selectedBankAccountId={selectedAccountId} {balance} {availableBalance} {isWithdrawing} {minPayoutLimit} bind:withdrawAmount bind:withdrawError onWithdraw={handleWithdraw} onClose={closeWithdrawModal} />
<DesignerPayoutHistoryTable {payoutHistory} isLoading={isLoadingPayouts} />
