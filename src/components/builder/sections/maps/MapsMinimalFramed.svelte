<script lang="ts">
  import { MapPin } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let mapEmbedUrl: string = '';
  export let storeName: string = 'Lokasi Dapur & Toko';
  export let address: string = '';

  $: isIframeSelected = $canvasStore?.selectedNodeId === 'maps_iframe' && $canvasStore?.selectedSectionId === sectionId;
  $: isCardSelected = $canvasStore?.selectedNodeId === 'maps_info_card' && $canvasStore?.selectedSectionId === sectionId;

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
  <div
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_info_card')}
    on:keydown={(e) => handleKeydown(e, 'maps_info_card')}
    class={`p-2 rounded-xl transition-all outline-none ${
      isCardSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900 bg-[var(--theme-primary,#2563eb)]/5' : ''
    }`}
  >
    <h2
      class="font-[var(--theme-font-heading,var(--font-heading,inherit))] text-[var(--theme-text-primary,var(--color-text-main,#0f172a))]"
      style="font-size: var(--theme-text-h2, var(--text-h2-size, 26px)); font-weight: var(--theme-text-h2-weight, var(--text-h2-weight, 700)); font-family: var(--theme-font-heading, var(--font-heading, inherit));"
    >
      {storeName}
    </h2>
    {#if address}
      <p
        class="text-[var(--theme-text-muted,var(--color-text-secondary,#64748b))] font-[var(--theme-font-body,var(--font-family,inherit))] mt-1 flex items-center gap-1.5"
        style="font-size: var(--theme-text-body, var(--text-body-size, 16px));"
      >
        <MapPin size={13} class="text-[var(--theme-primary,#2563eb)] shrink-0" />
        <span>{address}</span>
      </p>
    {/if}
  </div>

  <div
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_iframe')}
    on:keydown={(e) => handleKeydown(e, 'maps_iframe')}
    class={`w-full cq-map-frame-height rounded-2xl overflow-hidden border border-[var(--color-border,rgba(15,23,42,0.08))] bg-[var(--theme-surface,var(--color-card-base,#ffffff))] shadow-xs transition-all outline-none ${
      isIframeSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''
    }`}
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
