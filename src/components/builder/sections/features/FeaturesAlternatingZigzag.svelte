<script lang="ts">
  import type { FeatureItem } from '@/types';

  export let badgeText: string = 'Proses Produksi';
  export let title: string = '';
  export let subtitle: string = '';
  export let items: FeatureItem[] = [];
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent | KeyboardEvent, key: string) => void) | undefined = undefined;

  $: isHeadingActive = activeNodeId === 'features_heading' || activeNodeId === 'header';

  const handleHeadingClick = (e: MouseEvent) => {
    if (selectNode) selectNode(e, 'features_heading');
  };

  const handleHeadingKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (selectNode) selectNode(e, 'features_heading');
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

  const handleImageClick = (e: MouseEvent, index: number) => {
    if (selectNode) selectNode(e, `feature_item_${index}`);
  };

  const handleImageKeydown = (e: KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
      if (selectNode) selectNode(e, `feature_item_${index}`);
    }
  };
</script>

<div class="py-12 space-y-12">
  {#if title || badgeText}
    <div
      role="button"
      tabindex="0"
      on:click={handleHeadingClick}
      on:keydown={handleHeadingKeydown}
      class={`text-center max-w-2xl mx-auto mb-8 p-3 rounded-2xl transition-all cursor-pointer ${
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
      {#if title}
        <h2 data-node="title" class="title-heading text-heading-lg font-heading font-extrabold text-[var(--color-text-main,#0f172a)] tracking-tight mb-3">
          {title}
        </h2>
      {/if}
      {#if subtitle}
        <p data-node="subtitle" class="text-body-base text-[var(--color-text-secondary,#334155)] leading-relaxed font-sans">
          {subtitle}
        </p>
      {/if}
    </div>
  {/if}

  {#each items as item, index (item.id || item.title + index)}
    {@const isEven = index % 2 === 1}
    {@const isItemActive = activeNodeId === `feature_item_${index}`}
    <div
      data-node="feature_card"
      role="button"
      tabindex="0"
      on:click={(e) => handleItemClick(e, index)}
      on:keydown={(e) => handleItemKeydown(e, index)}
      class={`zigzag-item p-4 rounded-2xl transition-all duration-150 cursor-pointer ${isEven ? 'zigzag-reverse' : ''} ${
        isItemActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 bg-blue-50/10 dark:bg-blue-950/10'
          : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
      }`}
    >
      <div class="text-left">
        <span class={`text-xs font-heading font-bold uppercase tracking-wider block mb-2 ${isEven ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--color-primary,#2563eb)]'}`}>
          {item.badge || `Langkah 0${index + 1}`}
        </span>
        <h3 data-node="feature_title" class="text-heading-md font-heading font-black text-[var(--color-text-main,#0f172a)] mb-3">
          {item.title}
        </h3>
        <p data-node="feature_desc" class="text-body-sm text-[var(--color-text-secondary,#334155)] leading-relaxed font-sans">
          {item.description}
        </p>
      </div>
      <div
        role="button"
        tabindex="0"
        on:click|stopPropagation={(e) => handleImageClick(e, index)}
        on:keydown={(e) => handleImageKeydown(e, index)}
        class="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md bg-[var(--color-nested-base,#f1f5f9)]"
      >
        <img
          src={item.imageUrl || (isEven ? 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80')}
          alt={item.title}
          class="w-full h-full object-cover"
        />
      </div>
    </div>
  {/each}
</div>

<style>
  .zigzag-item {
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
    .zigzag-item {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      align-items: center;
      gap: 32px !important;
    }
    .zigzag-reverse {
      direction: rtl;
    }
    .zigzag-reverse > div {
      direction: ltr;
    }
  }

  @container featurecard (min-width: 960px) {
    .title-heading {
      font-size: 2.5rem;
      line-height: 2.875rem;
    }
    .zigzag-item {
      gap: 40px !important;
    }
  }
</style>
