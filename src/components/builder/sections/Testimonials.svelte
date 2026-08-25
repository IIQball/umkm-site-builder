<script lang="ts">
  import { editorStore, canvasStore } from '../stores/editorStore';
  import type { TestimonialsProps, SectionStyles, TestimonialItem } from '@/types';
  import { Star } from 'lucide-svelte';

  export let props: TestimonialsProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;

  $: testimonials = (Array.isArray(props?.testimonials) && props.testimonials.length > 0
    ? props.testimonials
    : [
        {
          customerName: 'Siti Rahma',
          rating: 5,
          comment: 'Produk sangat berkualitas, packing rapi, dan pengiriman super cepat!',
        },
      ]) as TestimonialItem[];

  $: isMobileView = $canvasStore?.viewMode === 'mobile';
  $: isTabletView = $canvasStore?.viewMode === 'tablet';
  $: hasCustomColor = !!styles?.color;

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

    const list = [...testimonials];
    const [moved] = list.splice(draggedIdx, 1);
    list.splice(targetIdx, 0, moved);
    editorStore.updateSectionProps(sectionId, { testimonials: list });

    draggedIdx = null;
    dropTargetIdx = null;
  };
</script>

<div class="max-w-6xl mx-auto w-full box-border">
  <div class="mb-6 sm:mb-8 text-center px-2">
    <h2 class={`text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mb-2 ${hasCustomColor ? '' : 'text-slate-900'}`}>
      {props?.title || 'Apa Kata Pelanggan Kami'}
    </h2>
    <p class={`text-xs sm:text-sm max-w-xl mx-auto ${hasCustomColor ? 'opacity-80' : 'text-slate-600'}`}>
      {props?.subtitle || 'Ulasan jujur dan kepuasan pengalaman berbelanja dari para pelanggan setia'}
    </p>
  </div>

  <div class={`grid ${isMobileView ? 'grid-cols-1' : isTabletView ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-4 sm:gap-6 w-full`}>
    {#each testimonials as item, index ((item.customerName || '') + index)}
      <div
        role="listitem"
        draggable={isActive}
        on:dragstart={(e) => onDragStart(e, index)}
        on:dragover={(e) => onDragOver(e, index)}
        on:dragleave={() => (dropTargetIdx = null)}
        on:drop={(e) => onDrop(e, index)}
        class={`bg-white p-4 sm:p-6 rounded-2xl border transition-all flex flex-col justify-between text-left min-w-0 ${
          isActive ? 'cursor-grab active:cursor-grabbing hover:border-blue-400' : ''
        } ${dropTargetIdx === index ? 'border-blue-500 ring-2 ring-blue-400/40 shadow-lg' : 'border-slate-200/80 shadow-sm'} ${
          draggedIdx === index ? 'opacity-30' : ''
        }`}
      >
        <div class="mb-4">
          <div class="flex items-center gap-1 mb-2.5">
            {#each Array(Math.max(1, Math.min(5, item.rating || 5))) as _}
              <Star size={14} class="fill-amber-400 text-amber-400" />
            {/each}
          </div>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed break-words line-clamp-4">
            "{item.comment || 'Pelayanan sangat memuaskan dan produk sesuai ekspektasi!'}"
          </p>
        </div>

        <div class="flex items-center gap-3 pt-3 border-t border-slate-100">
          {#if item.avatar}
            <img src={item.avatar} alt={item.customerName} class="w-8 h-8 rounded-full object-cover border border-slate-200 flex-shrink-0" />
          {:else}
            <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
              {(item.customerName || 'P').charAt(0).toUpperCase()}
            </div>
          {/if}
          <div class="min-w-0">
            <p class="text-xs font-bold text-slate-900 truncate">{item.customerName || 'Pelanggan Setia'}</p>
            <p class="text-[10px] text-slate-400 font-medium">Pembeli Terverifikasi</p>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
