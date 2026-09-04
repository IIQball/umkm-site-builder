<script lang="ts">
  import { editorStore, activeNodeId } from '../stores/editorStore';
  import type { HeroProps, SectionStyles } from '@/types';
  import { parsePx } from './hero/hero.helpers';
  import HeroFullBanner from './hero/HeroFullBanner.svelte';
  import HeroCenteredMinimal from './hero/HeroCenteredMinimal.svelte';
  import HeroSplitLayout from './hero/HeroSplitLayout.svelte';
  import HeroTerminalCode from './hero/HeroTerminalCode.svelte';
  import HeroFloatingCards from './hero/HeroFloatingCards.svelte';
  import HeroEmailCapture from './hero/HeroEmailCapture.svelte';
  import HeroSocialProof from './hero/HeroSocialProof.svelte';
  import HeroDualProduct from './hero/HeroDualProduct.svelte';
  import HeroBadgeTicker from './hero/HeroBadgeTicker.svelte';
  import HeroPillCategory from './hero/HeroPillCategory.svelte';
  import HeroBentoGrid from './hero/HeroBentoGrid.svelte';
  import HeroStatCounter from './hero/HeroStatCounter.svelte';
  import HeroChatSimulation from './hero/HeroChatSimulation.svelte';
  import HeroStickerPlayful from './hero/HeroStickerPlayful.svelte';
  import HeroEditorialSerif from './hero/HeroEditorialSerif.svelte';
  import HeroSideBooking from './hero/HeroSideBooking.svelte';
  import HeroDualContrast from './hero/HeroDualContrast.svelte';
  import HeroFounderStory from './hero/HeroFounderStory.svelte';
  import HeroGradientMesh from './hero/HeroGradientMesh.svelte';
  import HeroOversizedTypography from './hero/HeroOversizedTypography.svelte';
  import './hero/hero.css';

  export let props: HeroProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'split_left_text';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'split_left_text';
  $: isFullBannerPreset = activePreset === 'full_banner_overlay' || activePreset === 'video_background_loop';
  $: tagName = props?.tagName || 'h1';
  $: title = props?.title || 'Selamat datang di toko kami';
  $: subtitle = props?.subtitle || 'Produk berkualitas dengan harga terjangkau dan pelayanan terpercaya.';
  $: imageUrl = props?.imageUrl || 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1200&q=80';
  $: heroBgImage = imageUrl;
  $: videoUrl = (props?.videoUrl as string) || 'https://assets.mixkit.co/videos/preview/mixkit-shopping-in-a-clothing-store-42581-large.mp4';
  $: ctaText = props?.ctaText || 'Lihat Katalog';
  $: ctaLink = props?.ctaLink || '#products';
  $: secondaryCtaText = (props?.secondaryCtaText as string) || '';
  $: secondaryCtaLink = (props?.secondaryCtaLink as string) || '#';
  $: badgeText = props?.badgeText || 'Promo Spesial UMKM';
  $: waNumber = (props?.whatsappNumber as string) || (props?.waNumber as string) || '';

  $: parsedPadding = (() => {
    if (styles?.paddingTop || styles?.paddingBottom) {
      const top = parseInt(String(styles?.paddingTop || '0'), 10) || 0;
      const bottom = parseInt(String(styles?.paddingBottom || '0'), 10) || 0;
      return { top, bottom };
    }
    if (styles?.padding) {
      const parts = styles.padding.trim().split(/\s+/).map((p) => parseInt(p, 10) || 0);
      const top = parts[0] || (isFullBannerPreset ? 64 : 48);
      const bottom = parts.length > 2 ? (parts[2] || top) : top;
      return { top, bottom };
    }
    return {
      top: isFullBannerPreset ? 64 : 48,
      bottom: isFullBannerPreset ? 64 : 48,
    };
  })();

  $: paddingTop = parsedPadding.top;
  $: paddingBottom = parsedPadding.bottom;
  $: marginTop = parsePx(styles?.marginTop, 0);
  $: marginBottom = parsePx(styles?.marginBottom, 0);

  $: customBgColor = styles?.bgColorToken
    ? `var(--theme-${styles.bgColorToken === 'textPrimary' ? 'text-primary' : styles.bgColorToken === 'textMuted' ? 'text-muted' : styles.bgColorToken})`
    : styles?.backgroundColor;
  $: customBgStyle = customBgColor ? `background-color: ${customBgColor};` : '';
  $: sectionBgClass = isFullBannerPreset ? 'bg-slate-950 text-white' : 'text-[var(--color-text-main,#0f172a)]';

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

<section
  id="hero-section"
  data-node="hero_container"
  class="relative w-full overflow-hidden select-none hero-card {sectionBgClass} {isActive ? 'relative z-10' : ''}"
  style="background-color: var(--color-bg-base, #ffffff); {customBgStyle} margin-top: {marginTop}px; margin-bottom: {marginBottom}px; min-height: {styles?.minHeight || 'auto'}; container-type: inline-size; container-name: herocard;"
>
  {#if activePreset === 'full_banner_overlay' && heroBgImage}
    <div class="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
      <img
        src={heroBgImage}
        alt="Hero Background"
        class="w-full h-full object-cover select-none"
      />
      <div class="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
    </div>
  {:else if activePreset === 'video_background_loop'}
    <div class="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
      <video
        src={videoUrl}
        autoplay
        loop
        muted
        playsinline
        class="w-full h-full object-cover select-none"
      ></video>
      <div class="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
    </div>
  {:else if activePreset === 'gradient_mesh_glow'}
    <div class="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[var(--color-primary,#2563eb)] opacity-20 blur-3xl"></div>
      <div class="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-purple-600 opacity-20 blur-3xl"></div>
    </div>
  {/if}

  <div
    class="relative z-10 w-full max-w-[var(--theme-max-width,1200px)] mx-auto builder-safe-container box-border"
    style="padding-left: var(--active-safe-zone, var(--active-margin, 32px)); padding-right: var(--active-safe-zone, var(--active-margin, 32px)); padding-top: {paddingTop}px; padding-bottom: {paddingBottom}px;"
  >
    {#if activePreset === 'full_banner_overlay' || activePreset === 'video_background_loop'}
      <HeroFullBanner
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        {waNumber}
        activeNodeId={$activeNodeId}
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
        {secondaryCtaText}
        {secondaryCtaLink}
        {waNumber}
        {imageUrl}
        activeNodeId={$activeNodeId}
        {selectNode}
        {selectNodeKey}
      />
    {:else if activePreset === 'social_proof_community'}
      <HeroSocialProof
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        {secondaryCtaText}
        {secondaryCtaLink}
        {waNumber}
        activeNodeId={$activeNodeId}
        {selectNode}
        {selectNodeKey}
      />
    {:else if activePreset === 'dual_product_showcase'}
      <HeroDualProduct
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        {secondaryCtaText}
        {secondaryCtaLink}
        {waNumber}
        activeNodeId={$activeNodeId}
        {selectNode}
        {selectNodeKey}
      />
    {:else if activePreset === 'badge_ticker_split'}
      <HeroBadgeTicker
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        {secondaryCtaText}
        {secondaryCtaLink}
        {imageUrl}
        {waNumber}
        activeNodeId={$activeNodeId}
        {selectNode}
        {selectNodeKey}
      />
    {:else if activePreset === 'pill_category_selector'}
      <HeroPillCategory
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {imageUrl}
        activeNodeId={$activeNodeId}
        {selectNode}
        {selectNodeKey}
      />
    {:else if activePreset === 'bento_masonry_hero'}
      <HeroBentoGrid
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        {secondaryCtaText}
        {secondaryCtaLink}
        {imageUrl}
        {waNumber}
        activeNodeId={$activeNodeId}
        {selectNode}
        {selectNodeKey}
      />
    {:else if activePreset === 'split_stat_counter'}
      <HeroStatCounter
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        {secondaryCtaText}
        {secondaryCtaLink}
        {imageUrl}
        {waNumber}
        activeNodeId={$activeNodeId}
        {selectNode}
        {selectNodeKey}
      />
    {:else if activePreset === 'sticky_whatsapp_pill_float'}
      <HeroChatSimulation
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        {secondaryCtaText}
        {secondaryCtaLink}
        {waNumber}
        activeNodeId={$activeNodeId}
        {selectNode}
        {selectNodeKey}
      />
    {:else if activePreset === 'sticker_badge_playful'}
      <HeroStickerPlayful
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        {imageUrl}
        {waNumber}
        activeNodeId={$activeNodeId}
        {selectNode}
        {selectNodeKey}
      />
    {:else if activePreset === 'editorial_luxury_serif'}
      <HeroEditorialSerif
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        {imageUrl}
        {waNumber}
        {selectNode}
        {selectNodeKey}
      />
    {:else if activePreset === 'side_card_booking'}
      <HeroSideBooking
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {waNumber}
        activeNodeId={$activeNodeId}
        {selectNode}
        {selectNodeKey}
      />
    {:else if activePreset === 'dual_contrast_split'}
      <HeroDualContrast
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        {secondaryCtaText}
        {secondaryCtaLink}
        {waNumber}
        activeNodeId={$activeNodeId}
        {selectNode}
        {selectNodeKey}
      />
    {:else if activePreset === 'brand_story_founder'}
      <HeroFounderStory
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        {secondaryCtaText}
        {secondaryCtaLink}
        {imageUrl}
        {waNumber}
        activeNodeId={$activeNodeId}
        {selectNode}
        {selectNodeKey}
      />
    {:else if activePreset === 'gradient_mesh_glow'}
      <HeroGradientMesh
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        activeNodeId={$activeNodeId}
        {selectNode}
        {selectNodeKey}
      />
    {:else if activePreset === 'interactive_terminal_code'}
      <HeroTerminalCode
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        {secondaryCtaText}
        {secondaryCtaLink}
        {waNumber}
        activeNodeId={$activeNodeId}
        {selectNode}
        {selectNodeKey}
      />
    {:else if activePreset === 'floating_cards_showcase'}
      <HeroFloatingCards
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        {secondaryCtaText}
        {secondaryCtaLink}
        {waNumber}
        activeNodeId={$activeNodeId}
        {selectNode}
        {selectNodeKey}
      />
    {:else if activePreset === 'oversized_bold_typography'}
      <HeroOversizedTypography
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        activeNodeId={$activeNodeId}
        {selectNode}
        {selectNodeKey}
      />
    {:else if activePreset === 'inline_email_capture'}
      <HeroEmailCapture
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        activeNodeId={$activeNodeId}
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
        {secondaryCtaText}
        {secondaryCtaLink}
        {imageUrl}
        {waNumber}
        activeNodeId={$activeNodeId}
        {selectNode}
        {selectNodeKey}
      />
    {/if}
  </div>
</section>