<script lang="ts">
  import { MapPin, Navigation, Clock } from 'lucide-svelte';

  export let mapEmbedUrl: string;
  export let activeAddress: string;
  export let markerTitle: string;
  export let activePreset: string;
</script>

{#if activePreset === 'card_overlay_center'}
  <div class="relative w-full rounded-3xl overflow-hidden border border-base-200 dark:border-slate-800 shadow-xl flex items-center justify-center">
    <div style="height: 480px; min-height: 420px;" class="w-full">
      <iframe src={mapEmbedUrl} title="Google Maps" width="100%" height="100%" style="border:0;" loading="lazy" allowfullscreen></iframe>
    </div>
    <div
      class="absolute max-w-sm w-11/12 p-6 rounded-2xl shadow-2xl backdrop-blur-md text-center space-y-3 pointer-events-auto"
      style="background-color: var(--theme-surface); border: 1px solid var(--theme-border, rgba(0,0,0,0.08));"
    >
      <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
        <MapPin size={20} />
      </div>
      <h3 class="font-extrabold text-base text-base-content">{markerTitle}</h3>
      <p class="text-xs text-base-content/70 leading-relaxed">{activeAddress}</p>
      <a
        href="https://maps.google.com/?q={encodeURIComponent(activeAddress)}"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all cursor-pointer w-full justify-center"
        style:background-color="var(--theme-primary)"
      >
        <Navigation size={14} />
        <span>Buka Rute Navigasi</span>
      </a>
    </div>
  </div>
{:else}
  <!-- full_bleed_with_hours_pill -->
  <div class="relative w-full rounded-3xl overflow-hidden border border-base-200 dark:border-slate-800 shadow-xl">
    <div style="height: 440px;" class="w-full">
      <iframe src={mapEmbedUrl} title="Google Maps" width="100%" height="100%" style="border:0;" loading="lazy" allowfullscreen></iframe>
    </div>
    <div class="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl backdrop-blur-md bg-base-100/90 dark:bg-slate-900/90 border border-base-300 dark:border-slate-800 shadow-lg">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <Clock size={16} />
        </div>
        <div>
          <span class="font-bold text-xs text-base-content">Jam Buka Toko</span>
          <p class="text-[11px] text-base-content/70">Senin - Sabtu: 08:00 - 21:00 WIB</p>
        </div>
      </div>
      <a
        href="https://maps.google.com/?q={encodeURIComponent(activeAddress)}"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer"
        style:background-color="var(--theme-primary)"
      >
        <Navigation size={13} />
        <span>Petunjuk Arah</span>
      </a>
    </div>
  </div>
{/if}
