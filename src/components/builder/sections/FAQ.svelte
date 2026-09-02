<script lang="ts">
  import { ChevronDown } from 'lucide-svelte';
  import { editorStore } from '../stores/editorStore';
  import type { FAQProps, SectionStyles, FAQItem } from '@/types';
  import FaqChatStyle from './faq/FaqChatStyle.svelte';
  import FaqSearchFiltered from './faq/FaqSearchFiltered.svelte';
  import FaqCategorizedTabs from './faq/FaqCategorizedTabs.svelte';
  import FaqSplitSidebar from './faq/FaqSplitSidebar.svelte';
  import FaqBoxedCardsGrid from './faq/FaqBoxedCardsGrid.svelte';

  export let props: FAQProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'accordion_single_col';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'accordion_single_col';
  $: faqs = (Array.isArray(props?.faqs) && props.faqs.length > 0
    ? props.faqs
    : [
        {
          question: 'Berapa lama proses pengiriman pesanan?',
          answer: 'Pesanan diproses dalam 1x24 jam dan sampai dalam 1-3 hari kerja tergantung lokasi pengiriman.',
        },
        {
          question: 'Bagaimana cara melakukan pembayaran?',
          answer: 'Kami menerima pembayaran melalui transfer Bank (BCA, Mandiri, BRI), E-Wallet, dan QRIS instan.',
        },
        {
          question: 'Apakah produk memiliki garansi resmi?',
          answer: 'Ya, semua produk kami 100% original dengan jaminan penggantian baru jika ada cacat/rusak saat sampai.',
        },
        {
          question: 'Apakah bisa memesan secara custom/grosir?',
          answer: 'Tentu bisa! Silakan klik tombol WhatsApp kami untuk konsultasi harga spesial pesanan partai besar.',
        },
      ]) as FAQItem[];

  $: waNumber = (props?.whatsappNumber as string) || (props?.waNumber as string) || '6281234567890';

  let expandedIndex: number | null = 0;
  let expandedCol2Index: number | null = null;
  let draggedIdx: number | null = null;
  let dropTargetIdx: number | null = null;

  const onDragStart = (e: DragEvent, index: number) => {
    if (!isActive) return;
    draggedIdx = index;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(index));
    }
  };

  const onDragOver = (e: DragEvent, index: number) => {
    if (draggedIdx === null || draggedIdx === index) return;
    e.preventDefault();
    dropTargetIdx = index;
  };

  const onDrop = (e: DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) {
      draggedIdx = null;
      dropTargetIdx = null;
      return;
    }

    const list = [...faqs];
    const [moved] = list.splice(draggedIdx, 1);
    list.splice(targetIdx, 0, moved);
    editorStore.updateSectionProps(sectionId, { faqs: list });

    draggedIdx = null;
    dropTargetIdx = null;
  };

  const toggle = (idx: number) => {
    expandedIndex = expandedIndex === idx ? null : idx;
  };
</script>

<div data-node="faq_container" class="w-full box-border py-12">
  {#if activePreset === 'split_faq_sidebar'}
    <FaqSplitSidebar
      {props}
      {faqs}
      {waNumber}
      {expandedIndex}
      onToggle={toggle}
    />
  {:else if activePreset === 'boxed_cards_grid'}
    <FaqBoxedCardsGrid
      {props}
      {faqs}
    />
  {:else if activePreset === 'chat_bubble_qa'}
    <FaqChatStyle title={props?.title || ''} {faqs} />
  {:else if activePreset === 'searchable_kb'}
    <FaqSearchFiltered title={props?.title || ''} {faqs} />
  {:else if activePreset === 'categorized_tabs'}
    <FaqCategorizedTabs title={props?.title || ''} {faqs} />
  {:else if activePreset === 'two_column_accordion'}
    <!-- Preset 3: 2-Column Accordion -->
    <div class="flex flex-col gap-8 text-left">
      <div class="text-center max-w-2xl mx-auto space-y-2">
        <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight">
          {props?.title || 'Frequently Asked Questions'}
        </h2>
        <p class="text-sm text-[var(--theme-text-muted,#64748b)]">
          {props?.subtitle || 'Jawaban ringkas dan jelas untuk memandu belanja online Anda.'}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <!-- Col 1 -->
        <div class="flex flex-col gap-3">
          {#each faqs.filter((_, i) => i % 2 === 0) as faq, i}
            {@const realIdx = i * 2}
            {@const isOpen = expandedIndex === realIdx}
            <div class="rounded-2xl border border-base-200 dark:border-slate-800 overflow-hidden bg-[var(--theme-surface,#ffffff)] transition-all">
              <button
                type="button"
                on:click={() => toggle(realIdx)}
                class="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left font-bold text-xs sm:text-sm text-[var(--theme-text-primary,#0f172a)] hover:text-[var(--theme-primary,#2563eb)] transition-colors cursor-pointer"
              >
                <span>{faq.question}</span>
                <span class="p-1 rounded-lg bg-base-100 dark:bg-slate-800 text-muted transition-transform duration-200" class:rotate-180={isOpen}>
                  <ChevronDown size={14} />
                </span>
              </button>
              {#if isOpen}
                <div class="px-5 pb-5 pt-1 text-xs text-[var(--theme-text-muted,#64748b)] leading-relaxed border-t border-base-100 dark:border-slate-800/60">
                  {faq.answer}
                </div>
              {/if}
            </div>
          {/each}
        </div>

        <!-- Col 2 -->
        <div class="flex flex-col gap-3">
          {#each faqs.filter((_, i) => i % 2 !== 0) as faq, i}
            {@const realIdx = i * 2 + 1}
            {@const isOpen = expandedCol2Index === realIdx}
            <div class="rounded-2xl border border-base-200 dark:border-slate-800 overflow-hidden bg-[var(--theme-surface,#ffffff)] transition-all">
              <button
                type="button"
                on:click={() => (expandedCol2Index = isOpen ? null : realIdx)}
                class="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left font-bold text-xs sm:text-sm text-[var(--theme-text-primary,#0f172a)] hover:text-[var(--theme-primary,#2563eb)] transition-colors cursor-pointer"
              >
                <span>{faq.question}</span>
                <span class="p-1 rounded-lg bg-base-100 dark:bg-slate-800 text-muted transition-transform duration-200" class:rotate-180={isOpen}>
                  <ChevronDown size={14} />
                </span>
              </button>
              {#if isOpen}
                <div class="px-5 pb-5 pt-1 text-xs text-[var(--theme-text-muted,#64748b)] leading-relaxed border-t border-base-100 dark:border-slate-800/60">
                  {faq.answer}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </div>
  {:else}
    <!-- Default: 1-Column Centered Accordion -->
    <div class="max-w-3xl mx-auto flex flex-col gap-8 text-left">
      <div class="text-center space-y-2">
        <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight">
          {props?.title || 'Pertanyaan yang Sering Diajukan'}
        </h2>
        <p class="text-sm text-[var(--theme-text-muted,#64748b)]">
          {props?.subtitle || 'Punya pertanyaan seputar produk, metode bayar, atau komplain? Temukan solusinya di sini.'}
        </p>
      </div>

      <div class="flex flex-col gap-3">
        {#each faqs as faq, i}
          {@const isOpen = expandedIndex === i}
          <div
            role="region"
            aria-label="FAQ Accordion Item"
            draggable={isActive}
            on:dragstart={(e) => onDragStart(e, i)}
            on:dragover={(e) => onDragOver(e, i)}
            on:drop={(e) => onDrop(e, i)}
            class="rounded-2xl border border-base-200 dark:border-slate-800 overflow-hidden bg-[var(--theme-surface,#ffffff)] transition-all {dropTargetIdx === i ? 'border-primary ring-2 ring-primary/20' : ''}"
          >
            <button
              type="button"
              on:click={() => toggle(i)}
              class="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-bold text-sm text-[var(--theme-text-primary,#0f172a)] hover:text-[var(--theme-primary,#2563eb)] transition-colors cursor-pointer"
            >
              <span>{faq.question}</span>
              <span class="p-1 rounded-lg bg-base-100 dark:bg-slate-800 text-muted transition-transform duration-200" class:rotate-180={isOpen}>
                <ChevronDown size={16} />
              </span>
            </button>
            {#if isOpen}
              <div class="px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] leading-relaxed border-t border-base-100 dark:border-slate-800/60">
                {faq.answer}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
