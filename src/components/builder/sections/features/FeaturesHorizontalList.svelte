<script lang="ts">
  import type { FeatureItem } from '@/types';
  import { resolveFeatureIcon } from './featureIcons';

  export let badgeText: string = 'Standar Kualitas';
  export let title: string = 'Komitmen Terbaik di Setiap Pesanan';
  export let subtitle: string = 'Kami memastikan setiap tahapan dari kebun hingga ke tangan Anda melewati proses kurasi ketat.';
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
</script>

<div class="py-12">
  <div class="asym-split-container">
    <!-- Kolom Kiri Sticky -->
    <div
      role="button"
      tabindex="0"
      on:click={handleHeadingClick}
      on:keydown={handleHeadingKeydown}
      class={`text-left asym-sticky-left self-start p-3 rounded-2xl transition-all cursor-pointer ${
        isHeadingActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 bg-blue-50/20 dark:bg-blue-950/20'
          : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
      }`}
    >
      {#if badgeText}
        <span
          data-node="badge"
          class="inline-flex items-center rounded-full border px-2.5 py-1 text-2xs gap-1.5 font-heading font-medium bg-emerald-50/90 dark:bg-emerald-950/70 border-emerald-200/90 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 mb-4 shadow-2xs"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
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

    <!-- Kolom Kanan List -->
    <div class="space-y-4 text-left">
      {#each items as item, index (item.id || item.title + index)}
        {@const isItemActive = activeNodeId === `feature_item_${index}`}
        <div
          data-node="feature_card"
          role="button"
          tabindex="0"
          on:click={(e) => handleItemClick(e, index)}
          on:keydown={(e) => handleItemKeydown(e, index)}
          class={`bg-[var(--color-card-base,#ffffff)] p-6 rounded-2xl border border-[var(--color-border,rgba(15,23,42,0.08))] transition-all duration-150 flex items-start gap-4 shadow-xs cursor-pointer ${
            isItemActive
              ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
              : 'hover:border-blue-400/80 hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
          }`}
        >
          <div
            data-node="feature_icon"
            class="w-12 h-12 rounded-xl bg-[var(--color-primary,#2563eb)]/10 text-[var(--color-primary,#2563eb)] border border-[var(--color-primary,#2563eb)]/20 flex items-center justify-center shrink-0"
          >
            <svelte:component this={resolveFeatureIcon(item.icon || item.iconName)} size={22} />
          </div>
          <div class="flex-1 min-w-0">
            <h3 data-node="feature_title" class="text-heading-md font-heading font-semibold text-[var(--color-text-main,#0f172a)] mb-1">
              {item.title}
            </h3>
            <p data-node="feature_desc" class="text-body-sm text-[var(--color-text-secondary,#334155)] leading-relaxed font-sans">
              {item.description}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .asym-split-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
  }

  .title-heading {
    font-size: 1.625rem;
    line-height: 2rem;
  }

  .asym-sticky-left {
    position: static;
  }

  @container featurecard (min-width: 640px) {
    .title-heading {
      font-size: 2.125rem;
      line-height: 2.5rem;
    }
    .asym-split-container {
      display: grid !important;
      grid-template-columns: 4fr 8fr !important;
      gap: 32px !important;
    }
    .asym-sticky-left {
      position: sticky;
      top: 2rem;
    }
  }

  @container featurecard (min-width: 960px) {
    .title-heading {
      font-size: 2.5rem;
      line-height: 2.875rem;
    }
    .asym-split-container {
      gap: 40px !important;
    }
  }
</style>
