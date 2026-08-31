<script lang="ts">
  import { editorStore } from '../stores/editorStore';
  import type { HeroProps, SectionStyles } from '@/types';
  import HeroFullBanner from './hero/HeroFullBanner.svelte';
  import HeroCenteredMinimal from './hero/HeroCenteredMinimal.svelte';
  import HeroSplitLayout from './hero/HeroSplitLayout.svelte';

  export let props: HeroProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'split_left_text';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'split_left_text';
  $: isFullBannerPreset = activePreset === 'full_banner_overlay';
  $: tagName = props?.tagName || 'h1';
  $: title = props?.title || 'Selamat datang di toko kami';
  $: subtitle = props?.subtitle || 'Produk berkualitas dengan harga terjangkau';
  $: imageUrl = props?.imageUrl || 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1200&q=80';
  $: heroBgImage = imageUrl;
  $: ctaText = props?.ctaText || 'Lihat Katalog';
  $: ctaLink = props?.ctaLink || '#products';
  $: badgeText = props?.badgeText || 'Promo Spesial UMKM';

  $: parsedPadding = (() => {
    if (styles?.paddingTop || styles?.paddingBottom) {
      const top = parseInt(String(styles?.paddingTop || '0'), 10) || 0;
      const bottom = parseInt(String(styles?.paddingBottom || '0'), 10) || 0;
      return { top, bottom };
    }
    if (styles?.padding) {
      const parts = styles.padding.trim().split(/\s+/).map((p) => parseInt(p, 10) || 0);
      const top = parts[0] || (activePreset === 'full_banner_overlay' ? 48 : 0);
      const bottom = parts.length > 2 ? (parts[2] || top) : top;
      return { top, bottom };
    }
    return {
      top: activePreset === 'full_banner_overlay' ? 48 : 0,
      bottom: activePreset === 'full_banner_overlay' ? 48 : 0,
    };
  })();

  $: paddingTop = parsedPadding.top;
  $: paddingBottom = parsedPadding.bottom;

  $: parsePx = (val: unknown, fallback: number = 0): number => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') return parseInt(val, 10) || fallback;
    return fallback;
  };

  $: marginTop = parsePx(styles?.marginTop, 0);
  $: marginBottom = parsePx(styles?.marginBottom, 0);

  $: customBgColor = styles?.bgColorToken
    ? `var(--theme-${styles.bgColorToken === 'textPrimary' ? 'text-primary' : styles.bgColorToken === 'textMuted' ? 'text-muted' : styles.bgColorToken})`
    : styles?.backgroundColor;
  $: customBgStyle = customBgColor ? `background-color: ${customBgColor};` : '';
  $: sectionBgClass = isFullBannerPreset ? 'bg-slate-950 text-white' : 'text-[var(--theme-text-primary,#0f172a)]';

  const selectNode = (e: MouseEvent, key: string) => {
    e.stopPropagation();
    editorStore.selectSection(sectionId);
    editorStore.selectNode(sectionId, key);
  };

  const selectNodeKey = (e: KeyboardEvent, key: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
      editorStore.selectSection(sectionId);
      editorStore.selectNode(sectionId, key);
    }
  };
</script>

<!-- Outer Section Container (100% Bleed) -->
<section
  id="hero-section"
  data-node="hero_container"
  class="relative w-full overflow-hidden select-none {sectionBgClass} {isActive ? 'relative z-10' : ''}"
  style="background-color: var(--theme-bg); {customBgStyle} margin-top: {marginTop}px; margin-bottom: {marginBottom}px; min-height: {styles?.minHeight || 'auto'};"
>
  {#if isFullBannerPreset && heroBgImage}
    <div class="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
      <img
        src={heroBgImage}
        alt="Hero Background"
        class="w-full h-full object-cover select-none"
      />
      <div class="absolute inset-0 bg-black/40"></div>
    </div>
  {/if}

  <!-- Inner Safe-Zone Content Container -->
  <div
    class="hero-inner-safe-zone relative z-10 mx-auto w-full box-border"
    style="
      padding-left: var(--active-safe-zone, 32px);
      padding-right: var(--active-safe-zone, 32px);
      padding-top: {paddingTop}px;
      padding-bottom: {paddingBottom}px;
      {styles?.paddingLeft && styles.paddingLeft !== '0px' ? `padding-left: ${styles.paddingLeft};` : ''}
      {styles?.paddingRight && styles.paddingRight !== '0px' ? `padding-right: ${styles.paddingRight};` : ''}
    "
  >
    {#if activePreset === 'full_banner_overlay'}
      <HeroFullBanner
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        {selectNode}
        {selectNodeKey}
      />
    {:else if activePreset === 'centered_minimal'}
      <HeroCenteredMinimal
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        {imageUrl}
        {selectNode}
        {selectNodeKey}
      />
    {:else}
      <HeroSplitLayout
        isImageLeft={activePreset === 'split_right_text'}
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        {imageUrl}
        {selectNode}
        {selectNodeKey}
      />
    {/if}
  </div>
</section>