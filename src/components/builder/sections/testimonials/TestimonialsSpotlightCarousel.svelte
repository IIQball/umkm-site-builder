<script lang="ts">
  import { Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-svelte';
  import type { TestimonialItem } from '@/types';

  export let activePreset: string;
  export let testimonials: TestimonialItem[] = [];
  export let spotlightItem: TestimonialItem;
  export let carouselItem: TestimonialItem;
  export let activeSpotlightIdx: number = 0;
  export let carouselIdx: number = 0;
  export let onSelectSpotlight: (idx: number) => void;
  export let onPrevCarousel: () => void;
  export let onNextCarousel: () => void;
</script>

{#if activePreset === 'spotlight_hero'}
  <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 bg-[var(--theme-surface,#ffffff)] border border-base-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm text-left">
    <div class="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden shrink-0 ring-4 ring-[var(--theme-primary,#2563eb)]/20 shadow-md">
      <img
        src={spotlightItem?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
        alt={spotlightItem?.customerName}
        class="w-full h-full object-cover"
      />
    </div>

    <div class="flex-1 flex flex-col gap-3">
      <div class="flex items-center gap-1 text-amber-400">
        {#each Array(spotlightItem?.rating || 5) as _}
          <Star size={18} class="fill-current" />
        {/each}
      </div>
      <p class="text-base sm:text-lg font-medium text-[var(--theme-text-primary,#0f172a)] italic leading-relaxed">
        "{spotlightItem?.comment}"
      </p>
      <div class="flex items-center gap-2 pt-2 border-t border-base-200 dark:border-slate-800">
        <span class="font-bold text-sm text-[var(--theme-text-primary,#0f172a)]">{spotlightItem?.customerName}</span>
        <span class="inline-flex items-center gap-1 text-3xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
          <CheckCircle2 size={10} /> Verified Buyer
        </span>
      </div>

      {#if testimonials.length > 1}
        <div class="flex gap-2 pt-2">
          {#each testimonials as _, i}
            <button
              type="button"
              on:click={() => onSelectSpotlight(i)}
              class="w-2.5 h-2.5 rounded-full transition-all cursor-pointer {activeSpotlightIdx === i ? 'bg-[var(--theme-primary,#2563eb)] w-6' : 'bg-base-300 dark:bg-slate-700'}"
            />
          {/each}
        </div>
      {/if}
    </div>
  </div>
{:else if activePreset === 'carousel_slider'}
  <div class="max-w-2xl mx-auto relative bg-[var(--theme-surface,#ffffff)] border border-base-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm text-center">
    <div class="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 ring-2 ring-[var(--theme-primary,#2563eb)]/30">
      <img
        src={carouselItem?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
        alt={carouselItem?.customerName}
        class="w-full h-full object-cover"
      />
    </div>
    <div class="flex justify-center items-center gap-1 text-amber-400 mb-3">
      {#each Array(carouselItem?.rating || 5) as _}
        <Star size={16} class="fill-current" />
      {/each}
    </div>
    <p class="text-base font-medium text-[var(--theme-text-primary,#0f172a)] italic mb-4">
      "{carouselItem?.comment}"
    </p>
    <p class="font-bold text-xs text-[var(--theme-text-primary,#0f172a)]">{carouselItem?.customerName}</p>

    <div class="flex justify-between items-center mt-6 pt-4 border-t border-base-200 dark:border-slate-800">
      <button
        type="button"
        on:click={onPrevCarousel}
        class="p-2 rounded-full bg-base-100 dark:bg-slate-800 hover:bg-base-200 text-muted hover:text-main cursor-pointer"
      >
        <ChevronLeft size={16} />
      </button>
      <span class="text-2xs font-mono text-muted">{carouselIdx + 1} / {testimonials.length}</span>
      <button
        type="button"
        on:click={onNextCarousel}
        class="p-2 rounded-full bg-base-100 dark:bg-slate-800 hover:bg-base-200 text-muted hover:text-main cursor-pointer"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  </div>
{/if}
