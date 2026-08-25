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
  $: tagName = props?.tagName || 'h1';
  $: title = props?.title || 'Selamat datang di toko kami';
  $: subtitle = props?.subtitle || 'Produk berkualitas dengan harga terjangkau';
  $: imageUrl = props?.imageUrl || 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1200&q=80';
  $: ctaText = props?.ctaText || 'Lihat Katalog';
  $: ctaLink = props?.ctaLink || '#products';
  $: badgeText = props?.badgeText || 'Promo Spesial UMKM';

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

<div
  data-node="hero_container"
  class={`relative w-full overflow-hidden box-border select-none ${isActive ? 'relative z-10' : ''}`}
  style="min-height: {styles?.minHeight || 'auto'};"
>
  {#if activePreset === 'full_banner_overlay'}
    <!-- Preset 4: Full Banner Overlay -->
    <div class="relative w-full min-h-[480px] sm:min-h-[560px] flex items-center justify-center text-center px-4 sm:px-6 py-16">
      {#if imageUrl}
        <div class="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <img
            src={imageUrl}
            alt="Banner Hero"
            class="w-full h-full object-cover select-none pointer-events-none"
          />
          <div class="absolute inset-0 bg-slate-950/50 backdrop-blur-[1px] pointer-events-none"></div>
        </div>
      {/if}

      <div class="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-4 text-white">
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
    </div>

  {:else if activePreset === 'centered_minimal'}
    <!-- Preset 3: Centered Minimal -->
    <div class="w-full max-w-[var(--theme-max-width,1200px)] mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col items-center text-center gap-6">
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
    <div class="w-full max-w-[var(--theme-max-width,1200px)] mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
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
    <div class="w-full max-w-[var(--theme-max-width,1200px)] mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
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