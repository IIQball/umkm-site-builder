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
      class={`p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 transition-all duration-200 cursor-pointer ${
        isCardActive
          ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 shadow-md'
          : 'hover:border-[var(--theme-primary, var(--color-primary))]/50'
      }`}
      style="background: var(--color-card-base); border: 1px solid var(--color-border); border-radius: var(--btn-radius, var(--theme-btn-radius, 24px));"
    >
      <div class="space-y-2">
        <div
          class="w-8 h-8 rounded-xl flex items-center justify-center"
          style="background: rgba(var(--color-primary-rgb), 0.1); color: var(--theme-primary, var(--color-primary));"
        >
          <HelpCircle size={16} />
        </div>
        <h3
          class="font-heading font-bold text-xs sm:text-sm"
          style="color: var(--color-text-main); font-family: var(--font-heading);"
        >
          {item.question}
        </h3>
        <p
          class="text-xs leading-relaxed pt-1 border-t"
          style="color: var(--color-text-secondary); border-color: var(--color-border); font-family: var(--font-family);"
        >
          {item.answer}
        </p>
      </div>
    </div>
  {/each}
</div>
