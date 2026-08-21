<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import DesignerStatCards from './DesignerStatCards.svelte';
  import DesignerMutationTable from './DesignerMutationTable.svelte';
  import DesignerBankWithdraw from './DesignerBankWithdraw.svelte';

  export let walletSummary: {
    balance: number;
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
  export let totalNetIncome: number;
  export let totalTemplatesSold: number;

  const handleBalanceUpdate = (e: Event) => {
    const customEvent = e as CustomEvent;
    walletSummary.balance = customEvent.detail.balance;
    walletSummary.mutations = [customEvent.detail.mutation, ...walletSummary.mutations];
  };

  onMount(() => {
    window.addEventListener('designer_balance_updated', handleBalanceUpdate);
    
    // Load persisted mock withdrawals
    const saved = localStorage.getItem('designer_mock_mutations');
    if (saved) {
      const mockMuts = JSON.parse(saved);
      const existingIds = new Set(walletSummary.mutations.map(m => m.id));
      const toAdd = mockMuts.filter((m: any) => !existingIds.has(m.id));
      if (toAdd.length > 0) {
        walletSummary.mutations = [...toAdd, ...walletSummary.mutations];
        const totalDebits = toAdd.reduce((sum: number, m: any) => sum + m.amount, 0);
        walletSummary.balance = Math.max(0, walletSummary.balance - totalDebits);
      }
    }
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('designer_balance_updated', handleBalanceUpdate);
    }
  });

  // Build weekly activity data from mutations (last 7 days)
  const buildWeeklyData = () => {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const dayLabel = days[d.getDay()];
      const dayStr = d.toISOString().slice(0, 10);
      const amount = walletSummary.mutations
        .filter((m) => m.type === 'CREDIT' && String(m.createdAt).slice(0, 10) === dayStr)
        .reduce((s, m) => s + m.amount, 0);
      return { label: dayLabel, amount, isToday: i === 6 };
    });
  };

  $: weeklyData = buildWeeklyData();
  $: maxWeekly = Math.max(...weeklyData.map((d) => d.amount), 1);

  // Build credit distribution data (top 3 templates by commission)
  const buildDistribution = () => {
    const creditMuts = walletSummary.mutations.filter((m) => m.type === 'CREDIT');
    if (creditMuts.length === 0) return [];
    const totalCredit = creditMuts.reduce((s, m) => s + m.amount, 0) || 1;
    // Group by description (template name proxy)
    const grouped: Record<string, number> = {};
    for (const m of creditMuts) {
      grouped[m.description] = (grouped[m.description] ?? 0) + m.amount;
    }
    return Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, amt], i) => ({
        name: name.length > 28 ? name.slice(0, 28) + '…' : name,
        amount: amt,
        pct: Math.round((amt / totalCredit) * 100),
        color: ['bg-indigo-500', 'bg-violet-400', 'bg-sky-400'][i],
      }));
  };

  $: distribution = buildDistribution();
</script>

<div class="space-y-5">
  <!-- Row 1: Stat cards -->
  <DesignerStatCards
    balance={walletSummary.balance}
    {totalNetIncome}
    {totalTemplatesSold}
  />

  <!-- Row 2: Bank Account & Withdraw funds -->
  <DesignerBankWithdraw bind:balance={walletSummary.balance} />

  <!-- Row 2: Analytics 2-col -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
    <!-- Left: Distribution by template -->
    <div class="bg-card border border-light rounded-2xl p-6 shadow-sm">
      <div class="flex items-start justify-between mb-5">
        <div>
          <h3 class="text-[13px] font-bold text-main">Distribusi Pendapatan</h3>
          <p class="text-[11px] text-muted mt-0.5">Breakdown per template / komisi</p>
        </div>
        <span class="text-[10px] font-bold text-muted bg-nested border border-light rounded-lg px-2 py-1">All Time</span>
      </div>

      {#if distribution.length === 0}
        <div class="flex flex-col items-center py-8 text-center">
          <span class="material-symbols-outlined text-[32px] text-muted mb-2">bar_chart</span>
          <p class="text-[12px] text-muted">Belum ada data distribusi</p>
        </div>
      {:else}
        <div class="space-y-4">
          {#each distribution as item}
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="text-[12px] font-medium text-main truncate max-w-[200px]">{item.name}</span>
                <span class="text-[11px] font-bold text-secondary flex-shrink-0 ml-2">{item.pct}%</span>
              </div>
              <div class="h-2 bg-nested rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700 {item.color}"
                  style="width: {item.pct}%"
                ></div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Right: Weekly activity bar chart -->
    <div class="bg-card border border-light rounded-2xl p-6 shadow-sm">
      <div class="flex items-start justify-between mb-5">
        <div>
          <h3 class="text-[13px] font-bold text-main">Aktivitas Mingguan</h3>
          <p class="text-[11px] text-muted mt-0.5">Pendapatan CREDIT 7 hari terakhir</p>
        </div>
        <span class="text-[10px] font-bold text-indigo-600 bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-2 py-1">Weekly</span>
      </div>

      <!-- Bar chart -->
      <div class="flex items-end gap-2 h-28">
        {#each weeklyData as day}
          <div class="flex flex-col items-center gap-1.5 flex-1">
            <div class="w-full relative flex items-end justify-center" style="height: 80px;">
              <div
                class="w-full rounded-t-lg transition-all duration-700
                       {day.isToday ? 'bg-indigo-500' : 'bg-nested hover:bg-indigo-500/20'}"
                style="height: {day.amount > 0 ? Math.max(6, Math.round((day.amount / maxWeekly) * 80)) : 6}px"
                title="{day.label}: {day.amount > 0 ? `Rp ${day.amount.toLocaleString('id-ID')}` : 'Tidak ada'}"
              ></div>
            </div>
            <span class="text-[10px] font-medium {day.isToday ? 'text-indigo-600 font-bold' : 'text-muted'} leading-none">
              {day.label}
            </span>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Row 3: Mutation ledger table -->
  <DesignerMutationTable mutations={walletSummary.mutations} />
</div>
