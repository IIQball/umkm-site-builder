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
  let displayViewsValue: string = String(initialViews);
  let displayClicksValue: string = String(initialClicks);
  let viewsAnimationId: number;
  let clicksAnimationId: number;

  const animateCounter = (
    target: number,
    animationIdRef: number,
    setDisplay: (val: string) => void
  ) => {
    if (typeof window === 'undefined' || target === 0) {
      setDisplay(String(target));
      return;
    }

    if (animationIdRef) {
      window.cancelAnimationFrame(animationIdRef);
    }

    const duration = 900;
    const startTime = performance.now();

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(target * ease);

      setDisplay(current.toLocaleString('id-ID'));

      if (progress < 1) {
        animationIdRef = requestAnimationFrame(updateCount);
      } else {
        setDisplay(String(target));
      }
    };

    animationIdRef = requestAnimationFrame(updateCount);
  };

  $: {
    if (stats.totalViews > 0) {
      animateCounter(stats.totalViews, viewsAnimationId, (val) => {
        displayViewsValue = val;
      });
    }
  }

  $: {
    if (stats.totalWaClicks > 0) {
      animateCounter(stats.totalWaClicks, clicksAnimationId, (val) => {
        displayClicksValue = val;
      });
    }
  }
</script>

<div class="space-y-6">
  <div>
    <h2 class="text-2xl font-bold">Lalu Lintas Toko</h2>
    <p class="text-sm text-base-content/60 mt-1">Pantau pengunjung dan interaksi pelanggan Anda</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Visitors Card - Dark theme (matches analytics StatCard) -->
    <div class="bg-main text-canvas dark:bg-nested/95 border border-nested dark:border-nested/70 shadow-sm rounded-3xl p-6 transition-all {!isOnboarded ? 'opacity-50 pointer-events-none' : ''}">
      <div class="flex items-center justify-between gap-2.5 mb-4">
        <p class="text-xs font-bold uppercase tracking-wider font-heading text-white/80">Pengunjung Toko</p>
        <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-nested/50 text-canvas border border-nested/70">
          <span class="material-symbols-outlined text-base">visibility</span>
        </div>
      </div>
      <div class="my-3 min-w-0">
        <p class="text-heading-md sm:text-2xl font-black font-mono tracking-tight leading-none text-white">
          {displayViewsValue}
        </p>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-nested/30">
        <span class="inline-flex items-center gap-1.5 font-bold px-2.5 py-0.5 rounded-full border bg-nested/30 border-nested/50 text-canvas/80">
          <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
          <span>Traffic</span>
        </span>
        <span class="font-normal text-canvas/60 text-2xs">Total kunjungan ke toko</span>
      </div>
    </div>

    <!-- WhatsApp Clicks Card - Orange theme (matches analytics StatCard) -->
    <div class="bg-orange text-white border border-orange/20 shadow-md shadow-orange/10 rounded-3xl p-6 transition-all {!isOnboarded ? 'opacity-50 pointer-events-none' : ''}">
      <div class="flex items-center justify-between gap-2.5 mb-4">
        <p class="text-xs font-bold uppercase tracking-wider font-heading text-white/80">Klik WhatsApp</p>
        <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-white/15 text-white border border-white/20">
          <span class="material-symbols-outlined text-base">message</span>
        </div>
      </div>
      <div class="my-3 min-w-0">
        <p class="text-heading-md sm:text-2xl font-black font-mono tracking-tight leading-none text-white">
          {displayClicksValue}
        </p>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/20">
        <span class="inline-flex items-center gap-1.5 font-bold px-2.5 py-0.5 rounded-full border bg-white/20 border-white/30 text-white">
          <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
          <span>Kontak</span>
        </span>
        <span class="font-normal text-white/80 text-2xs">Klik hubungi via WhatsApp</span>
      </div>
    </div>
  </div>

  {#if stats.totalViews > 0}
    <div class="bg-primary text-white border border-primary/20 shadow-md shadow-primary/10 rounded-3xl p-6 transition-all {!isOnboarded ? 'opacity-50 pointer-events-none' : ''}">
      <div class="flex items-center justify-between gap-2.5 mb-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-wider font-heading text-white/80">Tingkat Konversi</p>
          <p class="text-heading-md sm:text-2xl font-black font-mono tracking-tight leading-none text-white mt-3">
            {((stats.totalWaClicks / stats.totalViews) * 100).toFixed(2)}%
          </p>
        </div>
        <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-white/15 text-white border border-white/20">
          <span class="material-symbols-outlined text-base">trending_up</span>
        </div>
      </div>
      <div class="mt-4 flex flex-col gap-2">
        <progress
          class="progress progress-primary w-full"
          value={stats.totalWaClicks}
          max={stats.totalViews}></progress>
        <p class="text-xs text-white/70">
          {stats.totalWaClicks} dari {stats.totalViews} pengunjung menghubungi Anda
        </p>
      </div>
    </div>
  {/if}
</div>
