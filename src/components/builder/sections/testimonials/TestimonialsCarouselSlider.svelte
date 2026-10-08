<script lang="ts">
  import { Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-svelte';
  import type { TestimonialItem } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import { resolveTestimonialItemStyle } from './testimonialStyles.helpers';

  export let sectionId: string = '';
  export let testimonials: TestimonialItem[] = [];
  export let nodeStyles: Record<string, Record<string, string>> = {};

  let currentIdx = 0;
  $: currentItem = testimonials[currentIdx] || testimonials[0];
  $: itemStyle = resolveTestimonialItemStyle(currentItem, currentIdx, nodeStyles);

  function nextSlide() {
    if (testimonials.length === 0) return;
    currentIdx = (currentIdx + 1) % testimonials.length;
  }

  function prevSlide() {
    if (testimonials.length === 0) return;
    currentIdx = (currentIdx - 1 + testimonials.length) % testimonials.length;
  }

  function selectTrack(e: Event) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, currentItem?.id || `testi_item_${currentIdx}`);
    }
  }

  function selectAvatar(e: Event) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, `testi_avatar_${currentIdx}`);
    }
  }
</script>

<div
  role="button"
  tabindex="0"
  on:click={selectTrack}
  on:keydown={(e) => { if (e.key === 'Enter') selectTrack(e); }}
  class={`max-w-xl mx-auto space-y-4 text-center cursor-pointer transition-all rounded-3xl p-4 ${
    $canvasStore.selectedSectionId === sectionId && ($canvasStore.selectedNodeId === (currentItem?.id || `testi_item_${currentIdx}`) || $canvasStore.selectedNodeId === 'testi_slider_track')
      ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 shadow-xl'
      : ''
  }`}
>
  <div class="flex justify-center gap-1 text-amber-400">
    {#each Array(currentItem?.rating || 5) as _}
      <Star size={14} class="fill-amber-400 text-amber-400" />
    {/each}
  </div>

  <p
    class="text-sm sm:text-base leading-relaxed italic"
    style="{itemStyle.color ? `color: ${itemStyle.color};` : 'color: var(--color-text-main);'}"
  >
    "{currentItem?.comment}"
  </p>

  <div class="flex flex-col items-center gap-2">
    {#if currentItem?.avatar}
      <div
        role="button"
        tabindex="0"
        on:click={selectAvatar}
        on:keydown={(e) => { if (e.key === 'Enter') selectAvatar(e); }}
        class="w-10 h-10 rounded-full overflow-hidden bg-nested border border-light shadow-xs cursor-pointer"
      >
        <img src={currentItem.avatar} alt={currentItem.customerName} class="w-full h-full object-cover" />
      </div>
    {/if}

    <div>
      <h4 class="font-heading font-bold text-xs text-main">
        {currentItem?.customerName}
      </h4>
      <div class="flex items-center justify-center gap-1.5 text-[10px] text-secondary mt-0.5">
        {#if currentItem?.verified !== false}
          <span class="text-emerald-600 font-semibold flex items-center gap-0.5">
            <CheckCircle2 size={10} />
            <span>{currentItem?.verifiedText || 'Pembeli Terverifikasi'}</span>
          </span>
        {/if}
        {#if currentItem?.role}
          <span>• {currentItem.role}</span>
        {/if}
      </div>
    </div>
  </div>

  <!-- Slider Controls -->
  {#if testimonials.length > 1}
    <div class="flex items-center justify-center gap-3 pt-2">
      <button
        type="button"
        aria-label="Ulasan sebelumnya"
        on:click|stopPropagation={prevSlide}
        class="w-8 h-8 rounded-full border border-light bg-card flex items-center justify-center text-xs font-bold text-main hover:bg-nested active:scale-95 transition-all shadow-xs cursor-pointer"
      >
        <ChevronLeft size={14} />
      </button>
      <span class="text-xs text-secondary font-mono">
        {currentIdx + 1} / {testimonials.length}
      </span>
      <button
        type="button"
        aria-label="Ulasan selanjutnya"
        on:click|stopPropagation={nextSlide}
        class="w-8 h-8 rounded-full border border-light bg-card flex items-center justify-center text-xs font-bold text-main hover:bg-nested active:scale-95 transition-all shadow-xs cursor-pointer"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  {/if}
</div>
