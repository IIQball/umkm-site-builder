<script lang="ts">
  import { Star } from 'lucide-svelte';
  import type { TestimonialItem } from '@/types';

  export let testimonials: TestimonialItem[] = [];
</script>

<div class="w-full overflow-x-hidden relative py-4">
  <div class="flex gap-6 w-max animate-pulse">
    {#each [...testimonials, ...testimonials, ...testimonials] as item}
      <div class="w-72 p-5 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-3 text-left">
        <div class="flex items-center gap-1 text-amber-400">
          {#each Array(item.rating || 5) as _}
            <Star size={14} fill="currentColor" />
          {/each}
        </div>
        <p class="text-xs text-[var(--theme-text-muted,#64748b)] leading-relaxed italic line-clamp-3">
          "{item.comment}"
        </p>
        <div class="flex items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          {#if item.avatar}
            <img src={item.avatar} alt={item.customerName} class="w-7 h-7 rounded-full object-cover" />
          {/if}
          <span class="font-bold text-xs text-[var(--theme-text-primary,#0f172a)]">{item.customerName}</span>
        </div>
      </div>
    {/each}
  </div>
</div>
