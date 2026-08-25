<script lang="ts">
  import { editorStore, canvasStore } from '../stores/editorStore';
  import type { TestimonialsProps, SectionStyles, TestimonialItem } from '@/types';
  import { Star, MessageCircle } from 'lucide-svelte';

  export let props: TestimonialsProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'masonry_grid';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'masonry_grid';
  $: testimonials = (Array.isArray(props?.testimonials) && props.testimonials.length > 0
    ? props.testimonials
    : [
        {
          customerName: 'Siti Rahma',
          rating: 5,
          comment: 'Produk sangat berkualitas, packing rapi, dan pengiriman super cepat!',
        },
        {
          customerName: 'Budi Santoso',
          rating: 5,
          comment: 'Pelayanan CS ramah dan responsif sekali. Sangat puas berbelanja di sini!',
        },
        {
          customerName: 'Dewi Lestari',
          rating: 5,
          comment: 'Harga terjangkau tapi mutunya premium. Pasti akan order lagi nanti.',
        },
      ]) as TestimonialItem[];

  $: isMobileView = $canvasStore?.viewMode === 'mobile';
  $: hasCustomColor = !!styles?.color;

  let activeSpotlightIdx = 0;
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

<div
  data-node="testimonials_container"
  class="w-full max-w-[var(--theme-max-width,1200px)] mx-auto box-border py-12"
>
  <div class="mb-8 text-center px-2">
    <h2 class={`text-2xl sm:text-3xl font-black tracking-tight mb-2 ${hasCustomColor ? '' : 'text-[var(--theme-text-primary,#0f172a)]'}`}>
      {props?.title || 'Apa Kata Pelanggan Kami'}
    </h2>
    <p class={`text-xs sm:text-sm max-w-xl mx-auto ${hasCustomColor ? 'opacity-80' : 'text-[var(--theme-text-muted,#64748b)]'}`}>
      {props?.subtitle || 'Ulasan jujur dan kepuasan pengalaman berbelanja dari para pelanggan setia'}
    </p>
  </div>

  {#if activePreset === 'single_spotlight'}
    <!-- Preset 2: Single Spotlight with Pagination -->
    {@const item = testimonials[activeSpotlightIdx] || testimonials[0]}
    <div class="max-w-2xl mx-auto flex flex-col items-center gap-6">
      <div
        data-node="testimonial_card"
        class="w-full p-8 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-md flex flex-col items-center text-center gap-4"
      >
        <div data-node="testimonial_rating" class="flex items-center gap-1">
          {#each Array(Math.max(1, Math.min(5, item.rating || 5))) as _}
            <Star size={18} class="fill-amber-400 text-amber-400" />
          {/each}
        </div>
        <p data-node="testimonial_comment" class="text-base sm:text-lg italic text-[var(--theme-text-primary,#0f172a)] leading-relaxed">
          "{item.comment || 'Pelayanan sangat memuaskan dan produk sesuai ekspektasi!'}"
        </p>
        <div data-node="testimonial_author" class="flex items-center gap-3 pt-2">
          {#if item.avatar}
            <img src={item.avatar} alt={item.customerName} class="w-12 h-12 rounded-full object-cover border border-base-300 flex-shrink-0" />
          {:else}
            <div class="w-12 h-12 rounded-full bg-blue-100 text-[var(--theme-primary,#2563eb)] font-bold text-sm flex items-center justify-center flex-shrink-0">
              {(item.customerName || 'P').charAt(0).toUpperCase()}
            </div>
          {/if}
          <div class="text-left min-w-0">
            <p class="text-sm font-bold text-[var(--theme-text-primary,#0f172a)]">{item.customerName || 'Pelanggan Setia'}</p>
            <p class="text-xs text-[var(--theme-text-muted,#64748b)]">Pembeli Terverifikasi</p>
          </div>
        </div>
      </div>

      <!-- Pagination Dots gap-2 (8px) -->
      <div class="flex items-center gap-2">
        {#each testimonials as _, idx}
          <button
            type="button"
            on:click={() => (activeSpotlightIdx = idx)}
            class={`w-3 h-3 rounded-full transition-all cursor-pointer ${
              activeSpotlightIdx === idx ? 'bg-[var(--theme-primary,#2563eb)] scale-110' : 'bg-base-300 dark:bg-slate-700 hover:bg-slate-400'
            }`}
            aria-label={`Slide ${idx + 1}`}
          ></button>
        {/each}
      </div>
    </div>

  {:else if activePreset === 'chat_bubble_flow'}
    <!-- Preset 3: Chat Bubble Flow (WhatsApp Style) -->
    <div class="max-w-2xl mx-auto flex flex-col gap-4">
      {#each testimonials as item, index ((item.customerName || '') + index)}
        <div
          data-node="testimonial_card"
          class="p-6 rounded-2xl rounded-tl-sm bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm flex flex-col gap-3 text-left"
        >
          <div class="flex items-center justify-between gap-2">
            <div data-node="testimonial_author" class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                <MessageCircle size={16} />
              </div>
              <div>
                <p class="text-xs font-bold text-[var(--theme-text-primary,#0f172a)]">{item.customerName || 'Pelanggan'}</p>
                <p class="text-[10px] text-emerald-600 font-semibold">via WhatsApp</p>
              </div>
            </div>
            <div data-node="testimonial_rating" class="flex items-center gap-0.5">
              {#each Array(Math.max(1, Math.min(5, item.rating || 5))) as _}
                <Star size={12} class="fill-amber-400 text-amber-400" />
              {/each}
            </div>
          </div>
          <p data-node="testimonial_comment" class="text-xs sm:text-sm text-[var(--theme-text-primary,#0f172a)] leading-relaxed">
            "{item.comment || 'Pelayanan sangat memuaskan dan produk sesuai ekspektasi!'}"
          </p>
        </div>
      {/each}
    </div>

  {:else}
    <!-- Preset 1 (Default): Masonry Grid 3-col (Card p-6 = 24px, gap-6 = 24px) -->
    <div class={`grid ${isMobileView ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-6 w-full`}>
      {#each testimonials as item, index ((item.customerName || '') + index)}
        <div
          data-node="testimonial_card"
          role="listitem"
          draggable={isActive}
          on:dragstart={(e) => onDragStart(e, index)}
          on:dragover={(e) => onDragOver(e, index)}
          on:dragleave={() => (dropTargetIdx = null)}
          on:drop={(e) => onDrop(e, index)}
          class={`p-6 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border transition-all flex flex-col justify-between text-left min-w-0 ${
            isActive ? 'cursor-grab active:cursor-grabbing hover:border-blue-400' : ''
          } ${dropTargetIdx === index ? 'border-blue-500 ring-2 ring-blue-400/40 shadow-lg' : 'border-base-200 dark:border-slate-800 shadow-sm'} ${
            draggedIdx === index ? 'opacity-30' : ''
          }`}
        >
          <div class="mb-4 flex flex-col gap-2">
            <div data-node="testimonial_rating" class="flex items-center gap-1">
              {#each Array(Math.max(1, Math.min(5, item.rating || 5))) as _}
                <Star size={14} class="fill-amber-400 text-amber-400" />
              {/each}
            </div>
            <p data-node="testimonial_comment" class="text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] leading-relaxed break-words line-clamp-4">
              "{item.comment || 'Pelayanan sangat memuaskan dan produk sesuai ekspektasi!'}"
            </p>
          </div>

          <div data-node="testimonial_author" class="flex items-center gap-3 pt-3 border-t border-base-200 dark:border-slate-800">
            {#if item.avatar}
              <img src={item.avatar} alt={item.customerName} class="w-10 h-10 rounded-full object-cover border border-base-300 flex-shrink-0" />
            {:else}
              <div class="w-10 h-10 rounded-full bg-blue-100 text-[var(--theme-primary,#2563eb)] font-bold text-xs flex items-center justify-center flex-shrink-0">
                {(item.customerName || 'P').charAt(0).toUpperCase()}
              </div>
            {/if}
            <div class="min-w-0">
              <p class="text-xs font-bold text-[var(--theme-text-primary,#0f172a)] truncate">{item.customerName || 'Pelanggan Setia'}</p>
              <p class="text-[10px] text-[var(--theme-text-muted,#64748b)] font-medium">Pembeli Terverifikasi</p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

