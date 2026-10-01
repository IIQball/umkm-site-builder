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

  let displayViewsValue: string = String(initialViews);
  let displayClicksValue: string = String(initialClicks);
  let viewsAnimationId: number = 0;
  let clicksAnimationId: number = 0;

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

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 {!isOnboarded ? 'opacity-50 pointer-events-none' : ''}">
    <StatCard
      label="Pengunjung Toko"
      value={displayViewsValue}
      cardTheme="dark"
      icon="visibility"
      badge="Traffic"
      description="Total kunjungan ke toko"
    />

    <StatCard
      label="Klik WhatsApp"
      value={displayClicksValue}
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