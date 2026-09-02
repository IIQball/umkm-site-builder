<script lang="ts">
  import { editorStore } from '../stores/editorStore';
  import type { HeroProps, SectionStyles } from '@/types';
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
  import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-svelte';

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

<section
  id="hero-section"
  data-node="hero_container"
  class="relative w-full overflow-hidden select-none hero-card container-type-inline-size {sectionBgClass} {isActive ? 'relative z-10' : ''}"
  style="background-color: var(--theme-bg); {customBgStyle} margin-top: {marginTop}px; margin-bottom: {marginBottom}px; min-height: {styles?.minHeight || 'auto'};"
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
      <div class="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[var(--theme-primary,#2563eb)] opacity-20 blur-3xl"></div>
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
        {waNumber}
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
        {waNumber}
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
        {imageUrl}
        {waNumber}
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
        {imageUrl}
        {waNumber}
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
        {imageUrl}
        {waNumber}
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
        {waNumber}
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
        {waNumber}
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
        {imageUrl}
        {waNumber}
        {selectNode}
        {selectNodeKey}
      />
    {:else if activePreset === 'gradient_mesh_glow'}
      <div class="py-12 flex flex-col items-center text-center gap-6">
        {#if badgeText}
          <div
            data-node="badge"
            role="button"
            tabindex="0"
            on:click={(e) => selectNode(e, 'badge')}
            on:keydown={(e) => selectNodeKey(e, 'badge')}
            class="inline-flex items-center gap-1.5 px-4 h-8 rounded-full bg-blue-50 dark:bg-blue-950/50 text-[var(--theme-primary,#2563eb)] text-xs font-bold border border-blue-200 dark:border-blue-800 cursor-pointer shadow-sm"
          >
            <Sparkles size={13} />
            <span>{badgeText}</span>
          </div>
        {/if}

        <svelte:element
          this={tagName || 'h1'}
          data-node="title"
          role="button"
          tabindex="0"
          on:click={(e) => selectNode(e, 'title')}
          on:keydown={(e) => selectNodeKey(e, 'title')}
          class="font-black tracking-tight text-3xl sm:text-5xl lg:text-6xl text-[var(--theme-text-primary,#0f172a)] cursor-pointer leading-tight"
        >
          {title}
        </svelte:element>

        <p data-node="subtitle" class="text-sm sm:text-base text-[var(--theme-text-muted,#64748b)] max-w-2xl leading-relaxed">
          {subtitle}
        </p>

        <div class="w-full max-w-md p-6 rounded-2xl bg-[var(--theme-surface,#f8fafc)]/80 backdrop-blur-md border border-base-200 dark:border-slate-800 shadow-xl flex flex-col items-center gap-4">
          <div class="flex items-center gap-4 text-xs font-medium text-[var(--theme-text-muted,#64748b)]">
            <span class="flex items-center gap-1"><CheckCircle2 size={14} class="text-emerald-500" /> Kualitas Asli</span>
            <span class="flex items-center gap-1"><CheckCircle2 size={14} class="text-emerald-500" /> Siap Kirim</span>
            <span class="flex items-center gap-1"><CheckCircle2 size={14} class="text-emerald-500" /> Garansi Aman</span>
          </div>
          {#if ctaText}
            <a
              href={ctaLink}
              style="height: var(--theme-btn-height, 48px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
              class="w-full inline-flex items-center justify-center font-bold text-sm shadow-md hover:brightness-105 active:scale-95 transition-all"
            >
              <span>{ctaText}</span>
              <ArrowRight size={16} class="ml-2" />
            </a>
          {/if}
        </div>
      </div>
    {:else if activePreset === 'interactive_terminal_code'}
      <HeroTerminalCode {badgeText} {tagName} {title} {subtitle} {ctaText} {ctaLink} />
    {:else if activePreset === 'floating_cards_showcase'}
      <HeroFloatingCards {badgeText} {tagName} {title} {subtitle} {ctaText} {ctaLink} />
    {:else if activePreset === 'oversized_bold_typography'}
      <div class="py-12 flex flex-col items-center text-center gap-6">
        {#if badgeText}
          <span data-node="badge" class="px-4 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">{badgeText}</span>
        {/if}
        <svelte:element
          this={tagName || 'h1'}
          data-node="title"
          class="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tighter leading-none"
        >
          {title}
        </svelte:element>
        <p data-node="subtitle" class="text-base sm:text-xl text-[var(--theme-text-muted,#64748b)] max-w-2xl font-medium leading-relaxed">
          {subtitle}
        </p>
        {#if ctaText}
          <div data-node="cta" class="pt-4">
            <a
              href={ctaLink}
              style="height: var(--theme-btn-height, 52px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
              class="inline-flex items-center justify-center px-10 font-bold text-base shadow-xl active:scale-95 transition-transform"
            >
              <span>{ctaText}</span>
              <ArrowRight size={18} class="ml-2" />
            </a>
          </div>
        {/if}
      </div>
    {:else if activePreset === 'inline_email_capture'}
      <HeroEmailCapture {badgeText} {tagName} {title} {subtitle} {ctaText} {ctaLink} />
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

<style>
  :global(.hero-card) {
    container-type: inline-size;
    container-name: herocard;
  }

  :global(.cq-grid-split) {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  :global(.cq-grid-dual-contrast) {
    display: flex;
    flex-direction: column;
  }
  :global(.cq-title-lg) {
    font-size: 1.75rem;
    line-height: 2.125rem;
  }
  :global(.cq-btn-group) {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0.75rem;
  }
  :global(.cq-stat-container) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  :global(.cq-bento-grid) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @container herocard (min-width: 680px) {
    :global(.cq-grid-split) {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      align-items: center;
      gap: 2rem;
    }
    :global(.cq-title-lg) {
      font-size: 2.25rem;
      line-height: 2.625rem;
    }
    :global(.cq-btn-group) {
      flex-direction: row;
      width: auto;
    }
    :global(.cq-stat-container) {
      flex-direction: row;
      align-items: center;
      gap: 1.5rem;
    }
    :global(.cq-bento-grid) {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    :global(.cq-bento-span-full) {
      grid-column: span 2;
    }
  }

  @container herocard (min-width: 980px) {
    :global(.cq-title-lg) {
      font-size: 3rem;
      line-height: 3.25rem;
    }
    :global(.cq-grid-dual-contrast) {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    :global(.cq-bento-grid) {
      grid-template-columns: repeat(12, minmax(0, 1fr));
    }
    :global(.cq-bento-span-7) {
      grid-column: span 7;
    }
    :global(.cq-bento-span-5) {
      grid-column: span 5;
    }
    :global(.cq-bento-span-4) {
      grid-column: span 4;
    }
  }
</style>