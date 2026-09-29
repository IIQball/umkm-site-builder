<script lang="ts">
  import type { FeatureItem } from '@/types';
  import { resolveFeatureIcon } from './featureIcons';
  import FeaturesHeaderTitle from './FeaturesHeaderTitle.svelte';

  export let badgeText: string = 'Benefit Utama';
  export let title: string = 'Dirancang Khusus untuk Kebutuhan Harian';
  export let subtitle: string = 'Setiap detail kami perhitungkan demi kenyamanan penggunaan produk jangka panjang.';
  export let items: FeatureItem[] = [];
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'bento_spotlight', 'bento_cards', 'image'];
  export let mainImageUrl: string = 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&auto=format&fit=crop&q=80'
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent | KeyboardEvent, key: string) => void) | undefined = undefined;

  $: isImageActive = activeNodeId === 'features_image' || activeNodeId === 'image';
  $: isGridFirst = elementOrder.indexOf('bento_spotlight') === 0 || elementOrder.indexOf('bento_cards') === 0 || elementOrder.indexOf('features_grid') === 0;
  $: hasHeader = elementOrder.some((s) => ['badge', 'title', 'subtitle'].includes(s));
  $: hasSpotlight = elementOrder.includes('bento_spotlight') || elementOrder.includes('features_grid');
  $: hasCards = elementOrder.includes('bento_cards') || elementOrder.includes('features_grid');
  $: hasImage = elementOrder.includes('image');
  $: isCardsBeforeSpotlight = elementOrder.indexOf('bento_cards') !== -1 && elementOrder.indexOf('bento_spotlight') !== -1 && elementOrder.indexOf('bento_cards') < elementOrder.indexOf('bento_spotlight');

  $: item0 = items[0] || {
    title: 'Daya Simpan Alami Hingga 6 Bulan',
    description: 'Melalui teknik dehidrasi higienis temperatur rendah, rasa renyah dan aroma gurih tetap bertahan sempurna tanpa setetes pun minyak jelantah sisa.',
    imageUrl: mainImageUrl,
    badge: badgeText || 'Benefit Utama',
  };
  $: item1 = items[1] || {
    icon: 'sparkles',
    title: 'Rendah Kalori',
    description: 'Hanya 110 kkal per kemasan, bebas rasa bersalah untuk camilan malam hari.',
    statLabel: 'Cek Informasi Nilai Gizi →',
  };
  $: item2 = items[2] || {
    icon: 'leaf',
    title: 'Gluten-Free Friendly',
    description: 'Dibuat dari tepung singkong mocaf pilihan yang aman bagi penderita intoleransi gluten.',
  };
  $: item3 = items[3] || {
    title: 'Siap Jadi Reseller di Kota Anda?',
    description: 'Dapatkan harga grosir khusus dan materi promosi gratis.',
    statLabel: 'Gabung Mitra',
  };

  const handleImageClick = (e: MouseEvent) => {
    if (selectNode) selectNode(e, 'features_image');
  };

  const handleImageKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
      if (selectNode) selectNode(e, 'features_image');
    }
  };

  const handleItemClick = (e: MouseEvent, index: number) => {
    if (selectNode) selectNode(e, `feature_item_${index}`);
  };

  const handleItemKeydown = (e: KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (selectNode) selectNode(e, `feature_item_${index}`);
    }
  };
</script>

<div class="text-center py-12 flex flex-col">
  {#if hasHeader}
    <div style="order: {isGridFirst ? 2 : 1};">
      <FeaturesHeaderTitle
        {badgeText}
        {title}
        {subtitle}
        {activeNodeId}
        {selectNode}
        {elementOrder}
        maxWidthClass="max-w-2xl"
      />
    </div>
  {/if}

  {#if hasSpotlight || hasCards}
    <div class="bento-grid-container text-left" style="order: {isGridFirst ? 1 : 2};">
      {#if hasSpotlight}
        <!-- Bento Utama (Span 8) -->
        <div
          data-node="feature_card"
          role="button"
          tabindex="0"
          on:click={(e) => handleItemClick(e, 0)}
          on:keydown={(e) => handleItemKeydown(e, 0)}
          class={`bg-[var(--color-card-base)] p-6 sm:p-8 border border-[var(--color-border)] shadow-xs bento-span-8 flex flex-col justify-between transition-all duration-150 cursor-pointer ${
            activeNodeId === 'feature_item_0'
              ? 'border-[var(--color-primary)] ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
              : 'hover:border-[var(--color-primary)]/80 hover:outline-dashed hover:outline-1 hover:outline-primary/50'
          }`}
          style="border-radius: var(--btn-radius, 16px); order: {isCardsBeforeSpotlight ? 2 : 1};"
        >
        <div>
          <span class="text-xs font-heading font-bold text-[var(--color-primary)] uppercase tracking-wider block mb-2">
            {item0.badge || 'Benefit Utama'}
          </span>
          <h3 data-node="feature_title" class="text-heading-md font-heading font-black text-[var(--color-text-main)] mb-2">
            {item0.title}
          </h3>
          <p data-node="feature_desc" class="text-body-sm text-[var(--color-text-secondary)] leading-relaxed font-sans">
            {item0.description}
          </p>
        </div>
        {#if hasImage && (item0.imageUrl || mainImageUrl)}
          <div
            role="button"
            tabindex="0"
            on:click|stopPropagation={handleImageClick}
            on:keydown={handleImageKeydown}
            class={`w-full aspect-[21/9] rounded-xl overflow-hidden mt-6 bg-[var(--color-nested-base)] transition-all ${
              isImageActive
                ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
                : 'hover:opacity-95'
            }`}
            style="border-radius: calc(var(--btn-radius, 16px) * 0.75);"
          >
            <img
              src={item0.imageUrl || mainImageUrl}
              alt={item0.title}
              class="w-full h-full object-cover"
            />
          </div>
        {/if}
      </div>
    {/if}

    {#if hasCards}
      <!-- Bento Samping 1 (Span 4) -->
      <div
        data-node="feature_card"
        role="button"
        tabindex="0"
        on:click={(e) => handleItemClick(e, 1)}
        on:keydown={(e) => handleItemKeydown(e, 1)}
        class={`bg-[var(--color-card-base)] p-6 border border-[var(--color-border)] shadow-xs bento-span-4 flex flex-col justify-between transition-all duration-150 cursor-pointer ${
          activeNodeId === 'feature_item_1'
            ? 'border-[var(--color-primary)] ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
            : 'hover:border-[var(--color-primary)]/80 hover:outline-dashed hover:outline-1 hover:outline-primary/50'
        }`}
        style="border-radius: var(--btn-radius, 16px); order: {isCardsBeforeSpotlight ? 1 : 2};"
      >
      <div>
        <div
          data-node="feature_icon"
          class="w-10 h-10 flex items-center justify-center mb-4 border"
          style="background-color: color-mix(in srgb, var(--color-secondary) 15%, transparent); border-color: color-mix(in srgb, var(--color-secondary) 25%, transparent); color: var(--color-secondary); border-radius: calc(var(--btn-radius, 16px) * 0.75);"
        >
          <svelte:component this={resolveFeatureIcon(item1.icon || item1.iconName || 'sparkles')} size={20} />
        </div>
        <h3 data-node="feature_title" class="text-heading-md font-heading font-bold text-[var(--color-text-main)] mb-2">
          {item1.title}
        </h3>
        <p data-node="feature_desc" class="text-body-sm text-[var(--color-text-secondary)] leading-relaxed font-sans">
          {item1.description}
        </p>
      </div>
      {#if item1.statLabel || item1.linkUrl}
        <span class="text-xs font-heading font-semibold mt-4 inline-block" style="color: var(--color-secondary);">
          {item1.statLabel || 'Cek Detail →'}
        </span>
      {/if}
    </div>

    <!-- Bento Bawah 1 (Span 4) -->
    <div
      data-node="feature_card"
      role="button"
      tabindex="0"
      on:click={(e) => handleItemClick(e, 2)}
      on:keydown={(e) => handleItemKeydown(e, 2)}
      class={`bg-[var(--color-card-base)] p-6 border border-[var(--color-border)] shadow-xs bento-span-4 transition-all duration-150 cursor-pointer ${
        activeNodeId === 'feature_item_2'
          ? 'border-[var(--color-primary)] ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
          : 'hover:border-[var(--color-primary)]/80 hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
      style="border-radius: var(--btn-radius, 16px); order: {isCardsBeforeSpotlight ? 1 : 2};"
    >
      <div
        data-node="feature_icon"
        class="w-10 h-10 flex items-center justify-center mb-4 border"
        style="background-color: color-mix(in srgb, var(--color-primary) 15%, transparent); border-color: color-mix(in srgb, var(--color-primary) 25%, transparent); color: var(--color-primary); border-radius: calc(var(--btn-radius, 16px) * 0.75);"
      >
        <svelte:component this={resolveFeatureIcon(item2.icon || item2.iconName || 'leaf')} size={20} />
      </div>
      <h3 data-node="feature_title" class="text-heading-md font-heading font-bold text-[var(--color-text-main)] mb-2">
        {item2.title}
      </h3>
      <p data-node="feature_desc" class="text-body-sm text-[var(--color-text-secondary)] leading-relaxed font-sans">
        {item2.description}
      </p>
    </div>

    <!-- Bento Bawah 2 (Span 8) -->
    <div
      data-node="feature_card"
      role="button"
      tabindex="0"
      on:click={(e) => handleItemClick(e, 3)}
      on:keydown={(e) => handleItemKeydown(e, 3)}
      class={`p-6 shadow-xs bento-span-8 flex items-center justify-between border transition-all duration-150 cursor-pointer ${
        activeNodeId === 'feature_item_3'
          ? 'border-[var(--color-primary)] ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
          : 'hover:border-[var(--color-primary)]/80 hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
      style="background-color: var(--color-nested-base, currentColor); border-color: var(--color-border); border-radius: var(--btn-radius, 16px); color: var(--color-text-main); order: {isCardsBeforeSpotlight ? 1 : 2};"
    >
      <div>
        <h3 data-node="feature_title" class="text-heading-md font-heading font-bold mb-1" style="color: var(--color-text-main);">
          {item3.title}
        </h3>
        <p data-node="feature_desc" class="text-body-sm font-sans" style="color: var(--color-text-secondary);">
          {item3.description}
        </p>
      </div>
      <span
        class="btn btn-sm btn-primary font-heading font-semibold shrink-0 ml-4 shadow-xs"
        style="border-radius: var(--btn-radius, 16px); background-color: var(--btn-primary-bg, var(--color-primary)); color: var(--theme-btn-primary-text, var(--btn-primary-text, currentColor));"
      >
        {item3.statLabel || 'Gabung Mitra'}
      </span>
    </div>
    {/if}
  </div>
  {/if}
</div>

<style>
  .bento-grid-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }

  .title-heading {
    font-size: 1.625rem;
    line-height: 2rem;
  }

  @container featurecard (min-width: 640px) {
    .title-heading {
      font-size: 2.125rem;
      line-height: 2.5rem;
    }
    .bento-grid-container {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 16px !important;
    }
    .bento-span-8,
    .bento-span-4 {
      grid-column: span 2 !important;
    }
  }

  @container featurecard (min-width: 960px) {
    .title-heading {
      font-size: 2.5rem;
      line-height: 2.875rem;
    }
    .bento-grid-container {
      grid-template-columns: repeat(12, minmax(0, 1fr)) !important;
      gap: 20px !important;
    }
    .bento-span-8 {
      grid-column: span 8 !important;
    }
    .bento-span-4 {
      grid-column: span 4 !important;
    }
  }
</style>
