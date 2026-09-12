<script lang="ts">
  import type { GoogleMapsProps, SectionStyles } from '@/types';
  import './maps/maps.css';
  import {
    DEFAULT_MAP_ADDRESS,
    DEFAULT_MAP_TITLE,
    DEFAULT_STORE_NAME,
    DEFAULT_STORE_HOURS,
    DEFAULT_BRANCHES,
    buildMapEmbedUrl,
    buildDirectMapsUrl,
    buildWhatsAppHelpLink,
    type MapBranchItem,
  } from './maps/maps.helpers';
  import MapsHeader from './maps/MapsHeader.svelte';
  import MapsFullwidth from './maps/MapsFullwidth.svelte';
  import MapsSplitInfo from './maps/MapsSplitInfo.svelte';
  import MapsCompactBoxed from './maps/MapsCompactBoxed.svelte';
  import MapsFloatingCard from './maps/MapsFloatingCard.svelte';
  import MapsTwoColumnDirections from './maps/MapsTwoColumnDirections.svelte';
  import MapsStoreHours from './maps/MapsStoreHours.svelte';
  import MapsRouteFinder from './maps/MapsRouteFinder.svelte';
  import MapsMinimalFramed from './maps/MapsMinimalFramed.svelte';
  import MapsMultiBranch from './maps/MapsMultiBranch.svelte';
  import MapsCardOverlay from './maps/MapsCardOverlay.svelte';

  export let props: GoogleMapsProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'fullwidth_map';
  export let store: {
    googleMapsUrl?: string;
    googleMapsEmbedUrl?: string;
    waNumber?: string;
    name?: string;
    address?: string;
    latitude?: number | null;
    longitude?: number | null;
  } | null = null;

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'fullwidth_map';

  // Dual-mode data: Tenant DB vs Designer props
  $: rawAddress = store?.address || props?.address || DEFAULT_MAP_ADDRESS;
  $: rawGoogleMapsUrl = store?.googleMapsUrl || props?.googleMapsUrl || '';
  $: rawGoogleMapsEmbedUrl = store?.googleMapsEmbedUrl || (props?.googleMapsEmbedUrl as string) || '';
  $: rawWaNumber = store?.waNumber || props?.whatsappNumber || '';
  $: storeName = store?.name || (props?.markerTitle as string) || (props?.storeName as string) || DEFAULT_STORE_NAME;
  $: lat = store?.latitude ?? (typeof props?.latitude === 'number' ? props.latitude : null);
  $: lng = store?.longitude ?? (typeof props?.longitude === 'number' ? props.longitude : null);

  $: badge = (props?.badge as string) ?? 'Lokasi Gerai Fisik';
  $: title = (props?.title as string) || DEFAULT_MAP_TITLE;
  $: subtitle = (props?.subtitle as string) ?? '';
  $: storeHours = (props?.storeHours as string) || DEFAULT_STORE_HOURS;
  $: storeHoursStatus = (props?.storeHoursStatus as string) || 'Toko Buka Sekarang';
  $: facilities = (props?.facilities as string) || 'Parkir Mobil/Bus Luas, Musholla, Toilet Bersih';
  $: directionsLandmark = (props?.directionsLandmark as string) || '100 meter ke arah timur dari bundaran kota, toko berada di sisi kiri jalan.';
  $: directionsParking = (props?.directionsParking as string) || 'Lahan parkir aman memuat mobil dan motor dengan pengawasan juru parkir resmi.';
  $: mapHeight = (props?.mapHeight as string) || '380px';
  $: zoom = typeof props?.zoom === 'number' ? props.zoom : 15;

  $: branches = (Array.isArray(props?.branches) && props.branches.length > 0
    ? props.branches
    : DEFAULT_BRANCHES) as MapBranchItem[];

  // Priority hierarchy for embed URL:
  // 1. Direct embed URL provided
  // 2. buildMapEmbedUrl using coordinates (lat, lng), URL, or clean address
  $: mapEmbedUrl = (() => {
    if (rawGoogleMapsEmbedUrl && rawGoogleMapsEmbedUrl.includes('output=embed')) {
      return rawGoogleMapsEmbedUrl;
    }
    return buildMapEmbedUrl(rawGoogleMapsUrl || rawAddress, zoom, lat, lng, storeName, rawAddress);
  })();
  $: directMapsUrl = buildDirectMapsUrl(rawGoogleMapsUrl || rawAddress, lat, lng);
  $: whatsappUrl = buildWhatsAppHelpLink(rawWaNumber);

  // Preset 3 and 8 handle their own minimal titles
  $: showHeader = activePreset !== 'compact_boxed' && activePreset !== 'minimal_framed_map';
</script>

<section
  id={sectionId ? `section-${sectionId}` : undefined}
  data-section-type="google_maps"
  class={`maps-card relative w-full py-8 text-left transition-all ${
    isActive ? 'relative z-10' : ''
  }`}
  style="container-type: inline-size; container-name: mapscard;"
>
  <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {#if showHeader}
      <MapsHeader {sectionId} {badge} {title} {subtitle} />
    {/if}

    {#if activePreset === 'split_map_info'}
      <MapsSplitInfo
        {sectionId}
        {mapEmbedUrl}
        {directMapsUrl}
        {whatsappUrl}
        {storeName}
        address={rawAddress}
        {storeHours}
        {facilities}
      />
    {:else if activePreset === 'compact_boxed'}
      <MapsCompactBoxed
        {sectionId}
        {mapEmbedUrl}
        {directMapsUrl}
        {storeName}
        address={rawAddress}
      />
    {:else if activePreset === 'floating_address_card'}
      <MapsFloatingCard
        {sectionId}
        {mapEmbedUrl}
        {directMapsUrl}
        {storeName}
        address={rawAddress}
        {facilities}
        {mapHeight}
      />
    {:else if activePreset === 'two_column_directions'}
      <MapsTwoColumnDirections
        {sectionId}
        {mapEmbedUrl}
        {directMapsUrl}
        title={storeName}
        {directionsLandmark}
        {directionsParking}
      />
    {:else if activePreset === 'store_hours_highlight'}
      <MapsStoreHours
        {sectionId}
        {mapEmbedUrl}
        {whatsappUrl}
        {storeHoursStatus}
        {storeHours}
      />
    {:else if activePreset === 'interactive_route_finder'}
      <MapsRouteFinder
        {sectionId}
        {mapEmbedUrl}
        {directMapsUrl}
      />
    {:else if activePreset === 'minimal_framed_map'}
      <MapsMinimalFramed
        {sectionId}
        {mapEmbedUrl}
        {storeName}
        address={rawAddress}
      />
    {:else if activePreset === 'multi_branch_tabs'}
      <MapsMultiBranch
        {sectionId}
        {branches}
      />
    {:else if activePreset === 'card_overlay_bottom'}
      <MapsCardOverlay
        {sectionId}
        {mapEmbedUrl}
        {directMapsUrl}
        {storeName}
        {storeHours}
        {mapHeight}
      />
    {:else}
      <!-- Preset 1 (Default): fullwidth_map -->
      <MapsFullwidth
        {sectionId}
        {mapEmbedUrl}
        {directMapsUrl}
        {storeName}
        address={rawAddress}
        {storeHoursStatus}
        {mapHeight}
      />
    {/if}
  </div>
</section>
