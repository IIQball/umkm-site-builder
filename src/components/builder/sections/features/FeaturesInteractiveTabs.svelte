<script lang="ts">
  import type { FeatureItem } from '@/types';

  export let badgeText: string = 'Varian Unggulan';
  export let title: string = 'Eksplorasi Varian Rasa Favorit';
  export let subtitle: string = 'Pilih varian untuk melihat detail rasa, keunggulan, dan bahan baku.';
  export let items: FeatureItem[] = [];
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent | KeyboardEvent, key: string) => void) | undefined = undefined;

  let activeTabIdx = 0;
  $: activeItem = items[activeTabIdx] || items[0] || {
    badge: 'Best Seller Sepanjang Masa',
    title: 'Original Savory Butter',
    description: 'Dibuat dengan taburan garam laut murni Kusamba dan mentega gurih tanpa penyedap buatan. Cocok untuk semua umur.',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    statLabel: 'Pesan Varian Ini',
  };

  $: isHeadingActive = activeNodeId === 'features_heading' || activeNodeId === 'header';
  $: isImageActive = activeNodeId === 'features_image' || activeNodeId === 'image';
  $: isItemActive = activeNodeId === `feature_item_${activeTabIdx}`;

  const handleHeadingClick = (e: MouseEvent) => {
    if (selectNode) selectNode(e, 'features_heading');
  };

  const handleHeadingKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (selectNode) selectNode(e, 'features_heading');
    }
  };

  const handleTabClick = (e: MouseEvent, idx: number) => {
    activeTabIdx = idx;
    if (selectNode) selectNode(e, `feature_item_${idx}`);
  };

  const handleImageClick = (e: MouseEvent) => {
    if (selectNode) selectNode(e, 'features_image');
  };

  const handleImageKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (selectNode) selectNode(e, 'features_image');
    }
  };

  const handleActiveItemClick = (e: MouseEvent) => {
    if (selectNode) selectNode(e, `feature_item_${activeTabIdx}`);
  };

  const handleActiveItemKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (selectNode) selectNode(e, `feature_item_${activeTabIdx}`);
    }
  };
</script>

<div class="text-center py-12">
  <div
    role="button"
    tabindex="0"
    on:click={handleHeadingClick}
    on:keydown={handleHeadingKeydown}
    class={`max-w-2xl mx-auto mb-6 p-3 rounded-2xl transition-all cursor-pointer ${
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
      <p data-node="subtitle" class="text-body-base text-[var(--color-text-secondary,#334155)] mb-2 font-sans">
        {subtitle}
      </p>
    {/if}
  </div>

  <!-- Tab Bar -->
  {#if items.length > 0}
    <div class="flex flex-wrap items-center justify-center gap-2 mb-8">
      {#each items as item, idx}
        <button
          type="button"
          on:click={(e) => handleTabClick(e, idx)}
          class={`h-10 min-h-[40px] px-5 rounded-2xl text-xs font-heading font-semibold transition-all duration-150 cursor-pointer active:scale-[0.98] ${
            activeTabIdx === idx
              ? 'bg-[var(--color-primary,#2563eb)] text-white shadow-xs'
              : 'bg-[var(--color-nested-base,#f1f5f9)] text-[var(--color-text-secondary,#334155)] hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          {item.title}
        </button>
      {/each}
    </div>
  {/if}

  <!-- Tab Panels -->
  <div class="tabs-showcase-container text-left">
    <div
      data-node="feature_card"
      role="button"
      tabindex="0"
      on:click={handleActiveItemClick}
      on:keydown={handleActiveItemKeydown}
      class={`space-y-4 p-6 rounded-2xl bg-[var(--color-card-base,#ffffff)] border border-[var(--color-border,rgba(15,23,42,0.08))] transition-all duration-150 cursor-pointer ${
        isItemActive
          ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 bg-blue-50/10 dark:bg-blue-950/10'
          : 'hover:border-blue-400/80 hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
      }`}
    >
      <span class="text-xs font-heading font-bold text-[var(--color-primary,#2563eb)] uppercase tracking-wider block">
        {activeItem.badge || 'Pilihan Unggulan'}
      </span>
      <h3 data-node="feature_title" class="text-heading-md font-heading font-black text-[var(--color-text-main,#0f172a)]">
        {activeItem.title}
      </h3>
      <p data-node="feature_desc" class="text-body-sm text-[var(--color-text-secondary,#334155)] leading-relaxed font-sans">
        {activeItem.description}
      </p>
      {#if activeItem.linkUrl || activeItem.statLabel}
        <span class="inline-flex items-center justify-center h-10 min-h-[40px] px-6 rounded-2xl bg-[var(--color-primary,#2563eb)] text-white text-xs font-heading font-semibold hover:bg-primary-dark active:scale-[0.98] shadow-xs">
          {activeItem.statLabel || 'Pesan Varian Ini'}
        </span>
      {/if}
    </div>

    <div
      role="button"
      tabindex="0"
      on:click={handleImageClick}
      on:keydown={handleImageKeydown}
      class={`w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-[var(--color-nested-base,#f1f5f9)] transition-all cursor-pointer ${
        isImageActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
          : 'hover:opacity-95'
      }`}
    >
      <img
        src={activeItem.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'}
        alt={activeItem.title}
        class="w-full h-full object-cover"
      />
    </div>
  </div>
</div>

<style>
  .tabs-showcase-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
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
    .tabs-showcase-container {
      display: grid !important;
      grid-template-columns: 5fr 7fr !important;
      align-items: center;
      gap: 32px !important;
    }
  }

  @container featurecard (min-width: 960px) {
    .title-heading {
      font-size: 2.5rem;
      line-height: 2.875rem;
    }
    .tabs-showcase-container {
      gap: 40px !important;
    }
  }
</style>
