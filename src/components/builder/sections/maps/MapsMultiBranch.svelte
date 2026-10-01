<script lang="ts">
  import { MapPin } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import type { MapBranchItem } from './maps.helpers';
  import { resolveMapIcon } from './mapsIcons';
  import { resolveMapsNodeStyle } from './mapsStyles.helpers';
  import MapsBranchSwitcher from './MapsBranchSwitcher.svelte';

  export let sectionId: string = '';
  export let branches: MapBranchItem[] = [];
  export let activeBranchIdx: number = 0;
  export let onSelectBranch: (idx: number) => void = () => {};
  export let mapEmbedUrl: string = '';
  export let directMapsUrl: string = '';
  export let storeName: string = '';
  export let address: string = '';
  export let ctaText: string = 'Buka Petunjuk Arah';
  export let ctaIcon: string = 'Navigation';
  export let nodeStyles: Record<string, Record<string, string>> = {};

  $: activeBranch = branches[activeBranchIdx] || branches[0] || {
    id: 'default',
    name: storeName || 'Cabang Utama',
    address: address || 'Banyuwangi',
  };

  $: isCardSelected = $canvasStore?.selectedNodeId === 'maps_info_card' && $canvasStore?.selectedSectionId === sectionId;
  $: isIframeSelected = $canvasStore?.selectedNodeId === 'maps_iframe' && $canvasStore?.selectedSectionId === sectionId;
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

<div class="w-full text-left space-y-3">
  <!-- Bilah Tab Cabang -->
  <MapsBranchSwitcher
    {sectionId}
    {branches}
    {activeBranchIdx}
    {onSelectBranch}
    {nodeStyles}
  />

  <!-- Detail Info Alamat Cabang Aktif -->
  <div
    data-node="maps_info_card"
    data-node-id="maps_info_card"
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_info_card')}
    on:keydown={(e) => handleKeydown(e, 'maps_info_card')}
    class={`bg-[var(--theme-surface,var(--color-card-base))] p-3 sm:p-4 rounded-xl border border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3 text-[var(--theme-text-muted,var(--color-text-muted))] font-sans transition-all outline-none ${
      isCardSelected ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''
    }`}
    style={`border-radius: ${cardStyle.borderRadius || '0.75rem'}; padding: ${cardStyle.padding || ''}; ${cardStyle.backgroundColor ? `background-color: ${cardStyle.backgroundColor} !important;` : ''} ${cardStyle.borderColor ? `border-color: ${cardStyle.borderColor} !important;` : ''} font-size: var(--theme-text-body, var(--text-body-size, 14px));`}
  >
    <div class="flex items-start sm:items-center gap-2">
      <MapPin size={15} class="text-[var(--theme-primary,var(--color-primary))] mt-0.5 sm:mt-0 shrink-0" />
      <div>
        <span
          class="font-heading font-bold text-[var(--theme-text-primary,var(--color-text-main))]"
          style={cardStyle.color ? `color: ${cardStyle.color} !important;` : ''}
        >
          {activeBranch.name}:
        </span>
        <span class="ml-1 text-[var(--theme-text-muted,var(--color-text-muted))] font-sans">{activeBranch.address}</span>
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
      class={`inline-flex items-center gap-1.5 px-3 py-1.5 font-heading font-bold hover:opacity-90 active:scale-[0.98] transition-all outline-none shadow-xs ${
        isCtaSelected ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''
      }`}
      style={`border-radius: ${ctaStyle.borderRadius || 'var(--theme-btn-radius,var(--btn-radius,8px))'}; background-color: ${ctaStyle.backgroundColor || 'var(--theme-btn-primary-bg,var(--btn-primary-bg,var(--theme-primary, var(--color-primary))))'}; color: ${ctaStyle.color || 'var(--theme-btn-primary-text, var(--btn-primary-text, white))'}; font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.9);`}
    >
      <svelte:component this={ResolvedCtaIcon} size={11} />
      <span>{ctaText || 'Buka Petunjuk Arah'}</span>
    </a>
  </div>

  <!-- Frame Peta Cabang -->
  <div
    data-node="maps_iframe"
    data-node-id="maps_iframe"
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_iframe')}
    on:keydown={(e) => handleKeydown(e, 'maps_iframe')}
    class={`w-full cq-map-frame-height rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--theme-surface,var(--color-card-base))] transition-all outline-none ${
      isIframeSelected ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''
    }`}
    style={`border-radius: ${iframeStyle.borderRadius || '1rem'}; ${iframeStyle.borderColor ? `border-color: ${iframeStyle.borderColor} !important;` : ''}`}
  >
    <iframe
      title={`Peta ${activeBranch.name}`}
      src={mapEmbedUrl}
      class="w-full h-full border-0"
      loading="lazy"
      allowfullscreen
    ></iframe>
  </div>
</div>
