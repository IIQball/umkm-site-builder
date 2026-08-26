<script lang="ts">
  import { ChevronDown, MessageCircle } from 'lucide-svelte';
  import type { FAQItem } from '@/types';

  export let faqs: FAQItem[];
  export let activePreset: string;
  export let openIndex: number | null;
  export let toggleFaq: (i: number) => void;
  export let waLink: string;
</script>

{#if activePreset === 'split_faq_sidebar'}
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
    <div class="lg:col-span-4 p-6 rounded-2xl bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 space-y-4">
      <h3 class="font-bold text-lg text-base-content">Punya Pertanyaan Lain?</h3>
      <p class="text-xs text-base-content/70 leading-relaxed">
        Tim support kami siap membantu menjawab pertanyaan Anda melalui WhatsApp setiap hari pukul 08:00 - 21:00 WIB.
      </p>
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all cursor-pointer shadow-sm w-full justify-center"
      >
        <MessageCircle size={15} />
        <span>Tanya Admin</span>
      </a>
    </div>

    <div class="lg:col-span-8 space-y-3">
      {#each faqs as item, index}
        <div
          class="rounded-xl border border-base-200 dark:border-slate-800 overflow-hidden transition-all duration-200"
          style="background-color: var(--theme-surface);"
        >
          <button
            type="button"
            on:click={() => toggleFaq(index)}
            class="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-xs md:text-sm text-base-content cursor-pointer"
          >
            <span>{item.question}</span>
            <ChevronDown size={16} class="transition-transform duration-200 {openIndex === index ? 'rotate-180 text-primary' : 'text-base-content/40'}" />
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

{:else if activePreset === 'two_column_accordion'}
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each faqs as item, index}
      <div
        class="rounded-xl border border-base-200 dark:border-slate-800 overflow-hidden transition-all duration-200 h-fit"
        style="background-color: var(--theme-surface);"
      >
        <button
          type="button"
          on:click={() => toggleFaq(index)}
          class="w-full px-4 py-3.5 flex items-center justify-between text-left font-bold text-xs text-base-content cursor-pointer"
        >
          <span>{item.question}</span>
          <ChevronDown size={15} class="transition-transform duration-200 {openIndex === index ? 'rotate-180 text-primary' : 'text-base-content/40'}" />
        </button>
        {#if openIndex === index}
          <div class="px-4 pb-3.5 pt-1 text-xs text-base-content/70 leading-relaxed border-t border-base-200/50 dark:border-slate-800/50">
            <p>{item.answer}</p>
          </div>
        {/if}
      </div>
    {/each}
  </div>

{:else}
  <!-- accordion_single_col & default -->
  <div class="max-w-3xl mx-auto space-y-3">
    {#each faqs as item, index}
      <div
        class="rounded-2xl border border-base-200 dark:border-slate-800 overflow-hidden transition-all duration-200 shadow-sm"
        style="background-color: var(--theme-surface);"
      >
        <button
          type="button"
          on:click={() => toggleFaq(index)}
          class="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-xs md:text-sm text-base-content cursor-pointer"
        >
          <span>{item.question}</span>
          <ChevronDown size={16} class="transition-transform duration-200 {openIndex === index ? 'rotate-180 text-primary' : 'text-base-content/40'}" />
        </button>
        {#if openIndex === index}
          <div class="px-5 pb-4 pt-1 text-xs text-base-content/70 leading-relaxed border-t border-base-200/50 dark:border-slate-800/50">
            <p>{item.answer}</p>
          </div>
        {/if}
      </div>
    {/each}
  </div>
{/if}
