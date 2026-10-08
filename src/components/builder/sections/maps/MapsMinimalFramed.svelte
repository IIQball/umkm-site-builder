<script lang="ts">
  import { MapPin } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import type { MapBranchItem } from './maps.helpers';
  import { resolveMapsNodeStyle } from './mapsStyles.helpers';
  import MapsBranchSwitcher from './MapsBranchSwitcher.svelte';

  export let sectionId: string = '';
  export let mapEmbedUrl: string = '';
  export let storeName: string = 'Lokasi Dapur & Toko';
  export let address: string = '';
  export let branchMode: 'single' | 'multi' = 'single';
  export let branches: MapBranchItem[] = [];
  export let activeBranchIdx: number = 0;
  export let onSelectBranch: (idx: number) => void = () => {};
  export let nodeStyles: Record<string, Record<string, string>> = {};

  $: isIframeSelected = $canvasStore?.selectedNodeId === 'maps_iframe' && $canvasStore?.selectedSectionId === sectionId;
  $: isCardSelected = $canvasStore?.selectedNodeId === 'maps_info_card' && $canvasStore?.selectedSectionId === sectionId;

  $: iframeStyle = resolveMapsNodeStyle('maps_iframe', nodeStyles);
  $: cardStyle = resolveMapsNodeStyle('maps_info_card', nodeStyles);

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

<div class="w-full text-left space-y-3">
  <div
    data-node="maps_info_card"
    data-node-id="maps_info_card"
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_info_card')}
    on:keydown={(e) => handleKeydown(e, 'maps_info_card')}
    class={`p-2 rounded-xl transition-all outline-none ${
      isCardSelected ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2 dark:ring-offset-base-100 bg-[var(--theme-primary,var(--color-primary))]/5' : ''
    }`}
    style={`padding: ${cardStyle.padding || ''}; ${cardStyle.backgroundColor ? `background-color: ${cardStyle.backgroundColor} !important;` : ''}`}
  >
    <h2
      class="font-heading text-[var(--theme-text-primary,var(--color-text-main))]"
      style={`font-size: ${cardStyle.fontSize || 'var(--theme-text-h2, var(--text-h2-size, 26px))'}; font-weight: ${cardStyle.fontWeight || 'var(--theme-text-h2-weight, var(--text-h2-weight, 700))'}; ${cardStyle.color ? `color: ${cardStyle.color} !important;` : ''}`}
    >
      {storeName}
    </h2>
    {#if address}
      <p
        class="text-[var(--theme-text-muted,var(--color-text-muted))] font-sans mt-1 flex items-center gap-1.5"
        style="font-size: var(--theme-text-body, var(--text-body-size, 16px));"
      >
        <MapPin size={13} class="text-[var(--theme-primary,var(--color-primary))] shrink-0" />
        <span>{address}</span>
      </p>
    {/if}
  </div>

  <div
    data-node="maps_iframe"
    data-node-id="maps_iframe"
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_iframe')}
    on:keydown={(e) => handleKeydown(e, 'maps_iframe')}
    class={`w-full cq-map-frame-height rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--theme-surface,var(--color-card-base))] shadow-xs transition-all outline-none ${
      isIframeSelected ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''
    }`}
    style={`border-radius: ${iframeStyle.borderRadius || '1rem'}; ${iframeStyle.borderColor ? `border-color: ${iframeStyle.borderColor} !important;` : ''}`}
  >
    <iframe
      title="Peta Bersih Minimalis"
      src={mapEmbedUrl}
      class="w-full h-full border-0"
      loading="lazy"
      allowfullscreen
    ></iframe>
  </div>
</div>
