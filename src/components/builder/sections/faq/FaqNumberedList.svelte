<script lang="ts">
  import type { FAQItem } from '@/types';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let faqs: FAQItem[] = [];

  function selectItem(e: Event, idx: number, item: FAQItem) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, item.id || `faq_item_${idx}`);
    }
  }

  function formatIndex(n: number): string {
    const num = n + 1;
    return num < 10 ? `0${num}` : `${num}`;
  }
</script>

<div class="max-w-2xl mx-auto text-left space-y-4">
  {#each faqs as item, index (item.id || index)}
    {@const isItemActive = $canvasStore.selectedNodeId === (item.id || `faq_item_${index}`)}

    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectItem(e, index, item)}
      on:keydown={(e) => { if (e.key === 'Enter') selectItem(e, index, item); }}
      class={`flex gap-4 p-4 rounded-2xl border-b border-[var(--color-border,rgba(15,23,42,0.08))] transition-all duration-200 cursor-pointer ${
        isItemActive
          ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900 bg-[var(--color-card-base,var(--theme-surface,#ffffff))] shadow-xs'
          : 'hover:bg-[var(--color-card-base,var(--theme-surface,#ffffff))]/60'
      }`}
    >
      <span class="font-mono text-base font-black text-[var(--theme-primary,#2563eb)] shrink-0">
        {formatIndex(index)}
      </span>
      <div class="space-y-1">
        <h4 class="font-[var(--font-heading,inherit)] font-bold text-xs sm:text-sm text-[var(--color-text-main,var(--theme-text-primary,#0f172a))]">
          {item.question}
        </h4>
        <p class="text-xs text-[var(--color-text-secondary,var(--theme-text-muted,#64748b))] leading-relaxed font-[var(--font-family,inherit)]">
          {item.answer}
        </p>
      </div>
    </div>
  {/each}
</div>
