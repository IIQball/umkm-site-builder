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
      isTabsSelected ? 'ring-2 ring-primary ring-offset-2 bg-primary/5' : ''
    }`}
  >
    {#each branches as branch, idx}
      <button
        type="button"
        on:click={(e) => handleBranchClick(e, idx)}
        class={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
          activeBranchIdx === idx
            ? 'bg-primary text-white shadow-sm'
            : 'bg-base-200/70 dark:bg-slate-800 text-secondary hover:text-main hover:bg-base-200'
        }`}
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
    class={`bg-card p-3 sm:p-4 rounded-xl border border-base-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-secondary transition-all outline-none ${
      isCardSelected ? 'ring-2 ring-primary ring-offset-2' : ''
    }`}
  >
    <div class="flex items-start sm:items-center gap-2">
      <MapPin size={15} class="text-primary mt-0.5 sm:mt-0 shrink-0" />
      <div>
        <span class="font-heading font-bold text-main">{activeBranch.name}:</span>
        <span class="ml-1 text-secondary">{activeBranch.address}</span>
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
      class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[11px] font-heading font-bold hover:bg-slate-800 dark:hover:bg-white active:scale-[0.98] transition-all outline-none ${
        isCtaSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
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
    class={`w-full cq-map-frame-height rounded-2xl overflow-hidden border border-base-200 dark:border-slate-800 bg-base-200/40 transition-all outline-none ${
      isIframeSelected ? 'ring-2 ring-primary ring-offset-2' : ''
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
