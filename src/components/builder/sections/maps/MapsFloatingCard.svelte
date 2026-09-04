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
  class={`relative w-full rounded-2xl overflow-hidden border border-[var(--color-border,rgba(15,23,42,0.08))] bg-[var(--color-card-base,var(--theme-surface,#ffffff))] transition-all outline-none ${
    isIframeSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''
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
    class={`cq-floating-card-corner bg-[var(--color-card-base,var(--theme-surface,#ffffff))]/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-[var(--color-border,rgba(15,23,42,0.08))] space-y-2 text-left transition-all outline-none ${
      isCardSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''
    }`}
  >
    <h3
      class="font-[var(--theme-font-heading,var(--font-heading,inherit))] text-[var(--theme-text-primary,var(--color-text-main,#0f172a))]"
      style="font-size: var(--theme-text-h3, var(--text-h3-size, 18px)); font-weight: var(--theme-text-h3-weight, var(--text-h3-weight, 600)); font-family: var(--theme-font-heading, var(--font-heading, inherit));"
    >
      {storeName}
    </h3>
    <p
      class="text-[var(--theme-text-muted,var(--color-text-secondary,#64748b))] font-[var(--theme-font-body,var(--font-family,inherit))] leading-relaxed"
      style="font-size: var(--theme-text-body, var(--text-body-size, 14px)); font-family: var(--theme-font-body, var(--font-family, inherit));"
    >
      {address}
    </p>

    {#if facilities}
      <div
        class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold font-[var(--theme-font-body,var(--font-family,inherit))]"
        style="font-size: var(--theme-text-caption, var(--text-caption-size, 11px));"
      >
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
      class={`inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-[var(--theme-btn-radius,var(--btn-radius,16px))] bg-[var(--theme-btn-primary-bg,var(--btn-primary-bg,var(--theme-primary,#2563eb)))] text-[var(--theme-btn-primary-text,var(--btn-primary-text,#ffffff))] font-[var(--theme-font-heading,var(--font-heading,inherit))] font-bold hover:opacity-90 active:scale-[0.98] transition-all mt-1 outline-none shadow-xs ${
        isCtaSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''
      }`}
      style="font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.9);"
    >
      <Navigation size={12} />
      <span>Lihat Rute</span>
      <ArrowRight size={12} />
    </a>
  </div>
</div>
