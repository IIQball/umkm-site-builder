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
    class={`flex justify-center gap-2 p-1.5 rounded-2xl w-fit mx-auto transition-all ${
      $canvasStore.selectedNodeId === 'faq_tabs'
        ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 bg-nested/50'
        : ''
    }`}
  >
    {#each tabs as tab}
      <button
        type="button"
        on:click|stopPropagation={() => (activeTab = tab.id)}
        class={`px-4 py-1.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
          activeTab === tab.id
            ? 'bg-primary text-white shadow-xs'
            : 'bg-nested/80 text-secondary hover:text-main'
        }`}
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
        class={`rounded-2xl border border-light/80 bg-nested/40 overflow-hidden shadow-xs transition-all duration-200 cursor-pointer ${
          isItemActive
            ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-md'
            : 'hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        <button
          type="button"
          on:click|stopPropagation={() => toggle(index)}
          class="w-full p-4 flex items-center justify-between gap-4 text-left font-heading font-bold text-xs sm:text-sm text-main hover:text-primary transition-colors cursor-pointer"
        >
          <span class="flex-1 min-w-0">{item.question}</span>
          <span
            class={`p-1 rounded-lg text-secondary transition-transform duration-200 shrink-0 ${
              isOpen ? 'rotate-180 text-primary' : ''
            }`}
          >
            <ChevronDown size={15} />
          </span>
        </button>

        {#if isOpen}
          <div class="px-4 pb-4 pt-1 text-xs text-secondary leading-relaxed border-t border-light/60">
            {item.answer}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
