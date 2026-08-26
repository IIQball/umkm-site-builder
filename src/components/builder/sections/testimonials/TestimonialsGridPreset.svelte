<script lang="ts">
  import { Star, Quote } from 'lucide-svelte';
  import type { TestimonialItem } from '@/types';

  export let testimonials: TestimonialItem[];
  export let activePreset: string;
</script>

{#if activePreset === 'large_quote_cards'}
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    {#each testimonials as item}
      <div
        class="p-8 rounded-3xl border border-base-200 dark:border-slate-800 space-y-4 relative overflow-hidden shadow-lg"
        style="background-color: var(--theme-surface);"
      >
        <Quote size={40} class="text-primary/10 absolute top-4 right-4" />
        <div class="flex items-center gap-1 text-amber-500">
          {#each Array(item.rating || 5) as _}
            <Star size={16} fill="currentColor" />
          {/each}
        </div>
        <p class="text-sm md:text-base italic text-base-content/80 leading-relaxed font-medium">
          "{item.comment}"
        </p>
        <div class="flex items-center gap-3 pt-2 border-t border-base-200/60 dark:border-slate-800/60">
          <div class="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
            {item.customerName?.charAt(0) || 'U'}
          </div>
          <div>
            <h4 class="font-bold text-xs text-base-content">{item.customerName}</h4>
            <span class="text-[10px] text-base-content/50">Pelanggan Terverifikasi</span>
          </div>
        </div>
      </div>
    {/each}
  </div>

{:else if activePreset === 'compact_badge_grid'}
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    {#each testimonials as item}
      <div
        class="p-4 rounded-2xl border border-base-200 dark:border-slate-800 space-y-2 text-center"
        style="background-color: var(--theme-surface);"
      >
        <div class="flex items-center justify-center gap-0.5 text-amber-500">
          {#each Array(item.rating || 5) as _}
            <Star size={12} fill="currentColor" />
          {/each}
        </div>
        <p class="text-[11px] text-base-content/80 line-clamp-2">"{item.comment}"</p>
        <h5 class="font-bold text-[11px] text-base-content">{item.customerName}</h5>
      </div>
    {/each}
  </div>

{:else}
  <!-- masonry_grid, two_column_cards & default -->
  <div class="grid grid-cols-1 md:grid-cols-2 {activePreset === 'masonry_grid' ? 'lg:grid-cols-3' : ''} gap-6">
    {#each testimonials as item}
      <div
        class="p-6 rounded-2xl border border-base-200 dark:border-slate-800 space-y-4 transition-all duration-300 hover:shadow-xl group"
        style="background-color: var(--theme-surface);"
      >
        <div class="flex items-center gap-1 text-amber-500">
          {#each Array(item.rating || 5) as _}
            <Star size={14} fill="currentColor" />
          {/each}
        </div>
        <p class="text-xs text-base-content/80 leading-relaxed italic">
          "{item.comment}"
        </p>
        <div class="flex items-center gap-3 pt-2 border-t border-base-200/50 dark:border-slate-800/50">
          {#if item.avatar}
            <img src={item.avatar} alt={item.customerName} class="w-8 h-8 rounded-full object-cover" />
          {:else}
            <div class="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
              {item.customerName?.charAt(0) || 'P'}
            </div>
          {/if}
          <div>
            <h4 class="font-bold text-xs text-base-content">{item.customerName}</h4>
            <span class="text-[10px] text-base-content/50">Pembeli Terverifikasi</span>
          </div>
        </div>
      </div>
    {/each}
  </div>
{/if}
