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
  import { getEffectiveMapsElementOrder } from './maps/mapsLayout.helpers';
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

  let activeBranchIdx = 0;

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'fullwidth_map';
  $: branchMode = ((props?.branchMode as string) || (activePreset === 'multi_branch_tabs' ? 'multi' : 'single')) as 'single' | 'multi';

  // Dual-mode data: Tenant DB vs Designer props
  $: rawAddress = store?.address || props?.address || DEFAULT_MAP_ADDRESS;
  $: rawGoogleMapsUrl = store?.googleMapsUrl || props?.googleMapsUrl || '';
  $: rawGoogleMapsEmbedUrl = store?.googleMapsEmbedUrl || (props?.googleMapsEmbedUrl as string) || '';
  $: rawWaNumber = store?.waNumber || props?.whatsappNumber || '';
  $: baseStoreName = store?.name || (props?.markerTitle as string) || (props?.storeName as string) || DEFAULT_STORE_NAME;
  $: lat = store?.latitude ?? (typeof props?.latitude === 'number' ? props.latitude : null);
  $: lng = store?.longitude ?? (typeof props?.longitude === 'number' ? props.longitude : null);

  $: badge = (props?.badgeText as string) || (props?.badge as string) || 'Lokasi Gerai Fisik';
  $: badgeIcon = (props?.badgeIcon as string) || 'MapPin';
  $: title = (props?.title as string) || DEFAULT_MAP_TITLE;
  $: subtitle = (props?.subtitle as string) ?? '';
  $: storeHours = (props?.storeHours as string) || DEFAULT_STORE_HOURS;
  $: storeHoursStatus = (props?.storeHoursStatus as string) || 'Toko Buka Sekarang';
  $: facilities = (props?.facilities as string) || 'Parkir Mobil/Bus Luas, Musholla, Toilet Bersih';
  $: directionsLandmark = (props?.directionsLandmark as string) || '100 meter ke arah timur dari bundaran kota, toko berada di sisi kiri jalan.';
  $: directionsParking = (props?.directionsParking as string) || 'Lahan parkir aman memuat mobil dan motor dengan pengawasan juru parkir resmi.';
  $: mapHeight = (props?.mapHeight as string) || '380px';
  $: zoom = typeof props?.zoom === 'number' ? props.zoom : 15;
  $: ctaText = (props?.ctaText as string) || '';
  $: ctaIcon = (props?.ctaIcon as string) || 'Navigation';
  $: nodeStyles = ((props?.nodeStyles || styles?.nodeStyles || {}) as unknown) as Record<string, Record<string, string>>;

  $: branches = (Array.isArray(props?.branches) && props.branches.length > 0
    ? props.branches
    : DEFAULT_BRANCHES) as MapBranchItem[];

  $: safeBranchIdx = activeBranchIdx >= branches.length ? 0 : activeBranchIdx;
  $: activeBranch = branches[safeBranchIdx] || branches[0];

  $: isMulti = branchMode === 'multi';
  $: effectiveStoreName = isMulti && activeBranch?.name ? activeBranch.name : baseStoreName;
  $: effectiveAddress = isMulti && activeBranch?.address ? activeBranch.address : rawAddress;
  $: effectiveGoogleMapsUrl = isMulti && activeBranch?.googleMapsUrl ? activeBranch.googleMapsUrl : rawGoogleMapsUrl;

  $: mapEmbedUrl = (() => {
    if (!isMulti && rawGoogleMapsEmbedUrl && rawGoogleMapsEmbedUrl.includes('output=embed')) {
      return rawGoogleMapsEmbedUrl;
    }
    return buildMapEmbedUrl(effectiveGoogleMapsUrl || effectiveAddress, zoom, lat, lng, effectiveStoreName, effectiveAddress);
  })();

  $: directMapsUrl = buildDirectMapsUrl(effectiveGoogleMapsUrl || effectiveAddress, lat, lng);
  $: whatsappUrl = buildWhatsAppHelpLink(rawWaNumber);
  $: effectiveOrder = getEffectiveMapsElementOrder(activePreset, props?.elementOrder, branchMode);
  $: showHeader =
    activePreset !== 'compact_boxed' &&
    activePreset !== 'minimal_framed_map' &&
    (!effectiveOrder.length ||
      effectiveOrder.includes('badge') ||
      effectiveOrder.includes('maps_badge') ||
      effectiveOrder.includes('title') ||
      effectiveOrder.includes('maps_title') ||
      effectiveOrder.includes('subtitle') ||
      effectiveOrder.includes('maps_subtitle'));

  const getSlotOrder = (slot: string) => {
    const idx = effectiveOrder.indexOf(slot);
    return idx === -1 ? 99 : idx;
  };

  $: headerMinOrder = Math.min(getSlotOrder('badge'), getSlotOrder('title'), getSlotOrder('subtitle'));
  $: bodyOrder = Math.min(
    getSlotOrder('maps_branch_selector'),
    getSlotOrder('maps_iframe'),
    getSlotOrder('maps_info_card'),
    getSlotOrder('maps_cta_button'),
    getSlotOrder('maps_hours_card'),
    getSlotOrder('maps_directions_card')
  );

  function handleSelectBranch(idx: number) {
    activeBranchIdx = idx;
  }
</script>

<section
  id={sectionId ? `section-${sectionId}` : undefined}
  data-section-type="google_maps"
  class={`maps-card relative w-full py-8 text-left transition-all ${
    isActive ? 'relative z-10' : ''
  }`}
  style="container-type: inline-size; container-name: mapscard;"
>
  <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
    {#if showHeader}
      <div style="order: {headerMinOrder};" class="w-full">
        <MapsHeader
          {sectionId}
          {badge}
          badgeText={badge}
          {badgeIcon}
          {title}
          {subtitle}
          elementOrder={effectiveOrder}
          {nodeStyles}
          {isActive}
        />
      </div>
    {/if}

    <div style="order: {bodyOrder};" class="w-full">
      {#if activePreset === 'split_map_info'}
        <MapsSplitInfo
          {sectionId} {mapEmbedUrl} {directMapsUrl} {whatsappUrl}
          storeName={effectiveStoreName} address={effectiveAddress}
          {storeHours} {facilities} {branchMode} {branches}
          activeBranchIdx={safeBranchIdx} onSelectBranch={handleSelectBranch}
          {ctaText} {ctaIcon} {nodeStyles} elementOrder={effectiveOrder}
        />
      {:else if activePreset === 'compact_boxed'}
        <MapsCompactBoxed
          {sectionId} {mapEmbedUrl} {directMapsUrl}
          storeName={effectiveStoreName} address={effectiveAddress}
          {branchMode} {branches} activeBranchIdx={safeBranchIdx}
          onSelectBranch={handleSelectBranch} {ctaText} {ctaIcon} {nodeStyles}
        />
      {:else if activePreset === 'floating_address_card'}
        <MapsFloatingCard
          {sectionId} {mapEmbedUrl} {directMapsUrl}
          storeName={effectiveStoreName} address={effectiveAddress}
          {facilities} {mapHeight} {branchMode} {branches}
          activeBranchIdx={safeBranchIdx} onSelectBranch={handleSelectBranch}
          {ctaText} {ctaIcon} {nodeStyles}
        />
      {:else if activePreset === 'two_column_directions'}
        <MapsTwoColumnDirections
          {sectionId} {mapEmbedUrl} {directMapsUrl}
          title={effectiveStoreName} {directionsLandmark} {directionsParking}
          {branchMode} {branches} activeBranchIdx={safeBranchIdx}
          onSelectBranch={handleSelectBranch} {ctaText} {ctaIcon} {nodeStyles}
        />
      {:else if activePreset === 'store_hours_highlight'}
        <MapsStoreHours
          {sectionId} {mapEmbedUrl} {whatsappUrl}
          {storeHoursStatus} {storeHours} {branchMode} {branches}
          activeBranchIdx={safeBranchIdx} onSelectBranch={handleSelectBranch}
          {nodeStyles}
        />
      {:else if activePreset === 'interactive_route_finder'}
        <MapsRouteFinder
          {sectionId} {mapEmbedUrl} {directMapsUrl}
          {branchMode} {branches} activeBranchIdx={safeBranchIdx}
          onSelectBranch={handleSelectBranch} {ctaText} {ctaIcon} {nodeStyles}
        />
      {:else if activePreset === 'minimal_framed_map'}
        <MapsMinimalFramed
          {sectionId} {mapEmbedUrl}
          storeName={effectiveStoreName} address={effectiveAddress}
          {branchMode} {branches} activeBranchIdx={safeBranchIdx}
          onSelectBranch={handleSelectBranch} {nodeStyles}
        />
      {:else if activePreset === 'multi_branch_tabs'}
        <MapsMultiBranch
          {sectionId} {branches} activeBranchIdx={safeBranchIdx}
          onSelectBranch={handleSelectBranch} {mapEmbedUrl} {directMapsUrl}
          storeName={effectiveStoreName} address={effectiveAddress}
          {ctaText} {ctaIcon} {nodeStyles}
        />
      {:else if activePreset === 'card_overlay_bottom'}
        <MapsCardOverlay
          {sectionId} {mapEmbedUrl} {directMapsUrl}
          storeName={effectiveStoreName} {storeHours} {mapHeight}
          {branchMode} {branches} activeBranchIdx={safeBranchIdx}
          onSelectBranch={handleSelectBranch} {ctaText} {ctaIcon} {nodeStyles}
        />
      {:else}
        <!-- Preset 1 (Default): fullwidth_map -->
        <MapsFullwidth
          {sectionId} {mapEmbedUrl} {directMapsUrl}
          storeName={effectiveStoreName} address={effectiveAddress}
          {storeHoursStatus} {mapHeight} {branchMode} {branches}
          activeBranchIdx={safeBranchIdx} onSelectBranch={handleSelectBranch}
          {ctaText} {ctaIcon} {nodeStyles} elementOrder={effectiveOrder}
        />
      {/if}
    </div>
  </div>
</section>
