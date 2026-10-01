<script lang="ts">
  import { MapPin } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import type { MapBranchItem } from './maps.helpers';
  import { resolveMapIcon } from './mapsIcons';
  import { resolveMapsNodeStyle } from './mapsStyles.helpers';
  import MapsBranchSwitcher from './MapsBranchSwitcher.svelte';

  export let sectionId: string = '';
  export let mapEmbedUrl: string = '';
  export let directMapsUrl: string = '';
  export let storeName: string = 'Cabang Utama Banyuwangi';
  export let address: string = 'Jl. S. Parman No. 22, Sobo, Banyuwangi';
  export let facilities: string = 'Parkir Luas, Musholla';
  export let mapHeight: string = '400px';
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
    title="Peta Floating Card"
    src={mapEmbedUrl}
    class="w-full cq-map-frame-height border-0"
    style={mapHeight ? `min-height: ${mapHeight}` : ''}
    loading="lazy"
    allowfullscreen
  ></iframe>

  <!-- Floating Address Card di Pojok Kanan Atas -->
  <div
    data-node="maps_info_card"
    data-node-id="maps_info_card"
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_info_card')}
    on:keydown={(e) => handleKeydown(e, 'maps_info_card')}
    class={`cq-floating-card-corner bg-[var(--theme-surface,var(--color-card-base))]/95 backdrop-blur-md p-4 sm:p-5 shadow-xl border border-[var(--color-border)] text-left space-y-2.5 transition-all outline-none ${
      isCardSelected ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''
    }`}
    style={`border-radius: ${cardStyle.borderRadius || '1rem'}; padding: ${cardStyle.padding || ''}; ${cardStyle.backgroundColor ? `background-color: ${cardStyle.backgroundColor} !important;` : ''} ${cardStyle.borderColor ? `border-color: ${cardStyle.borderColor} !important;` : ''}`}
  >
    <div class="flex items-start gap-2">
      <MapPin size={16} class="text-[var(--theme-primary,var(--color-primary))] mt-0.5 shrink-0" />
      <div>
        <h4
          class="font-heading font-bold text-[var(--theme-text-primary,var(--color-text-main))]"
          style={`font-size: ${cardStyle.fontSize || 'var(--theme-text-body, var(--text-body-size, 16px))'}; ${cardStyle.color ? `color: ${cardStyle.color} !important;` : ''}`}
        >
          {storeName}
        </h4>
        <p
          class="text-[var(--theme-text-muted,var(--color-text-muted))] font-sans mt-0.5 leading-relaxed"
          style="font-size: calc(var(--theme-text-body, var(--text-body-size, 16px)) * 0.85);"
        >
          {address}
        </p>
        {#if facilities}
          <p
            class="text-emerald-600 dark:text-emerald-400 font-sans mt-1"
            style="font-size: var(--theme-text-caption, var(--text-caption-size, 10px));"
          >
            ✓ {facilities}
          </p>
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
      class={`inline-flex items-center justify-center gap-1.5 w-full h-8 px-3 font-heading font-bold hover:opacity-90 active:scale-[0.98] transition-all outline-none shadow-xs ${
        isCtaSelected ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''
      }`}
      style={`border-radius: ${ctaStyle.borderRadius || 'var(--theme-btn-radius,var(--btn-radius,12px))'}; background-color: ${ctaStyle.backgroundColor || 'var(--theme-btn-primary-bg,var(--btn-primary-bg,var(--theme-primary, var(--color-primary))))'}; color: ${ctaStyle.color || 'var(--theme-btn-primary-text, var(--btn-primary-text, white))'}; font-size: calc(var(--theme-text-body, var(--text-body-size, 16px)) * 0.85);`}
    >
      <svelte:component this={ResolvedCtaIcon} size={12} />
      <span>{ctaText || 'Petunjuk Arah'}</span>
    </a>
  </div>
</div>
