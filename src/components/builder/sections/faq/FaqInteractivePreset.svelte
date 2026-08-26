<script lang="ts">
  import { Search, MessageSquare } from 'lucide-svelte';
  import type { FAQItem } from '@/types';

  export let faqs: FAQItem[];
  export let activePreset: string;
  export let openIndex: number | null;
  export let toggleFaq: (i: number) => void;

  let searchQuery = '';
  $: filteredFaqs = searchQuery
    ? faqs.filter(
        (f) =>
          f.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.answer?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : faqs;
</script>

{#if activePreset === 'searchable_faq_box'}
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="relative">
      <Search size={18} class="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Ketik kata kunci pertanyaan..."
        class="w-full pl-11 pr-4 py-3 rounded-2xl bg-base-100 dark:bg-slate-900 border border-base-300 dark:border-slate-800 text-xs text-base-content focus:outline-none focus:border-primary shadow-sm"
      />
    </div>

    <div class="space-y-3">
      {#each filteredFaqs as item, index}
        <div
          class="rounded-xl border border-base-200 dark:border-slate-800 overflow-hidden shadow-sm"
          style="background-color: var(--theme-surface);"
        >
          <button
            type="button"
            on:click={() => toggleFaq(index)}
            class="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-xs md:text-sm text-base-content cursor-pointer"
          >
            <span>{item.question}</span>
            <span class="text-xs text-primary font-semibold">{openIndex === index ? 'Tutup' : 'Buka'}</span>
          </button>
          {#if openIndex === index}
            <div class="px-5 pb-4 pt-1 text-xs text-base-content/70 leading-relaxed border-t border-base-200/50 dark:border-slate-800/50">
              <p>{item.answer}</p>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>

{:else}
  <!-- bubble_chat_faq -->
  <div class="max-w-2xl mx-auto space-y-4">
    {#each faqs as item}
      <div class="space-y-2">
        <div class="flex justify-start">
          <div class="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-3 bg-base-200 dark:bg-slate-800 text-base-content text-xs font-semibold shadow-sm flex items-start gap-2">
            <MessageSquare size={14} class="text-primary flex-shrink-0 mt-0.5" />
            <span>{item.question}</span>
          </div>
        </div>
        <div class="flex justify-end">
          <div class="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-3 bg-primary text-white text-xs leading-relaxed shadow-sm">
            <p>{item.answer}</p>
          </div>
        </div>
      </div>
    {/each}
  </div>
{/if}
