<script lang="ts">
  import type { TestimonialItem } from '@/types';
  import { Star, CheckCircle2 } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';
  import { resolveTestimonialItemStyle } from './testimonialStyles.helpers';

  export let sectionId: string = '';
  export let testimonials: TestimonialItem[] = [];
  export let nodeStyles: Record<string, Record<string, string>> = {};

  let activeIdx = 0;
  $: currentItem = testimonials[activeIdx] || testimonials[0];
  $: itemStyle = resolveTestimonialItemStyle(currentItem, activeIdx, nodeStyles);
  $: authorStyle = nodeStyles?.['testi_spotlight_author'] || nodeStyles?.[`testi_avatar_${activeIdx}`] || {};

  function selectQuote(e: Event) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, currentItem?.id || `testi_item_${activeIdx}`);
    }
  }

  function selectAuthor(e: Event) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, `testi_avatar_${activeIdx}`);
    }
  }
</script>

<div class="max-w-2xl mx-auto text-center space-y-4">
  <div class="flex justify-center gap-1 text-amber-400">
    {#each Array(currentItem?.rating || 5) as _}
      <Star size={16} class="fill-amber-400 text-amber-400" />
    {/each}
  </div>

  <div
    role="button"
    tabindex="0"
    on:click={selectQuote}
    on:keydown={(e) => { if (e.key === 'Enter') selectQuote(e); }}
    style="margin-top: {itemStyle.marginTop}; margin-bottom: {itemStyle.marginBottom};"
    class={`p-4 rounded-2xl cursor-pointer transition-all ${
      $canvasStore.selectedSectionId === sectionId && ($canvasStore.selectedNodeId === (currentItem?.id || `testi_item_${activeIdx}`) || $canvasStore.selectedNodeId === 'testi_spotlight_quote')
        ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100'
        : 'hover:outline hover:outline-dashed hover:outline-1 hover:outline-primary/50'
    }`}
  >
    <p
      class="text-base sm:text-xl font-heading italic leading-relaxed"
      style="{itemStyle.color ? `color: ${itemStyle.color};` : 'color: var(--color-text-main);'}"
    >
      "{currentItem?.comment}"
    </p>
  </div>

  <div
    role="button"
    tabindex="0"
    on:click={selectAuthor}
    on:keydown={(e) => { if (e.key === 'Enter') selectAuthor(e); }}
    class={`pt-2 cursor-pointer transition-all rounded-xl p-2 flex flex-col items-center gap-2 ${
      $canvasStore.selectedSectionId === sectionId && ($canvasStore.selectedNodeId === `testi_avatar_${activeIdx}` || $canvasStore.selectedNodeId === 'testi_spotlight_author')
        ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100'
        : 'hover:outline hover:outline-dashed hover:outline-1 hover:outline-primary/50'
    }`}
  >
    {#if currentItem?.avatar}
      <div class="w-12 h-12 rounded-full overflow-hidden bg-nested border border-light shadow-sm">
        <img src={currentItem.avatar} alt={currentItem.customerName} class="w-full h-full object-cover" />
      </div>
    {/if}

    <div>
      <h4
        class="font-heading font-black text-sm"
        style="{authorStyle.color ? `color: ${authorStyle.color};` : 'color: var(--color-text-main);'}"
      >
        {currentItem?.customerName}
      </h4>
      <div class="flex items-center justify-center gap-1.5 text-xs text-secondary mt-0.5">
        {#if currentItem?.verified !== false}
          <span class="text-emerald-600 font-semibold flex items-center gap-0.5">
            <CheckCircle2 size={11} />
            <span>{currentItem?.verifiedText || 'Pelanggan Terverifikasi'}</span>
          </span>
        {/if}
        {#if currentItem?.role}
          <span>• {currentItem.role}</span>
        {/if}
      </div>
    </div>
  </div>

  <!-- Pagination Dots -->
  {#if testimonials.length > 1}
    <div class="flex justify-center gap-2 pt-3">
      {#each testimonials as _, idx}
        <button
          type="button"
          aria-label={`Lihat ulasan ${idx + 1}`}
          on:click={() => (activeIdx = idx)}
          class={`h-2 rounded-full transition-all ${
            activeIdx === idx ? 'w-6 bg-primary shadow-xs' : 'w-2 bg-base-300'
          }`}
        ></button>
      {/each}
    </div>
  {/if}
</div>
