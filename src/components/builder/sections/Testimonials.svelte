<script lang="ts">
  import { editorStore } from '../stores/editorStore';
  import type { TestimonialsProps, SectionStyles, TestimonialItem } from '@/types';
  import { Star } from 'lucide-svelte';
  import TestimonialsMarquee from './testimonials/TestimonialsMarquee.svelte';
  import TestimonialsVideoCards from './testimonials/TestimonialsVideoCards.svelte';
  import TestimonialsSocialCards from './testimonials/TestimonialsSocialCards.svelte';
  import TestimonialsSpotlightCarousel from './testimonials/TestimonialsSpotlightCarousel.svelte';

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
          comment: 'Produk sangat berkualitas, packing rapi dan aman, pengiriman super cepat sampai!',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        },
        {
          customerName: 'Budi Santoso',
          rating: 5,
          comment: 'Pelayanan CS ramah dan responsif sekali via WhatsApp. Sangat puas berbelanja di sini!',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        },
        {
          customerName: 'Dewi Lestari',
          rating: 5,
          comment: 'Harga terjangkau tapi mutunya premium standar pabrik. Pasti akan repeat order!',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
        },
      ]) as TestimonialItem[];

  $: hasCustomColor = !!styles?.color;

  let activeSpotlightIdx = 0;
  let carouselIdx = 0;
  let draggedIdx: number | null = null;
  let dropTargetIdx: number | null = null;

  $: spotlightItem = testimonials[activeSpotlightIdx] || testimonials[0];
  $: carouselItem = testimonials[carouselIdx] || testimonials[0];

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

  const nextCarousel = () => {
    carouselIdx = (carouselIdx + 1) % testimonials.length;
  };

  const prevCarousel = () => {
    carouselIdx = (carouselIdx - 1 + testimonials.length) % testimonials.length;
  };
</script>

<div data-node="testimonials_container" class="w-full box-border py-12">
  <div class="mb-8 text-center px-2">
    <h2 class={`text-2xl sm:text-3xl font-black tracking-tight mb-2 ${hasCustomColor ? '' : 'text-[var(--theme-text-primary,#0f172a)]'}`}>
      {props?.title || 'Apa Kata Pelanggan Kami'}
    </h2>
    <p class={`text-xs sm:text-sm max-w-xl mx-auto ${hasCustomColor ? 'opacity-80' : 'text-[var(--theme-text-muted,#64748b)]'}`}>
      {props?.subtitle || 'Ulasan jujur dan kepuasan pengalaman berbelanja dari para pelanggan setia'}
    </p>
  </div>

  {#if activePreset === 'marquee_scroll'}
    <TestimonialsMarquee {testimonials} />
  {:else if activePreset === 'video_review_cards'}
    <TestimonialsVideoCards {testimonials} />
  {:else if activePreset === 'social_post_cards'}
    <TestimonialsSocialCards {testimonials} />
  {:else if activePreset === 'spotlight_hero' || activePreset === 'carousel_slider'}
    <TestimonialsSpotlightCarousel
      {activePreset}
      {testimonials}
      {spotlightItem}
      {carouselItem}
      {activeSpotlightIdx}
      {carouselIdx}
      onSelectSpotlight={(i) => (activeSpotlightIdx = i)}
      onPrevCarousel={prevCarousel}
      onNextCarousel={nextCarousel}
    />
  {:else}
    <!-- Default: Masonry or 3-column Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
      {#each testimonials as item, index}
        <div
          data-node="testimonial_item"
          role="region"
          aria-label="Testimonial Card"
          draggable={isActive}
          on:dragstart={(e) => onDragStart(e, index)}
          on:dragover={(e) => onDragOver(e, index)}
          on:drop={(e) => onDrop(e, index)}
          class={`flex flex-col justify-between p-6 rounded-2xl bg-[var(--theme-surface,#ffffff)] border border-base-200 dark:border-slate-800 shadow-xs hover:border-[var(--theme-primary,#2563eb)]/30 transition-all ${
            dropTargetIdx === index ? 'border-primary ring-2 ring-primary/20' : ''
          }`}
        >
          <div class="flex items-center gap-1 text-amber-400 mb-3">
            {#each Array(item.rating || 5) as _}
              <Star size={14} class="fill-current" />
            {/each}
          </div>

          <p class="text-xs sm:text-sm text-[var(--theme-text-primary,#0f172a)] font-medium leading-relaxed italic mb-6">
            "{item.comment}"
          </p>

          <div class="flex items-center gap-3 pt-3 border-t border-base-100 dark:border-slate-800/60 mt-auto">
            <div class="w-9 h-9 rounded-full overflow-hidden shrink-0 ring-1 ring-base-200">
              <img
                src={item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                alt={item.customerName}
                class="w-full h-full object-cover"
              />
            </div>
            <div class="min-w-0">
              <p class="text-xs font-bold text-[var(--theme-text-primary,#0f172a)] truncate">
                {item.customerName}
              </p>
              <span class="text-3xs text-[var(--theme-text-muted,#64748b)]">Pembeli Terverifikasi</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
