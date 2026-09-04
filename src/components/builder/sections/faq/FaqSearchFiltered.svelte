<script lang="ts">
  import { Search, ChevronDown } from 'lucide-svelte';
  import type { FAQItem } from '@/types';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let faqs: FAQItem[] = [];

  let searchQuery = '';
  let openIndex: number | null = 0;

  $: filteredFaqs = faqs.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (item.question && item.question.toLowerCase().includes(q)) ||
      (item.answer && item.answer.toLowerCase().includes(q))
    );
  });

  function toggle(idx: number) {
    openIndex = openIndex === idx ? null : idx;
  }

  function selectSearchBar(e: Event) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, 'faq_search_bar');
    }
  }

  function selectItem(e: Event, idx: number, item: FAQItem) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, item.id || `faq_item_${idx}`);
    }
  }
</script>

<div class="max-w-2xl mx-auto flex flex-col gap-6 text-center">
  <!-- Search Input Bar -->
  <div
    role="button"
    tabindex="0"
    on:click={selectSearchBar}
    on:keydown={(e) => { if (e.key === 'Enter') selectSearchBar(e); }}
    class={`relative w-full mx-auto transition-all rounded-2xl ${
      $canvasStore.selectedNodeId === 'faq_search_bar'
        ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900'
        : ''
    }`}
  >
    <Search size={16} class="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary,var(--theme-text-muted,#64748b))]" />
    <input
      type="text"
      bind:value={searchQuery}
      on:click|stopPropagation
      placeholder="Ketik kata kunci (misal: pengiriman, expired, COD)..."
      class="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[var(--color-nested-base,#f8fafc)] border border-[var(--color-border,rgba(15,23,42,0.08))] text-xs text-[var(--color-text-main,var(--theme-text-primary,#0f172a))] shadow-xs focus:outline-none focus:border-[var(--theme-primary,#2563eb)] focus:ring-1 focus:ring-[var(--theme-primary,#2563eb)] transition-all font-[var(--font-family,inherit)]"
    />
  </div>

  <!-- Filtered FAQs List -->
  <div class="space-y-2 text-left">
    {#if filteredFaqs.length === 0}
      <div class="p-8 text-center text-xs text-[var(--color-text-secondary,var(--theme-text-muted,#64748b))] bg-[var(--color-card-base,var(--theme-surface,#ffffff))] rounded-2xl border border-[var(--color-border,rgba(15,23,42,0.08))] font-[var(--font-family,inherit)]">
        Tidak ditemukan pertanyaan yang cocok dengan "{searchQuery}".
      </div>
    {:else}
      {#each filteredFaqs as item, index (item.id || index)}
        {@const isOpen = openIndex === index}
        {@const isItemActive = $canvasStore.selectedNodeId === (item.id || `faq_item_${index}`)}

        <div
          role="button"
          tabindex="0"
          on:click={(e) => selectItem(e, index, item)}
          on:keydown={(e) => { if (e.key === 'Enter') selectItem(e, index, item); }}
          class={`rounded-2xl border border-[var(--color-border,rgba(15,23,42,0.08))] bg-[var(--color-card-base,var(--theme-surface,#ffffff))] overflow-hidden shadow-xs transition-all duration-200 cursor-pointer ${
            isItemActive
              ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900 shadow-md'
              : 'hover:border-[var(--theme-primary,#2563eb)]/30'
          }`}
        >
          <button
            type="button"
            on:click|stopPropagation={() => toggle(index)}
            class="w-full p-4 flex items-center justify-between gap-4 text-left font-[var(--font-heading,inherit)] font-bold text-xs sm:text-sm text-[var(--color-text-main,var(--theme-text-primary,#0f172a))] hover:text-[var(--theme-primary,#2563eb)] transition-colors cursor-pointer"
          >
            <span class="flex-1 min-w-0">{item.question}</span>
            <span
              class={`p-1 rounded-lg text-[var(--color-text-secondary,var(--theme-text-muted,#64748b))] transition-transform duration-200 shrink-0 ${
                isOpen ? 'rotate-180 text-[var(--theme-primary,#2563eb)]' : ''
              }`}
            >
              <ChevronDown size={15} />
            </span>
          </button>

          {#if isOpen}
            <div class="px-4 pb-4 pt-1 text-xs text-[var(--color-text-secondary,var(--theme-text-muted,#64748b))] leading-relaxed border-t border-[var(--color-border,rgba(15,23,42,0.08))] font-[var(--font-family,inherit)]">
              {item.answer}
            </div>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</div>
