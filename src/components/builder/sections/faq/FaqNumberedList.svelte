<script lang="ts">
  import type { FAQItem } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import { resolveFaqItemStyle } from './faqStyles.helpers';

  export let sectionId: string = '';
  export let faqs: FAQItem[] = [];
  export let nodeStyles: Record<string, Record<string, string>> = {};

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
    {@const isItemActive = $canvasStore.selectedSectionId === sectionId && $canvasStore.selectedNodeId === (item.id || `faq_item_${index}`)}
    {@const itemStyle = resolveFaqItemStyle(item, index, nodeStyles)}

    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectItem(e, index, item)}
      on:keydown={(e) => { if (e.key === 'Enter') selectItem(e, index, item); }}
      class={`flex gap-4 p-4 rounded-2xl border-b border-[var(--color-border)] transition-all duration-200 cursor-pointer ${
        isItemActive
          ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100 bg-[var(--theme-surface, var(--color-card-base))] shadow-xs'
          : 'hover:bg-[var(--theme-surface, var(--color-card-base))]/60'
      }`}
      style="background: {itemStyle.backgroundColor || 'transparent'}; margin-top: {itemStyle.marginTop}; margin-bottom: {itemStyle.marginBottom};"
    >
      <span class="font-mono text-base font-black text-[var(--theme-primary, var(--color-primary))] shrink-0">
        {formatIndex(index)}
      </span>
      <div class="space-y-1">
        <h3
          class="font-heading font-bold text-xs sm:text-sm"
          style="color: {itemStyle.color || 'var(--theme-text-primary, var(--color-text-main))'}; font-family: var(--theme-heading-font, var(--font-heading));"
        >
          {item.question}
        </h3>
        <p class="text-xs text-[var(--theme-text-muted, var(--color-text-secondary))] leading-relaxed font-sans" style="font-family: var(--theme-body-font, var(--font-family));">
          {item.answer}
        </p>
      </div>
    </div>
  {/each}
</div>
