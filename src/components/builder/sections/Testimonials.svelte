<script lang="ts">
  import type { TestimonialsProps, SectionStyles, TestimonialItem } from '@/types';
  import TestimonialsGridPreset from './testimonials/TestimonialsGridPreset.svelte';
  import TestimonialsSpecialPreset from './testimonials/TestimonialsSpecialPreset.svelte';

  export let props: TestimonialsProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'masonry_grid';

  void sectionId;
  void isActive;

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
</script>

<section
  class="relative w-full py-12 transition-all {isActive ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-base-100' : ''}"
  style:background-color="var(--theme-bg)"
>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
    <!-- Header -->
    <div class="mb-10 text-center max-w-2xl mx-auto">
      {#if props.badge}
        <span class="inline-block px-3 py-1 mb-2 text-xs font-bold uppercase tracking-wider rounded-full bg-primary/10 text-primary">
          {props.badge}
        </span>
      {/if}
      <h2 class="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
        {props.title || 'Kata Pelanggan Kami'}
      </h2>
      {#if props.subtitle}
        <p class="mt-2 text-sm text-base-content/60">{props.subtitle}</p>
      {/if}
    </div>

    <!-- Presets -->
    {#if activePreset === 'single_spotlight' || activePreset === 'chat_bubble_flow' || activePreset === 'testimonial_marquee_slider' || activePreset === 'statistics_with_review'}
      <TestimonialsSpecialPreset {testimonials} {activePreset} />
    {:else}
      <TestimonialsGridPreset {testimonials} {activePreset} />
    {/if}
  </div>
</section>
