<script lang="ts">
  import { Star, Sparkles, CheckCircle2 } from 'lucide-svelte';
  import type { TestimonialItem } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import { resolveTestimonialItemStyle } from './testimonialStyles.helpers';

  export let sectionId: string = '';
  export let testimonials: TestimonialItem[] = [];
  export let nodeStyles: Record<string, Record<string, string>> = {};

  $: displayCards = Array.isArray(testimonials) && testimonials.length > 0 ? testimonials : [];

  function selectCard(e: Event, idx: number, item: any) {
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

<div class="cq-side-3-grid text-left">
  {#each displayCards as item, index (item.id || index)}
    {@const itemStyle = resolveTestimonialItemStyle(item, index, nodeStyles)}
    {@const isHighlighted = displayCards.length >= 3 ? index === 1 : index === 0}
    {@const isCardActive = $canvasStore.selectedSectionId === sectionId && $canvasStore.selectedNodeId === (item.id || `testi_item_${index}`)}
    {@const isAvatarActive = $canvasStore.selectedSectionId === sectionId && $canvasStore.selectedNodeId === `testi_avatar_${index}`}

    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, index, item)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, item); }}
      class={`p-6 rounded-3xl transition-all duration-200 cursor-pointer relative space-y-3 ${
        isHighlighted
          ? 'bg-slate-900 text-white shadow-xl cq-side-3-highlight'
          : 'bg-card border border-light/80 shadow-xs hover:shadow-md'
      } ${
        isCardActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 shadow-2xl'
          : ''
      }`}
    >
      {#if isHighlighted}
        <span class="absolute -top-2.5 right-6 bg-primary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
          <Sparkles size={11} />
          <span>ULASAN PILIHAN</span>
        </span>
      {/if}

      <div class="flex items-center gap-1 text-amber-400">
        {#each Array(item.rating || 5) as _}
          <Star size={13} class="fill-amber-400 text-amber-400" />
        {/each}
      </div>

      <p
        class={`text-xs sm:text-sm leading-relaxed ${isHighlighted ? 'text-slate-200 font-medium' : 'text-secondary italic'}`}
        style="{itemStyle.color ? `color: ${itemStyle.color};` : ''}"
      >
        "{item.comment}"
      </p>

      <div class={`pt-3 border-t flex items-center gap-3 ${isHighlighted ? 'border-slate-800' : 'border-light/60'}`}>
        {#if item.avatar}
          <div
            role="button"
            tabindex="0"
            on:click={(e) => selectAvatar(e, index)}
            on:keydown={(e) => { if (e.key === 'Enter') selectAvatar(e, index); }}
            class={`w-9 h-9 rounded-full overflow-hidden bg-nested shrink-0 cursor-pointer ${
              isAvatarActive ? 'ring-2 ring-primary' : ''
            }`}
          >
            <img src={item.avatar} alt={item.customerName} class="w-full h-full object-cover" />
          </div>
        {/if}

        <div class="min-w-0">
          <h5 class={`font-heading font-bold text-xs truncate ${isHighlighted ? 'text-white' : 'text-main'}`}>
            — {item.customerName}
          </h5>
          {#if item.role}
            <span class={`text-[10px] block truncate ${isHighlighted ? 'text-slate-400' : 'text-secondary'}`}>
              {item.role}
            </span>
          {/if}
          {#if item.verified !== false}
            <span class="text-[10px] text-emerald-500 font-semibold flex items-center gap-1 mt-0.5">
              <CheckCircle2 size={10} />
              <span>{item.verifiedText || 'Pembeli Terverifikasi'}</span>
            </span>
          {/if}
        </div>
      </div>
    </div>
  {/each}
</div>
