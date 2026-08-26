<script lang="ts">
  import type { GoogleMapsProps, SectionStyles } from '@/types';
  import { MapPin, Navigation, Clock, Phone, Compass, Building2, CheckCircle2 } from 'lucide-svelte';

  export let props: GoogleMapsProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'fullwidth_map';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'fullwidth_map';
  $: defaultAddress = props?.address || 'Jl. Raya Jember No.KM 13, Labanasem, Kab. Banyuwangi, Jawa Timur 68461';
  $: markerTitle = props?.markerTitle || 'Lokasi Toko Kami';
  $: zoom = props?.zoom || 15;
  $: mapHeight = props?.mapHeight || '400px';

  let branches = [
    { name: 'Cabang Utama (Pusat)', address: 'Jl. Raya Jember No.KM 13, Kab. Banyuwangi', city: 'Banyuwangi', phone: '+62 812-3456-7890' },
    { name: 'Cabang Kota (Outlet 2)', address: 'Jl. Ahmad Yani No. 45, Pusat Kota', city: 'Banyuwangi Kota', phone: '+62 813-9876-5432' },
    { name: 'Cabang Rogojampi (Outlet 3)', address: 'Jl. Raya Rogojampi No. 88', city: 'Rogojampi', phone: '+62 815-1122-3344' },
  ];
  let selectedBranchIdx = 0;

  $: rawMapsUrl = (props?.googleMapsUrl as string) || (props?.mapsUrl as string) || '';
  $: activeAddress = activePreset === 'multi_branch_map'
    ? branches[selectedBranchIdx].address
    : defaultAddress;

  $: mapEmbedUrl = rawMapsUrl && rawMapsUrl.includes('google.com') && rawMapsUrl.includes('embed')
    ? rawMapsUrl
    : `https://maps.google.com/maps?q=${encodeURIComponent(activeAddress)}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
</script>

<div
  id={sectionId ? `map-${sectionId}` : undefined}
  data-node="maps_container"
  class={`w-full box-border py-12 ${isActive ? 'relative z-10' : ''}`}
>
  {#if activePreset === 'card_overlay_center'}
    <!-- Preset A: Card Overlay Center (Peta full width + kartu info melayang tepat di tengah) -->
    <div class="relative w-full rounded-3xl overflow-hidden border border-base-200 dark:border-slate-800 shadow-xl flex items-center justify-center">
      <div data-node="map_frame" style="height: 480px; min-height: 420px;" class="w-full">
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

      <!-- Center Floating Card -->
      <div
        data-node="map_info_card"
        class="absolute m-4 max-w-md p-6 sm:p-8 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-base-200 dark:border-slate-800 shadow-2xl flex flex-col items-center text-center gap-4 z-10"
      >
        <div class="w-12 h-12 rounded-full bg-blue-50 text-[var(--theme-primary,#2563eb)] flex items-center justify-center shadow-inner">
          <MapPin size={24} />
        </div>
        <div>
          <h3 class="text-xl font-black text-[var(--theme-text-primary,#0f172a)]">{markerTitle}</h3>
          <p class="text-xs text-[var(--theme-text-muted,#64748b)] mt-1 leading-relaxed max-w-xs">{defaultAddress}</p>
        </div>
        <div class="w-full pt-3 border-t border-base-200 dark:border-slate-800 flex items-center justify-around text-xs text-[var(--theme-text-muted,#64748b)]">
          <div class="flex items-center gap-1.5">
            <Clock size={14} class="text-[var(--theme-primary,#2563eb)]" />
            <span>08.00 - 20.00</span>
          </div>
          <div class="flex items-center gap-1.5">
            <Phone size={14} class="text-[var(--theme-primary,#2563eb)]" />
            <span>Tersedia CS</span>
          </div>
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(defaultAddress)}`}
          target="_blank"
          rel="noreferrer"
          style="height: 40px; border-radius: 8px; background-color: var(--theme-primary, #2563eb); color: #ffffff;"
          class="w-full inline-flex items-center justify-center px-4 text-xs font-bold shadow-md hover:brightness-105 transition-all"
        >
          <Navigation size={14} class="mr-1.5" />
          <span>Buka Petunjuk Arah</span>
        </a>
      </div>
    </div>

  {:else if activePreset === 'multi_branch_map'}
    <!-- Preset B: Multi Branch Map (Tabs cabang di kiri, peta responsif di kanan) -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
      <!-- Left: Branch Selector List -->
      <div class="md:col-span-5 flex flex-col gap-4 text-left">
        <div>
          <h3 class="text-2xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight">Daftar Cabang Toko</h3>
          <p class="text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] mt-1">Pilih cabang toko terdekat dari lokasi Anda saat ini</p>
        </div>

        <div class="flex flex-col gap-3">
          {#each branches as branch, idx}
            <button
              type="button"
              on:click={() => (selectedBranchIdx = idx)}
              class={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                selectedBranchIdx === idx
                  ? 'bg-blue-500/10 border-[var(--theme-primary,#2563eb)] ring-2 ring-blue-400/30 shadow-sm'
                  : 'bg-[var(--theme-surface,#f8fafc)] hover:bg-base-200 border-base-200 dark:border-slate-800'
              }`}
            >
              <div class={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                selectedBranchIdx === idx ? 'bg-[var(--theme-primary,#2563eb)] text-white' : 'bg-base-200 text-base-content/70'
              }`}>
                <Building2 size={16} />
              </div>
              <div class="min-w-0 flex-1">
                <h4 class="text-sm font-bold text-[var(--theme-text-primary,#0f172a)]">{branch.name}</h4>
                <p class="text-xs text-[var(--theme-text-muted,#64748b)] mt-0.5">{branch.address}</p>
                <p class="text-[11px] font-semibold text-[var(--theme-primary,#2563eb)] mt-1">{branch.phone}</p>
              </div>
            </button>
          {/each}
        </div>
      </div>

      <!-- Right: Interactive Map Frame -->
      <div data-node="map_frame" class="md:col-span-7 rounded-3xl overflow-hidden border border-base-200 dark:border-slate-800 shadow-md min-h-[380px]">
        <iframe
          src={mapEmbedUrl}
          title="Branch Map"
          width="100%"
          height="100%"
          style="border:0; min-height: 380px;"
          loading="lazy"
          allowfullscreen
        ></iframe>
      </div>
    </div>

  {:else if activePreset === 'route_guide_map'}
    <!-- Preset C: Route Guide & Map (Peta 7 kolom kiri + Panduan rute transportasi 5 kolom kanan) -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
      <div data-node="map_frame" class="md:col-span-7 rounded-3xl overflow-hidden border border-base-200 dark:border-slate-800 shadow-md min-h-[380px]">
        <iframe
          src={mapEmbedUrl}
          title="Route Map"
          width="100%"
          height="100%"
          style="border:0; min-height: 380px;"
          loading="lazy"
          allowfullscreen
        ></iframe>
      </div>

      <div class="md:col-span-5 p-6 rounded-3xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm flex flex-col justify-between text-left gap-6">
        <div>
          <div class="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--theme-primary,#2563eb)] uppercase tracking-wider mb-2">
            <Compass size={14} />
            <span>Panduan Menuju Lokasi</span>
          </div>
          <h3 class="text-xl font-black text-[var(--theme-text-primary,#0f172a)]">{markerTitle}</h3>
          <p class="text-xs text-[var(--theme-text-muted,#64748b)] mt-1">{defaultAddress}</p>

          <div class="mt-4 pt-4 border-t border-base-200 dark:border-slate-800 flex flex-col gap-3">
            <div class="flex items-start gap-2.5 text-xs">
              <CheckCircle2 size={16} class="text-emerald-600 flex-shrink-0 mt-0.5" />
              <span class="text-[var(--theme-text-primary,#0f172a)]"><strong>Dari Pusat Kota:</strong> 10 menit via jalan protokol utama ke arah selatan.</span>
            </div>
            <div class="flex items-start gap-2.5 text-xs">
              <CheckCircle2 size={16} class="text-emerald-600 flex-shrink-0 mt-0.5" />
              <span class="text-[var(--theme-text-primary,#0f172a)]"><strong>Patokan Lokasi:</strong> Tepat di seberang SPBU Labanasem / samping minimarket.</span>
            </div>
            <div class="flex items-start gap-2.5 text-xs">
              <CheckCircle2 size={16} class="text-emerald-600 flex-shrink-0 mt-0.5" />
              <span class="text-[var(--theme-text-primary,#0f172a)]"><strong>Fasilitas Parkir:</strong> Area parkir luas mobil dan motor gratis.</span>
            </div>
          </div>
        </div>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(defaultAddress)}`}
          target="_blank"
          rel="noreferrer"
          style="height: 44px; border-radius: 8px; background-color: var(--theme-primary, #2563eb); color: #ffffff;"
          class="inline-flex items-center justify-center px-4 text-xs font-bold shadow-md hover:brightness-105 transition-all text-center"
        >
          <Navigation size={14} class="mr-1.5" />
          <span>Buka di Google Maps / Waze</span>
        </a>
      </div>
    </div>

  {:else if activePreset === 'minimal_map_action'}
    <!-- Preset D: Minimal Map Action (Peta ramping 280px + baris aksi satu baris di bawah) -->
    <div class="w-full max-w-4xl mx-auto flex flex-col gap-4">
      <div data-node="map_frame" class="w-full h-[280px] rounded-3xl overflow-hidden border border-base-200 dark:border-slate-800 shadow-md">
        <iframe
          src={mapEmbedUrl}
          title="Minimal Map"
          width="100%"
          height="100%"
          style="border:0;"
          loading="lazy"
          allowfullscreen
        ></iframe>
      </div>

      <div class="p-4 sm:p-5 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-[var(--theme-primary,#2563eb)] flex items-center justify-center flex-shrink-0">
            <MapPin size={18} />
          </div>
          <div class="min-w-0">
            <p class="font-bold text-sm text-[var(--theme-text-primary,#0f172a)] truncate">{markerTitle}</p>
            <p class="text-xs text-[var(--theme-text-muted,#64748b)] truncate max-w-md">{defaultAddress}</p>
          </div>
        </div>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(defaultAddress)}`}
          target="_blank"
          rel="noreferrer"
          style="height: 38px; border-radius: 8px; background-color: var(--theme-primary, #2563eb); color: #ffffff;"
          class="px-5 text-xs font-bold shadow-sm inline-flex items-center justify-center gap-1.5 flex-shrink-0 hover:brightness-105 transition-all"
        >
          <Navigation size={14} />
          <span>Navigasi</span>
        </a>
      </div>
    </div>

  {:else if activePreset === 'full_bleed_with_hours_pill'}
    <!-- Preset E: Full Bleed with Hours Pill (Peta full width dengan floating status pill hijau di pojok atas) -->
    <div class="relative w-full rounded-3xl overflow-hidden border border-base-200 dark:border-slate-800 shadow-xl">
      <div data-node="map_frame" style={`height: ${mapHeight}; min-height: 340px;`} class="w-full">
        <iframe
          src={mapEmbedUrl}
          title="Full Bleed Map"
          width="100%"
          height="100%"
          style="border:0;"
          loading="lazy"
          allowfullscreen
        ></iframe>
      </div>

      <!-- Top-Right Floating Status Pill -->
      <div class="absolute top-4 right-4 z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600/90 text-white text-xs font-bold shadow-lg backdrop-blur-md border border-white/20">
        <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
        <span>Buka Sekarang: 08.00 - 21.00 WIB</span>
      </div>

      <!-- Bottom Address Bar -->
      <div class="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-base-200 dark:border-slate-800 shadow-lg flex items-center justify-between gap-4 z-10 text-left">
        <div class="min-w-0">
          <p class="font-bold text-xs text-[var(--theme-text-primary,#0f172a)] truncate">{markerTitle}</p>
          <p class="text-[11px] text-[var(--theme-text-muted,#64748b)] truncate">{defaultAddress}</p>
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(defaultAddress)}`}
          target="_blank"
          rel="noreferrer"
          style="height: 32px; border-radius: 6px; background-color: var(--theme-primary, #2563eb); color: #ffffff;"
          class="px-3 text-[11px] font-bold inline-flex items-center justify-center flex-shrink-0"
        >
          <span>Peta</span>
        </a>
      </div>
    </div>

  {:else if activePreset === 'split_map_info'}
    <!-- Preset 2: Split Map Info (2-Col: Left Address & Hours, Right Map Frame) -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
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
            {defaultAddress}
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
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(defaultAddress)}`}
          target="_blank"
          rel="noreferrer"
          style="height: var(--theme-btn-height, 48px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
          class="inline-flex items-center justify-center px-6 font-bold text-sm shadow-md hover:brightness-105 active:scale-95 transition-all"
        >
          <Navigation size={16} class="mr-2" />
          <span>Buka Petunjuk Arah</span>
        </a>
      </div>

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
          <p class="text-xs text-[var(--theme-text-muted,#64748b)] mt-1 leading-relaxed">{defaultAddress}</p>
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
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(defaultAddress)}`}
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

      <div
        data-node="map_info_card"
        class="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md p-6 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-base-200 dark:border-slate-800 shadow-xl flex flex-col gap-3 text-left z-10"
      >
        <div class="flex items-center gap-2 text-xs font-bold text-[var(--theme-primary,#2563eb)]">
          <MapPin size={16} />
          <span>{markerTitle}</span>
        </div>
        <p class="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
          {defaultAddress}
        </p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(defaultAddress)}`}
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
