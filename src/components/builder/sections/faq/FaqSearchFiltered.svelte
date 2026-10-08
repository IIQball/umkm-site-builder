<script lang="ts">
  import { Search, ChevronDown } from 'lucide-svelte';
  import type { FAQItem } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import { resolveFaqItemStyle } from './faqStyles.helpers';

  export let sectionId: string = '';
  export let faqs: FAQItem[] = [];
  export let nodeStyles: Record<string, Record<string, string>> = {};

  let rawQuery = '';
  let searchQuery = '';
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let openIndex: number | null = 0;

  /** Strip non-alphanumeric (allow Indonesian letters + spaces) */
  function sanitizeQuery(val: string): string {
    return val.replace(/[^a-zA-Z0-9\u00C0-\u024F\s]/g, '').slice(0, 60);
  }

  function handleInput(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    rawQuery = sanitizeQuery(target.value);
    target.value = rawQuery;
    if (debounceTimer !== null) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = rawQuery.toLowerCase().trim();
    }, 300);
  }

  $: filteredFaqs = faqs.filter((item) => {
    if (!searchQuery) return true;
    return (
      (item.question && item.question.toLowerCase().includes(searchQuery)) ||
      (item.answer && item.answer.toLowerCase().includes(searchQuery))
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

  export let elementOrder: string[] = [];
  $: hasSearchBar = !elementOrder.length || elementOrder.includes('faq_search_bar') || elementOrder.includes('search_bar');
  $: searchBarStyle = nodeStyles?.['faq_search_bar'] || {};
</script>

<div class="max-w-2xl mx-auto flex flex-col gap-6 text-center">
  {#if hasSearchBar}
  <!-- Search Input Bar -->
  <div
    role="button"
    tabindex="0"
    on:click={selectSearchBar}
    on:keydown={(e) => { if (e.key === 'Enter') selectSearchBar(e); }}
    class={`relative w-full mx-auto transition-all rounded-2xl ${
      $canvasStore.selectedNodeId === 'faq_search_bar'
        ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100'
        : ''
    }`}
    style="margin-top: {searchBarStyle.marginTop || '0px'}; margin-bottom: {searchBarStyle.marginBottom || '0px'};"
  >
    <Search size={16} class="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--theme-text-muted, var(--color-text-secondary))]" />
    <input
      type="text"
      value={rawQuery}
      on:input={handleInput}
      on:click|stopPropagation
      inputmode="text"
      autocomplete="off"
      placeholder="Ketik kata kunci (misal: pengiriman, COD)..."
      class="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[var(--color-nested-base)] border border-[var(--color-border)] text-xs text-[var(--theme-text-primary, var(--color-text-main))] shadow-xs focus:outline-none focus:border-[var(--theme-primary, var(--color-primary))] focus:ring-1 focus:ring-[var(--theme-primary, var(--color-primary))] transition-all font-sans"
    />
  </div>
  {/if}

  <!-- Filtered FAQs List -->
  <div class="space-y-3 text-left">
    {#if filteredFaqs.length === 0}
      <div class="p-8 text-center text-xs text-[var(--theme-text-muted, var(--color-text-secondary))] bg-[var(--theme-surface, var(--color-card-base))] rounded-2xl border border-[var(--color-border)] font-sans">
        Tidak ditemukan pertanyaan yang cocok dengan "{rawQuery}".
      </div>
    {:else}
      {#each filteredFaqs as item, index (item.id || index)}
        {@const isOpen = openIndex === index}
        {@const isItemActive = $canvasStore.selectedSectionId === sectionId && $canvasStore.selectedNodeId === (item.id || `faq_item_${index}`)}
        {@const itemStyle = resolveFaqItemStyle(item, index, nodeStyles)}

        <div
          role="button"
          tabindex="0"
          on:click={(e) => selectItem(e, index, item)}
          on:keydown={(e) => { if (e.key === 'Enter') selectItem(e, index, item); }}
          class={`rounded-2xl border border-[var(--color-border)] bg-[var(--theme-surface, var(--color-card-base))] overflow-hidden shadow-xs transition-all duration-200 cursor-pointer ${
            isItemActive
              ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100 shadow-md'
              : 'hover:border-[var(--theme-primary, var(--color-primary))]/30'
          }`}
          style="background: {itemStyle.backgroundColor || 'var(--theme-surface, var(--color-card-base))'}; border-color: {itemStyle.borderColor || 'var(--color-border)'}; border-radius: var(--theme-btn-border-radius, var(--btn-radius, 16px)); margin-top: {itemStyle.marginTop}; margin-bottom: {itemStyle.marginBottom};"
        >
          <button
            type="button"
            on:click|stopPropagation={() => toggle(index)}
            class="w-full p-4 flex items-center justify-between gap-4 text-left font-heading font-bold text-xs sm:text-sm hover:text-[var(--theme-primary, var(--color-primary))] transition-colors cursor-pointer"
            style="color: {itemStyle.color || 'var(--theme-text-primary, var(--color-text-main))'}; font-family: var(--theme-heading-font, var(--font-heading));"
          >
            <span class="flex-1 min-w-0">{item.question}</span>
            <span
              class={`p-1 rounded-lg text-[var(--theme-text-muted, var(--color-text-secondary))] transition-transform duration-200 shrink-0 ${
                isOpen ? 'rotate-180 text-[var(--theme-primary, var(--color-primary))]' : ''
              }`}
            >
              <ChevronDown size={15} />
            </span>
          </button>

          {#if isOpen}
            <div class="px-4 pb-4 pt-1 text-xs text-[var(--theme-text-muted, var(--color-text-secondary))] leading-relaxed border-t border-[var(--color-border)] font-sans">
              {item.answer}
            </div>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</div>
