<script lang="ts">
  import { editorStore } from '../stores/editorStore';
  import type { HeroProps, SectionStyles } from '@/types';
  import { ShoppingBag } from 'lucide-svelte';

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

<!-- 1. Outer Section Container (Selalu Full Width / 100% Bleed) -->
<section
  id="hero-section"
  data-node="hero_container"
  class="relative w-full overflow-hidden select-none {sectionBgClass} {isActive ? 'relative z-10' : ''}"
  style="background-color: var(--theme-bg); {customBgStyle} margin-top: {marginTop}px; margin-bottom: {marginBottom}px; min-height: {styles?.minHeight || 'auto'};"
>
  <!-- Background Image & Overlay (Wajib 100% Full Width tanpa Margin) -->
  {#if isFullBannerPreset && heroBgImage}
    <div class="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
      <img
        src={heroBgImage}
        alt="Hero Background"
        class="w-full h-full object-cover select-none"
      />
      <!-- Dark Overlay agar teks kontras -->
      <div class="absolute inset-0 bg-black/40"></div>
    </div>
  {/if}

  <!-- 2. Inner Safe-Zone Content Container (Membatasi konten di dalam grid & margin) -->
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
    <!-- Slot Layout Konten (Split Grid / Centered / Text Box) -->
    {#if activePreset === 'full_banner_overlay'}
      <!-- Preset 4: Full Banner Overlay Content -->
      <div class="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center gap-4 text-white">
        {#if badgeText}
          <div
            data-node="badge"
            role="button"
            tabindex="0"
            on:click={(e) => selectNode(e, 'badge')}
            on:keydown={(e) => selectNodeKey(e, 'badge')}
            class="inline-flex items-center gap-1.5 px-4 h-8 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/30 cursor-pointer shadow-sm"
          >
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
          class="font-black tracking-tight leading-tight text-3xl sm:text-5xl drop-shadow-md cursor-pointer"
        >
          {title}
        </svelte:element>

        <div
          data-node="subtitle"
          role="button"
          tabindex="0"
          on:click={(e) => selectNode(e, 'subtitle')}
          on:keydown={(e) => selectNodeKey(e, 'subtitle')}
          class="cursor-pointer"
        >
          <p class="text-sm sm:text-lg text-slate-100 max-w-xl leading-relaxed drop-shadow">
            {subtitle}
          </p>
        </div>

        {#if ctaText}
          <div data-node="cta" class="mt-2">
            <a
              href={ctaLink}
              style="height: var(--theme-btn-height, 48px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
              class="inline-flex items-center justify-center px-8 font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-transform"
            >
              <ShoppingBag size={18} class="mr-2" />
              <span>{ctaText}</span>
            </a>
          </div>
        {/if}
      </div>

    {:else if activePreset === 'centered_minimal'}
      <!-- Preset 3: Centered Minimal -->
      <div class="w-full flex flex-col items-center text-center gap-6">
        {#if badgeText}
          <div
            data-node="badge"
            role="button"
            tabindex="0"
            on:click={(e) => selectNode(e, 'badge')}
            on:keydown={(e) => selectNodeKey(e, 'badge')}
            class="inline-flex items-center gap-1.5 px-4 h-8 rounded-full bg-blue-50 text-[var(--theme-primary,#2563eb)] text-xs font-bold border border-blue-200 cursor-pointer shadow-sm"
          >
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
          class="font-black tracking-tight leading-tight text-3xl sm:text-5xl text-[var(--theme-text-primary,#0f172a)] max-w-3xl cursor-pointer"
        >
          {title}
        </svelte:element>

        <div
          data-node="subtitle"
          role="button"
          tabindex="0"
          on:click={(e) => selectNode(e, 'subtitle')}
          on:keydown={(e) => selectNodeKey(e, 'subtitle')}
          class="cursor-pointer"
        >
          <p class="text-sm sm:text-base text-[var(--theme-text-muted,#64748b)] max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {#if ctaText}
          <div data-node="cta">
            <a
              href={ctaLink}
              style="height: var(--theme-btn-height, 48px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
              class="inline-flex items-center justify-center px-8 font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-transform"
            >
              <ShoppingBag size={18} class="mr-2" />
              <span>{ctaText}</span>
            </a>
          </div>
        {/if}

        <!-- Showcase Gambar 16:9 dengan Concentric Nested Radius (Outer 16px, Padding 8px, Inner 8px) -->
        {#if imageUrl}
          <div data-node="image" class="w-full max-w-4xl mt-4 p-2 rounded-2xl bg-base-200/60 dark:bg-slate-800/60 border border-base-300 dark:border-slate-800 shadow-lg">
            <img
              src={imageUrl}
              alt="Hero Showcase"
              class="w-full aspect-[16/9] object-cover rounded-lg"
            />
          </div>
        {/if}
      </div>

    {:else if activePreset === 'split_right_text'}
      <!-- Preset 2: Split Right Text (Image Left, Text Right) -->
      <div class="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <!-- Left: Image Showcase with Concentric Nested Radius -->
        <div data-node="image" class="md:col-span-6 w-full">
          {#if imageUrl}
            <div class="p-2 rounded-2xl bg-base-200/60 dark:bg-slate-800/60 border border-base-300 dark:border-slate-800 shadow-md">
              <img
                src={imageUrl}
                alt="Hero Preview"
                class="w-full aspect-[4/3] object-cover rounded-lg"
              />
            </div>
          {/if}
        </div>

        <!-- Right: Text & CTA -->
        <div class="md:col-span-6 flex flex-col items-start text-left gap-4">
          {#if badgeText}
            <div
              data-node="badge"
              role="button"
              tabindex="0"
              on:click={(e) => selectNode(e, 'badge')}
              on:keydown={(e) => selectNodeKey(e, 'badge')}
              class="inline-flex items-center gap-1.5 px-4 h-8 rounded-full bg-blue-50 text-[var(--theme-primary,#2563eb)] text-xs font-bold border border-blue-200 cursor-pointer shadow-sm"
            >
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
            class="font-black tracking-tight leading-tight text-3xl sm:text-4xl lg:text-5xl text-[var(--theme-text-primary,#0f172a)] cursor-pointer"
          >
            {title}
          </svelte:element>

          <div
            data-node="subtitle"
            role="button"
            tabindex="0"
            on:click={(e) => selectNode(e, 'subtitle')}
            on:keydown={(e) => selectNodeKey(e, 'subtitle')}
            class="cursor-pointer"
          >
            <p class="text-sm sm:text-base text-[var(--theme-text-muted,#64748b)] leading-relaxed">
              {subtitle}
            </p>
          </div>

          {#if ctaText}
            <div data-node="cta" class="pt-2">
              <a
                href={ctaLink}
                style="height: var(--theme-btn-height, 48px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
                class="inline-flex items-center justify-center px-6 font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-transform"
              >
                <ShoppingBag size={18} class="mr-2" />
                <span>{ctaText}</span>
              </a>
            </div>
          {/if}
        </div>
      </div>

    {:else}
      <!-- Preset 1 (Default): Split Left Text (Text Left, Image Right) -->
      <div class="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <!-- Left: Text & CTA -->
        <div class="md:col-span-6 flex flex-col items-start text-left gap-4">
          {#if badgeText}
            <div
              data-node="badge"
              role="button"
              tabindex="0"
              on:click={(e) => selectNode(e, 'badge')}
              on:keydown={(e) => selectNodeKey(e, 'badge')}
              class="inline-flex items-center gap-1.5 px-4 h-8 rounded-full bg-blue-50 text-[var(--theme-primary,#2563eb)] text-xs font-bold border border-blue-200 cursor-pointer shadow-sm"
            >
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
            class="font-black tracking-tight leading-tight text-3xl sm:text-4xl lg:text-5xl text-[var(--theme-text-primary,#0f172a)] cursor-pointer"
          >
            {title}
          </svelte:element>

          <div
            data-node="subtitle"
            role="button"
            tabindex="0"
            on:click={(e) => selectNode(e, 'subtitle')}
            on:keydown={(e) => selectNodeKey(e, 'subtitle')}
            class="cursor-pointer"
          >
            <p class="text-sm sm:text-base text-[var(--theme-text-muted,#64748b)] leading-relaxed">
              {subtitle}
            </p>
          </div>

          {#if ctaText}
            <div data-node="cta" class="pt-2">
              <a
                href={ctaLink}
                style="height: var(--theme-btn-height, 48px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
                class="inline-flex items-center justify-center px-6 font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-transform"
              >
                <ShoppingBag size={18} class="mr-2" />
                <span>{ctaText}</span>
              </a>
            </div>
          {/if}
        </div>

        <!-- Right: Image Showcase with Concentric Nested Radius (Outer 16px, Padding 8px, Inner 8px) -->
        <div data-node="image" class="md:col-span-6 w-full">
          {#if imageUrl}
            <div class="p-2 rounded-2xl bg-base-200/60 dark:bg-slate-800/60 border border-base-300 dark:border-slate-800 shadow-md">
              <img
                src={imageUrl}
                alt="Hero Preview"
                class="w-full aspect-[4/3] object-cover rounded-lg"
              />
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</section>