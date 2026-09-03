<script lang="ts">
  import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-svelte';
  import type { FAQItem } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import { buildWhatsAppHelpLink } from './faq.helpers';

  export let sectionId: string = '';
  export let faqs: FAQItem[] = [];
  export let waNumber: string = '';
  export let title: string = '';
  export let subtitle: string = '';

  let openIndex: number | null = 0;

  function toggle(idx: number) {
    openIndex = openIndex === idx ? null : idx;
  }

  function selectCsCard(e: Event) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, 'faq_cs_card');
    }
  }

  function selectItem(e: Event, idx: number, item: FAQItem) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, item.id || `faq_item_${idx}`);
    }
  }
</script>

<div class="cq-faq-split text-left">
  <!-- Left Side: CS Card & Info -->
  <div class="flex flex-col gap-4">
    {#if title}
      <h2 class="text-heading-lg font-heading font-black text-main tracking-tight">
        {title}
      </h2>
    {/if}
    {#if subtitle}
      <p class="text-xs sm:text-sm text-secondary leading-relaxed">
        {subtitle}
      </p>
    {/if}

    <div
      role="button"
      tabindex="0"
      on:click={selectCsCard}
      on:keydown={(e) => { if (e.key === 'Enter') selectCsCard(e); }}
      class={`p-6 rounded-3xl bg-card border border-light/80 shadow-xs flex flex-col gap-3 transition-all duration-200 cursor-pointer ${
        $canvasStore.selectedNodeId === 'faq_cs_card'
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-md'
          : 'hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div class="flex items-center gap-2 text-xs font-heading font-bold text-primary">
        <HelpCircle size={17} />
        <span>Butuh Bantuan Langsung?</span>
      </div>
      <p class="text-xs text-secondary leading-relaxed">
        Tim customer service kami siap membalas pesan dan membantu konsultasi produk Anda.
      </p>
      <a
        href={buildWhatsAppHelpLink(waNumber)}
        target="_blank"
        rel="noopener noreferrer"
        on:click|stopPropagation
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-heading font-bold transition-all shadow-xs"
      >
        <MessageCircle size={14} />
        <span>Chat WhatsApp CS Toko</span>
      </a>
    </div>
  </div>

  <!-- Right Side: Accordion List -->
  <div class="flex flex-col gap-3">
    {#each faqs as item, index (item.id || index)}
      {@const isOpen = openIndex === index}
      {@const isItemActive = $canvasStore.selectedNodeId === (item.id || `faq_item_${index}`)}

      <div
        role="button"
        tabindex="0"
        on:click={(e) => selectItem(e, index, item)}
        on:keydown={(e) => { if (e.key === 'Enter') selectItem(e, index, item); }}
        class={`rounded-2xl border border-light/80 bg-card overflow-hidden shadow-xs transition-all duration-200 cursor-pointer ${
          isItemActive
            ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-md'
            : 'hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        <button
          type="button"
          on:click|stopPropagation={() => toggle(index)}
          class="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-heading font-bold text-xs sm:text-sm text-main hover:text-primary transition-colors cursor-pointer"
        >
          <span class="flex-1 min-w-0">{item.question}</span>
          <span
            class={`p-1.5 rounded-xl bg-nested text-secondary transition-transform duration-200 shrink-0 ${
              isOpen ? 'rotate-180 text-primary' : ''
            }`}
          >
            <ChevronDown size={15} />
          </span>
        </button>

        {#if isOpen}
          <div class="px-5 pb-5 pt-1 text-xs text-secondary leading-relaxed border-t border-light/60">
            {item.answer}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
