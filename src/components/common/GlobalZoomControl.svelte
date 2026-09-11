<script lang="ts">
  import { onMount } from 'svelte';
  import { zoomStore } from '@/lib/stores/zoomStore';
  import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-svelte';

  export let position: 'bottom-right' | 'bottom-left' = 'bottom-right';

  onMount(() => {
    zoomStore.init();
  });

  $: percentage = Math.round($zoomStore * 100);
  $: isMin = $zoomStore <= zoomStore.min;
  $: isMax = $zoomStore >= zoomStore.max;
  $: isDefault = $zoomStore === 1;

  const handleZoomIn = () => {
    if (!isMax) zoomStore.zoomIn();
  };

  const handleZoomOut = () => {
    if (!isMin) zoomStore.zoomOut();
  };

  const handleReset = () => {
    zoomStore.resetZoom();
  };
</script>

<aside
  aria-label="Kontrol Zoom Halaman"
  class={`fixed z-[9999] pointer-events-auto transition-all duration-300 ${
    position === 'bottom-right' ? 'bottom-5 right-5' : 'bottom-5 left-5'
  }`}
  style="zoom: 1 !important;"
>
  <div
    class="flex items-center gap-1 bg-card/90 dark:bg-slate-900/90 backdrop-blur-md border border-light dark:border-slate-800 rounded-full px-2 py-1.5 shadow-xl shadow-black/10 text-main"
  >
    <!-- Zoom Out Button -->
    <button
      type="button"
      on:click={handleZoomOut}
      disabled={isMin}
      class="w-7 h-7 rounded-full flex items-center justify-center text-secondary hover:text-main hover:bg-nested disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-secondary transition-all cursor-pointer disabled:cursor-not-allowed active:scale-95"
      title="Perkecil Tampilan (Min: 25%)"
      aria-label="Perkecil zoom halaman"
    >
      <ZoomOut size={14} />
    </button>

    <!-- Percentage Display / Reset Trigger -->
    <button
      type="button"
      on:click={handleReset}
      class="px-2 py-0.5 min-w-[3.25rem] text-center font-mono text-xs font-bold text-main hover:text-primary rounded-md hover:bg-nested/60 transition-colors cursor-pointer"
      title="Klik untuk setel ulang ke 100%"
      aria-label={`Zoom saat ini ${percentage}%, klik untuk reset ke 100%`}
    >
      <span>{percentage}%</span>
    </button>

    <!-- Zoom In Button -->
    <button
      type="button"
      on:click={handleZoomIn}
      disabled={isMax}
      class="w-7 h-7 rounded-full flex items-center justify-center text-secondary hover:text-main hover:bg-nested disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-secondary transition-all cursor-pointer disabled:cursor-not-allowed active:scale-95"
      title="Perbesar Tampilan (Maks: 200%)"
      aria-label="Perbesar zoom halaman"
    >
      <ZoomIn size={14} />
    </button>

    <!-- Reset Icon (visible when not 100%) -->
    {#if !isDefault}
      <button
        type="button"
        on:click={handleReset}
        class="w-6 h-6 rounded-full flex items-center justify-center text-muted hover:text-primary hover:bg-nested transition-all cursor-pointer active:scale-95"
        title="Setel Ulang ke 100%"
        aria-label="Setel ulang ke 100%"
      >
        <RotateCcw size={12} />
      </button>
    {/if}
  </div>
</aside>
