<script lang="ts">
  import { Navigation, ArrowRight } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let mapEmbedUrl: string = '';
  export let directMapsUrl: string = '';
  export let storeName: string = 'Warung Khas Banyuwangi';
  export let address: string = 'Jl. Raya Sukowati No. 42, Krajan Kidul, Banyuwangi';
  export let storeHoursStatus: string = 'Toko Buka Sekarang';
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
  class={`relative w-full rounded-2xl overflow-hidden shadow-md border border-base-200 dark:border-slate-800 bg-base-200/40 transition-all outline-none ${
    isIframeSelected ? 'ring-2 ring-primary ring-offset-2' : ''
  }`}
>
  <iframe
    title="Peta Lokasi Toko"
    src={mapEmbedUrl}
    class="w-full cq-map-frame-height border-0"
    style={mapHeight ? `min-height: ${mapHeight}` : ''}
    loading="lazy"
    allowfullscreen
  ></iframe>

  <!-- Floating Glassmorphism Card -->
  <div
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_info_card')}
    on:keydown={(e) => handleKeydown(e, 'maps_info_card')}
    class={`cq-floating-card-bottom bg-card/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-xl border border-light text-left transition-all outline-none ${
      isCardSelected ? 'ring-2 ring-primary ring-offset-2' : ''
    }`}
  >
    <div class="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
      <span>{storeHoursStatus}</span>
    </div>

    <h4 class="font-heading font-bold text-sm text-main mt-2 mb-1">
      {storeName}
    </h4>
    <p class="text-xs text-secondary leading-relaxed mb-4">
      {address}
    </p>

    <a
      href={directMapsUrl}
      target="_blank"
      rel="noreferrer"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode(e, 'maps_cta_button')}
      on:keydown={(e) => handleKeydown(e, 'maps_cta_button')}
      class={`inline-flex items-center justify-center gap-1.5 w-full h-9 px-4 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-heading font-bold hover:bg-slate-800 dark:hover:bg-white active:scale-[0.98] transition-all outline-none ${
        isCtaSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
    >
      <Navigation size={13} />
      <span>Buka Petunjuk Arah</span>
      <ArrowRight size={13} />
    </a>
  </div>
</div>
