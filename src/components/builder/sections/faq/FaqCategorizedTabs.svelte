<script lang="ts">
  import { ChevronDown } from 'lucide-svelte';
  import type { FAQItem } from '@/types';

  export let faqs: FAQItem[] = [];
  export let title: string = '';

  let activeCategory = 'Semua';
  let expandedIndex: number | null = 0;

  const toggle = (idx: number) => {
    expandedIndex = expandedIndex === idx ? null : idx;
  };
</script>

<div class="max-w-3xl mx-auto flex flex-col gap-6 text-center">
  <div>
    <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight mb-2">
      {title || 'Kategori Tanya Jawab'}
    </h2>
    <p class="text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)]">Pilih topik kategori pertanyaan di bawah</p>
  </div>

  <div class="flex flex-wrap items-center justify-center gap-2">
    {#each ['Semua', 'Pemesanan', 'Pembayaran', 'Pengiriman'] as category}
      <button
        type="button"
        on:click={() => (activeCategory = category)}
        class={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
          activeCategory === category
            ? 'bg-[var(--theme-primary,#2563eb)] text-white shadow-sm'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
        }`}
      >
        {category}
      </button>
    {/each}
  </div>

  <div class="flex flex-col gap-3 text-left">
    {#each faqs as item, index}
      {@const isExpanded = expandedIndex === index}
      <div class="rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <button
          type="button"
          on:click={() => toggle(index)}
          class="w-full p-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
        >
          <span class="font-bold text-xs sm:text-sm text-[var(--theme-text-primary,#0f172a)]">{item.question}</span>
          <ChevronDown size={16} class={`text-[var(--theme-primary,#2563eb)] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
        {#if isExpanded}
          <div class="px-4 pb-4 pt-1 text-xs text-[var(--theme-text-muted,#64748b)] leading-relaxed border-t border-base-200 dark:border-slate-800">
            {item.answer}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
