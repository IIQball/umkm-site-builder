<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { formatIDR } from '@/lib/utils/format';
  import { ArrowDownLeft, Info, Wallet } from 'lucide-svelte';
  import type { BankAccount, PayoutHistoryItem } from '@/types/finance';
  import { toast } from '@/lib/toast';
  import BankAccountCardModal from './bank/BankAccountCardModal.svelte';
  import PayoutModal from './bank/PayoutModal.svelte';
  import PayoutHistoryTable from './bank/PayoutHistoryTable.svelte';

  export let balance: number;
  export let availableBalance: number;
  export let settlementDelayDays = 7;
  export let initialBankAccount: BankAccount | null = null;
  export let initialPayoutHistory: PayoutHistoryItem[] = [];

  let bankAccount: BankAccount | null = initialBankAccount;
  let showWithdrawModal = false;
  $: if (initialBankAccount && !bankAccount) {
    bankAccount = initialBankAccount;
  }
  let payoutHistory: PayoutHistoryItem[] = initialPayoutHistory;
  let pollTimer: ReturnType<typeof setInterval> | null = null;

  async function fetchBankAccount() {
    try {
      const res = await fetch('/api/designer/bank-account');
      if (res.ok) {
        const json = await res.json();
        bankAccount = json.data || null;
      }
    } catch {
      // Ignored
    }
  }

  async function fetchPayoutHistory() {
    try {
      const res = await fetch('/api/designer/payout');
      if (res.ok) {
        const json = await res.json();
        const raw = json.data;
        if (Array.isArray(raw)) {
          payoutHistory = raw;
        } else if (raw && Array.isArray(raw.payouts)) {
          payoutHistory = raw.payouts;
        } else {
          payoutHistory = [];
        }
      }
    } catch {
      // Ignored
    }
  }

  async function handleSaveAccount(accountData: { bankName: string; accountNumber: string; holderName: string }) {
    const res = await fetch('/api/designer/bank-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(accountData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Gagal menyimpan rekening bank');
    }
    toast.success('Rekening bank berhasil disimpan');
    await fetchBankAccount();
  }

  async function handleWithdraw(amount: number) {
    if (!bankAccount) {
      throw new Error('Silakan simpan rekening bank terlebih dahulu');
    }
    const res = await fetch('/api/designer/payout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, bankAccountId: bankAccount.id }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Gagal mengajukan penarikan saldo');
    }
    const result = await res.json();

    // Optimistic balance updates
    balance = Math.max(0, balance - amount);
    availableBalance = Math.max(0, availableBalance - amount);

    toast.success('Pengajuan penarikan dana berhasil diproses');
    await fetchPayoutHistory();

    // Broadcast balance update for overview and mutation table
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('designer_balance_updated', {
          detail: {
            balance,
            availableBalance,
            mutation: {
              id: `wmut_${Date.now()}`,
              amount,
              balanceAfter: balance,
              type: 'DEBIT',
              description: `Penarikan dana ke ${bankAccount.bankName} (${bankAccount.accountNumber})`,
              referenceId: result.data?.id || null,
              createdAt: new Date().toISOString(),
            },
          },
        })
      );
    }
  }

  onMount(() => {
    fetchBankAccount();
    fetchPayoutHistory();
    pollTimer = setInterval(fetchPayoutHistory, 30000);
  });

  onDestroy(() => {
    if (pollTimer) clearInterval(pollTimer);
  });
</script>

<div class="space-y-6">
  <!-- Saldo Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
    <div class="bg-card border border-light rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-nested border border-light flex items-center justify-center text-muted">
            <Wallet size={16} />
          </div>
          <span class="text-xs font-bold text-secondary">Total Saldo Terakumulasi</span>
        </div>
      </div>
      <div>
        <h3 class="text-2xl font-black text-main tracking-tight font-mono">{formatIDR(balance)}</h3>
      </div>
      <div class="flex items-center gap-1.5 text-[11px] text-muted pt-3 border-t border-light">
        <Info size={13} class="flex-shrink-0" />
        <span>Termasuk pendapatan dalam masa settlement {settlementDelayDays} hari.</span>
      </div>
    </div>

    <div class="bg-card border border-primary/20 bg-primary/5 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-primary">Saldo Siap Ditarik</span>
        <span class="badge-custom badge-custom-emerald text-[10px]">Tersedia</span>
      </div>
      <div>
        <h3 class="text-2xl font-black text-primary tracking-tight font-mono">{formatIDR(availableBalance)}</h3>
      </div>
      <button
        type="button"
        on:click={() => {
          showWithdrawModal = true;
        }}
        disabled={availableBalance < 50000 || !bankAccount}
        class="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
      >
        <ArrowDownLeft size={15} />
        <span>Tarik Saldo ke Rekening</span>
      </button>
    </div>
  </div>

  <!-- Bank Account Management -->
  <BankAccountCardModal {bankAccount} onSaveAccount={handleSaveAccount} />

  <!-- Payout History -->
  <PayoutHistoryTable {payoutHistory} />

  <!-- Modal Withdraw -->
  <PayoutModal
    isOpen={showWithdrawModal}
    {availableBalance}
    {bankAccount}
    onClose={() => (showWithdrawModal = false)}
    onWithdraw={handleWithdraw}
  />
</div>
