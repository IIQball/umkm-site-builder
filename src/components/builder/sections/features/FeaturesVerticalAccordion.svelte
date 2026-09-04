<script lang="ts">
  import type { FeatureItem } from '@/types';
  import { ChevronDown } from 'lucide-svelte';

  export let badgeText: string = 'Proses Teliti';
  export let title: string = 'Kualitas Diperiksa Langkah demi Langkah';
  export let subtitle: string = 'Setiap tahapan pengolahan dipantau secara berkala untuk menjaga higienitas dan mutu rasa.';
  export let items: FeatureItem[] = [];
  export let mainImageUrl: string = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent | KeyboardEvent, key: string) => void) | undefined = undefined;

  let activeIdx: number = 0;

  $: activeItem = items[activeIdx] || items[0];
  $: isHeadingActive = activeNodeId === 'features_heading' || activeNodeId === 'header';
  $: isImageActive = activeNodeId === 'features_image' || activeNodeId === 'image';

  const handleHeadingClick = (e: MouseEvent) => {
    if (selectNode) selectNode(e, 'features_heading');
  };

  const handleHeadingKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (selectNode) selectNode(e, 'features_heading');
    }
  };

  const handleItemClick = (e: MouseEvent, index: number) => {
    activeIdx = index;
    if (selectNode) selectNode(e, `feature_item_${index}`);
  };

  const handleItemKeydown = (e: KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      activeIdx = index;
      if (selectNode) selectNode(e, `feature_item_${index}`);
    }
  };

  const handleImageClick = (e: MouseEvent) => {
    if (selectNode) selectNode(e, 'features_image');
  };

  const handleImageKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (selectNode) selectNode(e, 'features_image');
    }
  };
</script>

<div class="py-12">
  <div class="accordion-split-container">
    <!-- Akordeon List Kiri -->
    <div class="space-y-3 text-left">
      <div
        role="button"
        tabindex="0"
        on:click={handleHeadingClick}
        on:keydown={handleHeadingKeydown}
        class={`p-3 rounded-2xl transition-all cursor-pointer ${
          isHeadingActive
            ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 bg-blue-50/20 dark:bg-blue-950/20'
            : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
        }`}
      >
        {#if badgeText}
          <span
            data-node="badge"
            class="inline-flex items-center rounded-full border px-2.5 py-1 text-2xs gap-1.5 font-heading font-medium bg-blue-50/90 dark:bg-blue-950/70 border-blue-200/90 dark:border-blue-800/80 text-[var(--color-primary,#2563eb)] mb-2 shadow-2xs"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-[var(--color-primary,#2563eb)]"></span>
            {badgeText}
          </span>
        {/if}
        <h2 data-node="title" class="title-heading text-heading-lg font-heading font-extrabold text-[var(--color-text-main,#0f172a)] tracking-tight mb-2">
          {title}
        </h2>
        {#if subtitle}
          <p data-node="subtitle" class="text-body-base text-[var(--color-text-secondary,#334155)] mb-2 font-sans">
            {subtitle}
          </p>
        {/if}
      </div>

      {#each items as item, index (item.id || item.title + index)}
        {@const isExpanded = activeIdx === index}
        {@const isItemActive = activeNodeId === `feature_item_${index}`}
        <div
          data-node="feature_card"
          role="button"
          tabindex="0"
          on:click={(e) => handleItemClick(e, index)}
          on:keydown={(e) => handleItemKeydown(e, index)}
          class={`p-5 rounded-2xl border cursor-pointer transition-all duration-150 ${
            isItemActive
              ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
              : isExpanded
                ? 'border-[var(--color-primary,#2563eb)]/40 bg-blue-50/50 dark:bg-blue-950/30'
                : 'border-[var(--color-border,rgba(15,23,42,0.08))] bg-[var(--color-card-base,#ffffff)] hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          <h3 data-node="feature_title" class="text-heading-md font-heading font-semibold text-base flex items-center justify-between gap-4">
            <span class={isExpanded ? 'text-[var(--color-primary,#2563eb)]' : 'text-[var(--color-text-main,#0f172a)]'}>
              {`0${index + 1}. `}{item.title}
            </span>
            <ChevronDown
              size={18}
              class={`shrink-0 transition-transform ${
                isExpanded ? 'rotate-180 text-[var(--color-primary,#2563eb)]' : 'text-slate-400'
              }`}
            />
          </h3>
          {#if isExpanded}
            <p data-node="feature_desc" class="text-body-sm text-[var(--color-text-secondary,#334155)] leading-relaxed mt-2 font-sans">
              {item.description}
            </p>
          {/if}
        </div>
      {/each}
    </div>

    <!-- Ilustrasi Kanan -->
    <div
      role="button"
      tabindex="0"
      on:click={handleImageClick}
      on:keydown={handleImageKeydown}
      class={`w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-[var(--color-nested-base,#f1f5f9)] transition-all cursor-pointer ${
        isImageActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
          : 'hover:opacity-95'
      }`}
    >
      <img
        src={activeItem?.imageUrl || mainImageUrl}
        alt={activeItem?.title || title}
        class="w-full h-full object-cover transition-all duration-300"
      />
    </div>
  </div>
</div>

<style>
  .accordion-split-container {
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
    .accordion-split-container {
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
    .accordion-split-container {
      gap: 40px !important;
    }
  }
</style>
