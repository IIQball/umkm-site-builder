<script lang="ts">
  import type { FAQItem } from '@/types';
  import { HelpCircle, MessageCircle } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let faqs: FAQItem[] = [];

  function selectItem(e: Event, idx: number, item: FAQItem) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, item.id || `faq_item_${idx}`);
    }
  }
</script>

<div class="max-w-2xl mx-auto flex flex-col gap-4 text-left">
  <div
    class="flex flex-col gap-4 p-5 sm:p-6 shadow-xs"
    style="background: var(--color-nested-base, #f1f5f9); border: 1px solid var(--color-border, rgba(15, 23, 42, 0.08)); border-radius: var(--btn-radius, var(--theme-btn-radius, 24px));"
  >
    {#each faqs as item, index (item.id || index)}
      {@const isItemActive = $canvasStore.selectedNodeId === (item.id || `faq_item_${index}`)}

      <div
        role="button"
        tabindex="0"
        on:click={(e) => selectItem(e, index, item)}
        on:keydown={(e) => { if (e.key === 'Enter') selectItem(e, index, item); }}
        class={`flex flex-col gap-2 p-3 rounded-2xl transition-all duration-200 cursor-pointer ${
          isItemActive
            ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 shadow-sm'
            : 'hover:bg-black/5 dark:hover:bg-white/5'
        }`}
        style="background: {isItemActive ? 'var(--color-card-base, #ffffff)' : 'transparent'};"
      >
        <!-- Pertanyaan Pembeli (Kanan) -->
        <div
          class="self-end max-w-[85%] p-3.5 text-xs font-heading font-medium shadow-xs flex items-start gap-2"
          style="background: var(--theme-primary, var(--color-primary, #2563eb)); color: #ffffff; border-radius: var(--btn-radius, var(--theme-btn-radius, 16px)); border-top-right-radius: 4px;"
        >
          <HelpCircle size={14} class="shrink-0 mt-0.5 text-white/90" />
          <span>{item.question}</span>
        </div>

        <!-- Jawaban CS Toko (Kiri) -->
        <div
          class="self-start max-w-[85%] p-3.5 text-xs shadow-xs leading-relaxed flex items-start gap-2"
          style="background: var(--color-card-base, #ffffff); color: var(--color-text-main, #0f172a); border: 1px solid var(--color-border, rgba(15, 23, 42, 0.08)); border-radius: var(--btn-radius, var(--theme-btn-radius, 16px)); border-top-left-radius: 4px; font-family: var(--font-family);"
        >
          <MessageCircle size={14} class="shrink-0 mt-0.5" style="color: var(--theme-primary, var(--color-primary, #2563eb));" />
          <span>{item.answer}</span>
        </div>
      </div>
    {/each}
  </div>
</div>
