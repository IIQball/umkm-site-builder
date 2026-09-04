<script lang="ts">
  import { Star } from 'lucide-svelte';
  import type { TestimonialItem } from '@/types';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let testimonials: TestimonialItem[] = [];

  function selectCard(e: Event, idx: number, item: TestimonialItem) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, item.id || `testi_item_${idx}`);
    }
  }
</script>

<div class="overflow-hidden w-full py-4">
  <div class="testi-marquee-track gap-4 px-4 text-left">
    {#each [...testimonials, ...testimonials, ...testimonials] as item, index}
      {@const originalIdx = index % testimonials.length}
      {@const isCardActive = $canvasStore.selectedNodeId === (item.id || `testi_item_${originalIdx}`)}

      <div
        role="button"
        tabindex="0"
        on:click={(e) => selectCard(e, originalIdx, item)}
        on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, originalIdx, item); }}
        class={`w-72 p-4 rounded-2xl bg-card border border-light/80 shrink-0 space-y-2 shadow-xs transition-all duration-200 cursor-pointer ${
          isCardActive
            ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-md'
            : 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        <div class="flex items-center gap-0.5 text-amber-400">
          {#each Array(item.rating || 5) as _}
            <Star size={12} class="fill-amber-400 text-amber-400" />
          {/each}
        </div>
        <p class="text-xs text-secondary italic line-clamp-3 leading-relaxed">
          "{item.comment}"
        </p>
        <div class="flex items-center gap-2 pt-2 border-t border-light/60">
          {#if item.avatar}
            <img src={item.avatar} alt={item.customerName} class="w-6 h-6 rounded-full object-cover" />
          {/if}
          <p class="font-heading font-bold text-xs text-main truncate">
            {item.customerName}
          </p>
        </div>
      </div>
    {/each}
  </div>
</div>
