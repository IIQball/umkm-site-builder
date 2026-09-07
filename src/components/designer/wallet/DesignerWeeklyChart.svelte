<script lang="ts">
  import { onMount } from 'svelte';
  import { Card, Badge } from '@/components/ui';
  import { formatCurrency } from '@/lib/utils';

  export let weeklyData: Array<{ label: string; amount: number; isToday: boolean }> = [];
  export let maxWeekly: number = 1;
  export let topTemplates: Array<{ name: string; amount: number; pct: number; color: string }> = [];
  export let platformFeePercentage: number = 30;

  $: designerSharePercent = Math.max(0, 100 - platformFeePercentage);

  onMount(async () => {
    try {
      const res = await fetch('/api/public/commission');
      if (res.ok) {
        const json = await res.json();
        if (json.ok && json.data && typeof json.data.platformFeePercentage === 'number') {
          platformFeePercentage = json.data.platformFeePercentage;
        }
      }
    } catch {
      // Keep default or passed prop on error
    }
  });
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <!-- Weekly Revenue Chart Card (2 cols) -->
  <div class="lg:col-span-2">
    <Card variant="bordered" padding="none" radius="2xl" className="shadow-xs overflow-hidden h-full">
      <div class="p-6 border-b border-light flex items-center justify-between">
        <div>
          <h3 class="text-heading-md text-main font-bold font-heading">
            Aktivitas Pendapatan 7 Hari Terakhir
          </h3>
          <p class="text-body-sm text-secondary mt-0.5 font-sans">
            Total komisi yang masuk ke dompet Anda setiap harinya
          </p>
        </div>
        <Badge variant="primary" size="sm" dot>Live Sync</Badge>
      </div>

      <div class="p-6">
        <!-- Bar Chart -->
        <div class="flex items-end justify-between gap-2 h-44 pt-4 pb-2">
          {#each weeklyData as day}
            {@const heightPct = day.amount > 0 ? Math.max(8, Math.round((day.amount / maxWeekly) * 100)) : 4}
            <div class="flex-1 flex flex-col items-center gap-2 group relative">
              <!-- Tooltip -->
              {#if day.amount > 0}
                <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-3xs font-bold font-mono px-2 py-1 rounded-lg pointer-events-none whitespace-nowrap z-10 shadow-sm">
                  {formatCurrency(day.amount)}
                </div>
              {/if}

              <!-- Bar -->
              <div class="w-full flex justify-center items-end h-32">
                <div
                  class="w-full max-w-[36px] rounded-t-xl transition-all duration-500 {day.isToday
                    ? 'bg-primary'
                    : day.amount > 0
                    ? 'bg-primary/40 group-hover:bg-primary/70'
                    : 'bg-nested'}"
                  style="height: {heightPct}%;"
                ></div>
              </div>

              <!-- Day Label -->
              <span class="text-3xs font-bold font-heading {day.isToday ? 'text-primary' : 'text-muted'}">
                {day.label}
              </span>
            </div>
          {/each}
        </div>
      </div>
    </Card>
  </div>

  <!-- Credit Distribution Card (1 col) -->
  <div class="lg:col-span-1">
    <Card variant="bordered" padding="none" radius="2xl" className="shadow-xs overflow-hidden h-full flex flex-col justify-between">
      <div class="p-6 border-b border-light">
        <h3 class="text-heading-md text-main font-bold font-heading">
          Kontribusi Template
        </h3>
        <p class="text-body-sm text-secondary mt-0.5 font-sans">
          Top 3 tema terlaris Anda
        </p>
      </div>

      <div class="p-6 flex-1 flex flex-col justify-center gap-4">
        {#if topTemplates.length === 0}
          <div class="text-center py-6 text-muted text-xs">
            Belum ada data distribusi penjualan.
          </div>
        {:else}
          {#each topTemplates as tpl}
            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-xs font-bold">
                <span class="text-main truncate max-w-[160px]">{tpl.name}</span>
                <span class="text-secondary font-mono">{tpl.pct}%</span>
              </div>
              <div class="h-2 w-full bg-nested rounded-full overflow-hidden">
                <div
                  class="{tpl.color} h-full rounded-full transition-all duration-500"
                  style="width: {tpl.pct}%;"
                ></div>
              </div>
            </div>
          {/each}
        {/if}
      </div>

      <div class="p-4 bg-nested/50 border-t border-light text-center">
        <span class="text-3xs text-muted font-sans">
          Pembagian hasil: {designerSharePercent}% Desainer • {platformFeePercentage}% Platform
        </span>
      </div>
    </Card>
  </div>
</div>
