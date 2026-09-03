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
  class={`relative w-full rounded-2xl overflow-hidden border border-base-200 dark:border-slate-800 bg-base-200/40 transition-all outline-none ${
    isIframeSelected ? 'ring-2 ring-primary ring-offset-2' : ''
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
    class={`cq-overlay-bottom bg-slate-950/90 backdrop-blur-md text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 text-left transition-all outline-none ${
      isCardSelected ? 'ring-2 ring-primary ring-offset-2' : ''
    }`}
  >
    <div>
      <h4 class="font-heading font-bold text-sm text-white">
        {storeName}
      </h4>
      <p class="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
        <Clock size={12} class="text-emerald-400 shrink-0" />
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
      class={`h-9 px-5 rounded-xl bg-primary text-white text-xs font-heading font-bold hover:bg-primary-hover active:scale-[0.98] flex items-center justify-center gap-1.5 transition-all outline-none ${
        isCtaSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
    >
      <Navigation size={13} />
      <span>Petunjuk Arah</span>
    </a>
  </div>
</div>
