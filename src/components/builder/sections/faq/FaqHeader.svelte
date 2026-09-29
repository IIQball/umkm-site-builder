<script lang="ts">
  import { canvasStore } from '../../stores/editorStore';
  import { HelpCircle } from 'lucide-svelte';

  export let sectionId: string = '';
  export let title: string = '';
  export let subtitle: string = '';
  export let badgeText: string = '';
  export let align: 'left' | 'center' | 'right' = 'center';
  export let elementOrder: string[] = ['badge', 'title', 'subtitle'];

  $: defaultOrder = ['badge', 'title', 'subtitle'];
  $: effectiveOrder = Array.isArray(elementOrder) && elementOrder.length > 0
    ? [...elementOrder.filter((s) => defaultOrder.includes(s)), ...defaultOrder.filter((s) => !elementOrder.includes(s))]
    : defaultOrder;

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
        ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2'
        : 'hover:outline hover:outline-dashed hover:outline-1 hover:outline-[var(--theme-primary, var(--color-primary))]/60'
    }`}
  >
    {#each effectiveOrder as slot}
      {#if slot === 'badge' && badgeText}
        <div
          class="badge badge-primary badge-outline gap-1.5 px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider mb-2"
          style="border-radius: var(--btn-radius, var(--theme-btn-radius, 9999px));"
        >
          <HelpCircle size={12} class="text-[var(--theme-primary, var(--color-primary))]" />
          <span>{badgeText}</span>
        </div>
      {:else if slot === 'title' && title}
        <h2
          class="text-heading-lg font-heading text-main tracking-tight font-black"
          style="color: var(--color-text-main);"
        >
          {title}
        </h2>
      {:else if slot === 'subtitle' && subtitle}
        <p
          class="text-xs sm:text-sm text-secondary font-sans max-w-xl mx-auto mt-2 leading-relaxed"
          style="color: var(--color-text-secondary);"
        >
          {subtitle}
        </p>
      {/if}
    {/each}
  </div>
{/if}
