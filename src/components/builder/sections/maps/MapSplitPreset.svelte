<script lang="ts">
  import { MapPin, Navigation, Clock } from 'lucide-svelte';

  export let mapEmbedUrl: string;
  export let activeAddress: string;
  export let markerTitle: string;
  export let activePreset: string;
</script>

{#if activePreset === 'split_map_info'}
  <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
    <div class="md:col-span-5 space-y-5 p-6 rounded-2xl border border-base-200 dark:border-slate-800 bg-base-100 dark:bg-slate-900 shadow-sm">
      <div class="space-y-2">
        <h3 class="font-bold text-lg text-base-content">{markerTitle}</h3>
        <p class="text-xs text-base-content/70 leading-relaxed">{activeAddress}</p>
      </div>

      <div class="space-y-3 text-xs border-t border-base-200 dark:border-slate-800 pt-4">
        <div class="flex items-center gap-2.5 text-base-content/80">
          <Clock size={15} class="text-primary" />
          <span>Buka Setiap Hari: 08.00 - 21.00 WIB</span>
        </div>
      </div>

      <div class="pt-2">
        <a
          href="https://maps.google.com/?q={encodeURIComponent(activeAddress)}"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all cursor-pointer"
          style:background-color="var(--theme-primary)"
        >
          <Navigation size={14} />
          <span>Petunjuk Arah via Maps</span>
        </a>
      </div>
    </div>

    <div class="md:col-span-7 h-96 rounded-2xl overflow-hidden shadow-lg border border-base-200 dark:border-slate-800">
      <iframe src={mapEmbedUrl} title="Google Maps" width="100%" height="100%" style="border:0;" loading="lazy" allowfullscreen></iframe>
    </div>
  </div>

{:else if activePreset === 'compact_boxed'}
  <div class="max-w-4xl mx-auto rounded-3xl overflow-hidden border border-base-200 dark:border-slate-800 shadow-xl bg-base-100 dark:bg-slate-900">
    <div class="h-80 w-full">
      <iframe src={mapEmbedUrl} title="Google Maps" width="100%" height="100%" style="border:0;" loading="lazy" allowfullscreen></iframe>
    </div>
    <div class="p-5 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <MapPin size={18} />
        </div>
        <div>
          <h4 class="font-bold text-xs text-base-content">{markerTitle}</h4>
          <p class="text-[11px] text-base-content/60">{activeAddress}</p>
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
        <span>Buka Rute</span>
      </a>
    </div>
  </div>

{:else}
  <!-- fullwidth_map -->
  <div class="w-full rounded-3xl overflow-hidden shadow-xl border border-base-200 dark:border-slate-800" style="height: 420px;">
    <iframe src={mapEmbedUrl} title="Google Maps" width="100%" height="100%" style="border:0;" loading="lazy" allowfullscreen></iframe>
  </div>
{/if}
