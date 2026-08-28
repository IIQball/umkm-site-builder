<script lang="ts">
  import { TrendingUp, Users, MessageCircle, Loader2 } from 'lucide-svelte';

  export let storeId = '';

  interface StoreStats {
    totalViews: number;
    totalWaClicks: number;
  }

  let stats: StoreStats = { totalViews: 0, totalWaClicks: 0 };
  let loading = true;
  let error = '';

  async function fetchStats() {
    loading = true;
    error = '';
    try {
      const res = await fetch(`/api/stores/${storeId}`);
      if (!res.ok) {
        error = 'Gagal memuat statistik';
        return;
      }
      const data = await res.json();
      if (data.ok && data.data) {
        stats = {
          totalViews: data.data.totalViews || 0,
          totalWaClicks: data.data.totalWaClicks || 0,
        };
      } else {
        error = 'Data statistik tidak tersedia';
      }
    } catch {
      error = 'Terjadi kesalahan saat memuat statistik';
    } finally {
      loading = false;
    }
  }

  $: if (storeId) {
    fetchStats();
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h2 class="text-2xl font-bold">Lalu Lintas Toko</h2>
    <button
      class="btn btn-sm btn-outline"
      on:click={fetchStats}
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

  {#if error}
    <div class="alert alert-error">
      <span>{error}</span>
    </div>
  {/if}

  {#if loading}
    <div class="flex items-center justify-center py-16">
      <Loader2 size={32} class="animate-spin text-primary" />
      <span class="ml-3 text-base-content/60">Memuat statistik...</span>
    </div>
  {:else}
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
          <div class="mt-4 flex items-center text-xs text-base-content/60">
            <span>Jumlah pengunjung unik ke toko Anda</span>
          </div>
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
          <div class="mt-4 flex items-center text-xs text-base-content/60">
            <span>Jumlah klik tombol WhatsApp</span>
          </div>
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
  {/if}
</div>
