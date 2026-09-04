<script lang="ts">
  import { ChevronDown } from 'lucide-svelte';
  import type { FAQItem } from '@/types';
  import { canvasStore } from '../../stores/editorStore';

  export let sectionId: string = '';
  export let faqs: (FAQItem & { category?: string })[] = [];

  let activeTab = 'order';
  let openIndex: number | null = 0;

  const tabs = [
    { id: 'order', label: 'Pemesanan', categoryMatch: 'pemesanan' },
    { id: 'payment', label: 'Pembayaran', categoryMatch: 'pembayaran' },
    { id: 'shipping', label: 'Pengiriman', categoryMatch: 'pengiriman' },
  ];

  $: currentMatch = tabs.find((t) => t.id === activeTab)?.categoryMatch || 'pemesanan';

  $: filteredFaqs = faqs.filter((item) => {
    if (!item.category) return true;
    return item.category.toLowerCase().includes(currentMatch);
  });

  function toggle(idx: number) {
    openIndex = openIndex === idx ? null : idx;
  }

  function selectTabs(e: Event) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, 'faq_tabs');
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
  <!-- Tabs Navigation -->
  <div
    role="button"
    tabindex="0"
    on:click={selectTabs}
    on:keydown={(e) => { if (e.key === 'Enter') selectTabs(e); }}
    class={`flex flex-wrap justify-center gap-2 p-1.5 rounded-2xl w-fit mx-auto transition-all ${
      $canvasStore.selectedNodeId === 'faq_tabs'
        ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 dark:ring-offset-slate-900 bg-[var(--color-nested-base,#f8fafc)]'
        : ''
    }`}
  >
    {#each tabs as tab}
      <button
        type="button"
        on:click|stopPropagation={() => (activeTab = tab.id)}
        style={`border-radius: var(--btn-radius, var(--theme-btn-radius, 12px)); ${
          activeTab === tab.id
            ? 'background-color: var(--btn-primary-bg, var(--theme-btn-primary-bg, var(--theme-primary, #2563eb))); color: var(--btn-primary-text, var(--theme-btn-primary-text, #ffffff));'
            : 'background-color: var(--btn-secondary-bg, var(--theme-btn-secondary-bg, var(--color-nested-base, #f1f5f9))); color: var(--btn-secondary-text, var(--theme-btn-secondary-text, var(--color-text-secondary, #475569)));'
        }`}
        class="px-4 py-2 text-xs font-[var(--font-heading,inherit)] font-bold transition-all cursor-pointer shadow-xs hover:opacity-90"
      >
        {tab.label}
      </button>
    {/each}
  </div>

  <!-- FAQs under active tab -->
  <div class="space-y-3 text-left">
    {#each (filteredFaqs.length > 0 ? filteredFaqs : faqs) as item, index (item.id || index)}
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
  </div>
</div>
