<script lang="ts">
  import { canvasStore } from '../../stores/editorStore';
  import { HelpCircle } from 'lucide-svelte';

  export let sectionId: string = '';
  export let title: string = '';
  export let subtitle: string = '';
  export let badgeText: string = '';
  export let align: 'left' | 'center' | 'right' = 'center';

  $: isHeaderSelected = $canvasStore.selectedNodeId === 'faq_header';

  function handleSelect(e?: Event) {
    if (e) e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, 'faq_header');
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
        ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2'
        : 'hover:outline hover:outline-dashed hover:outline-1 hover:outline-[var(--theme-primary,#2563eb)]/60'
    }`}
  >
    {#if badgeText}
      <div
        class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2 font-heading"
        style="background: rgba(var(--color-primary-rgb, 37 99 235), 0.1); color: var(--theme-primary, var(--color-primary, #2563eb)); border: 1px solid rgba(var(--color-primary-rgb, 37 99 235), 0.2); border-radius: var(--btn-radius, var(--theme-btn-radius, 9999px));"
      >
        <HelpCircle size={12} class="text-[var(--theme-primary,#2563eb)]" />
        <span>{badgeText}</span>
      </div>
    {/if}
    {#if title}
      <h2
        class="text-heading-lg font-heading text-main tracking-tight font-black"
        style="color: var(--color-text-main, #0f172a); font-family: var(--font-heading);"
      >
        {title}
      </h2>
    {/if}
    {#if subtitle}
      <p
        class="text-xs sm:text-sm text-secondary max-w-xl mx-auto mt-2 leading-relaxed"
        style="color: var(--color-text-secondary, #334155); font-family: var(--font-family);"
      >
        {subtitle}
      </p>
    {/if}
  </div>
{/if}
