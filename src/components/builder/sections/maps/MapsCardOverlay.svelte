<script lang="ts">
  import { Navigation, Clock } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let mapEmbedUrl: string = '';
  export let directMapsUrl: string = '';
  export let storeName: string = 'Gerai Oleh-Oleh Tradisional';
  export let storeHours: string = 'Buka jam 08.00 - 21.00 WIB setiap hari';
  export let mapHeight: string = '380px';

  $: isIframeSelected = $canvasStore?.selectedNodeId === 'maps_iframe' && $canvasStore?.selectedSectionId === sectionId;
  $: isCardSelected = $canvasStore?.selectedNodeId === 'maps_info_card' && $canvasStore?.selectedSectionId === sectionId;
  $: isCtaSelected = $canvasStore?.selectedNodeId === 'maps_cta_button' && $canvasStore?.selectedSectionId === sectionId;

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

<div
  role="button"
  tabindex="0"
  on:click={(e) => selectNode(e, 'maps_iframe')}
  on:keydown={(e) => handleKeydown(e, 'maps_iframe')}
  class={`relative w-full rounded-2xl overflow-hidden border border-[var(--color-border,rgba(15,23,42,0.08))] bg-[var(--color-card-base,var(--theme-surface,#ffffff))] transition-all outline-none ${
    isIframeSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''
  }`}
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
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_info_card')}
    on:keydown={(e) => handleKeydown(e, 'maps_info_card')}
    class={`cq-overlay-bottom bg-[var(--theme-surface,var(--color-card-base,#ffffff))]/95 backdrop-blur-md text-[var(--theme-text-primary,var(--color-text-main,#0f172a))] border-t border-[var(--color-border,rgba(15,23,42,0.08))] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 text-left transition-all outline-none ${
      isCardSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''
    }`}
  >
    <div>
      <h3
        class="font-[var(--theme-font-heading,var(--font-heading,inherit))] text-[var(--theme-text-primary,var(--color-text-main,#0f172a))]"
        style="font-size: var(--theme-text-h3, var(--text-h3-size, 20px)); font-weight: var(--theme-text-h3-weight, var(--text-h3-weight, 600)); font-family: var(--theme-font-heading, var(--font-heading, inherit));"
      >
        {storeName}
      </h3>
      <p
        class="text-[var(--theme-text-muted,var(--color-text-secondary,#64748b))] font-[var(--theme-font-body,var(--font-family,inherit))] mt-0.5 flex items-center gap-1.5"
        style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
      >
        <Clock size={12} class="text-emerald-500 shrink-0" />
        <span>{storeHours}</span>
      </p>
    </div>

    <a
      href={directMapsUrl}
      target="_blank"
      rel="noreferrer"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode(e, 'maps_cta_button')}
      on:keydown={(e) => handleKeydown(e, 'maps_cta_button')}
      class={`h-9 px-5 rounded-[var(--theme-btn-radius,var(--btn-radius,16px))] bg-[var(--theme-btn-primary-bg,var(--btn-primary-bg,var(--theme-primary,#2563eb)))] text-[var(--theme-btn-primary-text,var(--btn-primary-text,#ffffff))] font-[var(--theme-font-heading,var(--font-heading,inherit))] font-bold hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-1.5 transition-all outline-none shadow-xs ${
        isCtaSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''
      }`}
      style="font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.9);"
    >
      <Navigation size={13} />
      <span>Petunjuk Arah</span>
    </a>
  </div>
</div>
