<script lang="ts">
  import { Clock } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import type { MapBranchItem } from './maps.helpers';
  import { resolveMapIcon } from './mapsIcons';
  import { resolveMapsNodeStyle } from './mapsStyles.helpers';
  import MapsBranchSwitcher from './MapsBranchSwitcher.svelte';

  export let sectionId: string = '';
  export let mapEmbedUrl: string = '';
  export let directMapsUrl: string = '';
  export let storeName: string = 'Gerai Oleh-Oleh Tradisional';
  export let storeHours: string = 'Buka jam 08.00 - 21.00 WIB setiap hari';
  export let mapHeight: string = '380px';
  export let branchMode: 'single' | 'multi' = 'single';
  export let branches: MapBranchItem[] = [];
  export let activeBranchIdx: number = 0;
  export let onSelectBranch: (idx: number) => void = () => {};
  export let ctaText: string = 'Petunjuk Arah';
  export let ctaIcon: string = 'Navigation';
  export let nodeStyles: Record<string, Record<string, string>> = {};

  $: isIframeSelected = $canvasStore?.selectedNodeId === 'maps_iframe' && $canvasStore?.selectedSectionId === sectionId;
  $: isCardSelected = $canvasStore?.selectedNodeId === 'maps_info_card' && $canvasStore?.selectedSectionId === sectionId;
  $: isCtaSelected = $canvasStore?.selectedNodeId === 'maps_cta_button' && $canvasStore?.selectedSectionId === sectionId;

  $: iframeStyle = resolveMapsNodeStyle('maps_iframe', nodeStyles);
  $: cardStyle = resolveMapsNodeStyle('maps_info_card', nodeStyles);
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

<div
  data-node="maps_iframe"
  data-node-id="maps_iframe"
  role="button"
  tabindex="0"
  on:click={(e) => selectNode(e, 'maps_iframe')}
  on:keydown={(e) => handleKeydown(e, 'maps_iframe')}
  class={`relative w-full rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--theme-surface,var(--color-card-base))] transition-all outline-none ${
    isIframeSelected ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''
  }`}
  style={`border-radius: ${iframeStyle.borderRadius || '1rem'}; ${iframeStyle.borderColor ? `border-color: ${iframeStyle.borderColor} !important;` : ''}`}
>
  <iframe
    title="Peta Overlay Bawah"
    src={mapEmbedUrl}
    class="w-full cq-map-frame-height border-0"
    style={mapHeight ? `min-height: ${mapHeight}` : ''}
    loading="lazy"
    allowfullscreen
  ></iframe>

  <!-- Bilah Penutup Bawah Melayang -->
  <div
    data-node="maps_info_card"
    data-node-id="maps_info_card"
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_info_card')}
    on:keydown={(e) => handleKeydown(e, 'maps_info_card')}
    class={`cq-overlay-bottom bg-[var(--theme-surface,var(--color-card-base))]/95 backdrop-blur-md text-[var(--theme-text-primary,var(--color-text-main))] border-t border-[var(--color-border)] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 text-left transition-all outline-none ${
      isCardSelected ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''
    }`}
    style={`padding: ${cardStyle.padding || ''}; ${cardStyle.backgroundColor ? `background-color: ${cardStyle.backgroundColor} !important;` : ''} ${cardStyle.borderColor ? `border-color: ${cardStyle.borderColor} !important;` : ''}`}
  >
    <div>
      <h3
        class="font-heading text-[var(--theme-text-primary,var(--color-text-main))]"
        style={`font-size: ${cardStyle.fontSize || 'var(--theme-text-h3, var(--text-h3-size, 20px))'}; font-weight: ${cardStyle.fontWeight || 'var(--theme-text-h3-weight, var(--text-h3-weight, 600))'}; ${cardStyle.color ? `color: ${cardStyle.color} !important;` : ''}`}
      >
        {storeName}
      </h3>
      <p
        class="text-[var(--theme-text-muted,var(--color-text-muted))] font-sans mt-0.5 flex items-center gap-1.5"
        style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
      >
        <Clock size={12} class="text-emerald-500 shrink-0" />
        <span>{storeHours}</span>
      </p>
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
      class={`h-9 px-5 font-heading font-bold hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-1.5 transition-all outline-none shadow-xs ${
        isCtaSelected ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''
      }`}
      style={`border-radius: ${ctaStyle.borderRadius || 'var(--theme-btn-radius,var(--btn-radius,16px))'}; background-color: ${ctaStyle.backgroundColor || 'var(--theme-btn-primary-bg,var(--btn-primary-bg,var(--theme-primary, var(--color-primary))))'}; color: ${ctaStyle.color || 'var(--theme-btn-primary-text, var(--btn-primary-text, white))'}; font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.9);`}
    >
      <svelte:component this={ResolvedCtaIcon} size={13} />
      <span>{ctaText || 'Petunjuk Arah'}</span>
    </a>
  </div>
</div>
