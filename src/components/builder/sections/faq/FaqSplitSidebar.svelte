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
      <h2
        class="text-heading-lg font-heading font-black text-main tracking-tight"
        style="color: var(--color-text-main, #0f172a); font-family: var(--font-heading);"
      >
        {title}
      </h2>
    {/if}
    {#if subtitle}
      <p
        class="text-xs sm:text-sm text-secondary leading-relaxed"
        style="color: var(--color-text-secondary, #334155); font-family: var(--font-family);"
      >
        {subtitle}
      </p>
    {/if}

    <div
      role="button"
      tabindex="0"
      on:click={selectCsCard}
      on:keydown={(e) => { if (e.key === 'Enter') selectCsCard(e); }}
      class={`p-6 shadow-xs flex flex-col gap-3 transition-all duration-200 cursor-pointer ${
        $canvasStore.selectedNodeId === 'faq_cs_card'
          ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 shadow-md'
          : 'hover:border-[var(--theme-primary,#2563eb)]/50'
      }`}
      style="background: var(--color-card-base, #ffffff); border: 1px solid var(--color-border, rgba(15, 23, 42, 0.08)); border-radius: var(--btn-radius, var(--theme-btn-radius, 24px));"
    >
      <div
        class="flex items-center gap-2 text-xs font-heading font-bold"
        style="color: var(--theme-primary, var(--color-primary, #2563eb));"
      >
        <HelpCircle size={17} />
        <span>Butuh Bantuan Langsung?</span>
      </div>
      <p
        class="text-xs text-secondary leading-relaxed"
        style="color: var(--color-text-secondary, #334155); font-family: var(--font-family);"
      >
        Tim customer service kami siap membalas pesan dan membantu konsultasi produk Anda.
      </p>
      <a
        href={buildWhatsAppHelpLink(waNumber)}
        target="_blank"
        rel="noopener noreferrer"
        on:click|stopPropagation
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-heading font-bold transition-all shadow-xs active:scale-[0.98]"
        style="background: var(--btn-primary-bg, var(--theme-btn-primary-bg, #10b981)); color: var(--btn-primary-text, var(--theme-btn-primary-text, #ffffff)); border-radius: var(--btn-radius, var(--theme-btn-radius, 16px));"
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
        class={`overflow-hidden shadow-xs transition-all duration-200 cursor-pointer ${
          isItemActive
            ? 'ring-2 ring-[var(--theme-primary,#2563eb)] ring-offset-2 shadow-md'
            : 'hover:border-[var(--theme-primary,#2563eb)]/50'
        }`}
        style="background: var(--color-card-base, #ffffff); border: 1px solid var(--color-border, rgba(15, 23, 42, 0.08)); border-radius: var(--btn-radius, var(--theme-btn-radius, 16px));"
      >
        <button
          type="button"
          on:click|stopPropagation={() => toggle(index)}
          class="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-heading font-bold text-xs sm:text-sm hover:opacity-80 transition-colors cursor-pointer"
          style="color: var(--color-text-main, #0f172a); font-family: var(--font-heading);"
        >
          <span class="flex-1 min-w-0">{item.question}</span>
          <span
            class={`p-1.5 rounded-xl transition-transform duration-200 shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`}
            style="background: var(--color-nested-base, #f1f5f9); color: {isOpen ? 'var(--theme-primary, #2563eb)' : 'var(--color-text-secondary, #334155)'};"
          >
            <ChevronDown size={15} />
          </span>
        </button>

        {#if isOpen}
          <div
            class="px-5 pb-5 pt-1 text-xs leading-relaxed border-t"
            style="color: var(--color-text-secondary, #334155); border-color: var(--color-border, rgba(15, 23, 42, 0.08)); font-family: var(--font-family);"
          >
            {item.answer}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
