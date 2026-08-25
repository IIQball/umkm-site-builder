<script lang="ts">
  import type { GoogleMapsProps, SectionStyles } from '@/types';
  import { MapPin, Navigation, Clock, Phone } from 'lucide-svelte';

  export let props: GoogleMapsProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'fullwidth_map';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'fullwidth_map';
  $: address = props?.address || 'Jl. Raya Jember No.KM 13, Labanasem, Kab. Banyuwangi, Jawa Timur 68461';
  $: markerTitle = props?.markerTitle || 'Lokasi Toko Kami';
  $: zoom = props?.zoom || 15;
  $: mapHeight = props?.mapHeight || '400px';

  $: mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
</script>

<div
  id={sectionId ? `map-${sectionId}` : undefined}
  data-node="maps_container"
  class={`w-full max-w-[var(--theme-max-width,1200px)] mx-auto box-border py-12 ${isActive ? 'relative z-10' : ''}`}
>
  {#if activePreset === 'split_map_info'}
    <!-- Preset 2: Split Map Info (2-Col: Left Address & Hours, Right Map Frame) -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
      <!-- Left Info Box -->
      <div data-node="map_info_card" class="md:col-span-5 p-6 sm:p-8 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-6 text-left">
        <div class="flex flex-col gap-4">
          <div class="inline-flex items-center gap-2 text-xs font-bold text-[var(--theme-primary,#2563eb)] uppercase tracking-wider">
            <MapPin size={16} />
            <span>Kunjungi Toko Kami</span>
          </div>
          <h3 class="text-2xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight">
            {markerTitle}
          </h3>
          <p class="text-sm text-[var(--theme-text-muted,#64748b)] leading-relaxed">
            {address}
          </p>

          <div class="pt-4 border-t border-base-200 dark:border-slate-800 flex flex-col gap-3 text-xs text-[var(--theme-text-muted,#64748b)]">
            <div class="flex items-center gap-2">
              <Clock size={16} class="text-[var(--theme-primary,#2563eb)]" />
              <span>Buka: Senin - Sabtu (08.00 - 20.00 WIB)</span>
            </div>
            <div class="flex items-center gap-2">
              <Phone size={16} class="text-[var(--theme-primary,#2563eb)]" />
              <span>Layanan Pelanggan Tersedia</span>
            </div>
          </div>
        </div>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noreferrer"
          style="height: var(--theme-btn-height, 48px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
          class="inline-flex items-center justify-center px-6 font-bold text-sm shadow-md hover:brightness-105 active:scale-95 transition-all"
        >
          <Navigation size={16} class="mr-2" />
          <span>Buka Petunjuk Arah</span>
        </a>
      </div>

      <!-- Right Map Frame -->
      <div data-node="map_frame" class="md:col-span-7 rounded-2xl overflow-hidden border border-base-200 dark:border-slate-800 shadow-md min-h-[360px]">
        <iframe
          src={mapEmbedUrl}
          title="Google Map Location"
          width="100%"
          height="100%"
          style="border:0; min-height: 360px;"
          loading="lazy"
          allowfullscreen
        ></iframe>
      </div>
    </div>

  {:else if activePreset === 'compact_boxed'}
    <!-- Preset 3: Compact Boxed Card with Preview and Action -->
    <div data-node="map_info_card" class="max-w-xl mx-auto p-6 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-md flex flex-col gap-4 text-left">
      <div class="flex items-start justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--theme-primary,#2563eb)] mb-1">
            <MapPin size={14} />
            <span>Lokasi Utama</span>
          </div>
          <h3 class="text-lg font-bold text-[var(--theme-text-primary,#0f172a)]">{markerTitle}</h3>
          <p class="text-xs text-[var(--theme-text-muted,#64748b)] mt-1 leading-relaxed">{address}</p>
        </div>
      </div>

      <div data-node="map_frame" class="w-full h-48 rounded-lg overflow-hidden border border-base-200 dark:border-slate-800">
        <iframe
          src={mapEmbedUrl}
          title="Google Map Preview"
          width="100%"
          height="100%"
          style="border:0;"
          loading="lazy"
          allowfullscreen
        ></iframe>
      </div>

      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
        target="_blank"
        rel="noreferrer"
        style="height: var(--theme-btn-height, 40px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
        class="inline-flex items-center justify-center px-4 text-xs font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all text-center"
      >
        <Navigation size={14} class="mr-1.5" />
        <span>Buka di Google Maps</span>
      </a>
    </div>

  {:else}
    <!-- Preset 1 (Default): Fullwidth Map with Floating Address Card -->
    <div class="relative w-full rounded-2xl overflow-hidden border border-base-200 dark:border-slate-800 shadow-md">
      <div data-node="map_frame" style={`height: ${mapHeight}; min-height: 320px;`} class="w-full">
        <iframe
          src={mapEmbedUrl}
          title="Google Maps"
          width="100%"
          height="100%"
          style="border:0;"
          loading="lazy"
          allowfullscreen
        ></iframe>
      </div>

      <!-- Floating Card p-6 (24px) -->
      <div
        data-node="map_info_card"
        class="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md p-6 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-base-200 dark:border-slate-800 shadow-xl flex flex-col gap-3 text-left z-10"
      >
        <div class="flex items-center gap-2 text-xs font-bold text-[var(--theme-primary,#2563eb)]">
          <MapPin size={16} />
          <span>{markerTitle}</span>
        </div>
        <p class="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
          {address}
        </p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noreferrer"
          style="height: var(--theme-btn-height, 36px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
          class="inline-flex items-center justify-center px-4 text-xs font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all text-center mt-1"
        >
          <Navigation size={14} class="mr-1.5" />
          <span>Petunjuk Arah</span>
        </a>
      </div>
    </div>
  {/if}
</div>
