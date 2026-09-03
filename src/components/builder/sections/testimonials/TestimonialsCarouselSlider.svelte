<script lang="ts">
  import { Star, ChevronLeft, ChevronRight } from 'lucide-svelte';
  import type { TestimonialItem } from '@/types';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let testimonials: TestimonialItem[] = [];

  let currentIdx = 0;
  $: currentItem = testimonials[currentIdx] || testimonials[0];

  function nextSlide() {
    currentIdx = (currentIdx + 1) % testimonials.length;
  }

  function prevSlide() {
    currentIdx = (currentIdx - 1 + testimonials.length) % testimonials.length;
  }

  function selectTrack(e: Event) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, 'testi_slider_track');
    }
  }
</script>

<div
  role="button"
  tabindex="0"
  on:click={selectTrack}
  on:keydown={(e) => { if (e.key === 'Enter') selectTrack(e); }}
  class={`max-w-xl mx-auto space-y-4 text-center cursor-pointer transition-all rounded-3xl p-4 ${
    $canvasStore.selectedNodeId === 'testi_slider_track'
      ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-xl'
      : ''
  }`}
>
  <div class="flex justify-center gap-1 text-amber-400">
    {#each Array(currentItem?.rating || 5) as _}
      <Star size={14} class="fill-amber-400 text-amber-400" />
    {/each}
  </div>

  <p class="text-sm sm:text-base text-main leading-relaxed italic">
    "{currentItem?.comment}"
  </p>

  <div>
    <h4 class="font-heading font-bold text-xs text-main">
      {currentItem?.customerName}
    </h4>
    {#if currentItem?.role}
      <span class="text-[10px] text-secondary">
        {currentItem.role}
      </span>
    {/if}
  </div>

  <!-- Slider Controls -->
  <div class="flex items-center justify-center gap-3 pt-2">
    <button
      type="button"
      aria-label="Ulasan sebelumnya"
      on:click|stopPropagation={prevSlide}
      class="w-8 h-8 rounded-full border border-light bg-card flex items-center justify-center text-xs font-bold text-main hover:bg-nested active:scale-95 transition-all shadow-xs"
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
      class="w-8 h-8 rounded-full border border-light bg-card flex items-center justify-center text-xs font-bold text-main hover:bg-nested active:scale-95 transition-all shadow-xs"
    >
      <ChevronRight size={14} />
    </button>
  </div>
</div>
