<script lang="ts">
  import { Building2 } from 'lucide-svelte';
  import { canvasStore, maxStoreBranchesStore } from '../../stores/editorStore';
  import type { MapBranchItem } from './maps.helpers';
  import { resolveMapsNodeStyle } from './mapsStyles.helpers';

  export let sectionId: string = '';
  export let branches: MapBranchItem[] = [];
  export let activeBranchIdx: number = 0;
  export let onSelectBranch: (idx: number) => void = () => {};
  export let nodeStyles: Record<string, Record<string, string>> = {};

  $: isSelected =
    $canvasStore?.selectedNodeId === 'maps_branch_selector' &&
    $canvasStore?.selectedSectionId === sectionId;

  $: style = resolveMapsNodeStyle('maps_branch_selector', nodeStyles);

  function selectSelector(e: Event) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, 'maps_branch_selector');
    }
  }

  function handleBranchClick(e: Event, idx: number) {
    e.stopPropagation();
    onSelectBranch(idx);
    if (sectionId) {
      canvasStore.selectNode(sectionId, 'maps_branch_selector');
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectSelector(e);
    }
  }
</script>

<div
  data-node="maps_branch_selector"
  data-node-id="maps_branch_selector"
  role="button"
  tabindex="0"
  on:click={selectSelector}
  on:keydown={handleKeydown}
  class={`flex flex-wrap items-center gap-2 p-1.5 rounded-2xl transition-all outline-none mb-3 ${
    isSelected
      ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-offset-2 dark:ring-offset-base-100 bg-[var(--theme-primary,var(--color-primary))]/5'
      : 'hover:bg-[var(--color-nested-base)]/40'
  }`}
  style="margin-top: {style.marginTop}; margin-bottom: {style.marginBottom};"
>
  {#each branches.slice(0, $maxStoreBranchesStore || 5) as branch, idx}
    <button
      type="button"
      on:click={(e) => handleBranchClick(e, idx)}
      style={`border-radius: ${style.borderRadius || 'var(--theme-btn-radius, var(--btn-radius, 12px))'}; font-size: var(--theme-text-body, var(--text-body-size, 14px)); ${
        activeBranchIdx === idx
          ? style.backgroundColor
            ? `background-color: ${style.backgroundColor}; color: ${style.color || 'white'};`
            : 'background-color: var(--theme-btn-primary-bg, var(--btn-primary-bg, var(--theme-primary, var(--color-primary)))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white));'
          : 'background-color: var(--theme-btn-secondary-bg, var(--btn-secondary-bg, var(--color-nested-base))); color: var(--theme-btn-secondary-text, var(--btn-secondary-text, var(--color-text-secondary)));'
      }`}
      class="px-4 py-2 font-heading font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs hover:opacity-90 border border-[var(--theme-btn-outline-border,transparent)]"
    >
      <Building2 size={13} class="shrink-0" />
      <span>{branch.name}</span>
    </button>
  {/each}
</div>
