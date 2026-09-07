<script lang="ts">
  import { Navigation, Compass } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let mapEmbedUrl: string = '';
  export let directMapsUrl: string = '';

  $: isIframeSelected = $canvasStore?.selectedNodeId === 'maps_iframe' && $canvasStore?.selectedSectionId === sectionId;
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

<div class="w-full text-center space-y-4">
  <div
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_iframe')}
    on:keydown={(e) => handleKeydown(e, 'maps_iframe')}
    class={`w-full h-64 rounded-2xl overflow-hidden border border-[var(--color-border,rgba(15,23,42,0.08))] bg-[var(--color-card-base,var(--theme-surface,#ffffff))] transition-all outline-none ${
      isIframeSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''
    }`}
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
    href={directMapsUrl}
    target="_blank"
    rel="noreferrer"
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_cta_button')}
    on:keydown={(e) => handleKeydown(e, 'maps_cta_button')}
    class={`inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-[var(--btn-radius,var(--theme-btn-radius,16px))] bg-[var(--btn-primary-bg,var(--theme-btn-primary-bg,var(--theme-primary,#2563eb)))] text-[var(--btn-primary-text,var(--theme-btn-primary-text,#ffffff))] font-[var(--theme-font-heading,var(--font-heading,inherit))] font-bold hover:opacity-90 active:scale-[0.99] shadow-md transition-all outline-none ${
      isCtaSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''
    }`}
    style="font-size: var(--theme-text-body, var(--text-body-size, 16px));"
  >
    <Compass size={18} class="animate-spin" style="animation-duration: 10s;" />
    <span>Mulai Rute Perjalanan Langsung (Google Maps)</span>
    <Navigation size={18} />
  </a>
</div>
