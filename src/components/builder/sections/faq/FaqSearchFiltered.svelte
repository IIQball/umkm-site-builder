<script lang="ts">
  import { Search, ChevronDown } from 'lucide-svelte';
  import type { FAQItem } from '@/types';

  export let faqs: FAQItem[] = [];
  export let title: string = '';

  let searchQuery = '';
  let expandedIndex: number | null = 0;

  $: filteredFaqs = faqs.filter((item) => {
    return !searchQuery || item.question.toLowerCase().includes(searchQuery.toLowerCase()) || item.answer.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const toggle = (idx: number) => {
    expandedIndex = expandedIndex === idx ? null : idx;
  };
</script>

<div class="max-w-3xl mx-auto flex flex-col gap-6 text-center">
  <div>
    <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight mb-2">
      {title || 'Pusat Bantuan Cepat'}
    </h2>
    <p class="text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)]">Ketik kata kunci untuk mencari jawaban langsung</p>
  </div>

  <!-- Search Input -->
  <div class="relative w-full max-w-lg mx-auto">
    <Search size={16} class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Cari pertanyaan (misal: pengiriman, pembayaran)..."
      class="w-full pl-11 pr-4 py-3 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-slate-200 dark:border-slate-700 text-xs text-[var(--theme-text-primary,#0f172a)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary,#2563eb)]"
    />
  </div>

  <div class="flex flex-col gap-3 text-left">
    {#if filteredFaqs.length === 0}
      <div class="p-8 text-center text-xs text-slate-400 bg-[var(--theme-surface,#f8fafc)] rounded-2xl border border-slate-200 dark:border-slate-800">
        Tidak ditemukan pertanyaan yang cocok dengan "{searchQuery}".
      </div>
    {:else}
      {#each filteredFaqs as item, index}
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
    {/if}
  </div>
</div>
