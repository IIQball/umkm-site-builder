<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import HeaderContent from './content/HeaderContent.svelte';
  import HeroContent from './content/HeroContent.svelte';
  import FeaturesContent from './content/FeaturesContent.svelte';
  import ProductCatalogContent from './content/ProductCatalogContent.svelte';
  import TestimonialsContent from './content/TestimonialsContent.svelte';
  import FaqContent from './content/FaqContent.svelte';
  import GoogleMapsContent from './content/GoogleMapsContent.svelte';
  import FooterContent from './content/FooterContent.svelte';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;
</script>

<div class="p-4 space-y-4 text-xs">
  {#if section.type === 'header_announcement'}
    <HeaderContent {section} {onUpdate} />
  {:else if section.type === 'hero'}
    <HeroContent {section} {onUpdate} />
  {:else if section.type === 'features'}
    <FeaturesContent {section} {onUpdate} />
  {:else if section.type === 'product_catalog'}
    <ProductCatalogContent {section} {onUpdate} />
  {:else if section.type === 'testimonials'}
    <TestimonialsContent {section} {onUpdate} />
  {:else if section.type === 'faq'}
    <FaqContent {section} {onUpdate} />
  {:else if section.type === 'google_maps'}
    <GoogleMapsContent {section} />
  {:else if section.type === 'footer'}
    <FooterContent {section} {onUpdate} />
  {/if}
</div>
