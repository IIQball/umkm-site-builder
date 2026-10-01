<script lang="ts">
  import { ExternalLink } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import type { MapBranchItem } from './maps.helpers';
  import { resolveMapIcon } from './mapsIcons';
  import { resolveMapsNodeStyle } from './mapsStyles.helpers';
  import MapsBranchSwitcher from './MapsBranchSwitcher.svelte';

  export let sectionId: string = '';
  export let mapEmbedUrl: string = '';
  export let directMapsUrl: string = '';
  export let storeName: string = 'Lokasi Workshop & Toko';
  export let address: string = 'Dusun Krajan, Glagah, Kab. Banyuwangi, Jawa Timur';
  export let branchMode: 'single' | 'multi' = 'single';
  export let branches: MapBranchItem[] = [];
  export let activeBranchIdx: number = 0;
  export let onSelectBranch: (idx: number) => void = () => {};
  export let ctaText: string = 'Buka di Aplikasi Google Maps';
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

<div class="w-full flex flex-col items-center">
  {#if branchMode === 'multi'}
    <div class="max-w-md w-full">
      <MapsBranchSwitcher
        {sectionId}
        {branches}
        {activeBranchIdx}
        {onSelectBranch}
        {nodeStyles}
      />
    </div>
  {/if}

  <div
    data-node="maps_info_card"
    data-node-id="maps_info_card"
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_info_card')}
    on:keydown={(e) => handleKeydown(e, 'maps_info_card')}
    class={`max-w-md w-full bg-[var(--theme-surface,var(--color-card-base))] p-5 rounded-2xl border border-[var(--color-border)] shadow-sm text-left space-y-3 transition-all outline-none ${
      isCardSelected ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''
    }`}
    style={`border-radius: ${cardStyle.borderRadius || '1rem'}; padding: ${cardStyle.padding || ''}; ${cardStyle.backgroundColor ? `background-color: ${cardStyle.backgroundColor} !important;` : ''} ${cardStyle.borderColor ? `border-color: ${cardStyle.borderColor} !important;` : ''}`}
  >
    <div>
      <h2
        class="font-heading text-[var(--theme-text-primary,var(--color-text-main))]"
        style={`font-size: ${cardStyle.fontSize || 'var(--theme-text-h2, var(--text-h2-size, 22px))'}; font-weight: ${cardStyle.fontWeight || 'var(--theme-text-h2-weight, var(--text-h2-weight, 700))'}; ${cardStyle.color ? `color: ${cardStyle.color} !important;` : ''}`}
      >
        {storeName}
      </h2>
      <p
        class="text-[var(--theme-text-muted,var(--color-text-muted))] font-sans mt-0.5 leading-relaxed"
        style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
      >
        {address}
      </p>
    </div>

    <!-- Mini Map Frame 192px -->
    <div
      data-node="maps_iframe"
      data-node-id="maps_iframe"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode(e, 'maps_iframe')}
      on:keydown={(e) => handleKeydown(e, 'maps_iframe')}
      class={`w-full h-48 overflow-hidden border border-[var(--color-border)] bg-[var(--theme-surface,var(--color-card-base))] transition-all outline-none ${
        isIframeSelected ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''
      }`}
      style={`border-radius: ${iframeStyle.borderRadius || '0.75rem'}; ${iframeStyle.borderColor ? `border-color: ${iframeStyle.borderColor} !important;` : ''}`}
    >
      <iframe
        title="Mini Map Preview"
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
      class={`inline-flex items-center justify-center gap-2 w-full h-9 font-heading font-bold hover:opacity-90 active:scale-[0.98] shadow-sm transition-all outline-none ${
        isCtaSelected ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''
      }`}
      style={`border-radius: ${ctaStyle.borderRadius || 'var(--theme-btn-radius,var(--btn-radius,16px))'}; background-color: ${ctaStyle.backgroundColor || 'var(--theme-btn-primary-bg,var(--btn-primary-bg,var(--theme-primary, var(--color-primary))))'}; color: ${ctaStyle.color || 'var(--theme-btn-primary-text, var(--btn-primary-text, white))'}; font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.9);`}
    >
      <svelte:component this={ResolvedCtaIcon} size={13} />
      <span>{ctaText || 'Buka di Aplikasi Google Maps'}</span>
      <ExternalLink size={13} />
    </a>
  </div>
</div>
