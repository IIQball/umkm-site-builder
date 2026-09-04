<script lang="ts">
  import type { FeatureItem } from '@/types';

  export let badgeText: string = 'Nilai Tambah Kami';
  export let title: string = 'Pelayanan Nyaman Dari Awal Hingga Selesai';
  export let subtitle: string = 'Kami tidak sekadar menjual barang, melainkan memberikan pengalaman belanja yang transparan dan amanah.';
  export let items: FeatureItem[] = [];
  export let ctaText: string = 'Hubungi Kami Langsung';
  export let ctaLink: string = '#';
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
    <!-- Sticky Heading Kiri -->
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
          class="inline-flex items-center rounded-full border px-2.5 py-1 text-2xs gap-1.5 font-heading font-medium bg-blue-50/90 dark:bg-blue-950/70 border-blue-200/90 dark:border-blue-800/80 text-[var(--color-primary,#2563eb)] mb-4 shadow-2xs"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-[var(--color-primary,#2563eb)]"></span>
          {badgeText}
        </span>
      {/if}
      <h2 data-node="title" class="title-heading text-heading-lg font-heading font-black text-[var(--color-text-main,#0f172a)] tracking-tight mb-4">
        {title}
      </h2>
      {#if subtitle}
        <p data-node="subtitle" class="text-body-base text-[var(--color-text-secondary,#334155)] leading-relaxed mb-6 font-sans">
          {subtitle}
        </p>
      {/if}
      {#if ctaText}
        <a
          href={ctaLink || '#'}
          class="inline-flex items-center justify-center h-10 min-h-[40px] px-5 py-2.5 rounded-2xl bg-[var(--color-primary,#2563eb)] text-white text-sm font-heading font-semibold hover:bg-primary-dark active:scale-[0.98] transition-all duration-150 cursor-pointer shadow-xs"
        >
          {ctaText}
        </a>
      {/if}
    </div>

    <!-- Kartu Bertumpuk Kanan -->
    <div class="space-y-4 text-left">
      {#each items as item, idx (item.id || item.title + idx)}
        {@const isItemActive = activeNodeId === `feature_item_${idx}`}
        <div
          data-node="feature_card"
          role="button"
          tabindex="0"
          on:click={(e) => handleItemClick(e, idx)}
          on:keydown={(e) => handleItemKeydown(e, idx)}
          class={`bg-[var(--color-card-base,#ffffff)] p-6 rounded-2xl shadow-xs border border-[var(--color-border,rgba(15,23,42,0.08))] transition-all duration-150 cursor-pointer ${
            isItemActive
              ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
              : 'hover:border-blue-400/80 hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
          }`}
        >
          <span class="text-xs font-mono font-bold text-[var(--color-primary,#2563eb)] block">
            {item.badge || `0${idx + 1} / BENEFIT`}
          </span>
          <h3 data-node="feature_title" class="text-heading-md font-heading font-bold text-[var(--color-text-main,#0f172a)] mt-1 mb-2">
            {item.title}
          </h3>
          <p data-node="feature_desc" class="text-body-sm text-[var(--color-text-secondary,#334155)] leading-relaxed font-sans">
            {item.description}
          </p>
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
