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

<div class="cq-faq-grid-2 text-left">
  {#each faqs as item, index (item.id || index)}
    {@const isCardActive = $canvasStore.selectedNodeId === (item.id || `faq_item_${index}`)}

    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, index, item)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, item); }}
      class={`p-5 sm:p-6 rounded-3xl border border-light/80 bg-card shadow-xs flex flex-col justify-between space-y-3 transition-all duration-200 cursor-pointer ${
        isCardActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-md'
          : 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div class="space-y-2">
        <div class="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-primary flex items-center justify-center">
          <HelpCircle size={16} />
        </div>
        <h3 class="font-heading font-bold text-xs sm:text-sm text-main">
          {item.question}
        </h3>
        <p class="text-xs text-secondary leading-relaxed pt-1 border-t border-light/60">
          {item.answer}
        </p>
      </div>
    </div>
  {/each}
</div>
