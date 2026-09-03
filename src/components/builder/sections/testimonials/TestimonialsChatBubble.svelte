<script lang="ts">
  import type { TestimonialItem } from '@/types';
  import { MessageCircle, Star } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let testimonials: TestimonialItem[] = [];

  function selectBubble(e: Event, idx: number, item: TestimonialItem) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, item.id || `testi_item_${idx}`);
    }
  }
</script>

<div class="max-w-xl mx-auto text-left space-y-4">
  {#each testimonials as item, index (item.id || index)}
    {@const isCardActive = $canvasStore.selectedNodeId === (item.id || `testi_item_${index}`)}

    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectBubble(e, index, item)}
      on:keydown={(e) => { if (e.key === 'Enter') selectBubble(e, index, item); }}
      class={`bg-card p-4 rounded-2xl rounded-tl-xs shadow-xs border border-light/80 space-y-2 max-w-[92%] transition-all duration-200 cursor-pointer ${
        isCardActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-md'
          : 'hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div class="flex items-center justify-between text-[11px] text-secondary border-b border-light/60 pb-1.5">
        <span class="font-heading font-bold text-main">
          {item.customerName}
        </span>
        <span class="flex items-center gap-1 font-mono text-[10px] text-emerald-600">
          <MessageCircle size={11} />
          <span>via WhatsApp</span>
        </span>
      </div>

      <div class="flex items-center gap-0.5 text-amber-400">
        {#each Array(item.rating || 5) as _}
          <Star size={11} class="fill-amber-400 text-amber-400" />
        {/each}
      </div>

      <p class="text-xs text-main leading-relaxed">
        "{item.comment}"
      </p>
    </div>
  {/each}
</div>
