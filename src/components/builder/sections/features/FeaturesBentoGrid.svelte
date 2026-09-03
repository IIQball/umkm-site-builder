<script lang="ts">
  import type { FeatureItem } from '@/types';
  import { resolveFeatureIcon } from './featureIcons';

  export let badgeText: string = 'Benefit Utama';
  export let title: string = 'Dirancang Khusus untuk Kebutuhan Harian';
  export let subtitle: string = 'Setiap detail kami perhitungkan demi kenyamanan penggunaan produk jangka panjang.';
  export let items: FeatureItem[] = [];
  export let mainImageUrl: string = 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&auto=format&fit=crop&q=80';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent | KeyboardEvent, key: string) => void) | undefined = undefined;

  $: isHeadingActive = activeNodeId === 'features_heading' || activeNodeId === 'header';
  $: isImageActive = activeNodeId === 'features_image' || activeNodeId === 'image';

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

  const handleHeadingClick = (e: MouseEvent) => {
    if (selectNode) selectNode(e, 'features_heading');
  };

  const handleHeadingKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (selectNode) selectNode(e, 'features_heading');
    }
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

<div class="text-center py-12">
  <div
    role="button"
    tabindex="0"
    on:click={handleHeadingClick}
    on:keydown={handleHeadingKeydown}
    class={`max-w-2xl mx-auto mb-8 p-3 rounded-2xl transition-all cursor-pointer ${
      isHeadingActive
        ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 bg-blue-50/20 dark:bg-blue-950/20'
        : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
    }`}
  >
    {#if badgeText}
      <span
        data-node="badge"
        class="inline-flex items-center rounded-full border px-2.5 py-1 text-2xs gap-1.5 font-heading font-medium bg-blue-50/90 dark:bg-blue-950/70 border-blue-200/90 dark:border-blue-800/80 text-[var(--color-primary,#2563eb)] mb-4 shadow-2xs"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-[var(--color-primary,#2563eb)]"></span>
        {badgeText}
      </span>
    {/if}
    <h2 data-node="title" class="title-heading text-heading-lg font-heading font-extrabold text-[var(--color-text-main,#0f172a)] tracking-tight mb-3">
      {title}
    </h2>
    {#if subtitle}
      <p data-node="subtitle" class="text-body-base text-[var(--color-text-secondary,#334155)] leading-relaxed font-sans">
        {subtitle}
      </p>
    {/if}
  </div>

  <div class="bento-grid-container text-left">
    <!-- Bento Utama (Span 8) -->
    <div
      data-node="feature_card"
      role="button"
      tabindex="0"
      on:click={(e) => handleItemClick(e, 0)}
      on:keydown={(e) => handleItemKeydown(e, 0)}
      class={`bg-[var(--color-card-base,#ffffff)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border,rgba(15,23,42,0.08))] shadow-xs bento-span-8 flex flex-col justify-between transition-all duration-150 cursor-pointer ${
        activeNodeId === 'feature_item_0'
          ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
          : 'hover:border-blue-400/80 hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
      }`}
    >
      <div>
        <span class="text-xs font-heading font-bold text-[var(--color-primary,#2563eb)] uppercase tracking-wider block mb-2">
          {item0.badge || 'Benefit Utama'}
        </span>
        <h3 data-node="feature_title" class="text-heading-md font-heading font-black text-[var(--color-text-main,#0f172a)] mb-2">
          {item0.title}
        </h3>
        <p data-node="feature_desc" class="text-body-sm text-[var(--color-text-secondary,#334155)] leading-relaxed font-sans">
          {item0.description}
        </p>
      </div>
      {#if item0.imageUrl || mainImageUrl}
        <div
          role="button"
          tabindex="0"
          on:click|stopPropagation={handleImageClick}
          on:keydown={handleImageKeydown}
          class={`w-full aspect-[21/9] rounded-xl overflow-hidden mt-6 bg-slate-100 dark:bg-slate-800 transition-all ${
            isImageActive
              ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
              : 'hover:opacity-95'
          }`}
        >
          <img
            src={item0.imageUrl || mainImageUrl}
            alt={item0.title}
            class="w-full h-full object-cover"
          />
        </div>
      {/if}
    </div>

    <!-- Bento Samping 1 (Span 4) -->
    <div
      data-node="feature_card"
      role="button"
      tabindex="0"
      on:click={(e) => handleItemClick(e, 1)}
      on:keydown={(e) => handleItemKeydown(e, 1)}
      class={`bg-[var(--color-card-base,#ffffff)] p-6 rounded-2xl border border-[var(--color-border,rgba(15,23,42,0.08))] shadow-xs bento-span-4 flex flex-col justify-between transition-all duration-150 cursor-pointer ${
        activeNodeId === 'feature_item_1'
          ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
          : 'hover:border-blue-400/80 hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
      }`}
    >
      <div>
        <div
          data-node="feature_icon"
          class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-4"
        >
          <svelte:component this={resolveFeatureIcon(item1.icon || item1.iconName || 'sparkles')} size={20} />
        </div>
        <h3 data-node="feature_title" class="text-heading-md font-heading font-bold text-[var(--color-text-main,#0f172a)] mb-2">
          {item1.title}
        </h3>
        <p data-node="feature_desc" class="text-body-sm text-[var(--color-text-secondary,#334155)] leading-relaxed font-sans">
          {item1.description}
        </p>
      </div>
      {#if item1.statLabel || item1.linkUrl}
        <span class="text-xs font-heading font-semibold text-amber-600 dark:text-amber-400 mt-4 inline-block">
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
      class={`bg-[var(--color-card-base,#ffffff)] p-6 rounded-2xl border border-[var(--color-border,rgba(15,23,42,0.08))] shadow-xs bento-span-4 transition-all duration-150 cursor-pointer ${
        activeNodeId === 'feature_item_2'
          ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
          : 'hover:border-blue-400/80 hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
      }`}
    >
      <div
        data-node="feature_icon"
        class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-4"
      >
        <svelte:component this={resolveFeatureIcon(item2.icon || item2.iconName || 'leaf')} size={20} />
      </div>
      <h3 data-node="feature_title" class="text-heading-md font-heading font-bold text-[var(--color-text-main,#0f172a)] mb-2">
        {item2.title}
      </h3>
      <p data-node="feature_desc" class="text-body-sm text-[var(--color-text-secondary,#334155)] leading-relaxed font-sans">
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
      class={`bg-slate-900 text-white p-6 rounded-2xl shadow-xs bento-span-8 flex items-center justify-between border border-slate-800 transition-all duration-150 cursor-pointer ${
        activeNodeId === 'feature_item_3'
          ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900'
          : 'hover:border-slate-700 hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
      }`}
    >
      <div>
        <h3 data-node="feature_title" class="text-heading-md font-heading font-bold text-white mb-1">
          {item3.title}
        </h3>
        <p data-node="feature_desc" class="text-body-sm text-slate-300 font-sans">
          {item3.description}
        </p>
      </div>
      <span class="h-10 min-h-[40px] px-4 py-2.5 rounded-2xl bg-white text-slate-900 text-sm font-heading font-semibold inline-flex items-center justify-center shrink-0 ml-4 hover:bg-slate-100 active:scale-[0.98] shadow-xs">
        {item3.statLabel || 'Gabung Mitra'}
      </span>
    </div>
  </div>
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
