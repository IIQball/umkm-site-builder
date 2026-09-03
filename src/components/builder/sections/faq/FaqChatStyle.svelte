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
  <div class="flex flex-col gap-4 p-5 sm:p-6 rounded-3xl bg-nested/60 border border-light/80 shadow-xs">
    {#each faqs as item, index (item.id || index)}
      {@const isItemActive = $canvasStore.selectedNodeId === (item.id || `faq_item_${index}`)}

      <div
        role="button"
        tabindex="0"
        on:click={(e) => selectItem(e, index, item)}
        on:keydown={(e) => { if (e.key === 'Enter') selectItem(e, index, item); }}
        class={`flex flex-col gap-2 p-3 rounded-2xl transition-all duration-200 cursor-pointer ${
          isItemActive
            ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 bg-card shadow-sm'
            : 'hover:bg-card/50'
        }`}
      >
        <!-- Pertanyaan Pembeli (Kanan) -->
        <div class="self-end max-w-[85%] p-3.5 rounded-2xl rounded-tr-xs bg-primary text-white text-xs font-heading font-medium shadow-xs flex items-start gap-2">
          <HelpCircle size={14} class="shrink-0 mt-0.5 text-white/90" />
          <span>{item.question}</span>
        </div>

        <!-- Jawaban CS Toko (Kiri) -->
        <div class="self-start max-w-[85%] p-3.5 rounded-2xl rounded-tl-xs bg-card border border-light/80 text-xs text-main shadow-xs leading-relaxed flex items-start gap-2">
          <MessageCircle size={14} class="shrink-0 mt-0.5 text-emerald-600" />
          <span>{item.answer}</span>
        </div>
      </div>
    {/each}
  </div>
</div>
