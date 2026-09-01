<script lang="ts">
  import type { GoogleMapsProps, SectionStyles } from '@/types';
  import { MapPin, Navigation, Clock, Phone, Copy, Check } from 'lucide-svelte';
  import MapsDirectionsGuide from './maps/MapsDirectionsGuide.svelte';
  import MapsMultiBranch from './maps/MapsMultiBranch.svelte';

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
  $: storeHours = (props?.storeHours as string) || 'Buka Setiap Hari: 08.00 - 20.00 WIB';

  let copied = false;
  let activeBranchIdx = 0;

  const branches = [
    { name: 'Pusat (Banyuwangi)', address: 'Jl. Raya Jember No.KM 13, Labanasem, Banyuwangi' },
    { name: 'Cabang Jember', address: 'Jl. Kalimantan No. 45, Sumbersari, Jember' },
    { name: 'Cabang Surabaya', address: 'Jl. Tunjungan No. 88, Genteng, Surabaya' },
  ];

  $: currentAddress = activePreset === 'multi_branch_tabs' ? branches[activeBranchIdx]?.address || address : address;
  $: mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(currentAddress)}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;

  const copyAddress = () => {
    navigator.clipboard.writeText(currentAddress);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  };
</script>

<div
  id={sectionId ? `map-${sectionId}` : undefined}
  data-node="maps_container"
  class={`w-full box-border py-12 ${isActive ? 'relative z-10' : ''}`}
>
  {#if activePreset === 'split_map_info'}
    <!-- Preset 2: Split Map Info -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch text-left">
      <div data-node="map_info_card" class="md:col-span-5 p-6 sm:p-8 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-6">
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
              <span>{storeHours}</span>
            </div>
            <div class="flex items-center gap-2">
              <Phone size={16} class="text-[var(--theme-primary,#2563eb)]" />
              <span>Layanan Pelanggan Siap Membantu</span>
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

      <div data-node="map_frame" class="md:col-span-7 rounded-2xl overflow-hidden border border-base-200 dark:border-slate-800 shadow-md min-h-[360px]">
        <iframe src={mapEmbedUrl} title="Google Map Location" width="100%" height="100%" style="border:0; min-height: 360px;" loading="lazy" allowfullscreen></iframe>
      </div>
    </div>

  {:else if activePreset === 'floating_glass_card'}
    <!-- Preset 3: Floating Glass Card Over Full Map -->
    <div class="relative w-full rounded-3xl overflow-hidden border border-base-200 dark:border-slate-800 shadow-xl min-h-[420px]">
      <iframe src={mapEmbedUrl} title="Google Map Location" width="100%" height="420" style="border:0;" loading="lazy" allowfullscreen></iframe>
      <div class="absolute top-6 left-6 max-w-sm p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/40 dark:border-slate-700 shadow-2xl text-left flex flex-col gap-3">
        <h4 class="font-black text-base text-[var(--theme-text-primary,#0f172a)]">{markerTitle}</h4>
        <p class="text-xs text-[var(--theme-text-muted,#64748b)] leading-relaxed">{address}</p>
        <button
          type="button"
          on:click={copyAddress}
          class="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-[var(--theme-text-primary,#0f172a)] hover:bg-slate-200 transition-colors w-fit cursor-pointer"
        >
          {#if copied}
            <Check size={14} class="text-emerald-500" />
            <span class="text-emerald-600">Alamat Disalin!</span>
          {:else}
            <Copy size={14} />
            <span>Salin Alamat</span>
          {/if}
        </button>
      </div>
    </div>

  {:else if activePreset === 'two_column_directions'}
    <MapsDirectionsGuide {address} {mapEmbedUrl} />

  {:else if activePreset === 'multi_branch_tabs'}
    <MapsMultiBranch {branches} {activeBranchIdx} {mapEmbedUrl} onSelectBranch={(idx) => (activeBranchIdx = idx)} />

  {:else if activePreset === 'curved_border_hero_map'}
    <!-- Preset 8: Curved Border Hero Map -->
    <div class="relative w-full rounded-[40px] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl min-h-[380px]">
      <iframe src={mapEmbedUrl} title="Google Map Location" width="100%" height="380" style="border:0;" loading="lazy" allowfullscreen></iframe>
    </div>

  {:else if activePreset === 'contact_hours_ribbon'}
    <!-- Preset 9: Contact & Hours Ribbon Below Map -->
    <div class="flex flex-col gap-4">
      <div class="rounded-2xl overflow-hidden border border-base-200 dark:border-slate-800 shadow-md min-h-[320px]">
        <iframe src={mapEmbedUrl} title="Google Map Location" width="100%" height="320" style="border:0;" loading="lazy" allowfullscreen></iframe>
      </div>
      <div class="p-4 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 flex flex-wrap items-center justify-around gap-4 text-xs text-[var(--theme-text-primary,#0f172a)]">
        <span class="flex items-center gap-2"><MapPin size={16} class="text-blue-500" /> {address}</span>
        <span class="flex items-center gap-2"><Clock size={16} class="text-emerald-500" /> {storeHours}</span>
      </div>
    </div>

  {:else}
    <!-- Preset 1 (Default): Fullwidth Map -->
    <div
      data-node="map_frame"
      class="w-full rounded-2xl overflow-hidden border border-base-200 dark:border-slate-800 shadow-sm"
      style={`height: ${mapHeight};`}
    >
      <iframe
        src={mapEmbedUrl}
        title="Google Map Location"
        width="100%"
        height="100%"
        style="border:0;"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
      ></iframe>
    </div>
  {/if}
</div>
