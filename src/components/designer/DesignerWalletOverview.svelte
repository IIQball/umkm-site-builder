<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import PeriodFilter from '@/components/common/PeriodFilter.svelte';
  import DesignerStatCards from './DesignerStatCards.svelte';
  import DesignerMutationTable from './DesignerMutationTable.svelte';
  import DesignerBankWithdraw from './DesignerBankWithdraw.svelte';
  import type { MerchantGrowthSummary } from '@/components/admin/growth/merchantGrowth.types';
  import { filterByPeriod, computeAvailableYears } from '@/lib/utils/format';

  export let walletSummary: {
    balance: number;
    availableBalance: number;
    mutations: Array<{
      id: string;
      amount: number;
      balanceAfter: number;
      type: 'CREDIT' | 'DEBIT';
      description: string;
      referenceId: string | null;
      createdAt: Date | string;
    }>;
  };
  export let totalNetIncome = 0;
  export let totalTemplatesSold = 0;
  export let settlementDelayDays = 7;
  export let showPerformanceCards = true;
  export let accountType: 'designer' | 'admin' = 'designer';
  export let totalEarnedCommission = 0;
  export let merchantGrowthData: MerchantGrowthSummary | undefined = undefined;

  type WalletMutation = (typeof walletSummary.mutations)[number];

  const currentYear = new Date().getFullYear();
  let selectedYear: number = currentYear;
  let selectedMonth: number | 'all' = 'all';

  $: availableYears = computeAvailableYears(walletSummary.mutations, (m) => m.createdAt);

  $: filteredMutations = filterByPeriod(
    walletSummary.mutations,
    selectedYear,
    selectedMonth,
    (m) => m.createdAt
  );

  $: periodCreditTotal = filteredMutations
    .filter((m) => m.type === 'CREDIT')
    .reduce((sum, m) => sum + m.amount, 0);

  $: displayNetIncome =
    selectedMonth === 'all' && totalNetIncome > 0
      ? totalNetIncome
      : periodCreditTotal;

  $: displayTemplatesSold =
    selectedMonth === 'all' && totalTemplatesSold > 0
      ? totalTemplatesSold
      : filteredMutations.filter((m) => m.type === 'CREDIT').length;

  $: displayEarnedCommission =
    selectedMonth === 'all' && totalEarnedCommission > 0
      ? totalEarnedCommission
      : periodCreditTotal;

  const handleBalanceUpdate = (e: Event) => {
    const customEvent = e as CustomEvent;
    walletSummary.balance = customEvent.detail.balance;
    if (customEvent.detail.availableBalance !== undefined) {
      walletSummary.availableBalance = customEvent.detail.availableBalance;
    }
    walletSummary.mutations = [customEvent.detail.mutation, ...walletSummary.mutations];
  };

  onMount(() => {
    window.addEventListener('designer_balance_updated', handleBalanceUpdate);
    
    // Load persisted mock withdrawals
    const saved = localStorage.getItem('designer_mock_mutations');
    if (saved) {
      const mockMuts: WalletMutation[] = JSON.parse(saved);
      const existingIds = new Set(walletSummary.mutations.map(m => m.id));
      const toAdd = mockMuts.filter((m) => !existingIds.has(m.id));
      if (toAdd.length > 0) {
        walletSummary.mutations = [...toAdd, ...walletSummary.mutations];
        const totalDebits = toAdd.reduce((sum: number, m) => sum + m.amount, 0);
        walletSummary.balance = Math.max(0, walletSummary.balance - totalDebits);
      }
    }
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('designer_balance_updated', handleBalanceUpdate);
    }
  });
</script>

<div class="space-y-8 md:space-y-10">
  <!-- Period Filter -->
  <PeriodFilter
    {availableYears}
    bind:selectedYear
    bind:selectedMonth
    title={accountType === 'admin' ? 'Filter Periode Dompet Admin' : 'Filter Periode Dompet Desainer'}
    description={accountType === 'admin' 
      ? 'Sesuaikan riwayat mutasi komisi fee pendampingan dan penarikan dana berdasarkan periode waktu.'
      : 'Sesuaikan mutasi komisi penjualan template dan riwayat penarikan dana berdasarkan periode waktu.'}
  />

  <!-- Row 1: Saldo Status Cards -->
  <DesignerStatCards
    balance={walletSummary.balance}
    availableBalance={walletSummary.availableBalance}
    {settlementDelayDays}
    {accountType}
    totalEarnedCommission={displayEarnedCommission}
  />

  <!-- Row 2: Performance Stats stacked 1-col beside Bank Card & Full Width Payout History -->
  <DesignerBankWithdraw
    bind:balance={walletSummary.balance}
    bind:availableBalance={walletSummary.availableBalance}
    totalNetIncome={displayNetIncome}
    totalTemplatesSold={displayTemplatesSold}
    {settlementDelayDays}
    {showPerformanceCards}
    {accountType}
    {merchantGrowthData}
  />

  <!-- Ledger Mutation Table -->
  <DesignerMutationTable mutations={filteredMutations} />
</div>

