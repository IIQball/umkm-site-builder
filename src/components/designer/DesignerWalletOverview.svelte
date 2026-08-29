<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Card, Badge } from '@/components/ui';
  import DesignerStatCards from './DesignerStatCards.svelte';
  import DesignerMutationTable from './DesignerMutationTable.svelte';
  import DesignerBankWithdraw from './DesignerBankWithdraw.svelte';

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
  export let totalNetIncome: number;
  export let totalTemplatesSold: number;
  export let settlementDelayDays = 7;

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
      .map(([name, amt], i) => {
        const cleanName = name.replace(/^Komisi Penjualan Template:\s*/i, '');
        return {
          name: cleanName,
          amount: amt,
          pct: Math.round((amt / totalCredit) * 100),
          color: ['bg-primary', 'bg-secondary', 'bg-info'][i],
        };
      });
  };

  $: distribution = buildDistribution();
</script>

<div class="space-y-8 md:space-y-10">
  <!-- Row 1: Stat cards (Row 1 has its own internal animated stagger) -->
  <DesignerStatCards
    balance={walletSummary.balance}
    availableBalance={walletSummary.availableBalance}
    {totalNetIncome}
    {totalTemplatesSold}
    {settlementDelayDays}
  />

  <!-- Row 2: Bank Account & Withdraw funds -->
  <div class="animate-fade-in-up delay-200">
    <DesignerBankWithdraw
      bind:balance={walletSummary.balance}
      bind:availableBalance={walletSummary.availableBalance}
      {settlementDelayDays}
    />
  </div>

  <!-- Row 3: Analytics 2-col (matching reference image Revenue Bar Chart + Donut Ring Chart) -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up delay-300">
    <!-- Left: Weekly Activity Bar Chart (matching image Revenue Chart) -->
    <Card variant="bordered" padding="lg" radius="3xl" beam beamColor="indigo" className="hover:shadow-md transition-all flex flex-col justify-between group">
      <div class="flex items-start justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0 shadow-xs">
            <span class="material-symbols-outlined text-lg">bar_chart</span>
          </div>
          <div>
            <div class="flex items-baseline gap-2">
              <h3 class="text-heading-md font-bold text-main leading-tight">Aktivitas Pendapatan</h3>
              <Badge variant="indigo" size="sm">7 Hari Terakhir</Badge>
            </div>
            <p class="text-body-sm text-secondary mt-0.5">Riwayat komisi CREDIT yang masuk ke dompet</p>
          </div>
        </div>
        <div class="w-8 h-8 rounded-full bg-nested hover:bg-nested/80 border border-light text-main flex items-center justify-center flex-shrink-0 transition-transform group-hover:rotate-45">
          <span class="material-symbols-outlined text-base">north_east</span>
        </div>
      </div>

      <!-- Bar chart visual with subtle dotted guidelines -->
      <div class="pt-4 pb-2 relative">
        <!-- Guidelines -->
        <div class="absolute inset-x-2 top-8 border-b border-dashed border-light/60 pointer-events-none"></div>
        <div class="absolute inset-x-2 top-20 border-b border-dashed border-light/60 pointer-events-none"></div>

        <div class="flex items-end justify-between gap-3 h-44 px-2 relative z-10">
          {#each weeklyData as day, idx}
            {@const heightPercent = day.amount > 0 ? Math.max(14, Math.round((day.amount / maxWeekly) * 100)) : 8}
            <div class="flex flex-col items-center gap-2 flex-1 group/bar relative">
              <!-- Bar container -->
              <div class="w-full max-w-[38px] bg-nested/70 rounded-t-2xl flex items-end justify-center h-36 overflow-hidden p-0.5 shadow-inner">
                <div
                  class="w-full rounded-t-2xl transition-all duration-700 cursor-pointer animate-bar-grow {day.isToday ? 'bg-gradient-to-t from-[#4338CA] to-[#5551FF] shadow-sm shadow-indigo-500/30' : 'bg-gradient-to-t from-primary/30 to-primary/60 hover:from-[#5551FF]/80 hover:to-[#5551FF]'}"
                  style="height: {heightPercent}%; animation-delay: {idx * 80}ms;"
                ></div>
              </div>

              <!-- Tooltip popup on hover -->
              <div class="absolute -top-9 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-nested border border-main text-main text-3xs font-mono font-bold px-2.5 py-1 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-lg scale-95 group-hover/bar:scale-100 duration-200">
                {day.amount > 0 ? `Rp ${day.amount.toLocaleString('id-ID')}` : 'Rp 0'}
              </div>

              <!-- Day Label -->
              <span class="text-xs font-semibold {day.isToday ? 'text-primary font-extrabold' : 'text-muted'}">
                {day.label}
              </span>
            </div>
          {/each}
        </div>
      </div>
    </Card>

    <!-- Right: Sales by Template Donut Ring Chart (matching image Sales by Category Donut) -->
    <Card variant="bordered" padding="lg" radius="3xl" beam beamColor="sky" className="hover:shadow-md transition-all flex flex-col justify-between group">
      <div class="flex items-start justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 flex-shrink-0 shadow-xs">
            <span class="material-symbols-outlined text-lg">donut_large</span>
          </div>
          <div>
            <div class="flex items-baseline gap-2">
              <h3 class="text-heading-md font-bold text-main leading-tight">Distribusi Penjualan</h3>
              <Badge variant="sky" size="sm">Performa Template</Badge>
            </div>
            <p class="text-body-sm text-secondary mt-0.5">Proporsi komisi berdasarkan template terlaris</p>
          </div>
        </div>
        <div class="w-8 h-8 rounded-full bg-nested hover:bg-nested/80 border border-light text-main flex items-center justify-center flex-shrink-0 transition-transform group-hover:rotate-45">
          <span class="material-symbols-outlined text-base">north_east</span>
        </div>
      </div>

      {#if distribution.length === 0}
        <div class="flex flex-col items-center justify-center py-12 text-center">
          <div class="w-12 h-12 rounded-2xl bg-nested flex items-center justify-center text-muted mb-2">
            <span class="material-symbols-outlined text-2xl">pie_chart</span>
          </div>
          <p class="text-xs text-muted font-sans">Belum ada data distribusi penjualan</p>
        </div>
      {:else}
        <div class="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
          <!-- Donut Ring SVG Visual -->
          <div class="relative w-36 h-36 flex items-center justify-center flex-shrink-0 group/donut">
            <svg viewBox="0 0 42 42" class="w-full h-full transform -rotate-90">
              <!-- Background Ring -->
              <circle
                cx="21"
                cy="21"
                r="15.91549430918954"
                fill="transparent"
                stroke="currentColor"
                stroke-width="4"
                class="text-nested"
              />
              <!-- Donut Slices -->
              {#each distribution as item, idx}
                {@const prevPct = distribution.slice(0, idx).reduce((s, it) => s + it.pct, 0)}
                {@const sliceColor = ['#6366F1', '#0EA5E9', '#F59E0B', '#10B981'][idx % 4]}
                <circle
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke={sliceColor}
                  stroke-width="4.2"
                  stroke-dasharray="{item.pct} {100 - item.pct}"
                  stroke-dashoffset="-{prevPct}"
                  class="transition-all duration-700 hover:stroke-[5.2] cursor-pointer"
                />
              {/each}
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span class="text-3xs font-bold text-muted uppercase tracking-wider font-heading">Top 3</span>
              <span class="text-sm font-extrabold text-main font-mono">100%</span>
            </div>
          </div>

          <!-- Legend List with Mini Progress Bars -->
          <div class="flex-1 space-y-3 w-full">
            {#each distribution as item, idx}
              {@const dotColor = ['bg-[#5551FF]', 'bg-[#06B6D4]', 'bg-[#F59E0B]', 'bg-[#10B981]'][idx % 4]}
              {@const barColor = ['bg-[#5551FF]', 'bg-[#06B6D4]', 'bg-[#F59E0B]', 'bg-[#10B981]'][idx % 4]}
              <div class="p-2 rounded-2xl hover:bg-nested/60 transition-colors border border-transparent hover:border-light">
                <div class="flex items-center justify-between gap-2 mb-1.5">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="w-2.5 h-2.5 rounded-full {dotColor} flex-shrink-0 shadow-2xs"></span>
                    <span class="text-xs font-semibold text-main truncate font-sans">{item.name}</span>
                  </div>
                  <span class="text-xs font-bold text-secondary font-mono bg-nested px-2.5 py-0.5 rounded-lg flex-shrink-0 border border-light/80">{item.pct}%</span>
                </div>
                <!-- Mini Progress Bar -->
                <div class="w-full h-1.5 bg-nested rounded-full overflow-hidden">
                  <div class="h-full rounded-full {barColor} transition-all duration-700" style="width: {item.pct}%"></div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </Card>
  </div>

  <!-- Row 4: Mutation ledger table -->
  <div class="animate-fade-in-up delay-400">
    <DesignerMutationTable mutations={walletSummary.mutations} />
  </div>
</div>
