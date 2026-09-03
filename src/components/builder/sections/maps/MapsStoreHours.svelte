<script lang="ts">
  import { MessageCircle, Clock } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let mapEmbedUrl: string = '';
  export let whatsappUrl: string = '';
  export let storeHoursStatus: string = 'BUKA SEKARANG';
  export let storeHours: string = 'Tutup Pukul 21.00 WIB';

  $: isIframeSelected = $canvasStore?.selectedNodeId === 'maps_iframe' && $canvasStore?.selectedSectionId === sectionId;
  $: isHoursSelected = $canvasStore?.selectedNodeId === 'maps_hours_badge' && $canvasStore?.selectedSectionId === sectionId;

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

<div class="w-full text-left space-y-4">
  <!-- Baris Penyorot Jam Buka -->
  <div
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_hours_badge')}
    on:keydown={(e) => handleKeydown(e, 'maps_hours_badge')}
    class={`bg-slate-950 dark:bg-slate-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 transition-all outline-none ${
      isHoursSelected ? 'ring-2 ring-primary ring-offset-2' : ''
    }`}
  >
    <div class="flex items-center gap-2.5 text-xs font-heading">
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
      <span class="font-bold text-emerald-400 tracking-wide">{storeHoursStatus}</span>
      <span class="text-slate-400 flex items-center gap-1.5">
        <Clock size={13} />
        <span>• {storeHours}</span>
      </span>
    </div>

    {#if whatsappUrl}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        class="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"
      >
        <MessageCircle size={13} />
        <span>Tanya Antrian via WhatsApp →</span>
      </a>
    {/if}
  </div>

  <!-- Frame Peta -->
  <div
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_iframe')}
    on:keydown={(e) => handleKeydown(e, 'maps_iframe')}
    class={`w-full cq-map-frame-height rounded-2xl overflow-hidden border border-base-200 dark:border-slate-800 bg-base-200/40 transition-all outline-none ${
      isIframeSelected ? 'ring-2 ring-primary ring-offset-2' : ''
    }`}
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
