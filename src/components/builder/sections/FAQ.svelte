<script lang="ts">
  import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-svelte';
  import { editorStore } from '../stores/editorStore';
  import type { FAQProps, SectionStyles, FAQItem } from '@/types';

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
          answer: 'Pesanan diproses dalam 1x24 jam dan sampai dalam 1-3 hari kerja tergantung lokasi.',
        },
        {
          question: 'Bagaimana cara melakukan pembayaran?',
          answer: 'Kami menerima pembayaran melalui transfer Bank, E-Wallet (GoPay, OVO, Dana), dan QRIS.',
        },
        {
          question: 'Apakah produk bergaransi?',
          answer: 'Ya, semua produk kami memiliki garansi 100% original dan jaminan penggantian barang baru jika rusak saat pengiriman.',
        },
      ]) as FAQItem[];

  $: hasCustomColor = !!styles?.color;

  let expandedIndex: number | null = 0;
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

<div
  data-node="faq_container"
  class="w-full box-border py-12"
>
  {#if activePreset === 'split_faq_sidebar'}
    <!-- Preset 2: Split FAQ Sidebar (Left Heading & Contact Card, Right Accordions) -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      <div class="md:col-span-5 flex flex-col gap-4 text-left">
        <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight">
          {props?.title || 'Pertanyaan Umum'}
        </h2>
        <p class="text-sm text-[var(--theme-text-muted,#64748b)] leading-relaxed">
          {props?.subtitle || 'Temukan jawaban cepat atas pertanyaan yang sering diajukan seputar produk & layanan kami.'}
        </p>

        <!-- Help Contact Card: Concentric nested radius -->
        <div class="mt-4 p-6 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm flex flex-col gap-3">
          <div class="flex items-center gap-2 text-sm font-bold text-[var(--theme-primary,#2563eb)]">
            <HelpCircle size={18} />
            <span>Butuh Bantuan Lebih?</span>
          </div>
          <p class="text-xs text-[var(--theme-text-muted,#64748b)]">
            Tim CS kami siap menjawab kebutuhan dan pertanyaan Anda setiap hari.
          </p>
          <a
            href="#contact"
            style="height: var(--theme-btn-height, 40px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
            class="inline-flex items-center justify-center px-4 text-xs font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all mt-1"
          >
            <MessageCircle size={14} class="mr-1.5" />
            <span>Hubungi Customer Service</span>
          </a>
        </div>
      </div>

      <!-- Right Accordion Stack -->
      <div class="md:col-span-7 flex flex-col gap-4 w-full">
        {#each faqs as item, index (item.question + index)}
          {@const isExpanded = expandedIndex === index}
          <div
            data-node="faq_item"
            class="rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
          >
            <button
              type="button"
              on:click={() => toggle(index)}
              class="w-full p-4 text-left flex items-center justify-between gap-4 transition-colors hover:bg-base-200/50 cursor-pointer"
            >
              <span data-node="faq_question" class="font-bold text-sm text-[var(--theme-text-primary,#0f172a)] leading-snug">
                {item.question}
              </span>
              <ChevronDown size={16} class={`text-[var(--theme-primary,#2563eb)] transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            {#if isExpanded}
              <div data-node="faq_answer" class="px-4 pb-4 pt-1 text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] leading-relaxed border-t border-base-200 dark:border-slate-800">
                {item.answer}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>

  {:else if activePreset === 'grid_2_col_cards'}
    <!-- Preset 3: Grid 2-Col Cards (Open Static FAQ cards) -->
    <div>
      <div class="mb-8 text-center px-2">
        <h2 class={`text-2xl sm:text-3xl font-black tracking-tight mb-2 ${hasCustomColor ? '' : 'text-[var(--theme-text-primary,#0f172a)]'}`}>
          {props?.title || 'Pertanyaan yang Sering Diajukan'}
        </h2>
        <p class={`text-xs sm:text-sm max-w-xl mx-auto ${hasCustomColor ? 'opacity-80' : 'text-[var(--theme-text-muted,#64748b)]'}`}>
          {props?.subtitle || 'Informasi lengkap seputar layanan, pemesanan, dan transaksi toko kami'}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {#each faqs as item, index (item.question + index)}
          <div
            data-node="faq_item"
            class="p-6 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 text-left"
          >
            <h3 data-node="faq_question" class="font-bold text-base text-[var(--theme-text-primary,#0f172a)]">
              {item.question}
            </h3>
            <p data-node="faq_answer" class="text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] leading-relaxed">
              {item.answer}
            </p>
          </div>
        {/each}
      </div>
    </div>

  {:else}
    <!-- Preset 1 (Default): Accordion Single Column (max-w-3xl centered) -->
    <div class="max-w-3xl mx-auto flex flex-col items-center">
      <div class="mb-8 text-center px-2">
        <h2 class={`text-2xl sm:text-3xl font-black tracking-tight mb-2 ${hasCustomColor ? '' : 'text-[var(--theme-text-primary,#0f172a)]'}`}>
          {props?.title || 'Pertanyaan yang Sering Diajukan'}
        </h2>
        <p class={`text-xs sm:text-sm max-w-xl mx-auto ${hasCustomColor ? 'opacity-80' : 'text-[var(--theme-text-muted,#64748b)]'}`}>
          {props?.subtitle || 'Informasi lengkap seputar layanan, pemesanan, dan transaksi toko kami'}
        </p>
      </div>

      <div class="flex flex-col gap-4 w-full">
        {#each faqs as item, index (item.question + index)}
          {@const isExpanded = expandedIndex === index}
          <div
            data-node="faq_item"
            role="region"
            draggable={isActive}
            on:dragstart={(e) => onDragStart(e, index)}
            on:dragover={(e) => onDragOver(e, index)}
            on:dragleave={() => (dropTargetIdx = null)}
            on:drop={(e) => onDrop(e, index)}
            class={`rounded-2xl bg-[var(--theme-surface,#f8fafc)] border transition-all overflow-hidden w-full min-w-0 ${
              isActive ? 'cursor-grab active:cursor-grabbing hover:border-blue-400' : ''
            } ${dropTargetIdx === index ? 'border-blue-500 ring-2 ring-blue-400/40 shadow-lg' : 'border-base-200 dark:border-slate-800 shadow-sm'} ${
              draggedIdx === index ? 'opacity-30' : ''
            }`}
          >
            <button
              type="button"
              on:click={() => toggle(index)}
              class="w-full p-4 text-left flex items-center justify-between gap-4 transition-colors hover:bg-base-200/50 cursor-pointer min-w-0"
            >
              <span data-node="faq_question" class="font-semibold text-xs sm:text-sm text-[var(--theme-text-primary,#0f172a)] leading-snug break-words flex-1">
                {item.question || 'Pertanyaan...'}
              </span>
              <div class={`text-[var(--theme-primary,#2563eb)] transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>
                <ChevronDown size={16} />
              </div>
            </button>

            {#if isExpanded}
              <div data-node="faq_answer" class="px-4 pb-4 pt-1 text-xs sm:text-sm leading-relaxed text-[var(--theme-text-muted,#64748b)] border-t border-base-200 dark:border-slate-800 break-words">
                {item.answer || 'Belum ada jawaban.'}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

