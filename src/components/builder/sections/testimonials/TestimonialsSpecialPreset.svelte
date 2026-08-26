<script lang="ts">
  import { Star, Users, Award, Quote } from 'lucide-svelte';
  import type { TestimonialItem } from '@/types';

  export let testimonials: TestimonialItem[];
  export let activePreset: string;
</script>

{#if activePreset === 'single_spotlight'}
  {#if testimonials[0]}
    <div
      class="max-w-3xl mx-auto p-8 md:p-12 rounded-3xl border border-base-200 dark:border-slate-800 shadow-xl text-center space-y-6 relative overflow-hidden"
      style="background-color: var(--theme-surface);"
    >
      <Quote size={48} class="text-primary/10 mx-auto" />
      <div class="flex items-center justify-center gap-1 text-amber-500">
        {#each Array(testimonials[0].rating || 5) as _}
          <Star size={20} fill="currentColor" />
        {/each}
      </div>
      <p class="text-base md:text-xl font-medium italic text-base-content leading-relaxed">
        "{testimonials[0].comment}"
      </p>
      <div>
        <h4 class="font-black text-sm text-base-content">{testimonials[0].customerName}</h4>
        <span class="text-xs text-primary font-semibold">Pelanggan Setia</span>
      </div>
    </div>
  {/if}

{:else if activePreset === 'chat_bubble_flow'}
  <div class="max-w-2xl mx-auto space-y-4">
    {#each testimonials as item, idx}
      <div class="flex {idx % 2 === 0 ? 'justify-start' : 'justify-end'}">
        <div
          class="max-w-[85%] p-4 rounded-2xl border border-base-200 dark:border-slate-800 shadow-sm space-y-2 {idx % 2 === 0 ? 'rounded-tl-sm' : 'rounded-tr-sm'}"
          style="background-color: var(--theme-surface);"
        >
          <div class="flex items-center justify-between gap-4">
            <span class="font-bold text-xs text-base-content">{item.customerName}</span>
            <div class="flex items-center gap-0.5 text-amber-500">
              {#each Array(item.rating || 5) as _}
                <Star size={11} fill="currentColor" />
              {/each}
            </div>
          </div>
          <p class="text-xs text-base-content/70 leading-relaxed">"{item.comment}"</p>
        </div>
      </div>
    {/each}
  </div>

{:else if activePreset === 'statistics_with_review'}
  <div class="space-y-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="p-6 rounded-2xl bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 text-center space-y-1">
        <Users size={24} class="text-primary mx-auto mb-2" />
        <h3 class="text-2xl font-black text-base-content">10.000+</h3>
        <p class="text-xs text-base-content/60">Pelanggan Puas</p>
      </div>
      <div class="p-6 rounded-2xl bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 text-center space-y-1">
        <Star size={24} class="text-amber-500 mx-auto mb-2" />
        <h3 class="text-2xl font-black text-base-content">4.9 / 5.0</h3>
        <p class="text-xs text-base-content/60">Rating Rata-rata</p>
      </div>
      <div class="p-6 rounded-2xl bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 text-center space-y-1">
        <Award size={24} class="text-primary mx-auto mb-2" />
        <h3 class="text-2xl font-black text-base-content">99%</h3>
        <p class="text-xs text-base-content/60">Rekomendasi Produk</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each testimonials.slice(0, 2) as item}
        <div class="p-6 rounded-2xl border border-base-200 dark:border-slate-800 space-y-3" style="background-color: var(--theme-surface);">
          <p class="text-xs text-base-content/80 italic">"{item.comment}"</p>
          <h4 class="font-bold text-xs text-base-content">{item.customerName}</h4>
        </div>
      {/each}
    </div>
  </div>

{:else}
  <!-- testimonial_marquee_slider -->
  <div class="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-thin">
    {#each testimonials as item}
      <div
        class="snap-start flex-shrink-0 w-72 p-5 rounded-2xl border border-base-200 dark:border-slate-800 space-y-3"
        style="background-color: var(--theme-surface);"
      >
        <div class="flex items-center gap-0.5 text-amber-500">
          {#each Array(item.rating || 5) as _}
            <Star size={12} fill="currentColor" />
          {/each}
        </div>
        <p class="text-xs text-base-content/80 line-clamp-3 italic">"{item.comment}"</p>
        <h4 class="font-bold text-xs text-base-content pt-2 border-t border-base-200 dark:border-slate-800">{item.customerName}</h4>
      </div>
    {/each}
  </div>
{/if}
