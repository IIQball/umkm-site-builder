<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import DesignerStatCards from './DesignerStatCards.svelte';
  import DesignerMutationTable from './DesignerMutationTable.svelte';
  import DesignerBankWithdraw from './DesignerBankWithdraw.svelte';
  import DesignerWeeklyChart from './wallet/DesignerWeeklyChart.svelte';
  import type { MerchantGrowthSummary } from '@/components/admin/growth/merchantGrowth.types';
  import { buildWeeklyData, buildDistribution } from './wallet/wallet.helpers';

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
  export let platformFeePercentage = 30;
  export let showPerformanceCards = true;
  export let showCharts = true;
  export let accountType: 'designer' | 'admin' = 'designer';
  export let totalEarnedCommission = 0;
  export let merchantGrowthData: MerchantGrowthSummary | undefined = undefined;

  type WalletMutation = (typeof walletSummary.mutations)[number];

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

  $: weeklyData = buildWeeklyData(walletSummary.mutations);
  $: maxWeekly = Math.max(...weeklyData.map((d) => d.amount), 1);
  $: topTemplates = buildDistribution(walletSummary.mutations);
</script>

<div class="space-y-8 md:space-y-10">
  <!-- Row 1: Saldo Status Cards -->
  <DesignerStatCards
    balance={walletSummary.balance}
    availableBalance={walletSummary.availableBalance}
    {settlementDelayDays}
    {accountType}
    {totalEarnedCommission}
  />

  <!-- Row 2: Performance Stats stacked 1-col beside Bank Card & Full Width Payout History -->
  <DesignerBankWithdraw
    bind:balance={walletSummary.balance}
    bind:availableBalance={walletSummary.availableBalance}
    {totalNetIncome}
    {totalTemplatesSold}
    {settlementDelayDays}
    {showPerformanceCards}
    {accountType}
    {merchantGrowthData}
  />

  <!-- Analytics Grid -->
  {#if showCharts}
    <DesignerWeeklyChart
      {weeklyData}
      {maxWeekly}
      {topTemplates}
      {platformFeePercentage}
    />
  {/if}

  <!-- Ledger Mutation Table -->
  <DesignerMutationTable mutations={walletSummary.mutations} />
</div>
