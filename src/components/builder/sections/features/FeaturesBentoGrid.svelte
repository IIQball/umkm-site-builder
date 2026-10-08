<script lang="ts">
  import type { FeatureItem } from '@/types';
  import { resolveFeatureIcon } from './featureIcons';
  import { resolveFeatureItemStyle } from './featureStyles.helpers';
  import FeaturesHeaderTitle from './FeaturesHeaderTitle.svelte';

  export let badgeText: string = 'Benefit Utama';
  export let title: string = 'Dirancang Khusus untuk Kebutuhan Harian';
  export let subtitle: string = 'Setiap detail kami perhitungkan demi kenyamanan penggunaan produk jangka panjang.';
  export let items: FeatureItem[] = [];
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'bento_spotlight', 'bento_cards', 'image'];
  export let mainImageUrl: string = 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&auto=format&fit=crop&q=80';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent | KeyboardEvent, key: string) => void) | undefined = undefined;
  export let nodeStyles: Record<string, Record<string, string>> = {};

  $: isImageActive = activeNodeId === 'features_image' || activeNodeId === 'image';
  $: isGridFirst = elementOrder.indexOf('bento_spotlight') === 0 || elementOrder.indexOf('bento_cards') === 0 || elementOrder.indexOf('features_grid') === 0;
  $: hasHeader = elementOrder.some((s) => ['badge', 'title', 'subtitle'].includes(s));
  $: hasSpotlight = elementOrder.includes('bento_spotlight') || elementOrder.includes('features_grid');
  $: hasCards = elementOrder.includes('bento_cards') || elementOrder.includes('features_grid');
  $: hasImage = elementOrder.includes('image');
  $: isCardsBeforeSpotlight = elementOrder.indexOf('bento_cards') !== -1 && elementOrder.indexOf('bento_spotlight') !== -1 && elementOrder.indexOf('bento_cards') < elementOrder.indexOf('bento_spotlight');

  $: item0 = items[0] || {
    icon: 'sparkles',
    iconName: 'sparkles',
    title: 'Daya Simpan Alami Hingga 6 Bulan',
    description: 'Melalui teknik dehidrasi higienis temperatur rendah, rasa renyah dan aroma gurih tetap bertahan sempurna tanpa setetes pun minyak jelantah sisa.',
    imageUrl: mainImageUrl,
    badge: badgeText || 'Benefit Utama',
  };
  $: item1 = items[1] || {
    icon: 'sparkles',
    iconName: 'sparkles',
    title: 'Rendah Kalori',
    description: 'Hanya 110 kkal per kemasan, bebas rasa bersalah untuk camilan malam hari.',
    statLabel: 'Cek Informasi Nilai Gizi →',
  };
  $: item2 = items[2] || {
    icon: 'leaf',
    iconName: 'leaf',
    title: 'Gluten-Free Friendly',
    description: 'Dibuat dari tepung singkong mocaf pilihan yang aman bagi penderita intoleransi gluten.',
  };
  $: item3 = items[3] || {
    icon: 'package',
    iconName: 'package',
    title: 'Siap Jadi Reseller di Kota Anda?',
    description: 'Dapatkan harga grosir khusus dan materi promosi gratis.',
    statLabel: 'Gabung Mitra',
  };
  $: style0 = resolveFeatureItemStyle(item0, 0, nodeStyles);
  $: style1 = resolveFeatureItemStyle(item1, 1, nodeStyles);
  $: style2 = resolveFeatureItemStyle(item2, 2, nodeStyles);
  $: style3 = resolveFeatureItemStyle(item3, 3, nodeStyles);

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
        {nodeStyles}
        maxWidthClass="max-w-2xl"
      />
    </div>
  {/if}

  {#if hasSpotlight || hasCards}
    <div class="cq-bento-feature bento-grid-container text-left" style="order: {isGridFirst ? 1 : 2};">
      {#if hasSpotlight}
        <!-- Bento Utama (Span 8) -->
        <div
          data-node="bento_spotlight"
          data-node-id="bento_spotlight"
          role="button"
          tabindex="0"
          on:click={(e) => handleItemClick(e, 0)}
          on:keydown={(e) => handleItemKeydown(e, 0)}
          class={`bg-[var(--color-card-base)] p-6 sm:p-8 border border-[var(--color-border)] shadow-xs cq-bento-span-8 bento-span-8 flex flex-col justify-between transition-all duration-150 cursor-pointer ${
            activeNodeId === 'bento_spotlight' || activeNodeId === 'feature_item_0'
              ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-offset-2'
              : 'hover:border-[var(--color-primary)]/80 hover:outline-dashed hover:outline-1 hover:outline-[var(--color-primary)]/50'
          }`}
          style="border-radius: var(--btn-radius, 16px); order: {isCardsBeforeSpotlight ? 2 : 1};"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <div
                data-node="feature_icon"
                class="w-10 h-10 flex items-center justify-center border shrink-0"
                style="background-color: color-mix(in srgb, var(--color-primary) 15%, transparent); border-color: color-mix(in srgb, var(--color-primary) 25%, transparent); color: var(--color-primary); border-radius: calc(var(--btn-radius, 16px) * 0.75);"
              >
                <svelte:component this={resolveFeatureIcon(item0.icon || item0.iconName || 'sparkles')} size={20} />
              </div>
              <span class="text-xs font-heading font-bold text-[var(--color-primary)] uppercase tracking-wider block">
                {item0.badge || 'Benefit Utama'}
              </span>
            </div>
            <h3 data-node="feature_title" class="feature-item-title mb-2" style={style0.color ? `color: ${style0.color} !important;` : ''}>
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
                  ? 'ring-2 ring-[var(--color-primary)] ring-offset-2'
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
          data-node="bento_cards"
          data-node-id="bento_cards"
          role="button"
          tabindex="0"
          on:click={(e) => handleItemClick(e, 1)}
          on:keydown={(e) => handleItemKeydown(e, 1)}
          class={`bg-[var(--color-card-base)] p-6 border border-[var(--color-border)] shadow-xs cq-bento-span-4 bento-span-4 flex flex-col justify-between transition-all duration-150 cursor-pointer ${
            activeNodeId === 'bento_cards' || activeNodeId === 'feature_item_1'
              ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-offset-2'
              : 'hover:border-[var(--color-primary)]/80 hover:outline-dashed hover:outline-1 hover:outline-[var(--color-primary)]/50'
          }`}
          style="border-radius: var(--btn-radius, 16px); order: {isCardsBeforeSpotlight ? 1 : 2};"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-4">
              <div
                data-node="feature_icon"
                class="w-10 h-10 flex items-center justify-center border shrink-0"
                style="background-color: color-mix(in srgb, var(--color-secondary) 15%, transparent); border-color: color-mix(in srgb, var(--color-secondary) 25%, transparent); color: var(--color-secondary); border-radius: calc(var(--btn-radius, 16px) * 0.75);"
              >
                <svelte:component this={resolveFeatureIcon(item1.icon || item1.iconName || 'sparkles')} size={20} />
              </div>
              {#if item1.badge}
                <span class="inline-block px-2 py-0.5 rounded-full text-xs font-heading font-medium" style="background-color: color-mix(in srgb, var(--color-secondary) 15%, transparent); color: var(--color-secondary);">
                  {item1.badge}
                </span>
              {/if}
            </div>
            <h3 data-node="feature_title" class="feature-item-title mb-2" style={style1.color ? `color: ${style1.color} !important;` : ''}>
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
          class={`bg-[var(--color-card-base)] p-6 border border-[var(--color-border)] shadow-xs cq-bento-span-4 bento-span-4 transition-all duration-150 cursor-pointer ${
            activeNodeId === 'feature_item_2'
              ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-offset-2'
              : 'hover:border-[var(--color-primary)]/80 hover:outline-dashed hover:outline-1 hover:outline-[var(--color-primary)]/50'
          }`}
          style="border-radius: var(--btn-radius, 16px); order: {isCardsBeforeSpotlight ? 1 : 2};"
        >
          <div class="flex items-center justify-between gap-2 mb-4">
            <div
              data-node="feature_icon"
              class="w-10 h-10 flex items-center justify-center border shrink-0"
              style="background-color: color-mix(in srgb, var(--color-primary) 15%, transparent); border-color: color-mix(in srgb, var(--color-primary) 25%, transparent); color: var(--color-primary); border-radius: calc(var(--btn-radius, 16px) * 0.75);"
            >
              <svelte:component this={resolveFeatureIcon(item2.icon || item2.iconName || 'leaf')} size={20} />
            </div>
            {#if item2.badge}
              <span class="inline-block px-2 py-0.5 rounded-full text-xs font-heading font-medium" style="background-color: color-mix(in srgb, var(--color-primary) 15%, transparent); color: var(--color-primary);">
                {item2.badge}
              </span>
            {/if}
          </div>
          <h3 data-node="feature_title" class="feature-item-title mb-2" style={style2.color ? `color: ${style2.color} !important;` : ''}>
            {item2.title}
          </h3>
          <p data-node="feature_desc" class="text-body-sm text-[var(--color-text-secondary)] leading-relaxed font-sans">
            {item2.description}
          </p>
          {#if item2.statLabel || item2.linkUrl}
            <span class="text-xs font-heading font-semibold mt-4 inline-block" style="color: var(--color-primary);">
              {item2.statLabel || 'Cek Detail →'}
            </span>
          {/if}
        </div>

        <!-- Bento Bawah 2 (Span 8) -->
        <div
          data-node="feature_card"
          role="button"
          tabindex="0"
          on:click={(e) => handleItemClick(e, 3)}
          on:keydown={(e) => handleItemKeydown(e, 3)}
          class={`p-6 shadow-xs cq-bento-span-8 bento-span-8 flex items-center justify-between border transition-all duration-150 cursor-pointer ${
            activeNodeId === 'feature_item_3'
              ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-offset-2'
              : 'hover:border-[var(--color-primary)]/80 hover:outline-dashed hover:outline-1 hover:outline-[var(--color-primary)]/50'
          }`}
          style="background-color: var(--color-nested-base, currentColor); border-color: var(--color-border); border-radius: var(--btn-radius, 16px); color: var(--color-text-main); order: {isCardsBeforeSpotlight ? 1 : 2};"
        >
          <div class="flex items-start gap-3.5">
            <div
              data-node="feature_icon"
              class="w-10 h-10 flex items-center justify-center border shrink-0 mt-0.5"
              style="background-color: color-mix(in srgb, var(--color-primary) 15%, transparent); border-color: color-mix(in srgb, var(--color-primary) 25%, transparent); color: var(--color-primary); border-radius: calc(var(--btn-radius, 16px) * 0.75);"
            >
              <svelte:component this={resolveFeatureIcon(item3.icon || item3.iconName || 'package')} size={20} />
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <h3 data-node="feature_title" class="feature-item-title" style={style3.color ? `color: ${style3.color} !important;` : ''}>
                  {item3.title}
                </h3>
                {#if item3.badge}
                  <span class="inline-block px-2 py-0.5 rounded-full text-xs font-heading font-medium" style="background-color: color-mix(in srgb, var(--color-primary) 15%, transparent); color: var(--color-primary);">
                    {item3.badge}
                  </span>
                {/if}
              </div>
              <p data-node="feature_desc" class="text-body-sm font-sans" style="color: var(--color-text-secondary);">
                {item3.description}
              </p>
            </div>
          </div>
          <span
            class="px-4 py-2 text-xs font-heading font-semibold shrink-0 ml-4 shadow-xs inline-flex items-center justify-center transition-all"
            style="border-radius: var(--btn-radius, 16px); background-color: var(--btn-primary-bg, var(--color-primary)); color: var(--theme-btn-primary-text, #ffffff);"
          >
            {item3.statLabel || 'Gabung Mitra'}
          </span>
        </div>
      {/if}
    </div>
  {/if}
</div>
