<script lang="ts">
  import type { FAQItem } from '@/types';
  import { ChevronDown } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let faqs: FAQItem[] = [];

  let openSet = new Set<number>([0]);

  function toggle(idx: number) {
    if (openSet.has(idx)) {
      openSet.delete(idx);
    } else {
      openSet.add(idx);
    }
    openSet = new Set(openSet);
  }

  function selectItem(e: Event, idx: number, item: FAQItem) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, item.id || `faq_item_${idx}`);
    }
  }

  $: col1 = faqs.filter((_, i) => i % 2 === 0);
  $: col2 = faqs.filter((_, i) => i % 2 !== 0);
</script>

<div class="cq-faq-grid-2 text-left">
  <!-- Column 1 -->
  <div class="flex flex-col gap-3">
    {#each col1 as item, i (item.id || i * 2)}
      {@const originalIdx = i * 2}
      {@const isOpen = openSet.has(originalIdx)}
      {@const isItemActive = $canvasStore.selectedNodeId === (item.id || `faq_item_${originalIdx}`)}

      <div
        role="button"
        tabindex="0"
        on:click={(e) => selectItem(e, originalIdx, item)}
        on:keydown={(e) => { if (e.key === 'Enter') selectItem(e, originalIdx, item); }}
        class={`overflow-hidden shadow-xs transition-all duration-200 cursor-pointer ${
          isItemActive
            ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 shadow-md'
            : 'hover:border-[var(--theme-primary,#2563eb)]/50'
        }`}
        style="background: var(--color-card-base, #ffffff); border: 1px solid var(--color-border, rgba(15, 23, 42, 0.08)); border-radius: var(--btn-radius, var(--theme-btn-radius, 16px));"
      >
        <button
          type="button"
          on:click|stopPropagation={() => toggle(originalIdx)}
          class="w-full p-4 flex items-center justify-between gap-3 text-left font-heading font-bold text-xs hover:opacity-80 transition-colors cursor-pointer"
          style="color: var(--color-text-main, #0f172a); font-family: var(--font-heading);"
        >
          <span class="flex-1 min-w-0">{item.question}</span>
          <span
            class={`p-1.5 rounded-xl transition-transform duration-200 shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`}
            style="background: var(--color-nested-base, #f1f5f9); color: {isOpen ? 'var(--theme-primary, #2563eb)' : 'var(--color-text-secondary, #334155)'};"
          >
            <ChevronDown size={14} />
          </span>
        </button>

        {#if isOpen}
          <div
            class="px-4 pb-4 pt-1 text-xs leading-relaxed border-t"
            style="color: var(--color-text-secondary, #334155); border-color: var(--color-border, rgba(15, 23, 42, 0.08)); font-family: var(--font-family);"
          >
            {item.answer}
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Column 2 -->
  <div class="flex flex-col gap-3">
    {#each col2 as item, i (item.id || i * 2 + 1)}
      {@const originalIdx = i * 2 + 1}
      {@const isOpen = openSet.has(originalIdx)}
      {@const isItemActive = $canvasStore.selectedNodeId === (item.id || `faq_item_${originalIdx}`)}

      <div
        role="button"
        tabindex="0"
        on:click={(e) => selectItem(e, originalIdx, item)}
        on:keydown={(e) => { if (e.key === 'Enter') selectItem(e, originalIdx, item); }}
        class={`overflow-hidden shadow-xs transition-all duration-200 cursor-pointer ${
          isItemActive
            ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 shadow-md'
            : 'hover:border-[var(--theme-primary,#2563eb)]/50'
        }`}
        style="background: var(--color-card-base, #ffffff); border: 1px solid var(--color-border, rgba(15, 23, 42, 0.08)); border-radius: var(--btn-radius, var(--theme-btn-radius, 16px));"
      >
        <button
          type="button"
          on:click|stopPropagation={() => toggle(originalIdx)}
          class="w-full p-4 flex items-center justify-between gap-3 text-left font-heading font-bold text-xs hover:opacity-80 transition-colors cursor-pointer"
          style="color: var(--color-text-main, #0f172a); font-family: var(--font-heading);"
        >
          <span class="flex-1 min-w-0">{item.question}</span>
          <span
            class={`p-1.5 rounded-xl transition-transform duration-200 shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`}
            style="background: var(--color-nested-base, #f1f5f9); color: {isOpen ? 'var(--theme-primary, #2563eb)' : 'var(--color-text-secondary, #334155)'};"
          >
            <ChevronDown size={14} />
          </span>
        </button>

        {#if isOpen}
          <div
            class="px-4 pb-4 pt-1 text-xs leading-relaxed border-t"
            style="color: var(--color-text-secondary, #334155); border-color: var(--color-border, rgba(15, 23, 42, 0.08)); font-family: var(--font-family);"
          >
            {item.answer}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
