<script lang="ts">
  import { Heart, Share2 } from 'lucide-svelte';
  import type { TestimonialItem } from '@/types';

  export let testimonials: TestimonialItem[] = [];
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
  {#each testimonials as item}
    <div class="p-6 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4">
      <div class="flex items-center gap-3">
        {#if item.avatar}
          <img src={item.avatar} alt={item.customerName} class="w-10 h-10 rounded-full object-cover border border-slate-200" />
        {/if}
        <div>
          <h4 class="font-bold text-sm text-[var(--theme-text-primary,#0f172a)]">{item.customerName || 'Pelanggan'}</h4>
          <span class="text-[11px] text-[var(--theme-text-muted,#64748b)]">@{(item.customerName || 'pelanggan').toLowerCase().replace(/\s+/g, '')}</span>
        </div>
      </div>
      <p class="text-xs text-[var(--theme-text-muted,#64748b)] leading-relaxed">
        {item.comment}
      </p>
      <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-slate-400 text-xs">
        <div class="flex items-center gap-1.5 hover:text-rose-500 cursor-pointer">
          <Heart size={14} /> <span>124</span>
        </div>
        <div class="flex items-center gap-1.5 hover:text-blue-500 cursor-pointer">
          <Share2 size={14} /> <span>Bagikan</span>
        </div>
      </div>
    </div>
  {/each}
</div>
