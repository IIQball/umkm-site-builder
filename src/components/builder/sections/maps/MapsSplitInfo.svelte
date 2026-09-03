<script lang="ts">
  import { MapPin, Clock, ShieldCheck, Navigation, MessageCircle } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let mapEmbedUrl: string = '';
  export let directMapsUrl: string = '';
  export let whatsappUrl: string = '';
  export let storeName: string = 'Dapur Utama & Pusat Oleh-Oleh';
  export let address: string = 'Jl. Ahmad Yani No. 18, Pusat Kota, Banyuwangi';
  export let storeHours: string = 'Setiap Hari (08.00 - 21.00 WIB)';
  export let facilities: string = 'Parkir Mobil/Bus Luas, Musholla, Toilet Bersih';

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
  <!-- Kartu Info Kiri -->
  <div
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_info_card')}
    on:keydown={(e) => handleKeydown(e, 'maps_info_card')}
    class={`bg-card p-6 rounded-2xl border border-base-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 transition-all outline-none ${
      isCardSelected ? 'ring-2 ring-primary ring-offset-2' : ''
    }`}
  >
    <div>
      <span class="text-xs font-bold text-primary uppercase tracking-wider">
        Kontak & Alamat
      </span>
      <h3 class="text-heading-md font-heading font-black text-main mt-1 mb-3">
        {storeName}
      </h3>
      <div class="space-y-3 text-xs text-secondary">
        <div class="flex items-start gap-2">
          <MapPin size={15} class="text-primary mt-0.5 shrink-0" />
          <p><strong class="text-main">Alamat:</strong> {address}</p>
        </div>
        <div class="flex items-start gap-2">
          <Clock size={15} class="text-emerald-500 mt-0.5 shrink-0" />
          <p><strong class="text-main">Jam Operasional:</strong> {storeHours}</p>
        </div>
        {#if facilities}
          <div class="flex items-start gap-2">
            <ShieldCheck size={15} class="text-blue-500 mt-0.5 shrink-0" />
            <p><strong class="text-main">Fasilitas:</strong> {facilities}</p>
          </div>
        {/if}
      </div>
    </div>

    <div class="pt-4 border-t border-base-200 dark:border-slate-800 flex flex-col sm:flex-row gap-2">
      <a
        href={directMapsUrl}
        target="_blank"
        rel="noreferrer"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode(e, 'maps_cta_button')}
        on:keydown={(e) => handleKeydown(e, 'maps_cta_button')}
        class={`inline-flex items-center justify-center gap-1.5 flex-1 h-9 px-4 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-heading font-bold hover:bg-slate-800 dark:hover:bg-white active:scale-[0.98] transition-all outline-none ${
          isCtaSelected ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
      >
        <Navigation size={13} />
        <span>Navigasi Maps</span>
      </a>
      {#if whatsappUrl}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          class="inline-flex items-center justify-center gap-1.5 flex-1 h-9 px-4 rounded-xl bg-emerald-600 text-white text-xs font-heading font-bold hover:bg-emerald-700 active:scale-[0.98] transition-all"
        >
          <MessageCircle size={13} />
          <span>Hubungi via WA</span>
        </a>
      {/if}
    </div>
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
      title="Peta Interaktif Kanan"
      src={mapEmbedUrl}
      class="w-full h-full min-h-[260px] border-0"
      loading="lazy"
      allowfullscreen
    ></iframe>
  </div>
</div>
