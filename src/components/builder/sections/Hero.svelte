<script lang="ts">
  import type { HeroProps, SectionStyles } from '@/types';
  import { parsePadding, parsePx, getNodeStyles, resolveTokenColor } from './hero/hero.helpers';
  import HeroSplitPreset from './hero/HeroSplitPreset.svelte';
  import HeroCenteredPreset from './hero/HeroCenteredPreset.svelte';
  import HeroBannerPreset from './hero/HeroBannerPreset.svelte';
  import HeroFeaturePreset from './hero/HeroFeaturePreset.svelte';

  export let props: HeroProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'split_left_text';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'split_left_text';
  $: isFullBannerPreset = activePreset === 'full_banner_overlay' || activePreset === 'hero_card_overlap';
  $: tagName = props?.tagName || 'h1';
  $: title = props?.title || 'Selamat datang di toko kami';
  $: subtitle = props?.subtitle || 'Produk berkualitas dengan harga terjangkau';
  $: imageUrl = props?.imageUrl || 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1200&q=80';
  $: ctaText = props?.ctaText || 'Lihat Katalog';
  $: ctaLink = props?.ctaLink || '#products';
  $: activeStoreWaNumber = (props?.whatsappNumber as string) || (props?.waNumber as string) || '628123456789';
  $: resolvedCtaLink = ctaLink === '#whatsapp' || ctaLink === 'whatsapp' || ctaLink.startsWith('wa:')
    ? `https://wa.me/${activeStoreWaNumber.replace(/[^0-9]/g, '')}`
    : ctaLink;
  $: badgeText = props?.badgeText || 'Promo Spesial UMKM';

  $: parsedPadding = parsePadding(styles, isFullBannerPreset);
  $: paddingTop = parsedPadding.top;
  $: paddingBottom = parsedPadding.bottom;
  $: marginTop = parsePx(styles?.marginTop, 0);
  $: marginBottom = parsePx(styles?.marginBottom, 0);

  $: customBgColor = styles?.bgColorToken ? resolveTokenColor(styles.bgColorToken) : styles?.backgroundColor;
  $: customBgStyle = customBgColor ? `background-color: ${customBgColor};` : '';
  $: minHeightStyle = styles?.minHeight ? `min-height: ${styles.minHeight};` : 'min-height: 520px;';

  $: getNodeStyleStr = (nodeName: string) => getNodeStyles(props?.nodeStyles, nodeName);
</script>

<section
  class="relative w-full transition-all overflow-hidden flex items-center {isActive ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-base-100' : ''}"
  style="{minHeightStyle} {customBgStyle} padding-top: {paddingTop}px; padding-bottom: {paddingBottom}px; margin-top: {marginTop}px; margin-bottom: {marginBottom}px;"
>
  <!-- Background Image for Banner Overlay presets -->
  {#if isFullBannerPreset}
    <div class="absolute inset-0 z-0">
      <img src={imageUrl} alt="Background" class="w-full h-full object-cover" />
      <div
        class="absolute inset-0"
        style:background="linear-gradient(to bottom, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85))"
      ></div>
    </div>
  {/if}

  <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl w-full">
    {#if activePreset === 'split_left_text' || activePreset === 'split_right_text' || activePreset === 'split_multi_badges'}
      <HeroSplitPreset
        {sectionId}
        {activePreset}
        {tagName}
        {title}
        {subtitle}
        {imageUrl}
        {ctaText}
        {resolvedCtaLink}
        {badgeText}
        {getNodeStyleStr}
      />
    {:else if activePreset === 'centered_minimal'}
      <HeroCenteredPreset
        {sectionId}
        {tagName}
        {title}
        {subtitle}
        {imageUrl}
        {ctaText}
        {resolvedCtaLink}
        {badgeText}
        {getNodeStyleStr}
      />
    {:else if activePreset === 'full_banner_overlay' || activePreset === 'hero_card_overlap'}
      <HeroBannerPreset
        {sectionId}
        {activePreset}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {resolvedCtaLink}
        {badgeText}
        {getNodeStyleStr}
      />
    {:else if activePreset === 'hero_triple_highlights' || activePreset === 'hero_search_focused'}
      <HeroFeaturePreset
        {sectionId}
        {activePreset}
        {tagName}
        {title}
        {subtitle}
        {imageUrl}
        {ctaText}
        {resolvedCtaLink}
        {badgeText}
        {getNodeStyleStr}
      />
    {:else}
      <HeroSplitPreset
        {sectionId}
        activePreset="split_left_text"
        {tagName}
        {title}
        {subtitle}
        {imageUrl}
        {ctaText}
        {resolvedCtaLink}
        {badgeText}
        {getNodeStyleStr}
      />
    {/if}
  </div>
</section>