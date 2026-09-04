<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { BankAccount, PayoutHistoryItem } from '@/types';
  import DesignerBankCard from './DesignerBankCard.svelte';
  import DesignerBankModal from './DesignerBankModal.svelte';
  import DesignerWithdrawModal from './DesignerWithdrawModal.svelte';
  import DesignerPayoutHistoryTable from './DesignerPayoutHistoryTable.svelte';

  export let balance: number;
  export let availableBalance: number;
  export let settlementDelayDays = 7;

  let bankAccount: BankAccount | null = null;
  let showBankModal = false;
  let showWithdrawModal = false;
  let inputBankName = 'BCA';
  let inputAccountNumber = '';
  let inputHolderName = '';
  let withdrawAmount = '';
  let withdrawError = '';
  let isWithdrawing = false;
  let withdrawSuccess = false;
  let isLoading = false;
  let apiError = '';
  let payoutHistory: PayoutHistoryItem[] = [];
  let isLoadingPayouts = false;
  let minPayoutLimit = 50000;
  let pollingInterval: ReturnType<typeof setInterval> | null = null;

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
        if (!payoutHistory.some((p) => p.status.toLowerCase() === 'processing')) stopPolling();
      }
    } catch (err) {
      console.error('Error during status polling:', err);
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

  function stopPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  }

  $: if (payoutHistory) checkAndStartPolling();
  onDestroy(() => stopPolling());

  const fetchBankAccount = async () => {
    isLoading = true;
    apiError = '';
    try {
      const res = await fetch('/api/designer/bank-account');
      const result = await res.json();
      if (res.ok && result.success && result.data) {
        const data = result.data as BankAccount;
        const resolvedName = data.accountHolder || data.holderName || (data as any).accountHolderName || '';
        bankAccount = {
          ...data,
          holderName: resolvedName,
          accountHolder: resolvedName,
        };
        inputBankName = data.bankName;
        inputAccountNumber = data.accountNumber;
        inputHolderName = resolvedName;
      } else {
        bankAccount = null;
      }
    } catch (err) {
      console.error('Failed to fetch bank account:', err);
    } finally {
      isLoading = false;
    }
  };

  onMount(() => {
    fetchBankAccount();
    fetchPayoutHistory();
  });

  const openBankModal = () => {
    if (bankAccount) {
      const resolvedName = bankAccount.accountHolder || bankAccount.holderName || '';
      inputBankName = bankAccount.bankName;
      inputAccountNumber = bankAccount.accountNumber;
      inputHolderName = resolvedName;
    } else {
      inputBankName = 'BCA';
      inputAccountNumber = '';
      inputHolderName = '';
    }
    apiError = '';
    showBankModal = true;
  };

  const saveBankAccount = async () => {
    if (!inputAccountNumber || !inputHolderName) {
      apiError = 'Semua field wajib diisi';
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
          accountNumber: inputAccountNumber,
          accountHolder: inputHolderName,
          holderName: inputHolderName
        })
      });

      const result = await res.json();
      if (res.ok && result.success) {
        const saved = result.data;
        const resolvedName = saved.accountHolder || saved.holderName || inputHolderName;
        bankAccount = {
          ...saved,
          holderName: resolvedName,
          accountHolder: resolvedName,
        };
        showBankModal = false;
      } else {
        apiError = result.error?.message || 'Gagal menyimpan rekening bank.';
      }
    } catch (err) {
      apiError = 'Terjadi kesalahan koneksi.';
    } finally {
      isLoading = false;
    }
  };

  const handleWithdraw = async () => {
    if (!bankAccount) return;
    const amountNum = Number(withdrawAmount);

    if (isNaN(amountNum) || amountNum < minPayoutLimit) {
      withdrawError = `Jumlah penarikan minimal Rp ${minPayoutLimit.toLocaleString('id-ID')}`;
      return;
    }

    if (amountNum > availableBalance) {
      withdrawError = 'Jumlah penarikan melebihi saldo yang siap ditarik.';
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

<DesignerBankCard
  {bankAccount}
  {isLoading}
  {balance}
  {availableBalance}
  {minPayoutLimit}
  {settlementDelayDays}
  onOpenBankModal={openBankModal}
  onOpenWithdrawModal={() => (showWithdrawModal = true)}
/>

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
  onClose={() => (showBankModal = false)}
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
