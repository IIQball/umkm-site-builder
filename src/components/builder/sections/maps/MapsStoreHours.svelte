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
    class={`bg-[var(--theme-surface,var(--color-card-base,#ffffff))] text-[var(--theme-text-primary,var(--color-text-main,#0f172a))] border border-[var(--color-border,rgba(15,23,42,0.08))] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 transition-all outline-none ${
      isHoursSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''
    }`}
  >
    <div
      class="flex items-center gap-2.5 font-[var(--theme-font-heading,var(--font-heading,inherit))]"
      style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
    >
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
      <span class="font-bold text-emerald-600 dark:text-emerald-400 tracking-wide">{storeHoursStatus}</span>
      <span class="text-[var(--theme-text-muted,var(--color-text-secondary,#64748b))] flex items-center gap-1.5 font-[var(--theme-font-body,var(--font-family,inherit))]">
        <Clock size={13} />
        <span>• {storeHours}</span>
      </span>
    </div>

    {#if whatsappUrl}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        class="inline-flex items-center gap-1.5 text-[var(--theme-primary,#2563eb)] hover:underline font-semibold transition-colors font-[var(--theme-font-heading,var(--font-heading,inherit))]"
        style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
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
    class={`w-full cq-map-frame-height rounded-2xl overflow-hidden border border-[var(--color-border,rgba(15,23,42,0.08))] bg-[var(--color-card-base,var(--theme-surface,#ffffff))] transition-all outline-none ${
      isIframeSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''
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
