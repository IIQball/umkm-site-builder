<script lang="ts">
  import { Navigation, ExternalLink } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let mapEmbedUrl: string = '';
  export let directMapsUrl: string = '';
  export let storeName: string = 'Lokasi Workshop & Toko';
  export let address: string = 'Dusun Krajan, Glagah, Kab. Banyuwangi, Jawa Timur';

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

<div class="w-full flex justify-center">
  <div
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_info_card')}
    on:keydown={(e) => handleKeydown(e, 'maps_info_card')}
    class={`max-w-md w-full bg-card p-5 rounded-2xl border border-base-200 dark:border-slate-800 shadow-sm text-left space-y-3 transition-all outline-none ${
      isCardSelected ? 'ring-2 ring-primary ring-offset-2' : ''
    }`}
  >
    <div>
      <h4 class="font-heading font-black text-base text-main">
        {storeName}
      </h4>
      <p class="text-xs text-secondary mt-0.5 leading-relaxed">
        {address}
      </p>
    </div>

    <!-- Mini Map Frame 192px -->
    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectNode(e, 'maps_iframe')}
      on:keydown={(e) => handleKeydown(e, 'maps_iframe')}
      class={`w-full h-48 rounded-xl overflow-hidden border border-base-200 dark:border-slate-800 bg-base-200/40 transition-all outline-none ${
        isIframeSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
    >
      <iframe
        title="Mini Map Preview"
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
      class={`inline-flex items-center justify-center gap-2 w-full h-9 rounded-xl bg-primary text-white text-xs font-heading font-bold hover:bg-primary-hover active:scale-[0.98] shadow-sm transition-all outline-none ${
        isCtaSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
    >
      <Navigation size={13} />
      <span>Buka di Aplikasi Google Maps</span>
      <ExternalLink size={13} />
    </a>
  </div>
</div>
