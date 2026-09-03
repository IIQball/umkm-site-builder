<script lang="ts">
  import { Flag, Car, Navigation, ArrowRight } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let mapEmbedUrl: string = '';
  export let directMapsUrl: string = '';
  export let title: string = 'Petunjuk Menuju Lokasi';
  export let directionsLandmark: string = '100 meter ke arah timur dari bundaran kota, toko berada di sisi kiri jalan bersebelahan dengan apotek.';
  export let directionsParking: string = 'Lahan parkir aman memuat mobil dan motor dengan pengawasan petugas parkir resmi.';

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

<div class="cq-map-split text-left">
  <!-- Instruksi Rute Kiri -->
  <div
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_info_card')}
    on:keydown={(e) => handleKeydown(e, 'maps_info_card')}
    class={`bg-card p-6 rounded-2xl border border-base-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between transition-all outline-none ${
      isCardSelected ? 'ring-2 ring-primary ring-offset-2' : ''
    }`}
  >
    <div class="space-y-3">
      <h3 class="font-heading font-black text-lg text-main">
        {title}
      </h3>

      <div class="space-y-2.5 text-xs text-secondary">
        {#if directionsLandmark}
          <div class="p-3 bg-base-200/50 dark:bg-slate-900/60 rounded-xl border border-base-200 dark:border-slate-800 space-y-1">
            <div class="flex items-center gap-1.5 font-heading font-bold text-main">
              <Flag size={14} class="text-rose-500 shrink-0" />
              <span>Patokan Terdekat:</span>
            </div>
            <p class="leading-relaxed pl-5">
              {directionsLandmark}
            </p>
          </div>
        {/if}

        {#if directionsParking}
          <div class="p-3 bg-base-200/50 dark:bg-slate-900/60 rounded-xl border border-base-200 dark:border-slate-800 space-y-1">
            <div class="flex items-center gap-1.5 font-heading font-bold text-main">
              <Car size={14} class="text-blue-500 shrink-0" />
              <span>Parkir Kendaraan:</span>
            </div>
            <p class="leading-relaxed pl-5">
              {directionsParking}
            </p>
          </div>
        {/if}
      </div>
    </div>

    <a
      href={directMapsUrl}
      target="_blank"
      rel="noreferrer"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode(e, 'maps_cta_button')}
      on:keydown={(e) => handleKeydown(e, 'maps_cta_button')}
      class={`inline-flex items-center justify-center gap-2 w-full h-9 px-4 rounded-xl bg-primary text-white text-xs font-heading font-bold hover:bg-primary-hover active:scale-[0.98] shadow-sm transition-all outline-none ${
        isCtaSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
    >
      <Navigation size={13} />
      <span>Mulai Navigasi Arah</span>
      <ArrowRight size={13} />
    </a>
  </div>

  <!-- Frame Peta Kanan -->
  <div
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_iframe')}
    on:keydown={(e) => handleKeydown(e, 'maps_iframe')}
    class={`w-full h-full min-h-[260px] rounded-2xl overflow-hidden shadow-md border border-base-200 dark:border-slate-800 bg-base-200/40 transition-all outline-none ${
      isIframeSelected ? 'ring-2 ring-primary ring-offset-2' : ''
    }`}
  >
    <iframe
      title="Peta Petunjuk Arah"
      src={mapEmbedUrl}
      class="w-full h-full min-h-[260px] border-0"
      loading="lazy"
      allowfullscreen
    ></iframe>
  </div>
</div>
