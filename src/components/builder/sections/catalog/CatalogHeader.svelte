<script lang="ts">
  import { canvasStore } from '../../stores/editorStore';
  import { Sparkles } from 'lucide-svelte';

  export let sectionId: string = '';
  export let title: string = '';
  export let subtitle: string = '';
  export let badgeText: string = '';
  export let align: 'left' | 'center' | 'right' = 'center';

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
    class={`relative cursor-pointer transition-all duration-150 mb-8 rounded-2xl p-3 ${
      align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center'
    } ${
      isHeaderSelected
        ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
        : 'hover:outline hover:outline-dashed hover:outline-1 hover:outline-blue-400/60'
    }`}
  >
    {#if badgeText}
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60 mb-2">
        <Sparkles size={12} class="animate-pulse" />
        <span>{badgeText}</span>
      </div>
    {/if}
    {#if title}
      <h2 class="text-heading-lg font-heading text-main tracking-tight font-black">
        {title}
      </h2>
    {/if}
    {#if subtitle}
      <p class="text-xs sm:text-sm text-secondary max-w-xl mx-auto mt-2 leading-relaxed">
        {subtitle}
      </p>
    {/if}
  </div>
{/if}
