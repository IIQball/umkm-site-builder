<script lang="ts">
  import type { TestimonialsProps, SectionStyles, TestimonialItem } from '@/types';
  import './testimonials/testimonials.css';
  import { DEFAULT_TESTIMONIALS, DEFAULT_CLIENT_LOGOS } from './testimonials/testimonials.helpers';
  import TestimonialsHeader from './testimonials/TestimonialsHeader.svelte';
  import TestimonialsMasonryGrid from './testimonials/TestimonialsMasonryGrid.svelte';
  import TestimonialsSpotlight from './testimonials/TestimonialsSpotlight.svelte';
  import TestimonialsChatBubble from './testimonials/TestimonialsChatBubble.svelte';
  import TestimonialsMarquee from './testimonials/TestimonialsMarquee.svelte';
  import TestimonialsVideoCards from './testimonials/TestimonialsVideoCards.svelte';
  import TestimonialsSocialCards from './testimonials/TestimonialsSocialCards.svelte';
  import TestimonialsSideBySide from './testimonials/TestimonialsSideBySide.svelte';
  import TestimonialsLogoCloud from './testimonials/TestimonialsLogoCloud.svelte';
  import TestimonialsSplitStats from './testimonials/TestimonialsSplitStats.svelte';
  import TestimonialsCarouselSlider from './testimonials/TestimonialsCarouselSlider.svelte';

  import {
    getEffectiveTestimonialsElementOrder,
  } from './testimonials/testimonialsLayout.helpers';

  export let props: TestimonialsProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'masonry_grid';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'masonry_grid';

  // Dual-mode data: Live Tenant DB vs Designer Manual props vs Fallback Mock data
  $: testimonials = (Array.isArray(props?.testimonials) && props.testimonials.length > 0
    ? props.testimonials
    : DEFAULT_TESTIMONIALS) as TestimonialItem[];

  $: title = (props?.title as string) || (props?.heading as string) || 'Kata Mereka yang Sudah Mencoba';
  $: subtitle = (props?.subtitle as string) || 'Kepuasan rasa dan kualitas produk adalah prioritas utama kami.';
  $: badgeText = (props?.badgeText as string) || 'Ulasan Pembeli';
  $: logos = ((props?.logos as any) || DEFAULT_CLIENT_LOGOS);
  $: nodeStyles = (props?.nodeStyles || {}) as Record<string, Record<string, string>>;
  $: effectiveOrder = getEffectiveTestimonialsElementOrder(
    activePreset,
    props?.elementOrder,
    testimonials,
    props?.testimonialsPreset as string
  );

  const getSlotOrder = (slot: string) => {
    const idx = effectiveOrder.indexOf(slot);
    return idx === -1 ? 99 : idx;
  };

  $: headerMinOrder = Math.min(
    getSlotOrder('badge'),
    getSlotOrder('title'),
    getSlotOrder('subtitle')
  );
  $: gridOrder = Math.min(
    getSlotOrder('testimonials_grid'),
    getSlotOrder('testi_item_0'),
    getSlotOrder('testi_stats'),
    getSlotOrder('testi_slider_track'),
    getSlotOrder('testi_logo_cloud')
  );
</script>

<div
  data-node="testimonials_container"
  class="testi-card w-full box-border py-12 flex flex-col"
  style="container-type: inline-size; container-name: testicard;"
>
  <div style="order: {headerMinOrder};" class="w-full">
    <TestimonialsHeader
      {sectionId}
      {title}
      {subtitle}
      {badgeText}
      align="center"
      elementOrder={effectiveOrder}
      {nodeStyles}
      {isActive}
    />
  </div>

  <div style="order: {gridOrder};" class="w-full">
    {#if activePreset === 'single_spotlight'}
      <TestimonialsSpotlight {sectionId} {testimonials} {nodeStyles} />
    {:else if activePreset === 'chat_bubble_flow'}
      <TestimonialsChatBubble {sectionId} {testimonials} {nodeStyles} />
    {:else if activePreset === 'infinite_marquee_scroll'}
      <TestimonialsMarquee {sectionId} {testimonials} {nodeStyles} />
    {:else if activePreset === 'video_review_cards'}
      <TestimonialsVideoCards {sectionId} {testimonials} {nodeStyles} />
    {:else if activePreset === 'social_post_cards'}
      <TestimonialsSocialCards {sectionId} {testimonials} {nodeStyles} />
    {:else if activePreset === 'side_by_side_3_cards'}
      <TestimonialsSideBySide {sectionId} {testimonials} {nodeStyles} />
    {:else if activePreset === 'logo_client_cloud'}
      <TestimonialsLogoCloud {sectionId} {logos} {nodeStyles} />
    {:else if activePreset === 'split_rating_stats'}
      <TestimonialsSplitStats {sectionId} {testimonials} {nodeStyles} />
    {:else if activePreset === 'carousel_slider'}
      <TestimonialsCarouselSlider {sectionId} {testimonials} {nodeStyles} />
    {:else}
      <!-- Default: masonry_grid -->
      <TestimonialsMasonryGrid {sectionId} {testimonials} {nodeStyles} />
    {/if}
  </div>
</div>
