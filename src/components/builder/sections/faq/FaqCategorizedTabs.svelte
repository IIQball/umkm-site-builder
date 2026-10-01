<script lang="ts">
  import { ChevronDown } from 'lucide-svelte';
  import type { FAQItem } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import { resolveFaqItemStyle } from './faqStyles.helpers';

  export let sectionId: string = '';
  export let faqs: (FAQItem & { category?: string })[] = [];
  export let nodeStyles: Record<string, Record<string, string>> = {};

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

  export let elementOrder: string[] = [];
  $: hasTabs = !elementOrder.length || elementOrder.includes('faq_tabs') || elementOrder.includes('tabs');
  $: tabsStyle = nodeStyles?.['faq_tabs'] || {};
</script>

<div class="max-w-2xl mx-auto flex flex-col gap-6 text-center">
  {#if hasTabs}
  <!-- Tabs Navigation -->
  <div
    role="button"
    tabindex="0"
    on:click={selectTabs}
    on:keydown={(e) => { if (e.key === 'Enter') selectTabs(e); }}
    class={`flex flex-wrap justify-center gap-2 p-1.5 rounded-2xl w-fit mx-auto transition-all ${
      $canvasStore.selectedNodeId === 'faq_tabs'
        ? 'ring-2 ring-[var(--theme-primary, var(--color-primary))] ring-offset-2 dark:ring-offset-base-100 bg-[var(--color-nested-base)]'
        : ''
    }`}
    style="margin-top: {tabsStyle.marginTop || '0px'}; margin-bottom: {tabsStyle.marginBottom || '0px'};"
  >
    {#each tabs as tab}
      <button
        type="button"
        on:click|stopPropagation={() => (activeTab = tab.id)}
        style={`border-radius: var(--theme-btn-border-radius, var(--btn-radius, 12px)); ${
          activeTab === tab.id
            ? 'background-color: var(--theme-btn-primary-bg, var(--color-primary)); color: var(--theme-btn-primary-text, white);'
            : 'background-color: var(--theme-surface, var(--color-nested-base)); color: var(--theme-text-muted, var(--color-text-secondary));'
        }`}
        class="px-4 py-2 text-xs font-heading font-bold transition-all cursor-pointer shadow-xs hover:opacity-90"
      >
        {tab.label}
      </button>
    {/each}
  </div>
  {/if}

  <!-- FAQs under active tab -->
  <div class="space-y-3 text-left">
    {#each (filteredFaqs.length > 0 ? filteredFaqs : faqs) as item, index (item.id || index)}
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
  </div>
</div>
