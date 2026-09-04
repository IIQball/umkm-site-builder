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
    class={`max-w-md w-full bg-[var(--color-card-base,var(--theme-surface,#ffffff))] p-5 rounded-2xl border border-[var(--color-border,rgba(15,23,42,0.08))] shadow-sm text-left space-y-3 transition-all outline-none ${
      isCardSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''
    }`}
  >
    <div>
      <h2
        class="font-[var(--theme-font-heading,var(--font-heading,inherit))] text-[var(--theme-text-primary,var(--color-text-main,#0f172a))]"
        style="font-size: var(--theme-text-h2, var(--text-h2-size, 22px)); font-weight: var(--theme-text-h2-weight, var(--text-h2-weight, 700)); font-family: var(--theme-font-heading, var(--font-heading, inherit));"
      >
        {storeName}
      </h2>
      <p
        class="text-[var(--theme-text-muted,var(--color-text-secondary,#64748b))] font-[var(--theme-font-body,var(--font-family,inherit))] mt-0.5 leading-relaxed"
        style="font-size: var(--theme-text-body, var(--text-body-size, 14px)); font-family: var(--theme-font-body, var(--font-family, inherit));"
      >
        {address}
      </p>
    </div>

    <!-- Mini Map Frame 192px -->
    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectNode(e, 'maps_iframe')}
      on:keydown={(e) => handleKeydown(e, 'maps_iframe')}
      class={`w-full h-48 rounded-xl overflow-hidden border border-[var(--color-border,rgba(15,23,42,0.08))] bg-[var(--theme-surface,var(--color-card-base,#ffffff))] transition-all outline-none ${
        isIframeSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''
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
      class={`inline-flex items-center justify-center gap-2 w-full h-9 rounded-[var(--theme-btn-radius,var(--btn-radius,16px))] bg-[var(--theme-btn-primary-bg,var(--btn-primary-bg,var(--theme-primary,#2563eb)))] text-[var(--theme-btn-primary-text,var(--btn-primary-text,#ffffff))] font-[var(--theme-font-heading,var(--font-heading,inherit))] font-bold hover:opacity-90 active:scale-[0.98] shadow-sm transition-all outline-none ${
        isCtaSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''
      }`}
      style="font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.9);"
    >
      <Navigation size={13} />
      <span>Buka di Aplikasi Google Maps</span>
      <ExternalLink size={13} />
    </a>
  </div>
</div>
