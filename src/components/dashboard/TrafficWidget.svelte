<script lang="ts">
  import StatCard from '@/components/ui/StatCard.svelte';

  export let initialViews = 0;
  export let initialClicks = 0;
  export let isOnboarded = true;

  interface StoreStats {
    totalViews: number;
    totalWaClicks: number;
  }

  let stats: StoreStats = { totalViews: initialViews, totalWaClicks: initialClicks };
  $: conversionRate = stats.totalViews > 0
    ? ((stats.totalWaClicks / stats.totalViews) * 100).toFixed(2) + '%'
    : '0%';
</script>

<div class="space-y-6">
  <div>
    <h2 class="text-2xl font-bold">Lalu Lintas Toko</h2>
    <p class="text-sm text-base-content/60 mt-1">Pantau pengunjung dan interaksi pelanggan Anda</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 {!isOnboarded ? 'opacity-50 pointer-events-none' : ''}">
    <StatCard
      label="Pengunjung Toko"
      value={stats.totalViews}
      cardTheme="dark"
      icon="visibility"
      badge="Traffic"
      description="Total kunjungan ke toko"
    />

    <StatCard
      label="Klik WhatsApp"
      value={stats.totalWaClicks}
      cardTheme="orange"
      icon="message"
      badge="Kontak"
      description="Klik hubungi via WhatsApp"
    />
  </div>

  {#if stats.totalViews > 0}
    <div class="space-y-3 {!isOnboarded ? 'opacity-50 pointer-events-none' : ''}">
      <StatCard
        label="Tingkat Konversi"
        value={conversionRate}
        cardTheme="blue"
        icon="trending_up"
        badge="Konversi"
        description="{stats.totalWaClicks} dari {stats.totalViews} pengunjung menghubungi Anda"
      />
      <div class="px-2">
        <progress
          class="progress progress-primary w-full"
          value={stats.totalWaClicks}
          max={stats.totalViews}
        ></progress>
      </div>
    </div>
  {/if}
</div>

