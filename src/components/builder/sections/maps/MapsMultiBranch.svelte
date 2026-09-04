<script lang="ts">
  import { MapPin, Navigation, Building2 } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import { buildMapEmbedUrl, buildDirectMapsUrl, type MapBranchItem } from './maps.helpers';

  export let sectionId: string = '';
  export let branches: MapBranchItem[] = [];
  export let activeBranchIdx: number = 0;

  $: activeBranch = branches[activeBranchIdx] || branches[0] || {
    id: 'default',
    name: 'Cabang Utama',
    address: 'Banyuwangi',
  };
  $: currentEmbedUrl = activeBranch.googleMapsUrl || buildMapEmbedUrl(activeBranch.address);
  $: currentDirectUrl = buildDirectMapsUrl(activeBranch.address);

  $: isTabsSelected = $canvasStore?.selectedNodeId === 'maps_branch_tabs' && $canvasStore?.selectedSectionId === sectionId;
  $: isCardSelected = $canvasStore?.selectedNodeId === 'maps_info_card' && $canvasStore?.selectedSectionId === sectionId;
  $: isIframeSelected = $canvasStore?.selectedNodeId === 'maps_iframe' && $canvasStore?.selectedSectionId === sectionId;
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

  function handleBranchClick(e: Event, idx: number) {
    e.stopPropagation();
    activeBranchIdx = idx;
    if (sectionId) {
      canvasStore.selectNode(sectionId, 'maps_branch_tabs');
    }
  }
</script>

<div class="w-full text-left space-y-3">
  <!-- Bilah Tab Cabang -->
  <div
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_branch_tabs')}
    on:keydown={(e) => handleKeydown(e, 'maps_branch_tabs')}
    class={`flex flex-wrap items-center gap-2 p-1 rounded-2xl transition-all outline-none ${
      isTabsSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900 bg-[var(--theme-primary,#2563eb)]/5' : ''
    }`}
  >
    {#each branches as branch, idx}
      <button
        type="button"
        on:click={(e) => handleBranchClick(e, idx)}
        style={`border-radius: var(--theme-btn-radius, var(--btn-radius, 12px)); font-size: var(--theme-text-body, var(--text-body-size, 14px)); ${
          activeBranchIdx === idx
            ? 'background-color: var(--theme-btn-primary-bg, var(--btn-primary-bg, var(--theme-primary, #2563eb))); color: var(--theme-btn-primary-text, var(--btn-primary-text, #ffffff));'
            : 'background-color: var(--theme-btn-secondary-bg, var(--btn-secondary-bg, var(--color-nested-base, #f1f5f9))); color: var(--theme-btn-secondary-text, var(--btn-secondary-text, var(--color-text-secondary, #475569)));'
        }`}
        class="px-4 py-2 font-[var(--theme-font-heading,var(--font-heading,inherit))] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs hover:opacity-90 border border-[var(--theme-btn-outline-border,transparent)]"
      >
        <Building2 size={13} class="shrink-0" />
        <span>{branch.name}</span>
      </button>
    {/each}
  </div>

  <!-- Detail Info Alamat Cabang Aktif -->
  <div
    role="button"
    tabindex="0"
    on:click={(e) => selectNode(e, 'maps_info_card')}
    on:keydown={(e) => handleKeydown(e, 'maps_info_card')}
    class={`bg-[var(--theme-surface,var(--color-card-base,#ffffff))] p-3 sm:p-4 rounded-xl border border-[var(--color-border,rgba(15,23,42,0.08))] flex flex-wrap items-center justify-between gap-3 text-[var(--theme-text-muted,var(--color-text-secondary,#334155))] font-[var(--theme-font-body,var(--font-family,inherit))] transition-all outline-none ${
      isCardSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''
    }`}
    style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
  >
    <div class="flex items-start sm:items-center gap-2">
      <MapPin size={15} class="text-[var(--theme-primary,#2563eb)] mt-0.5 sm:mt-0 shrink-0" />
      <div>
        <span class="font-[var(--theme-font-heading,var(--font-heading,inherit))] font-bold text-[var(--theme-text-primary,var(--color-text-main,#0f172a))]">{activeBranch.name}:</span>
        <span class="ml-1 text-[var(--theme-text-muted,var(--color-text-secondary,#64748b))] font-[var(--theme-font-body,var(--font-family,inherit))]">{activeBranch.address}</span>
      </div>
    </div>

    <a
      href={currentDirectUrl}
      target="_blank"
      rel="noreferrer"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode(e, 'maps_cta_button')}
      on:keydown={(e) => handleKeydown(e, 'maps_cta_button')}
      class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--theme-btn-radius,var(--btn-radius,8px))] bg-[var(--theme-btn-primary-bg,var(--btn-primary-bg,var(--theme-primary,#2563eb)))] text-[var(--theme-btn-primary-text,var(--btn-primary-text,#ffffff))] font-[var(--theme-font-heading,var(--font-heading,inherit))] font-bold hover:opacity-90 active:scale-[0.98] transition-all outline-none shadow-xs ${
        isCtaSelected ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900' : ''
      }`}
      style="font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.9);"
    >
      <Navigation size={11} />
      <span>Buka Petunjuk Arah</span>
    </a>
  </div>

  <!-- Frame Peta Cabang -->
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
      title={`Peta ${activeBranch.name}`}
      src={currentEmbedUrl}
      class="w-full h-full border-0"
      loading="lazy"
      allowfullscreen
    ></iframe>
  </div>
</div>
