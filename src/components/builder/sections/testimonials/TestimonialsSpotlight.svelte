<script lang="ts">
  import type { TestimonialItem } from '@/types';
  import { Star } from 'lucide-svelte';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let testimonials: TestimonialItem[] = [];

  let activeIdx = 0;
  $: currentItem = testimonials[activeIdx] || testimonials[0];

  function selectQuote(e: Event) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, 'testi_spotlight_quote');
    }
  }

  function selectAuthor(e: Event) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, 'testi_spotlight_author');
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
    class={`p-4 rounded-2xl cursor-pointer transition-all ${
      $canvasStore.selectedNodeId === 'testi_spotlight_quote'
        ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
        : 'hover:outline hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
    }`}
  >
    <p class="text-base sm:text-xl font-heading italic text-main leading-relaxed">
      "{currentItem?.comment}"
    </p>
  </div>

  <div
    role="button"
    tabindex="0"
    on:click={selectAuthor}
    on:keydown={(e) => { if (e.key === 'Enter') selectAuthor(e); }}
    class={`pt-2 cursor-pointer transition-all rounded-xl p-2 ${
      $canvasStore.selectedNodeId === 'testi_spotlight_author'
        ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
        : 'hover:outline hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
    }`}
  >
    <h4 class="font-heading font-black text-sm text-main">
      {currentItem?.customerName}
    </h4>
    <p class="text-xs text-secondary mt-0.5">
      {currentItem?.role || 'Pelanggan Terverifikasi'}
    </p>
  </div>

  <!-- Pagination Dots -->
  <div class="flex justify-center gap-2 pt-3">
    {#each testimonials as _, idx}
      <button
        type="button"
        aria-label={`Lihat ulasan ${idx + 1}`}
        on:click={() => (activeIdx = idx)}
        class={`h-2 rounded-full transition-all ${
          activeIdx === idx ? 'w-6 bg-primary shadow-xs' : 'w-2 bg-slate-300 dark:bg-slate-700'
        }`}
      ></button>
    {/each}
  </div>
</div>
