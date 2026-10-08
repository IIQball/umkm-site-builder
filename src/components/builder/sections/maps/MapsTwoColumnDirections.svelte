<script lang="ts">
  import { Flag, Car, ArrowRight } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import type { MapBranchItem } from './maps.helpers';
  import { resolveMapIcon } from './mapsIcons';
  import { resolveMapsNodeStyle } from './mapsStyles.helpers';
  import MapsBranchSwitcher from './MapsBranchSwitcher.svelte';

  export let sectionId: string = '';
  export let mapEmbedUrl: string = '';
  export let directMapsUrl: string = '';
  export let title: string = 'Petunjuk Menuju Lokasi';
  export let directionsLandmark: string = '100 meter ke arah timur dari bundaran kota, toko berada di sisi kiri jalan bersebelahan dengan apotek.';
  export let directionsParking: string = 'Lahan parkir aman memuat mobil dan motor dengan pengawasan petugas parkir resmi.';
  export let branchMode: 'single' | 'multi' = 'single';
  export let branches: MapBranchItem[] = [];
  export let activeBranchIdx: number = 0;
  export let onSelectBranch: (idx: number) => void = () => {};
  export let ctaText: string = 'Mulai Navigasi Arah';
  export let ctaIcon: string = 'Navigation';
  export let nodeStyles: Record<string, Record<string, string>> = {};

  $: isIframeSelected = $canvasStore?.selectedNodeId === 'maps_iframe' && $canvasStore?.selectedSectionId === sectionId;
  $: isDirectionsSelected = ($canvasStore?.selectedNodeId === 'maps_directions_card' || $canvasStore?.selectedNodeId === 'maps_info_card') && $canvasStore?.selectedSectionId === sectionId;
  $: isCtaSelected = $canvasStore?.selectedNodeId === 'maps_cta_button' && $canvasStore?.selectedSectionId === sectionId;

  $: iframeStyle = resolveMapsNodeStyle('maps_iframe', nodeStyles);
  $: directionsStyle = resolveMapsNodeStyle('maps_directions_card', nodeStyles);
  $: ctaStyle = resolveMapsNodeStyle('maps_cta_button', nodeStyles);

  $: ResolvedCtaIcon = resolveMapIcon(ctaIcon || 'Navigation');

  function selectNode(e: Event, nodeId: string) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, nodeId);
    }
  }

  function handleKeydown(e: KeyboardEvent, nodeId: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectNode(e, nodeId);
    }
  }
</script>

{#if branchMode === 'multi'}
  <MapsBranchSwitcher
    {sectionId}
    {branches}
    {activeBranchIdx}
    {onSelectBranch}
    {nodeStyles}
  />
{/if}

<div class="cq-map-split text-left">
  <!-- Instruksi Rute Kiri -->
  <div
    data-node="maps_directions_card"
    data-node-id="maps_directions_card"
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_directions_card')}
    on:keydown={(e) => handleKeydown(e, 'maps_directions_card')}
    class={`bg-[var(--theme-surface,var(--color-card-base))] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-4 flex flex-col justify-between transition-all outline-none ${
      isDirectionsSelected ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''
    }`}
    style={`border-radius: ${directionsStyle.borderRadius || '1rem'}; padding: ${directionsStyle.padding || ''}; ${directionsStyle.backgroundColor ? `background-color: ${directionsStyle.backgroundColor} !important;` : ''} ${directionsStyle.borderColor ? `border-color: ${directionsStyle.borderColor} !important;` : ''}`}
  >
    <div class="space-y-3">
      <h3
        class="font-heading text-[var(--theme-text-primary,var(--color-text-main))]"
        style={`font-size: ${directionsStyle.fontSize || 'var(--theme-text-h3, var(--text-h3-size, 20px))'}; font-weight: ${directionsStyle.fontWeight || 'var(--theme-text-h3-weight, var(--text-h3-weight, 700))'}; ${directionsStyle.color ? `color: ${directionsStyle.color} !important;` : ''}`}
      >
        {title}
      </h3>

      <div class="space-y-2.5 text-[var(--theme-text-muted,var(--color-text-muted))] font-sans">
        {#if directionsLandmark}
          <div class="p-3 bg-[var(--color-nested-base)] rounded-xl border border-[var(--color-border)] space-y-1">
            <div
              class="flex items-center gap-1.5 font-heading font-bold text-[var(--theme-text-primary,var(--color-text-main))]"
              style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
            >
              <Flag size={14} class="text-[var(--theme-primary,var(--color-primary))] shrink-0" />
              <span>Patokan Terdekat:</span>
            </div>
            <p
              class="leading-relaxed pl-5 text-[var(--theme-text-muted,var(--color-text-muted))] font-sans"
              style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
            >
              {directionsLandmark}
            </p>
          </div>
        {/if}

        {#if directionsParking}
          <div class="p-3 bg-[var(--color-nested-base)] rounded-xl border border-[var(--color-border)] space-y-1">
            <div
              class="flex items-center gap-1.5 font-heading font-bold text-[var(--theme-text-primary,var(--color-text-main))]"
              style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
            >
              <Car size={14} class="text-[var(--theme-primary,var(--color-primary))] shrink-0" />
              <span>Parkir Kendaraan:</span>
            </div>
            <p
              class="leading-relaxed pl-5 text-[var(--theme-text-muted,var(--color-text-muted))] font-sans"
              style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
            >
              {directionsParking}
            </p>
          </div>
        {/if}
      </div>
    </div>

    <a
      data-node="maps_cta_button"
      data-node-id="maps_cta_button"
      href={directMapsUrl}
      target="_blank"
      rel="noreferrer"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode(e, 'maps_cta_button')}
      on:keydown={(e) => handleKeydown(e, 'maps_cta_button')}
      class={`inline-flex items-center justify-center gap-2 w-full h-9 px-4 font-heading font-bold hover:opacity-90 active:scale-[0.98] shadow-sm transition-all outline-none ${
        isCtaSelected ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''
      }`}
      style={`border-radius: ${ctaStyle.borderRadius || 'var(--theme-btn-radius,var(--btn-radius,16px))'}; background-color: ${ctaStyle.backgroundColor || 'var(--theme-btn-primary-bg,var(--btn-primary-bg,var(--theme-primary, var(--color-primary))))'}; color: ${ctaStyle.color || 'var(--theme-btn-primary-text, var(--btn-primary-text, white))'}; font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.9);`}
    >
      <svelte:component this={ResolvedCtaIcon} size={13} />
      <span>{ctaText || 'Mulai Navigasi Arah'}</span>
      <ArrowRight size={13} />
    </a>
  </div>

  <!-- Frame Peta Kanan -->
  <div
    data-node="maps_iframe"
    data-node-id="maps_iframe"
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_iframe')}
    on:keydown={(e) => handleKeydown(e, 'maps_iframe')}
    class={`w-full h-full min-h-[260px] rounded-2xl overflow-hidden shadow-md border border-[var(--color-border)] bg-[var(--theme-surface,var(--color-card-base))] transition-all outline-none ${
      isIframeSelected ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''
    }`}
    style={`border-radius: ${iframeStyle.borderRadius || '1rem'}; ${iframeStyle.borderColor ? `border-color: ${iframeStyle.borderColor} !important;` : ''}`}
  >
    <iframe
      title="Peta Petunjuk Arah"
      src={mapEmbedUrl}
      class="w-full h-full min-h-[260px] border-0"
      loading="lazy"
      allowfullscreen
    ></iframe>
  </div>
</div>
