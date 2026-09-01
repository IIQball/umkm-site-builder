<script lang="ts">
  import { Play } from 'lucide-svelte';
  import type { TestimonialItem } from '@/types';

  export let testimonials: TestimonialItem[] = [];
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
  {#each testimonials as item}
    <div class="rounded-2xl overflow-hidden bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-md flex flex-col">
      <!-- Video Preview Card Mockup -->
      <div class="relative w-full aspect-[9/12] bg-slate-900 flex items-center justify-center overflow-hidden group">
        {#if item.avatar}
          <img src={item.avatar} alt={item.customerName} class="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
        {/if}
        <button
          type="button"
          class="w-14 h-14 rounded-full bg-white/90 text-[var(--theme-primary,#2563eb)] flex items-center justify-center shadow-xl group-hover:scale-110 active:scale-95 transition-all cursor-pointer z-10"
        >
          <Play size={24} class="ml-1 fill-current" />
        </button>
        <div class="absolute bottom-3 left-3 right-3 text-white z-10">
          <p class="text-xs font-bold truncate">{item.customerName}</p>
          <p class="text-[10px] text-white/80 line-clamp-1">"{item.comment}"</p>
        </div>
      </div>
      <div class="p-4 flex items-center justify-between text-xs">
        <span class="font-bold text-[var(--theme-text-primary,#0f172a)]">{item.customerName}</span>
        <span class="text-[11px] text-emerald-600 font-bold">⭐ Verified Review</span>
      </div>
    </div>
  {/each}
</div>
