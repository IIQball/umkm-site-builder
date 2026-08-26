<script lang="ts">
  import type { GoogleMapsProps, SectionStyles } from '@/types';
  import MapOverlayPreset from './maps/MapOverlayPreset.svelte';
  import MapSplitPreset from './maps/MapSplitPreset.svelte';
  import MapBranchGuidePreset from './maps/MapBranchGuidePreset.svelte';

  export let props: GoogleMapsProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'fullwidth_map';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'fullwidth_map';
  $: defaultAddress = props?.address || 'Jl. Raya Jember No.KM 13, Labanasem, Kab. Banyuwangi, Jawa Timur 68461';
  $: markerTitle = props?.markerTitle || 'Lokasi Toko Kami';
  $: zoom = props?.zoom || 15;

  let branches = [
    { name: 'Cabang Utama (Pusat)', address: 'Jl. Raya Jember No.KM 13, Kab. Banyuwangi', city: 'Banyuwangi', phone: '+62 812-3456-7890' },
    { name: 'Cabang Kota (Outlet 2)', address: 'Jl. Ahmad Yani No. 45, Pusat Kota', city: 'Banyuwangi Kota', phone: '+62 813-9876-5432' },
    { name: 'Cabang Rogojampi (Outlet 3)', address: 'Jl. Raya Rogojampi No. 88', city: 'Rogojampi', phone: '+62 815-1122-3344' },
  ];
  let selectedBranchIdx = 0;

  $: rawMapsUrl = (props?.googleMapsUrl as string) || (props?.mapsUrl as string) || '';
  $: activeAddress = activePreset === 'multi_branch_map' ? branches[selectedBranchIdx].address : defaultAddress;

  $: mapEmbedUrl = rawMapsUrl && rawMapsUrl.includes('google.com') && rawMapsUrl.includes('embed')
    ? rawMapsUrl
    : `https://maps.google.com/maps?q=${encodeURIComponent(activeAddress)}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
</script>

<div
  id={sectionId ? `map-${sectionId}` : undefined}
  class="w-full box-border py-12 {isActive ? 'relative z-10' : ''}"
  style:background-color="var(--theme-bg)"
>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
    <!-- Header -->
    {#if props.title || props.subtitle}
      <div class="mb-8 text-center max-w-2xl mx-auto">
        {#if props.title}
          <h2 class="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
            {props.title}
          </h2>
        {/if}
        {#if props.subtitle}
          <p class="mt-2 text-sm text-base-content/60">{props.subtitle}</p>
        {/if}
      </div>
    {/if}

    {#if activePreset === 'card_overlay_center' || activePreset === 'full_bleed_with_hours_pill'}
      <MapOverlayPreset {mapEmbedUrl} {activeAddress} {markerTitle} {activePreset} />
    {:else if activePreset === 'multi_branch_map' || activePreset === 'route_guide_map' || activePreset === 'minimal_map_action'}
      <MapBranchGuidePreset
        {mapEmbedUrl}
        {activeAddress}
        {markerTitle}
        {activePreset}
        {branches}
        {selectedBranchIdx}
        selectBranch={(i) => { selectedBranchIdx = i; }}
      />
    {:else}
      <MapSplitPreset {mapEmbedUrl} {activeAddress} {markerTitle} {activePreset} />
    {/if}
  </div>
</div>
