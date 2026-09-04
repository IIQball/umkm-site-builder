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
    class={`bg-[var(--color-card-base,var(--theme-surface,#ffffff))] p-6 rounded-2xl border border-[var(--color-border,rgba(15,23,42,0.08))] shadow-sm flex flex-col justify-between space-y-4 transition-all outline-none ${
      isCardSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''
    }`}
  >
    <div>
      <span
        class="font-bold text-[var(--theme-primary,#2563eb)] uppercase tracking-wider font-[var(--theme-font-heading,var(--font-heading,inherit))] block mb-1"
        style="font-size: var(--theme-text-caption, var(--text-caption-size, 10px));"
      >
        Kontak & Alamat
      </span>
      <h3
        class="font-[var(--theme-font-heading,var(--font-heading,inherit))] text-[var(--theme-text-primary,var(--color-text-main,#0f172a))] mt-1 mb-3"
        style="font-size: var(--theme-text-h3, var(--text-h3-size, 20px)); font-weight: var(--theme-text-h3-weight, var(--text-h3-weight, 700)); font-family: var(--theme-font-heading, var(--font-heading, inherit));"
      >
        {storeName}
      </h3>
      <div
        class="space-y-3 text-[var(--theme-text-muted,var(--color-text-secondary,#334155))] font-[var(--theme-font-body,var(--font-family,inherit))]"
        style="font-size: var(--theme-text-body, var(--text-body-size, 16px));"
      >
        <div class="flex items-start gap-2">
          <MapPin size={15} class="text-[var(--theme-primary,#2563eb)] mt-0.5 shrink-0" />
          <p><strong class="text-[var(--theme-text-primary,var(--color-text-main,#0f172a))]">Alamat:</strong> {address}</p>
        </div>
        <div class="flex items-start gap-2">
          <Clock size={15} class="text-emerald-500 mt-0.5 shrink-0" />
          <p><strong class="text-[var(--theme-text-primary,var(--color-text-main,#0f172a))]">Jam Operasional:</strong> {storeHours}</p>
        </div>
        {#if facilities}
          <div class="flex items-start gap-2">
            <ShieldCheck size={15} class="text-[var(--theme-primary,#2563eb)] mt-0.5 shrink-0" />
            <p><strong class="text-[var(--theme-text-primary,var(--color-text-main,#0f172a))]">Fasilitas:</strong> {facilities}</p>
          </div>
        {/if}
      </div>
    </div>

    <div class="pt-4 border-t border-[var(--color-border,rgba(15,23,42,0.08))] flex flex-col sm:flex-row gap-2">
      <a
        href={directMapsUrl}
        target="_blank"
        rel="noreferrer"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode(e, 'maps_cta_button')}
        on:keydown={(e) => handleKeydown(e, 'maps_cta_button')}
        class={`inline-flex items-center justify-center gap-1.5 flex-1 h-9 px-4 rounded-[var(--theme-btn-radius,var(--btn-radius,16px))] bg-[var(--theme-btn-primary-bg,var(--btn-primary-bg,var(--theme-primary,#2563eb)))] text-[var(--theme-btn-primary-text,var(--btn-primary-text,#ffffff))] font-[var(--theme-font-heading,var(--font-heading,inherit))] font-bold hover:opacity-90 active:scale-[0.98] transition-all outline-none shadow-xs ${
          isCtaSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''
        }`}
        style="font-size: calc(var(--theme-text-body, var(--text-body-size, 16px)) * 0.9);"
      >
        <Navigation size={13} />
        <span>Navigasi Maps</span>
      </a>
      {#if whatsappUrl}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          class="inline-flex items-center justify-center gap-1.5 flex-1 h-9 px-4 rounded-[var(--theme-btn-radius,var(--btn-radius,16px))] bg-emerald-600 text-white font-[var(--theme-font-heading,var(--font-heading,inherit))] font-bold hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-xs"
          style="font-size: calc(var(--theme-text-body, var(--text-body-size, 16px)) * 0.9);"
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
    class={`w-full h-full min-h-[260px] rounded-2xl overflow-hidden shadow-md border border-[var(--color-border,rgba(15,23,42,0.08))] bg-[var(--color-card-base,var(--theme-surface,#ffffff))] transition-all outline-none ${
      isIframeSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''
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
