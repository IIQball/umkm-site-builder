<script lang="ts">
  import { MessageCircle, Clock } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import type { MapBranchItem } from './maps.helpers';
  import { resolveMapsNodeStyle } from './mapsStyles.helpers';
  import MapsBranchSwitcher from './MapsBranchSwitcher.svelte';

  export let sectionId: string = '';
  export let mapEmbedUrl: string = '';
  export let whatsappUrl: string = '';
  export let storeHoursStatus: string = 'BUKA SEKARANG';
  export let storeHours: string = 'Tutup Pukul 21.00 WIB';
  export let branchMode: 'single' | 'multi' = 'single';
  export let branches: MapBranchItem[] = [];
  export let activeBranchIdx: number = 0;
  export let onSelectBranch: (idx: number) => void = () => {};
  export let nodeStyles: Record<string, Record<string, string>> = {};

  $: isIframeSelected = $canvasStore?.selectedNodeId === 'maps_iframe' && $canvasStore?.selectedSectionId === sectionId;
  $: isHoursSelected = ($canvasStore?.selectedNodeId === 'maps_hours_card' || $canvasStore?.selectedNodeId === 'maps_hours_badge') && $canvasStore?.selectedSectionId === sectionId;

  $: iframeStyle = resolveMapsNodeStyle('maps_iframe', nodeStyles);
  $: hoursStyle = resolveMapsNodeStyle('maps_hours_card', nodeStyles);

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

<div class="w-full text-left space-y-4">
  <!-- Baris Penyorot Jam Buka -->
  <div
    data-node="maps_hours_card"
    data-node-id="maps_hours_card"
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_hours_card')}
    on:keydown={(e) => handleKeydown(e, 'maps_hours_card')}
    class={`bg-[var(--theme-surface,var(--color-card-base))] text-[var(--theme-text-primary,var(--color-text-main))] border border-[var(--color-border)] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 transition-all outline-none ${
      isHoursSelected ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2 dark:ring-offset-base-100' : ''
    }`}
    style={`border-radius: ${hoursStyle.borderRadius || '1rem'}; padding: ${hoursStyle.padding || ''}; ${hoursStyle.backgroundColor ? `background-color: ${hoursStyle.backgroundColor} !important;` : ''} ${hoursStyle.borderColor ? `border-color: ${hoursStyle.borderColor} !important;` : ''}`}
  >
    <div
      class="flex items-center gap-2.5 font-heading"
      style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
    >
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
      <span class="font-bold text-emerald-600 dark:text-emerald-400 tracking-wide">{storeHoursStatus}</span>
      <span class="text-[var(--theme-text-muted,var(--color-text-muted))] flex items-center gap-1.5 font-sans">
        <Clock size={13} />
        <span>• {storeHours}</span>
      </span>
    </div>

    {#if whatsappUrl}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        class="inline-flex items-center gap-1.5 text-[var(--theme-primary,var(--color-primary))] hover:underline font-semibold transition-colors font-heading"
        style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
      >
        <MessageCircle size={13} />
        <span>Tanya Antrian via WhatsApp →</span>
      </a>
    {/if}
  </div>

  <!-- Frame Peta -->
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
      title="Peta Penyorot Jam Operasional"
      src={mapEmbedUrl}
      class="w-full h-full border-0"
      loading="lazy"
      allowfullscreen
    ></iframe>
  </div>
</div>
