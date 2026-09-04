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

  export let props: TestimonialsProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
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
</script>

<div
  data-node="testimonials_container"
  class="testi-card w-full box-border py-12"
  style="container-type: inline-size; container-name: testicard;"
>
  <TestimonialsHeader
    {sectionId}
    {title}
    {subtitle}
    {badgeText}
    align="center"
  />

  {#if activePreset === 'single_spotlight'}
    <TestimonialsSpotlight {sectionId} {testimonials} />
  {:else if activePreset === 'chat_bubble_flow'}
    <TestimonialsChatBubble {sectionId} {testimonials} />
  {:else if activePreset === 'infinite_marquee_scroll'}
    <TestimonialsMarquee {sectionId} {testimonials} />
  {:else if activePreset === 'video_review_cards'}
    <TestimonialsVideoCards {sectionId} {testimonials} />
  {:else if activePreset === 'social_post_cards'}
    <TestimonialsSocialCards {sectionId} {testimonials} />
  {:else if activePreset === 'side_by_side_3_cards'}
    <TestimonialsSideBySide {sectionId} {testimonials} />
  {:else if activePreset === 'logo_client_cloud'}
    <TestimonialsLogoCloud {sectionId} {logos} />
  {:else if activePreset === 'split_rating_stats'}
    <TestimonialsSplitStats {sectionId} {testimonials} />
  {:else if activePreset === 'carousel_slider'}
    <TestimonialsCarouselSlider {sectionId} {testimonials} />
  {:else}
    <!-- Default: masonry_grid -->
    <TestimonialsMasonryGrid {sectionId} {testimonials} />
  {/if}
</div>
