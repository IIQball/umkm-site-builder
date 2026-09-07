<script lang="ts">
  import type { FAQItem } from '@/types';
  import { HelpCircle } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let faqs: FAQItem[] = [];

  function selectCard(e: Event, idx: number, item: FAQItem) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, item.id || `faq_item_${idx}`);
    }
  }
</script>

<div class="w-full">
  <div class="flex justify-between items-center mb-3 px-1 text-xs text-[var(--color-text-secondary,var(--theme-text-muted,#64748b))]">
    <span class="font-[var(--font-heading,inherit)] font-bold text-[var(--color-text-main,var(--theme-text-primary,#0f172a))]">Tanya Jawab Populer</span>
    <span class="font-mono text-[11px]">Geser ke samping →</span>
  </div>

  <div class="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 snap-x no-scrollbar text-left">
    {#each faqs as item, index (item.id || index)}
      {@const isCardActive = $canvasStore.selectedNodeId === (item.id || `faq_item_${index}`)}

      <div
        role="button"
        tabindex="0"
        on:click={(e) => selectCard(e, index, item)}
        on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, item); }}
        class={`w-64 shrink-0 snap-start p-5 rounded-3xl bg-[var(--color-card-base,var(--theme-surface,#ffffff))] border border-[var(--color-border,rgba(15,23,42,0.08))] shadow-xs space-y-2 transition-all duration-200 cursor-pointer ${
          isCardActive
            ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900 shadow-md'
            : 'hover:shadow-md hover:border-[var(--theme-primary,#2563eb)]/30'
        }`}
      >
        <div class="w-7 h-7 rounded-xl bg-[var(--theme-primary,#2563eb)]/10 text-[var(--theme-primary,#2563eb)] flex items-center justify-center">
          <HelpCircle size={14} />
        </div>

        <h4 class="font-[var(--font-heading,inherit)] font-bold text-xs text-[var(--color-text-main,var(--theme-text-primary,#0f172a))] line-clamp-2">
          {item.question}
        </h4>

        <p class="text-xs text-[var(--color-text-secondary,var(--theme-text-muted,#64748b))] leading-relaxed line-clamp-4 pt-1 border-t border-[var(--color-border,rgba(15,23,42,0.08))] font-[var(--font-family,inherit)]">
          {item.answer}
        </p>
      </div>
    {/each}
  </div>
</div>
