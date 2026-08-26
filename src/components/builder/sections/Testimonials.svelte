<script lang="ts">
  import { editorStore, canvasStore } from '../stores/editorStore';
  import type { TestimonialsProps, SectionStyles, TestimonialItem } from '@/types';
  import { Star, MessageCircle, Play, TrendingUp, Users, Award, Quote } from 'lucide-svelte';

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
        {
          customerName: 'Agus Pratama',
          rating: 5,
          comment: 'Rekomendasi terbaik untuk belanja kebutuhan usaha UMKM, barang mantap!',
        },
        {
          customerName: 'Maya Kusuma',
          rating: 5,
          comment: 'Kualitas melebihi ekspektasi, sangat memuaskan dan recomended seller!',
        },
        {
          customerName: 'Rian Hidayat',
          rating: 5,
          comment: 'Pesanan mendarat dengan aman tanpa cacat. Terima kasih banyak!',
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
  class="w-full box-border py-12"
>
  <div class="mb-8 text-center px-2">
    <h2 class={`text-2xl sm:text-3xl font-black tracking-tight mb-2 ${hasCustomColor ? '' : 'text-[var(--theme-text-primary,#0f172a)]'}`}>
      {props?.title || 'Apa Kata Pelanggan Kami'}
    </h2>
    <p class={`text-xs sm:text-sm max-w-xl mx-auto ${hasCustomColor ? 'opacity-80' : 'text-[var(--theme-text-muted,#64748b)]'}`}>
      {props?.subtitle || 'Ulasan jujur dan kepuasan pengalaman berbelanja dari para pelanggan setia'}
    </p>
  </div>

  {#if activePreset === 'testimonial_marquee_slider'}
    <!-- Preset A: Testimonial Marquee Slider (Smooth horizontal continuous row) -->
    <div class="w-full overflow-x-auto no-scrollbar py-4 flex gap-6 snap-x">
      {#each [...testimonials, ...testimonials] as item, idx (idx)}
        <div
          data-node="testimonial_card"
          class="min-w-[260px] sm:min-w-[320px] max-w-[320px] p-6 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm flex flex-col justify-between snap-start text-left flex-shrink-0"
        >
          <div class="mb-4">
            <div data-node="testimonial_rating" class="flex items-center gap-1 mb-2">
              {#each Array(Math.max(1, Math.min(5, item.rating || 5))) as _}
                <Star size={14} class="fill-amber-400 text-amber-400" />
              {/each}
            </div>
            <p data-node="testimonial_comment" class="text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] leading-relaxed line-clamp-3">
              "{item.comment || 'Pelayanan sangat memuaskan!'}"
            </p>
          </div>

          <div data-node="testimonial_author" class="flex items-center gap-3 pt-3 border-t border-base-200 dark:border-slate-800">
            <div class="w-10 h-10 rounded-full bg-blue-100 text-[var(--theme-primary,#2563eb)] font-bold text-xs flex items-center justify-center flex-shrink-0">
              {(item.customerName || 'P').charAt(0).toUpperCase()}
            </div>
            <div class="min-w-0">
              <p class="text-xs font-bold text-[var(--theme-text-primary,#0f172a)] truncate">{item.customerName || 'Pelanggan'}</p>
              <p class="text-[10px] text-[var(--theme-text-muted,#64748b)]">Pembeli Terverifikasi</p>
            </div>
          </div>
        </div>
      {/each}
    </div>

  {:else if activePreset === 'large_quote_cards'}
    <!-- Preset B: Large Quote Cards (2 wide cards, large quote typography, 56px avatar) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {#each testimonials.slice(0, 2) as item}
        <div
          data-node="testimonial_card"
          class="p-8 rounded-3xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-md flex flex-col justify-between text-left relative"
        >
          <Quote size={36} class="text-[var(--theme-primary,#2563eb)]/20 mb-4" />
          <p data-node="testimonial_comment" class="text-lg sm:text-xl font-bold italic text-[var(--theme-text-primary,#0f172a)] leading-relaxed mb-6">
            "{item.comment}"
          </p>

          <div class="flex items-center justify-between pt-4 border-t border-base-200 dark:border-slate-800">
            <div data-node="testimonial_author" class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-full bg-blue-100 text-[var(--theme-primary,#2563eb)] font-black text-lg flex items-center justify-center flex-shrink-0 shadow-inner">
                {(item.customerName || 'P').charAt(0).toUpperCase()}
              </div>
              <div>
                <p class="font-bold text-base text-[var(--theme-text-primary,#0f172a)]">{item.customerName}</p>
                <p class="text-xs text-[var(--theme-text-muted,#64748b)]">Pelanggan Setia</p>
              </div>
            </div>
            <div data-node="testimonial_rating" class="flex items-center gap-1">
              {#each Array(5) as _}
                <Star size={16} class="fill-amber-400 text-amber-400" />
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </div>

  {:else if activePreset === 'video_story_testimonials'}
    <!-- Preset C: Video Story 9:16 Testimonials (4 vertical story cards) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {#each testimonials.slice(0, 4) as item, idx}
        <div
          data-node="testimonial_card"
          class="relative aspect-[9/16] rounded-3xl overflow-hidden shadow-lg border border-base-200 dark:border-slate-800 group bg-slate-900"
        >
          <img
            src={`https://images.unsplash.com/photo-${1534528741775 + idx}?auto=format&fit=crop&w=600&q=80`}
            alt={item.customerName}
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-5 text-white">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md">Ulasan Video</span>
              <div class="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Play size={12} class="fill-white ml-0.5" />
              </div>
            </div>
            <div class="text-left">
              <div class="flex items-center gap-0.5 mb-2">
                {#each Array(5) as _}
                  <Star size={12} class="fill-amber-400 text-amber-400" />
                {/each}
              </div>
              <p class="text-xs italic text-slate-100 line-clamp-3 mb-3 font-medium leading-relaxed">
                "{item.comment}"
              </p>
              <p class="font-bold text-sm text-white">{item.customerName}</p>
            </div>
          </div>
        </div>
      {/each}
    </div>

  {:else if activePreset === 'statistics_with_review'}
    <!-- Preset D: Statistics With Review (Left Col 5 satisfaction metrics, Right Col 7 review cards) -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
      <!-- Left Statistics -->
      <div class="md:col-span-5 flex flex-col gap-6 text-left">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3.5 h-7 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-3">
            <TrendingUp size={14} /> Terbukti Puas
          </span>
          <h3 class="text-3xl sm:text-4xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight">
            98.5%
          </h3>
          <p class="text-sm font-bold text-[var(--theme-text-primary,#0f172a)]">Kepuasan Pelanggan</p>
          <p class="text-xs text-[var(--theme-text-muted,#64748b)] mt-1">Berdasarkan lebih dari 5.000+ ulasan transaksi terverifikasi</p>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-4 border-t border-base-200 dark:border-slate-800">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-[var(--theme-primary,#2563eb)] flex items-center justify-center">
              <Users size={18} />
            </div>
            <div>
              <p class="font-bold text-sm text-[var(--theme-text-primary,#0f172a)]">10K+</p>
              <p class="text-[10px] text-[var(--theme-text-muted,#64748b)]">Pelanggan Aktif</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award size={18} />
            </div>
            <div>
              <p class="font-bold text-sm text-[var(--theme-text-primary,#0f172a)]">4.9 / 5</p>
              <p class="text-[10px] text-[var(--theme-text-muted,#64748b)]">Rating Bintang</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right 2 Review Cards -->
      <div class="md:col-span-7 flex flex-col gap-4">
        {#each testimonials.slice(0, 2) as item}
          <div class="p-6 rounded-2xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm text-left flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-blue-100 text-[var(--theme-primary,#2563eb)] font-bold text-xs flex items-center justify-center">
                  {(item.customerName || 'P').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p class="text-xs font-bold text-[var(--theme-text-primary,#0f172a)]">{item.customerName}</p>
                  <p class="text-[10px] text-[var(--theme-text-muted,#64748b)]">Pembeli Terverifikasi</p>
                </div>
              </div>
              <div class="flex items-center gap-0.5">
                {#each Array(5) as _}
                  <Star size={12} class="fill-amber-400 text-amber-400" />
                {/each}
              </div>
            </div>
            <p class="text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] leading-relaxed">
              "{item.comment}"
            </p>
          </div>
        {/each}
      </div>
    </div>

  {:else if activePreset === 'compact_badge_grid'}
    <!-- Preset E: Compact Badge Grid (6 compact review cards in 3x2 grid) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {#each testimonials.slice(0, 6) as item}
        <div
          data-node="testimonial_card"
          class="p-4 rounded-xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 shadow-sm text-left flex flex-col justify-between gap-2"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-0.5">
              {#each Array(5) as _}
                <Star size={12} class="fill-amber-400 text-amber-400" />
              {/each}
            </div>
            <span class="text-[10px] font-bold text-emerald-600">Terverifikasi</span>
          </div>
          <p data-node="testimonial_comment" class="text-xs text-[var(--theme-text-primary,#0f172a)] font-medium line-clamp-2">
            "{item.comment}"
          </p>
          <p data-node="testimonial_author" class="text-[11px] font-bold text-[var(--theme-text-muted,#64748b)]">
            - {item.customerName}
          </p>
        </div>
      {/each}
    </div>

  {:else if activePreset === 'single_spotlight'}
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
    <!-- Preset 1 (Default): Masonry Grid 3-col -->
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
