<script lang="ts">
  import { editorStore } from '../stores/editorStore';
  import type { HeroProps, SectionStyles } from '@/types';
  import { ShoppingBag, Search, CheckCircle2, ShieldCheck, Truck, Clock } from 'lucide-svelte';

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
  $: activeStoreWaNumber = (props?.whatsappNumber as string) || (props?.waNumber as string) || '628123456789';
  $: resolvedCtaLink = ctaLink === '#whatsapp' || ctaLink === 'whatsapp' || ctaLink.startsWith('wa:')
    ? `https://wa.me/${activeStoreWaNumber.replace(/[^0-9]/g, '')}`
    : ctaLink;
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

<!-- Outer Section Container (100% Edge-to-Edge) -->
<section
  id="hero-section"
  data-node="hero_container"
  class="relative w-full overflow-hidden select-none {sectionBgClass} {isActive ? 'relative z-10' : ''}"
  style="background-color: var(--theme-bg); {customBgStyle} margin-top: {marginTop}px; margin-bottom: {marginBottom}px; min-height: {styles?.minHeight || 'auto'};"
>
  <!-- Background Image & Overlay for full_banner_overlay & hero_card_overlap -->
  {#if (isFullBannerPreset || activePreset === 'hero_card_overlap') && heroBgImage}
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
    {#if activePreset === 'hero_card_overlap'}
      <!-- Preset A: Hero Card Overlap (Floating surface card over full bleed background) -->
      <div class="py-12 sm:py-20 flex items-end justify-start min-h-[440px] sm:min-h-[520px]">
        <div
          data-node="hero_card"
          class="w-full md:max-w-xl p-6 sm:p-8 rounded-2xl bg-[var(--theme-surface,#ffffff)] dark:bg-slate-900 text-[var(--theme-text-primary,#0f172a)] shadow-2xl border border-base-200 dark:border-slate-800 flex flex-col items-start text-left gap-4"
        >
          {#if badgeText}
            <div
              data-node="badge"
              role="button"
              tabindex="0"
              on:click={(e) => selectNode(e, 'badge')}
              on:keydown={(e) => selectNodeKey(e, 'badge')}
              class="inline-flex items-center gap-1.5 px-3.5 h-7 rounded-full bg-blue-50 text-[var(--theme-primary,#2563eb)] text-xs font-bold border border-blue-200 cursor-pointer shadow-sm"
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
            class="font-black tracking-tight leading-tight text-2xl sm:text-4xl text-[var(--theme-text-primary,#0f172a)] cursor-pointer"
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
            <p class="text-xs sm:text-sm text-[var(--theme-text-muted,#64748b)] leading-relaxed">
              {subtitle}
            </p>
          </div>

          {#if ctaText}
            <div data-node="cta" class="pt-2">
              <a
                href={ctaLink}
                style="height: var(--theme-btn-height, 44px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
                class="inline-flex items-center justify-center px-6 font-bold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-transform"
              >
                <ShoppingBag size={16} class="mr-2" />
                <span>{ctaText}</span>
              </a>
            </div>
          {/if}
        </div>
      </div>

    {:else if activePreset === 'split_multi_badges'}
      <!-- Preset B: Split Multi Badges (Col 1-7 text + 3 badges, Col 8-12 2 offset images) -->
      <div class="py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div class="md:col-span-7 flex flex-col items-start text-left gap-4">
          <!-- 3 Feature Badges row -->
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-1 px-3 h-7 rounded-full bg-blue-50 text-[var(--theme-primary,#2563eb)] text-[11px] font-bold border border-blue-200">
              <CheckCircle2 size={12} /> Terpercaya
            </span>
            <span class="inline-flex items-center gap-1 px-3 h-7 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
              <Truck size={12} /> Kirim Cepat
            </span>
            <span class="inline-flex items-center gap-1 px-3 h-7 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200">
              <ShieldCheck size={12} /> 100% Asli
            </span>
          </div>

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
            <p class="text-sm sm:text-base text-[var(--theme-text-muted,#64748b)] leading-relaxed max-w-xl">
              {subtitle}
            </p>
          </div>

          {#if ctaText}
            <div data-node="cta" class="pt-2">
              <a
                href={resolvedCtaLink}
                style="height: var(--theme-btn-height, 48px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
                class="inline-flex items-center justify-center px-6 font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-transform"
              >
                <ShoppingBag size={18} class="mr-2" />
                <span>{ctaText}</span>
              </a>
            </div>
          {/if}
        </div>

        <!-- Right: 2 Offset Product Images -->
        <div data-node="image" class="md:col-span-5 grid grid-cols-2 gap-4">
          <div class="p-2 rounded-2xl bg-base-200/60 dark:bg-slate-800/60 border border-base-300 dark:border-slate-800 shadow-md transform -rotate-2 hover:rotate-0 transition-transform">
            <img
              src={imageUrl}
              alt="Preview 1"
              class="w-full aspect-square object-cover rounded-lg"
            />
          </div>
          <div class="p-2 rounded-2xl bg-base-200/60 dark:bg-slate-800/60 border border-base-300 dark:border-slate-800 shadow-md transform rotate-3 translate-y-4 hover:rotate-0 transition-transform">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
              alt="Preview 2"
              class="w-full aspect-square object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

    {:else if activePreset === 'hero_triple_highlights'}
      <!-- Preset D: Hero Triple Highlights (Split text/image + 3 bottom summary cards) -->
      <div class="py-12 flex flex-col gap-10">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div class="md:col-span-6 flex flex-col items-start text-left gap-4">
            {#if badgeText}
              <div
                data-node="badge"
                class="inline-flex items-center gap-1.5 px-4 h-8 rounded-full bg-blue-50 text-[var(--theme-primary,#2563eb)] text-xs font-bold border border-blue-200"
              >
                <span>{badgeText}</span>
              </div>
            {/if}

            <svelte:element
              this={tagName || 'h1'}
              data-node="title"
              class="font-black tracking-tight leading-tight text-3xl sm:text-4xl lg:text-5xl text-[var(--theme-text-primary,#0f172a)]"
            >
              {title}
            </svelte:element>

            <p data-node="subtitle" class="text-sm sm:text-base text-[var(--theme-text-muted,#64748b)] leading-relaxed">
              {subtitle}
            </p>

            {#if ctaText}
              <div data-node="cta" class="pt-2">
                <a
                  href={ctaLink}
                  style="height: 48px; border-radius: 8px; background-color: var(--theme-primary, #2563eb); color: #ffffff;"
                  class="inline-flex items-center justify-center px-6 font-bold text-sm shadow-md"
                >
                  <ShoppingBag size={18} class="mr-2" />
                  <span>{ctaText}</span>
                </a>
              </div>
            {/if}
          </div>

          <div data-node="image" class="md:col-span-6 w-full">
            <div class="p-2 rounded-2xl bg-base-200/60 dark:bg-slate-800/60 border border-base-300 dark:border-slate-800 shadow-md">
              <img src={imageUrl} alt="Hero Preview" class="w-full aspect-[4/3] object-cover rounded-lg" />
            </div>
          </div>
        </div>

        <!-- 3 Highlight Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-base-200 dark:border-slate-800">
          <div class="p-4 rounded-xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 flex items-center gap-3 text-left">
            <div class="w-10 h-10 rounded-lg bg-blue-50 text-[var(--theme-primary,#2563eb)] flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p class="font-bold text-sm text-[var(--theme-text-primary,#0f172a)]">100% Original</p>
              <p class="text-[11px] text-[var(--theme-text-muted,#64748b)]">Jaminan produk berkualitas</p>
            </div>
          </div>
          <div class="p-4 rounded-xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 flex items-center gap-3 text-left">
            <div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <p class="font-bold text-sm text-[var(--theme-text-primary,#0f172a)]">Pengiriman Cepat</p>
              <p class="text-[11px] text-[var(--theme-text-muted,#64748b)]">Siap kirim ke seluruh kota</p>
            </div>
          </div>
          <div class="p-4 rounded-xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 flex items-center gap-3 text-left">
            <div class="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <p class="font-bold text-sm text-[var(--theme-text-primary,#0f172a)]">Layanan 24/7</p>
              <p class="text-[11px] text-[var(--theme-text-muted,#64748b)]">Respon cepat via WhatsApp</p>
            </div>
          </div>
        </div>
      </div>

    {:else if activePreset === 'hero_search_focused'}
      <!-- Preset E: Hero Search Focused (Large central search bar 56px, pill radius) -->
      <div class="py-16 sm:py-24 flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
        {#if badgeText}
          <div
            data-node="badge"
            class="inline-flex items-center gap-1.5 px-4 h-8 rounded-full bg-blue-50 text-[var(--theme-primary,#2563eb)] text-xs font-bold border border-blue-200"
          >
            <span>{badgeText}</span>
          </div>
        {/if}

        <svelte:element
          this={tagName || 'h1'}
          data-node="title"
          class="font-black tracking-tight leading-tight text-3xl sm:text-5xl text-[var(--theme-text-primary,#0f172a)]"
        >
          {title}
        </svelte:element>

        <p data-node="subtitle" class="text-sm sm:text-base text-[var(--theme-text-muted,#64748b)] leading-relaxed max-w-xl">
          {subtitle}
        </p>

        <!-- Search Bar 56px (h-14, pill shape) -->
        <div class="w-full max-w-xl mt-2 relative flex items-center">
          <div class="w-full h-14 pl-12 pr-28 rounded-full bg-[var(--theme-surface,#ffffff)] dark:bg-slate-900 border-2 border-[var(--theme-primary,#2563eb)] shadow-lg flex items-center">
            <Search size={20} class="absolute left-4 text-base-content/50" />
            <input
              type="text"
              placeholder="Cari produk pilihan Anda..."
              class="w-full bg-transparent text-sm text-base-content focus:outline-none"
            />
            <button
              type="button"
              style="background-color: var(--theme-primary, #2563eb); color: #ffffff;"
              class="absolute right-2 h-10 px-5 rounded-full text-xs font-bold shadow hover:brightness-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Cari</span>
            </button>
          </div>
        </div>
      </div>

    {:else if activePreset === 'full_banner_overlay'}
      <!-- Preset 4: Full Banner Overlay Content -->
      <div class="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center gap-4 text-white py-12">
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
      <div class="w-full flex flex-col items-center text-center gap-6 py-12">
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
      <div class="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-12">
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
      <div class="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-12">
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