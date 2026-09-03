<script lang="ts">
  import { Navigation, ArrowRight, Wifi } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let mapEmbedUrl: string = '';
  export let directMapsUrl: string = '';
  export let storeName: string = 'Kedai Kopi & Sangrai';
  export let address: string = 'Kompleks Pertokoan Ijen Terrace Blok C2, Banyuwangi';
  export let facilities: string = 'Tersedia Wifi Kencang & Area Parkir Nyaman';
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
    title="Peta Latar Belakang Penuh"
    src={mapEmbedUrl}
    class="w-full cq-map-frame-height border-0"
    style={mapHeight ? `min-height: ${mapHeight}` : ''}
    loading="lazy"
    allowfullscreen
  ></iframe>

  <!-- Top Right Floating Card -->
  <div
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_info_card')}
    on:keydown={(e) => handleKeydown(e, 'maps_info_card')}
    class={`cq-floating-card-corner bg-card/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-light space-y-2 text-left transition-all outline-none ${
      isCardSelected ? 'ring-2 ring-primary ring-offset-2' : ''
    }`}
  >
    <h4 class="font-heading font-bold text-xs text-main">
      {storeName}
    </h4>
    <p class="text-[11px] text-secondary leading-relaxed">
      {address}
    </p>

    {#if facilities}
      <div class="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
        <Wifi size={11} class="shrink-0" />
        <span>{facilities}</span>
      </div>
    {/if}

    <a
      href={directMapsUrl}
      target="_blank"
      rel="noreferrer"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode(e, 'maps_cta_button')}
      on:keydown={(e) => handleKeydown(e, 'maps_cta_button')}
      class={`inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-heading font-bold hover:bg-slate-800 dark:hover:bg-white active:scale-[0.98] transition-all mt-1 outline-none ${
        isCtaSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
    >
      <Navigation size={12} />
      <span>Lihat Rute</span>
      <ArrowRight size={12} />
    </a>
  </div>
</div>
