<script lang="ts">
  import { TrendingUp, Users, MessageCircle, Loader2 } from 'lucide-svelte';

  export let storeId = '';
  export let initialViews = 0;
  export let initialClicks = 0;

  interface StoreStats {
    totalViews: number;
    totalWaClicks: number;
  }

  let stats: StoreStats = { totalViews: initialViews, totalWaClicks: initialClicks };
  let loading = false;

  async function refreshStats() {
    loading = true;
    try {
      const res = await fetch(`/api/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId, eventType: 'store_view' }),
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.ok) {
          stats.totalViews = data.data.totalViews;
          stats.totalWaClicks = data.data.totalWaClicks;
        }
      }
    } catch {
      // silently fail on manual refresh
    } finally {
      loading = false;
    }
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h2 class="text-2xl font-bold">Lalu Lintas Toko</h2>
    <button
      class="btn btn-sm btn-outline"
      on:click={refreshStats}
      disabled={loading}
    >
      {#if loading}
        <Loader2 size={16} class="animate-spin" />
      {:else}
        <TrendingUp size={16} />
      {/if}
      Muat Ulang
    </button>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-base-content/60">Total Kunjungan</p>
            <p class="text-4xl font-bold text-primary mt-2">{stats.totalViews}</p>
          </div>
          <div class="rounded-full bg-primary/10 p-4">
            <Users size={32} class="text-primary" />
          </div>
        </div>
        {#if stats.totalViews === 0}
          <div class="mt-4 text-xs text-base-content/60">
            <p>Belum ada data pengunjung</p>
            <p>Tunggu pengunjung pertama ke toko Anda</p>
          </div>
        {:else}
          <div class="mt-4 flex items-center text-xs text-base-content/60">
            <span>Jumlah pengunjung unik ke toko Anda</span>
          </div>
        {/if}
      </div>
    </div>

    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-base-content/60">Klik WhatsApp</p>
            <p class="text-4xl font-bold text-success mt-2">{stats.totalWaClicks}</p>
          </div>
          <div class="rounded-full bg-success/10 p-4">
            <MessageCircle size={32} class="text-success" />
          </div>
        </div>
        {#if stats.totalWaClicks === 0}
          <div class="mt-4 text-xs text-base-content/60">
            <p>Belum ada klik WhatsApp</p>
            <p>Klik tombol WhatsApp akan tercatat di sini</p>
          </div>
        {:else}
          <div class="mt-4 flex items-center text-xs text-base-content/60">
            <span>Jumlah klik tombol WhatsApp</span>
          </div>
        {/if}
      </div>
    </div>
  </div>

  {#if stats.totalViews > 0}
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg">Conversion Rate</h3>
        <div class="mt-4">
          <div class="flex justify-between mb-2">
            <span class="text-sm">WhatsApp / Kunjungan</span>
            <span class="text-sm font-semibold">
              {((stats.totalWaClicks / stats.totalViews) * 100).toFixed(2)}%
            </span>
          </div>
          <progress
            class="progress progress-success w-full"
            value={stats.totalWaClicks}
            max={stats.totalViews}
          />
        </div>
      </div>
    </div>
  {/if}
</div>
