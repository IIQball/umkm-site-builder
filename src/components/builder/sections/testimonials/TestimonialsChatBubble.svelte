<script lang="ts">
  import type { TestimonialItem } from '@/types';
  import { MessageCircle, Star, CheckCircle2 } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import { resolveTestimonialItemStyle } from './testimonialStyles.helpers';

  export let sectionId: string = '';
  export let testimonials: TestimonialItem[] = [];
  export let nodeStyles: Record<string, Record<string, string>> = {};

  function selectBubble(e: Event, idx: number, item: TestimonialItem) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, item.id || `testi_item_${idx}`);
    }
  }

  function selectAvatar(e: Event, idx: number) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, `testi_avatar_${idx}`);
    }
  }
</script>

<div class="max-w-xl mx-auto text-left space-y-4">
  {#each testimonials as item, index (item.id || index)}
    {@const itemStyle = resolveTestimonialItemStyle(item, index, nodeStyles)}
    {@const isCardActive = $canvasStore.selectedSectionId === sectionId && $canvasStore.selectedNodeId === (item.id || `testi_item_${index}`)}
    {@const isAvatarActive = $canvasStore.selectedSectionId === sectionId && $canvasStore.selectedNodeId === `testi_avatar_${index}`}

    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectBubble(e, index, item)}
      on:keydown={(e) => { if (e.key === 'Enter') selectBubble(e, index, item); }}
      style="margin-top: {itemStyle.marginTop}; margin-bottom: {itemStyle.marginBottom};"
      class={`bg-card p-4 rounded-2xl rounded-tl-xs shadow-xs border border-light/80 space-y-2 max-w-[92%] transition-all duration-200 cursor-pointer ${
        isCardActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 shadow-md'
          : 'hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div class="flex items-center justify-between text-[11px] text-secondary border-b border-light/60 pb-1.5 gap-2">
        <div class="flex items-center gap-2 min-w-0">
          {#if item.avatar}
            <div
              role="button"
              tabindex="0"
              on:click={(e) => selectAvatar(e, index)}
              on:keydown={(e) => { if (e.key === 'Enter') selectAvatar(e, index); }}
              class={`w-6 h-6 rounded-full overflow-hidden bg-nested shrink-0 cursor-pointer ${
                isAvatarActive ? 'ring-2 ring-primary' : ''
              }`}
            >
              <img src={item.avatar} alt={item.customerName} class="w-full h-full object-cover" />
            </div>
          {/if}
          <div class="min-w-0">
            <span class="font-heading font-bold text-main truncate block">
              {item.customerName}
            </span>
            {#if item.verified !== false}
              <span class="text-[9px] text-emerald-600 font-semibold flex items-center gap-0.5">
                <CheckCircle2 size={9} />
                <span>{item.verifiedText || 'Pembeli Terverifikasi'}</span>
              </span>
            {/if}
          </div>
        </div>

        <span class="flex items-center gap-1 font-mono text-[10px] text-emerald-600 shrink-0">
          <MessageCircle size={11} />
          <span>{item.platform || item.role || 'via WhatsApp'}</span>
        </span>
      </div>

      <div class="flex items-center gap-0.5 text-amber-400">
        {#each Array(item.rating || 5) as _}
          <Star size={11} class="fill-amber-400 text-amber-400" />
        {/each}
      </div>

      <p
        class="text-xs leading-relaxed"
        style="{itemStyle.color ? `color: ${itemStyle.color};` : 'color: var(--color-text-main);'}"
      >
        "{item.comment}"
      </p>
    </div>
  {/each}
</div>
