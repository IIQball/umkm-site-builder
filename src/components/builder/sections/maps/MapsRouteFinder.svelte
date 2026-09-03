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
    class={`w-full h-64 rounded-2xl overflow-hidden border border-base-200 dark:border-slate-800 bg-base-200/40 transition-all outline-none ${
      isIframeSelected ? 'ring-2 ring-primary ring-offset-2' : ''
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
    class={`inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-primary text-white font-heading font-bold text-sm hover:bg-primary-hover active:scale-[0.99] shadow-md transition-all outline-none ${
      isCtaSelected ? 'ring-2 ring-primary ring-offset-2' : ''
    }`}
  >
    <Compass size={18} class="animate-spin" style="animation-duration: 10s;" />
    <span>Mulai Rute Perjalanan Langsung (Google Maps)</span>
    <Navigation size={18} />
  </a>
</div>
