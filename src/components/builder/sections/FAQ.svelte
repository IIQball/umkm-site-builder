<script lang="ts">
  import { ChevronDown } from 'lucide-svelte';
  import { editorStore } from '../stores/editorStore';
  import type { FAQProps, SectionStyles, FAQItem } from '@/types/builder';

  export let props: FAQProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;

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

<div class="max-w-3xl mx-auto w-full">
  <div class="mb-8 text-center">
    <h2 class={`text-2xl font-bold tracking-tight mb-2 ${hasCustomColor ? '' : 'text-slate-900'}`}>
      {props?.title || 'Pertanyaan yang Sering Diajukan'}
    </h2>
    <p class={`text-xs ${hasCustomColor ? 'opacity-80' : 'text-slate-600'}`}>
      {props?.subtitle || 'Informasi lengkap seputar layanan, pemesanan, dan transaksi toko kami'}
    </p>
  </div>

  <div class="space-y-3">
    {#each faqs as item, index (item.question + index)}
      {@const isExpanded = expandedIndex === index}
      <div
        role="region"
        draggable={isActive}
        on:dragstart={(e) => onDragStart(e, index)}
        on:dragover={(e) => onDragOver(e, index)}
        on:dragleave={() => (dropTargetIdx = null)}
        on:drop={(e) => onDrop(e, index)}
        class={`bg-white rounded-xl border transition-all overflow-hidden ${
          isActive ? 'cursor-grab active:cursor-grabbing hover:border-blue-400' : ''
        } ${dropTargetIdx === index ? 'border-blue-500 ring-2 ring-blue-400/40 shadow-lg' : 'border-slate-200/80 shadow-sm'} ${
          draggedIdx === index ? 'opacity-30' : ''
        }`}
      >
        <button
          type="button"
          on:click={() => toggle(index)}
          class="w-full px-5 py-3.5 text-left flex items-center justify-between gap-4 transition-colors hover:bg-slate-50 cursor-pointer"
        >
          <span class="font-semibold text-xs sm:text-sm text-slate-900 leading-snug">
            {item.question || 'Pertanyaan...'}
          </span>
          <div class={`text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-blue-600' : ''}`}>
            <ChevronDown size={16} />
          </div>
        </button>

        {#if isExpanded}
          <div class="px-5 pb-4 pt-1 text-xs leading-relaxed text-slate-600 border-t border-slate-100 bg-slate-50/50">
            {item.answer || 'Belum ada jawaban.'}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
