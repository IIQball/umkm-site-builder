<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import type { SectionStyles } from '@/types';
  import HeaderAnnouncement from './HeaderAnnouncement.svelte';
  import Hero from './Hero.svelte';
  import Features from './Features.svelte';
  import ProductCatalog from './ProductCatalog.svelte';
  import Testimonials from './Testimonials.svelte';
  import FAQ from './FAQ.svelte';
  import GoogleMaps from './GoogleMaps.svelte';
  import Footer from './Footer.svelte';

  export let section: TemplateSection;
  export let isActive: boolean = false;
  export let storeId: string | null = null;

  const isDarkColor = (color?: unknown): boolean => {
    if (typeof color !== 'string' || !color || color === 'transparent') return false;
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16) || 0;
      const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16) || 0;
      const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16) || 0;
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness < 128;
    }
    return false;
  };

  const buildStyle = (styles: SectionStyles = {}): string => {
    const s = styles || {};
    const rules: string[] = [];
    const defaultTextColor = isDarkColor(s.backgroundColor || '#ffffff') ? '#f8fafc' : '#0f172a';

    const defaultPadding = section?.type === 'header_announcement' ? '0px' : '48px 24px';
    rules.push(`background-color: ${s.backgroundColor || 'transparent'}`);
    rules.push(`color: ${s.color || defaultTextColor}`);
    rules.push(`padding: ${s.padding || defaultPadding}`);
    rules.push(`text-align: ${s.textAlign || 'center'}`);
    rules.push(`border-radius: ${s.borderRadius || '0px'}`);
    if (s.fontFamily) rules.push(`font-family: ${s.fontFamily}`);

    if (s.marginTop) rules.push(`margin-top: ${s.marginTop}`);
    if (s.marginBottom) rules.push(`margin-bottom: ${s.marginBottom}`);
    if (s.paddingTop) rules.push(`padding-top: ${s.paddingTop}`);
    if (s.paddingBottom) rules.push(`padding-bottom: ${s.paddingBottom}`);
    if (s.fontSize) rules.push(`font-size: ${s.fontSize}`);
    if (s.fontWeight) rules.push(`font-weight: ${s.fontWeight}`);
    if (s.display) rules.push(`display: ${s.display}`);
    if (s.alignItems) rules.push(`align-items: ${s.alignItems}`);
    if (s.justifyContent) rules.push(`justify-content: ${s.justifyContent}`);
    if (s.gap) rules.push(`gap: ${s.gap}`);
    if (s.margin) rules.push(`margin: ${s.margin}`);
    if (s.maxWidth) rules.push(`max-width: ${s.maxWidth}`);

    // Entrance Animation
    if (s.animation && s.animation !== 'none') {
      const dur = s.animationDuration || '600ms';
      const del = s.animationDelay || '0ms';
      rules.push(`animation: ${s.animation} ${dur} cubic-bezier(0.16, 1, 0.3, 1) ${del} both`);
    }

    return rules.join('; ');
  };

  $: inlineStyle = buildStyle(section?.styles);
  $: containerWidthMode = section?.styles?.containerWidth || 'boxed';
  $: containerClass = containerWidthMode === 'full'
    ? 'w-full max-w-full px-3.5 sm:px-6 md:px-8'
    : 'mx-auto w-full max-w-full px-3.5 sm:px-6 md:px-8';
  $: containerStyle = containerWidthMode === 'full'
    ? ''
    : 'max-width: var(--theme-max-width, 1200px);';
</script>

<section
  id={section.id}
  style={inlineStyle}
  class="relative transition-all box-border w-full max-w-full overflow-x-hidden min-w-0 font-[family-name:var(--theme-font-body)]"
>
  {#if section.type === 'header_announcement'}
    <HeaderAnnouncement props={section.props || {}} styles={section.styles || {}} sectionId={section.id} {isActive} layoutPreset={section.layoutPreset} />
  {:else}
    <div class={`${containerClass} min-w-0 box-border`} style={containerStyle}>
      {#if section.type === 'hero'}
        <Hero props={section.props || {}} styles={section.styles || {}} sectionId={section.id} {isActive} layoutPreset={section.layoutPreset} />
      {:else if section.type === 'features'}
        <Features props={section.props || {}} styles={section.styles || {}} sectionId={section.id} {isActive} layoutPreset={section.layoutPreset} />
      {:else if section.type === 'product_catalog'}
        <ProductCatalog props={{...(section.props || {}), storeId: storeId || (typeof section.props?.storeId === 'string' ? section.props.storeId : undefined)}} styles={section.styles || {}} sectionId={section.id} {isActive} layoutPreset={section.layoutPreset} />
      {:else if section.type === 'testimonials'}
        <Testimonials props={section.props || {}} styles={section.styles || {}} sectionId={section.id} {isActive} layoutPreset={section.layoutPreset} />
      {:else if section.type === 'faq'}
        <FAQ props={section.props || {}} styles={section.styles || {}} sectionId={section.id} {isActive} layoutPreset={section.layoutPreset} />
      {:else if section.type === 'google_maps'}
        <GoogleMaps props={section.props || {}} styles={section.styles || {}} sectionId={section.id} {isActive} layoutPreset={section.layoutPreset} />
      {:else if section.type === 'footer'}
        <Footer props={section.props || {}} styles={section.styles || {}} layoutPreset={section.layoutPreset} />
      {/if}
    </div>
  {/if}
</section>

<style>
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideLeft {
    from { opacity: 0; transform: translateX(24px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes slideRight {
    from { opacity: 0; transform: translateX(-24px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes zoomIn {
    from { opacity: 0; transform: scale(0.94); }
    to { opacity: 1; transform: scale(1); }
  }

  :global(.animate-fade-in) {
    animation: fadeIn 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  :global(.animate-slide-up) {
    animation: slideUp 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  :global(.animate-zoom-in) {
    animation: zoomIn 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }
</style>
