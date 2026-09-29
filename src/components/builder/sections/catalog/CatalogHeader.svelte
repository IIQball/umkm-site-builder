<script lang="ts">
  import { canvasStore } from '../../stores/editorStore';
  import { Sparkles } from 'lucide-svelte';

  export let sectionId: string = '';
  export let title: string = '';
  export let subtitle: string = '';
  export let badgeText: string = '';
  export let align: 'left' | 'center' | 'right' = 'center';
  export let elementOrder: string[] = ['badge', 'title', 'subtitle'];

  $: effectiveOrder = (elementOrder && elementOrder.length > 0 ? elementOrder : ['badge', 'title', 'subtitle']).filter(
    (k) => k !== 'catalog_grid'
  );

  $: isHeaderSelected = $canvasStore.selectedNodeId === 'catalog_header';

  function handleSelect(e?: Event) {
    if (e) e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, 'catalog_header');
    }
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Enter') handleSelect(e);
  }
</script>

{#if title || subtitle || badgeText}
  <div
    role="button"
    tabindex="0"
    on:click={handleSelect}
    on:keydown={handleKey}
    class={`flex flex-col cursor-pointer transition-all duration-150 mb-8 rounded-2xl p-3 ${
      align === 'left' ? 'items-start text-left' : align === 'right' ? 'items-end text-right' : 'items-center text-center'
    } ${
      isHeaderSelected
        ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
        : 'hover:outline hover:outline-dashed hover:outline-1 hover:outline-primary/60'
    }`}
  >
    {#each effectiveOrder as slot}
      {#if slot === 'badge' && badgeText}
        <div
          class="badge badge-primary badge-outline gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2"
        >
          <Sparkles size={12} class="animate-pulse" />
          <span>{badgeText}</span>
        </div>
      {:else if slot === 'title' && title}
        <h2 class="text-heading-lg font-heading text-main tracking-tight font-black">
          {title}
        </h2>
      {:else if slot === 'subtitle' && subtitle}
        <p class="text-xs sm:text-sm text-secondary max-w-xl mx-auto mt-2 leading-relaxed">
          {subtitle}
        </p>
      {/if}
    {/each}
  </div>
{/if}
