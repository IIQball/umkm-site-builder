<script lang="ts">
  import type { FAQItem } from '@/types';
  import { ChevronDown } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let faqs: FAQItem[] = [];

  let openIndex: number | null = 0;

  function toggle(idx: number) {
    openIndex = openIndex === idx ? null : idx;
  }

  function selectItem(e: Event, idx: number, item: FAQItem) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, item.id || `faq_item_${idx}`);
    }
  }
</script>

<div class="max-w-3xl mx-auto flex flex-col gap-3 text-left">
  {#each faqs as item, index (item.id || index)}
    {@const isOpen = openIndex === index}
    {@const isItemActive = $canvasStore.selectedNodeId === (item.id || `faq_item_${index}`)}

    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectItem(e, index, item)}
      on:keydown={(e) => { if (e.key === 'Enter') selectItem(e, index, item); }}
      class={`overflow-hidden shadow-xs transition-all duration-200 cursor-pointer ${
        isItemActive
          ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 shadow-md'
          : 'hover:border-[var(--theme-primary,#2563eb)]/50'
      }`}
      style="background: var(--color-card-base, #ffffff); border: 1px solid var(--color-border, rgba(15, 23, 42, 0.08)); border-radius: var(--btn-radius, var(--theme-btn-radius, 16px));"
    >
      <button
        type="button"
        on:click|stopPropagation={() => toggle(index)}
        class="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-heading font-bold text-xs sm:text-sm hover:opacity-80 transition-colors cursor-pointer"
        style="color: var(--color-text-main, #0f172a); font-family: var(--font-heading);"
      >
        <span class="flex-1 min-w-0">{item.question}</span>
        <span
          class={`p-1.5 rounded-xl transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
          style="background: var(--color-nested-base, #f1f5f9); color: {isOpen ? 'var(--theme-primary, #2563eb)' : 'var(--color-text-secondary, #334155)'};"
        >
          <ChevronDown size={15} />
        </span>
      </button>

      {#if isOpen}
        <div
          class="px-5 pb-5 pt-1 text-xs leading-relaxed border-t"
          style="color: var(--color-text-secondary, #334155); border-color: var(--color-border, rgba(15, 23, 42, 0.08)); font-family: var(--font-family);"
        >
          {item.answer}
        </div>
      {/if}
    </div>
  {/each}
</div>
