<script lang="ts">
  export let totalViews: number = 0;
  export let totalClicks: number = 0;
  export let isOnboarded: boolean = true;

  interface ChartBar {
    label: string;
    value: number;
    color: string;
    displayValue: string;
  }

  let bars: ChartBar[] = [];
  let conversionRate: number = 0;

  $: {
    const rate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;
    conversionRate = Math.round(rate * 10) / 10;

    bars = [
      {
        label: 'Pengunjung',
        value: totalViews,
        color: 'from-main to-nested',
        displayValue: totalViews.toLocaleString('id-ID'),
      },
      {
        label: 'Klik WhatsApp',
        value: totalClicks,
        color: 'from-orange to-orange/70',
        displayValue: totalClicks.toLocaleString('id-ID'),
      },
    ];
  }

  const maxValue = Math.max(...bars.map((b) => b.value), 1);

  const getBarHeight = (value: number): string => {
    const percentage = (value / maxValue) * 100;
    return `${Math.max(percentage, 10)}%`;
  };
</script>

<div class="bg-card border border-light shadow-xs rounded-3xl p-6 transition-all animate-fade-in-up delay-300 {isOnboarded ? '' : 'opacity-50 pointer-events-none'}">
  <!-- Header -->
  <div class="flex items-center justify-between gap-4 mb-6">
    <div>
      <h3 class="text-lg font-bold text-main">Perbandingan Traffic</h3>
      <p class="text-sm text-muted mt-1">Visualisasi pengunjung vs konversi WhatsApp</p>
    </div>
    <div class="flex flex-col items-end">
      <p class="text-sm font-medium text-muted">Tingkat Konversi</p>
      <p class="text-2xl font-black text-orange">{conversionRate}%</p>
    </div>
  </div>

  <!-- Chart Container -->
  <div class="space-y-6">
    {#each bars as bar (bar.label)}
      <div class="space-y-2">
        <!-- Label & Value -->
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold text-main">{bar.label}</span>
          <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-nested border border-light text-slate-700 dark:text-slate-300">
            {bar.displayValue}
          </span>
        </div>

        <!-- Bar -->
        <div class="h-12 bg-nested rounded-2xl overflow-hidden border border-light/50">
          <div
            class="h-full bg-gradient-to-r {bar.color} transition-all duration-1000 ease-out flex items-center justify-end pr-3"
            style="width: {getBarHeight(bar.value)}; animation: slideIn 0.8s ease-out;"
          >
            <span class="text-xs font-bold text-white drop-shadow-sm">
              {Math.round((bar.value / maxValue) * 100)}%
            </span>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Footer Stats -->
  <div class="mt-6 pt-4 border-t border-light/60">
    <div class="grid grid-cols-3 gap-3 text-center">
      <div>
        <p class="text-2xs text-muted font-medium">Total Pengunjung</p>
        <p class="text-lg font-bold text-main mt-1">{totalViews}</p>
      </div>
      <div>
        <p class="text-2xs text-muted font-medium">Total Kontak</p>
        <p class="text-lg font-bold text-orange mt-1">{totalClicks}</p>
      </div>
      <div>
        <p class="text-2xs text-muted font-medium">Conversion Rate</p>
        <p class="text-lg font-bold text-primary mt-1">{conversionRate}%</p>
      </div>
    </div>
  </div>
</div>

<style>
  @keyframes slideIn {
    from {
      width: 0;
      opacity: 0;
    }
    to {
      width: 100%;
      opacity: 1;
    }
  }
</style>