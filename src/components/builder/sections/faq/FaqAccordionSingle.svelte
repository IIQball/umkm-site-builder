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
      class={`rounded-2xl border border-light/80 bg-card overflow-hidden shadow-xs transition-all duration-200 cursor-pointer ${
        isItemActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-md'
          : 'hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <button
        type="button"
        on:click|stopPropagation={() => toggle(index)}
        class="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-heading font-bold text-xs sm:text-sm text-main hover:text-primary transition-colors cursor-pointer"
      >
        <span class="flex-1 min-w-0">{item.question}</span>
        <span
          class={`p-1.5 rounded-xl bg-nested text-secondary transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
        >
          <ChevronDown size={15} />
        </span>
      </button>

      {#if isOpen}
        <div class="px-5 pb-5 pt-1 text-xs text-secondary leading-relaxed border-t border-light/60">
          {item.answer}
        </div>
      {/if}
    </div>
  {/each}
</div>
