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
    class={`bg-[var(--theme-surface,var(--color-card-base,#ffffff))] p-6 rounded-2xl border border-[var(--color-border,rgba(15,23,42,0.08))] shadow-sm space-y-4 flex flex-col justify-between transition-all outline-none ${
      isCardSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''
    }`}
  >
    <div class="space-y-3">
      <h3
        class="font-[var(--theme-font-heading,var(--font-heading,inherit))] text-[var(--theme-text-primary,var(--color-text-main,#0f172a))]"
        style="font-size: var(--theme-text-h3, var(--text-h3-size, 20px)); font-weight: var(--theme-text-h3-weight, var(--text-h3-weight, 700)); font-family: var(--theme-font-heading, var(--font-heading, inherit));"
      >
        {title}
      </h3>

      <div class="space-y-2.5 text-[var(--theme-text-muted,var(--color-text-secondary,#334155))] font-[var(--theme-font-body,var(--font-family,inherit))]">
        {#if directionsLandmark}
          <div class="p-3 bg-[var(--color-nested-base,#f8fafc)] rounded-xl border border-[var(--color-border,rgba(15,23,42,0.08))] space-y-1">
            <div
              class="flex items-center gap-1.5 font-[var(--theme-font-heading,var(--font-heading,inherit))] font-bold text-[var(--theme-text-primary,var(--color-text-main,#0f172a))]"
              style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
            >
              <Flag size={14} class="text-[var(--theme-primary,#2563eb)] shrink-0" />
              <span>Patokan Terdekat:</span>
            </div>
            <p
              class="leading-relaxed pl-5 text-[var(--theme-text-muted,var(--color-text-secondary,#334155))] font-[var(--theme-font-body,var(--font-family,inherit))]"
              style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
            >
              {directionsLandmark}
            </p>
          </div>
        {/if}

        {#if directionsParking}
          <div class="p-3 bg-[var(--color-nested-base,#f8fafc)] rounded-xl border border-[var(--color-border,rgba(15,23,42,0.08))] space-y-1">
            <div
              class="flex items-center gap-1.5 font-[var(--theme-font-heading,var(--font-heading,inherit))] font-bold text-[var(--theme-text-primary,var(--color-text-main,#0f172a))]"
              style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
            >
              <Car size={14} class="text-[var(--theme-primary,#2563eb)] shrink-0" />
              <span>Parkir Kendaraan:</span>
            </div>
            <p
              class="leading-relaxed pl-5 text-[var(--theme-text-muted,var(--color-text-secondary,#334155))] font-[var(--theme-font-body,var(--font-family,inherit))]"
              style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
            >
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
      class={`inline-flex items-center justify-center gap-2 w-full h-9 px-4 rounded-[var(--theme-btn-radius,var(--btn-radius,16px))] bg-[var(--theme-btn-primary-bg,var(--btn-primary-bg,var(--theme-primary,#2563eb)))] text-[var(--theme-btn-primary-text,var(--btn-primary-text,#ffffff))] font-[var(--theme-font-heading,var(--font-heading,inherit))] font-bold hover:opacity-90 active:scale-[0.98] shadow-sm transition-all outline-none ${
        isCtaSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''
      }`}
      style="font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.9);"
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
    class={`w-full h-full min-h-[260px] rounded-2xl overflow-hidden shadow-md border border-[var(--color-border,rgba(15,23,42,0.08))] bg-[var(--color-card-base,var(--theme-surface,#ffffff))] transition-all outline-none ${
      isIframeSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''
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
