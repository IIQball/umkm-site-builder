<script lang="ts">
  import { ChevronDown, HelpCircle, MessageCircle, Search, MessageSquare } from 'lucide-svelte';
  import { editorStore } from '../stores/editorStore';
  import type { FAQProps, SectionStyles, FAQItem } from '@/types';

  export let props: FAQProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'accordion_single_col';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'accordion_single_col';
  $: rawFaqs = (Array.isArray(props?.faqs) && props.faqs.length > 0
    ? props.faqs
    : [
        {
          question: 'Berapa lama proses pengiriman pesanan?',
          answer: 'Pesanan diproses dalam 1x24 jam dan sampai dalam 1-3 hari kerja tergantung lokasi tujuan pengiriman.',
        },
        {
          question: 'Bagaimana cara melakukan pembayaran?',
          answer: 'Kami menerima pembayaran melalui transfer Bank, E-Wallet (GoPay, OVO, Dana, ShopeePay), dan QRIS instan.',
        },
        {
          question: 'Apakah produk bergaransi?',
          answer: 'Ya, semua produk kami memiliki garansi 100% original dan jaminan penggantian barang baru jika rusak saat pengiriman.',
        },
        {
          question: 'Apakah bisa pesan dalam jumlah banyak (grosir)?',
          answer: 'Tentu bisa! Hubungi WhatsApp admin kami untuk mendapatkan harga khusus pesanan grosir dan kemitraan.',
        },
        {
          question: 'Bagaimana cara melacak resi pengiriman?',
          answer: 'Nomor resi otomatis dikirimkan via WhatsApp setelah pesanan diserahkan ke pihak ekspedisi.',
        },
      ]) as FAQItem[];

  $: hasCustomColor = !!styles?.color;
  $: activeStoreWaNumber = (props?.whatsappNumber as string) || (props?.waNumber as string) || '628123456789';
  $: waLink = `https://wa.me/${activeStoreWaNumber.replace(/[^0-9]/g, '')}`;

  let expandedIndex: number | null = 0;
  let expandedIndexCol2: number | null = null;
  let searchQuery = '';
  let activeTab = 'semua';
  let draggedIdx: number | null = null;
  let dropTargetIdx: number | null = null;

  $: filteredFaqs = rawFaqs.filter((f) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (f.question || '').toLowerCase().includes(q) || (f.answer || '').toLowerCase().includes(q);
  });

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

    const list = [...rawFaqs];
    const [moved] = list.splice(draggedIdx, 1);
    list.splice(targetIdx, 0, moved);
    editorStore.updateSectionProps(sectionId, { faqs: list });

    draggedIdx = null;
    dropTargetIdx = null;
  };

  const toggle = (idx: number) => {
    expandedIndex = expandedIndex === idx ? null : idx;
  };

  const toggleCol2 = (idx: number) => {
    expandedIndexCol2 = expandedIndexCol2 === idx ? null : idx;
  };
</script>

<div
  data-node="faq_container"
  class="w-full box-border py-12"
>
  {#if activePreset === 'categorized_tabs_faq'}
    <!-- Preset A: Categorized Tabs FAQ (Category tabs on top + accordion list) -->
    <div class="max-w-3xl mx-auto flex flex-col items-center">
      <div class="mb-6 text-center px-2">
        <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight mb-2">
          {props?.title || 'Pusat Bantuan & FAQ'}
        </h2>
        <p class="text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] max-w-xl mx-auto">
          {props?.subtitle || 'Pilih kategori topik untuk melihat pertanyaan yang sering diajukan'}
        </p>
      </div>

      <!-- Category Tabs -->
      <div class="flex overflow-x-auto no-scrollbar gap-2 mb-8 p-1 rounded-full bg-base-200/60 dark:bg-slate-800/80 border border-base-300 dark:border-slate-700">
        {#each ['Semua', 'Pemesanan', 'Pembayaran', 'Pengiriman', 'Garansi'] as tab}
          <button
            type="button"
            on:click={() => (activeTab = tab.toLowerCase())}
            class={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.toLowerCase()
                ? 'bg-[var(--theme-primary,#2563eb)] text-white shadow-sm'
                : 'text-[var(--theme-text-muted,#64748b)] hover:text-base-content'
            }`}
          >
            {tab}
          </button>
        {/each}
      </div>

      <!-- Accordion List -->
      <div class="flex flex-col gap-4 w-full">
        {#each rawFaqs as item, index}
          {@const isExpanded = expandedIndex === index}
          <div class="rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
            <button
              type="button"
              on:click={() => toggle(index)}
              class="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-base-200/50 cursor-pointer"
            >
              <span class="font-bold text-xs sm:text-sm text-[var(--theme-text-primary,#0f172a)]">{item.question}</span>
              <ChevronDown size={16} class={`text-[var(--theme-primary,#2563eb)] transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            {#if isExpanded}
              <div class="px-4 pb-4 pt-1 text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] border-t border-base-200 dark:border-slate-800 leading-relaxed">
                {item.answer}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>

  {:else if activePreset === 'faq_contact_banner_bottom'}
    <!-- Preset B: FAQ Contact Banner Bottom (1-Col Accordion + Green Bottom WA Banner) -->
    <div class="max-w-3xl mx-auto flex flex-col gap-8">
      <div class="text-center px-2">
        <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight mb-2">
          {props?.title || 'Pertanyaan yang Sering Diajukan'}
        </h2>
        <p class="text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] max-w-xl mx-auto">
          {props?.subtitle || 'Informasi lengkap seputar layanan, pemesanan, dan transaksi toko kami'}
        </p>
      </div>

      <div class="flex flex-col gap-4 w-full">
        {#each rawFaqs.slice(0, 4) as item, index}
          {@const isExpanded = expandedIndex === index}
          <div class="rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <button
              type="button"
              on:click={() => toggle(index)}
              class="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-base-200/50 cursor-pointer"
            >
              <span class="font-bold text-xs sm:text-sm text-[var(--theme-text-primary,#0f172a)]">{item.question}</span>
              <ChevronDown size={16} class={`text-[var(--theme-primary,#2563eb)] transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            {#if isExpanded}
              <div class="px-4 pb-4 pt-1 text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] border-t border-base-200 dark:border-slate-800 leading-relaxed">
                {item.answer}
              </div>
            {/if}
          </div>
        {/each}
      </div>

      <!-- Green WA Banner at Bottom -->
      <div class="p-6 sm:p-8 rounded-2xl bg-emerald-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 class="text-lg font-bold">Masih Bingung atau Punya Pertanyaan Lain?</h4>
          <p class="text-xs text-emerald-100 mt-0.5">Customer service kami siap membantu Anda dengan ramah dan cepat.</p>
        </div>
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          class="px-6 py-3 rounded-full bg-white text-emerald-700 font-bold text-xs shadow-md hover:bg-emerald-50 transition-all flex items-center gap-2 flex-shrink-0"
        >
          <MessageCircle size={16} />
          <span>Chat WhatsApp Sekarang</span>
        </a>
      </div>
    </div>

  {:else if activePreset === 'two_column_accordion'}
    <!-- Preset C: Two Column Accordion (Col 1-6 & Col 7-12) -->
    <div class="w-full">
      <div class="mb-8 text-center px-2">
        <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight mb-2">
          {props?.title || 'Tanya Jawab Seputar Toko'}
        </h2>
        <p class="text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] max-w-xl mx-auto">
          {props?.subtitle || 'Pilihan pertanyaan terpopuler dari para pelanggan kami'}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-start">
        <!-- Col 1 -->
        <div class="flex flex-col gap-4">
          {#each rawFaqs.slice(0, Math.ceil(rawFaqs.length / 2)) as item, idx}
            {@const isExpanded = expandedIndex === idx}
            <div class="rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <button
                type="button"
                on:click={() => toggle(idx)}
                class="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-base-200/50 cursor-pointer"
              >
                <span class="font-bold text-xs sm:text-sm text-[var(--theme-text-primary,#0f172a)]">{item.question}</span>
                <ChevronDown size={16} class={`text-[var(--theme-primary,#2563eb)] transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
              {#if isExpanded}
                <div class="px-4 pb-4 pt-1 text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] border-t border-base-200 dark:border-slate-800 leading-relaxed">
                  {item.answer}
                </div>
              {/if}
            </div>
          {/each}
        </div>

        <!-- Col 2 -->
        <div class="flex flex-col gap-4">
          {#each rawFaqs.slice(Math.ceil(rawFaqs.length / 2)) as item, idx}
            {@const isExpanded = expandedIndexCol2 === idx}
            <div class="rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <button
                type="button"
                on:click={() => toggleCol2(idx)}
                class="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-base-200/50 cursor-pointer"
              >
                <span class="font-bold text-xs sm:text-sm text-[var(--theme-text-primary,#0f172a)]">{item.question}</span>
                <ChevronDown size={16} class={`text-[var(--theme-primary,#2563eb)] transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
              {#if isExpanded}
                <div class="px-4 pb-4 pt-1 text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] border-t border-base-200 dark:border-slate-800 leading-relaxed">
                  {item.answer}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </div>

  {:else if activePreset === 'searchable_faq_box'}
    <!-- Preset D: Searchable FAQ Box (Realtime search bar + accordion) -->
    <div class="max-w-3xl mx-auto flex flex-col items-center gap-6">
      <div class="text-center px-2">
        <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight mb-2">
          {props?.title || 'Pencarian Bantuan Cepat'}
        </h2>
        <p class="text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] max-w-xl mx-auto">
          {props?.subtitle || 'Ketik kata kunci untuk menemukan jawaban secara instan'}
        </p>
      </div>

      <!-- Realtime Search Bar 48px -->
      <div class="w-full relative">
        <Search size={18} class="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari pertanyaan (misal: pengiriman, pembayaran, retur)..."
          class="w-full h-12 pl-11 pr-4 rounded-xl bg-[var(--theme-surface,#ffffff)] dark:bg-slate-900 border border-base-300 dark:border-slate-700 shadow-sm text-xs sm:text-sm text-base-content focus:outline-none focus:border-[var(--theme-primary,#2563eb)]"
        />
      </div>

      <!-- Accordion Results -->
      <div class="flex flex-col gap-4 w-full">
        {#if filteredFaqs.length === 0}
          <div class="p-8 text-center text-xs text-[var(--theme-text-muted,#64748b)] bg-base-200/40 rounded-2xl border border-dashed border-base-300">
            Tidak ada pertanyaan yang sesuai dengan kata kunci "{searchQuery}".
          </div>
        {:else}
          {#each filteredFaqs as item, index}
            {@const isExpanded = expandedIndex === index}
            <div class="rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <button
                type="button"
                on:click={() => toggle(index)}
                class="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-base-200/50 cursor-pointer"
              >
                <span class="font-bold text-xs sm:text-sm text-[var(--theme-text-primary,#0f172a)]">{item.question}</span>
                <ChevronDown size={16} class={`text-[var(--theme-primary,#2563eb)] transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
              {#if isExpanded}
                <div class="px-4 pb-4 pt-1 text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] border-t border-base-200 dark:border-slate-800 leading-relaxed">
                  {item.answer}
                </div>
              {/if}
            </div>
          {/each}
        {/if}
      </div>
    </div>

  {:else if activePreset === 'bubble_chat_faq'}
    <!-- Preset E: Bubble Chat FAQ (Format tanya-jawab gaya chat conversation) -->
    <div class="max-w-2xl mx-auto flex flex-col gap-6">
      <div class="text-center px-2">
        <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight mb-2">
          {props?.title || 'Obrolan Tanya Jawab'}
        </h2>
        <p class="text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] max-w-xl mx-auto">
          {props?.subtitle || 'Simulasi dialog seputar pertanyaan yang sering disampaikan pelanggan'}
        </p>
      </div>

      <div class="flex flex-col gap-6 w-full">
        {#each rawFaqs as item}
          <div class="flex flex-col gap-3">
            <!-- User Question Bubble (Right) -->
            <div class="flex items-start justify-end gap-2">
              <div class="p-4 rounded-2xl rounded-tr-none bg-[var(--theme-primary,#2563eb)] text-white text-xs sm:text-sm font-semibold max-w-md shadow-sm text-left">
                {item.question}
              </div>
            </div>

            <!-- Store Answer Bubble (Left) -->
            <div class="flex items-start gap-2">
              <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                <MessageSquare size={14} />
              </div>
              <div class="p-4 rounded-2xl rounded-tl-none bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 text-[var(--theme-text-primary,#0f172a)] text-xs sm:text-sm max-w-md shadow-sm leading-relaxed text-left">
                {item.answer}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

  {:else if activePreset === 'split_faq_sidebar'}
    <!-- Preset 2: Split FAQ Sidebar (Left Heading & Contact Card, Right Accordions) -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      <div class="md:col-span-5 flex flex-col gap-4 text-left">
        <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight">
          {props?.title || 'Pertanyaan Umum'}
        </h2>
        <p class="text-sm text-[var(--theme-text-muted,#64748b)] leading-relaxed">
          {props?.subtitle || 'Temukan jawaban cepat atas pertanyaan yang sering diajukan seputar produk & layanan kami.'}
        </p>

        <!-- Help Contact Card -->
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
        {#each rawFaqs as item, index (item.question + index)}
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
        {#each rawFaqs as item, index (item.question + index)}
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
        {#each rawFaqs as item, index (item.question + index)}
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
