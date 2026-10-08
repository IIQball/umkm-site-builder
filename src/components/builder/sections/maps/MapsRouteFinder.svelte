<script lang="ts">
  import { Navigation } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import type { MapBranchItem } from './maps.helpers';
  import { resolveMapIcon } from './mapsIcons';
  import { resolveMapsNodeStyle } from './mapsStyles.helpers';
  import MapsBranchSwitcher from './MapsBranchSwitcher.svelte';

  export let sectionId: string = '';
  export let mapEmbedUrl: string = '';
  export let directMapsUrl: string = '';
  export let branchMode: 'single' | 'multi' = 'single';
  export let branches: MapBranchItem[] = [];
  export let activeBranchIdx: number = 0;
  export let onSelectBranch: (idx: number) => void = () => {};
  export let ctaText: string = 'Mulai Rute Perjalanan Langsung (Google Maps)';
  export let ctaIcon: string = 'Compass';
  export let nodeStyles: Record<string, Record<string, string>> = {};

  $: isIframeSelected = $canvasStore?.selectedNodeId === 'maps_iframe' && $canvasStore?.selectedSectionId === sectionId;
  $: isCtaSelected = $canvasStore?.selectedNodeId === 'maps_cta_button' && $canvasStore?.selectedSectionId === sectionId;

  $: iframeStyle = resolveMapsNodeStyle('maps_iframe', nodeStyles);
  $: ctaStyle = resolveMapsNodeStyle('maps_cta_button', nodeStyles);

  $: ResolvedCtaIcon = resolveMapIcon(ctaIcon || 'Compass');

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

<div class="w-full text-center space-y-4">
  <div
    data-node="maps_iframe"
    data-node-id="maps_iframe"
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_iframe')}
    on:keydown={(e) => handleKeydown(e, 'maps_iframe')}
    class={`w-full h-64 rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--theme-surface,var(--color-card-base))] transition-all outline-none ${
      isIframeSelected ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''
    }`}
    style={`border-radius: ${iframeStyle.borderRadius || '1rem'}; ${iframeStyle.borderColor ? `border-color: ${iframeStyle.borderColor} !important;` : ''}`}
  >
    <iframe
      title="Peta Navigasi Langsung"
      src={mapEmbedUrl}
      class="w-full h-full border-0"
      loading="lazy"
      allowfullscreen
    ></iframe>
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
    class={`inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 font-heading font-bold hover:opacity-90 active:scale-[0.99] shadow-md transition-all outline-none ${
      isCtaSelected ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''
    }`}
    style={`border-radius: ${ctaStyle.borderRadius || 'var(--theme-btn-radius,var(--btn-radius,16px))'}; background-color: ${ctaStyle.backgroundColor || 'var(--theme-btn-primary-bg,var(--btn-primary-bg,var(--theme-primary, var(--color-primary))))'}; color: ${ctaStyle.color || 'var(--theme-btn-primary-text, var(--btn-primary-text, white))'}; font-size: ${ctaStyle.fontSize || 'var(--theme-text-body, var(--text-body-size, 16px))'};`}
  >
    <svelte:component this={ResolvedCtaIcon} size={18} />
    <span>{ctaText || 'Mulai Rute Perjalanan Langsung (Google Maps)'}</span>
    <Navigation size={18} />
  </a>
</div>
