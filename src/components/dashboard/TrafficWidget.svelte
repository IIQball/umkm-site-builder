<script lang="ts">
  import { Users, MessageCircle } from 'lucide-svelte';

  export let initialViews = 0;
  export let initialClicks = 0;
  export let isOnboarded = true;

  interface StoreStats {
    totalViews: number;
    totalWaClicks: number;
  }

  let stats: StoreStats = { totalViews: initialViews, totalWaClicks: initialClicks };
</script>

<div class="space-y-6">
  <div>
    <h2 class="text-2xl font-bold">Lalu Lintas Toko</h2>
    <p class="text-sm text-base-content/60 mt-1">Pantau pengunjung dan interaksi pelanggan Anda</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="card bg-base-100 shadow-md {!isOnboarded ? 'opacity-50 pointer-events-none' : ''}">
      <div class="card-body">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-base-content/60">Pengunjung Toko</p>
            <p class="text-4xl font-bold text-primary mt-2">{stats.totalViews}</p>
          </div>
          <div class="rounded-full bg-primary/10 p-4">
            <Users size={32} class="text-primary" />
          </div>
        </div>
        {#if stats.totalViews === 0}
          <div class="mt-4 text-xs text-base-content/60">
            <p>Belum ada pengunjung tercatat</p>
            <p>Tunggu sampai orang pertama kali mengunjungi toko Anda</p>
          </div>
        {:else}
          <div class="mt-4 text-xs text-base-content/60">
            <p>Total orang yang telah berkunjung ke toko Anda</p>
          </div>
        {/if}
      </div>
    </div>

    <div class="card bg-base-100 shadow-md {!isOnboarded ? 'opacity-50 pointer-events-none' : ''}">
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
            <p>Belum ada yang hubungi via WhatsApp</p>
            <p>Setiap kali pembeli klik tombol WhatsApp akan tercatat di sini</p>
          </div>
        {:else}
          <div class="mt-4 text-xs text-base-content/60">
            <p>Jumlah pembeli yang klik tombol WhatsApp Anda</p>
          </div>
        {/if}
      </div>
    </div>
  </div>

  {#if stats.totalViews > 0}
    <div class="card bg-base-100 shadow-md {!isOnboarded ? 'opacity-50 pointer-events-none' : ''}">
      <div class="card-body">
        <h3 class="card-title text-lg">Tingkat Konversi</h3>
        <p class="text-sm text-base-content/60 mt-1">Berapa persen pengunjung yang menghubungi via WhatsApp</p>
        <div class="mt-4">
          <div class="flex justify-between mb-2">
            <span class="text-sm font-medium">Persentase Konversi</span>
            <span class="text-sm font-semibold text-success">
              {((stats.totalWaClicks / stats.totalViews) * 100).toFixed(2)}%
            </span>
          </div>
          <progress
            class="progress progress-success w-full"
            value={stats.totalWaClicks}
            max={stats.totalViews}
          />
          <p class="text-xs text-base-content/60 mt-2">
            {stats.totalWaClicks} dari {stats.totalViews} pengunjung menghubungi Anda
          </p>
        </div>
      </div>
    </div>
  {/if}
</div>
