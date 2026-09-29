<script lang="ts">
  import { Check, X } from 'lucide-svelte';
  import FeaturesHeaderTitle from './FeaturesHeaderTitle.svelte';

  export let badgeText: string = 'Komparasi Kualitas';
  export let title: string = 'Bandingkan Kualitasnya';
  export let subtitle: string = 'Mengapa beralih ke produk olahan tangan UMKM kami jauh lebih menguntungkan?';
  export let beforeTitle: string = 'Produk Pasaran Biasa';
  export let beforeItems: string[] = [
    'Memakai minyak curah berulang kali',
    'Pengawet kimia sintetis berlebih',
    'Tekstur keras dan cepat tengik',
    'Tanpa jaminan sertifikasi resmi',
  ];
  export let afterTitle: string = 'Olahan Dapur UMKM Kami';
  export let afterItems: string[] = [
    'Minyak kelapa murni sekali pakai',
    '100% bumbu rempah segar alami',
    'Renyah tahan 6 bulan berkat kemasan vakum',
    'Bersertifikat Halal MUI & BPOM',
  ];
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent | KeyboardEvent, key: string) => void) | undefined = undefined;
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'before_card', 'after_card'];

  $: hasHeader = elementOrder.some((s) => ['badge', 'title', 'subtitle'].includes(s));
  $: hasBefore = elementOrder.includes('before_card') || elementOrder.includes('features_grid');
  $: hasAfter = elementOrder.includes('after_card') || elementOrder.includes('features_grid');
  $: isGridFirst = (elementOrder.indexOf('before_card') === 0) || (elementOrder.indexOf('after_card') === 0) || (elementOrder.indexOf('features_grid') === 0);
  $: isAfterBefore = elementOrder.indexOf('after_card') !== -1 && elementOrder.indexOf('before_card') !== -1 && elementOrder.indexOf('after_card') < elementOrder.indexOf('before_card');

  const handleBeforeClick = (e: MouseEvent) => {
    if (selectNode) selectNode(e, 'feature_item_0');
  };

  const handleBeforeKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (selectNode) selectNode(e, 'feature_item_0');
    }
  };

  const handleAfterClick = (e: MouseEvent) => {
    if (selectNode) selectNode(e, 'feature_item_1');
  };

  const handleAfterKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (selectNode) selectNode(e, 'feature_item_1');
    }
  };
</script>

<div class="py-12 text-center flex flex-col">
  {#if hasHeader}
    <div style="order: {isGridFirst ? 2 : 1};">
      <FeaturesHeaderTitle
        {badgeText}
        {title}
        {subtitle}
        {activeNodeId}
        {selectNode}
        {elementOrder}
        maxWidthClass="max-w-xl"
      />
    </div>
  {/if}

  {#if hasBefore || hasAfter}
    <div class="comparison-grid text-left" style="order: {isGridFirst ? 1 : 2};">
    {#if hasBefore}
      <!-- Kartu Sebelum / Produk Biasa -->
      <div
        data-node="feature_card"
        role="button"
        tabindex="0"
        on:click={handleBeforeClick}
        on:keydown={handleBeforeKeydown}
        class={`bg-[var(--color-nested-base)] p-6 border space-y-4 shadow-xs transition-all duration-150 cursor-pointer ${
          activeNodeId === 'feature_item_0'
            ? 'border-[var(--color-primary)] ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
            : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/80 hover:outline-dashed hover:outline-1 hover:outline-primary/50'
        }`}
        style="border-radius: var(--btn-radius, 16px); order: {isAfterBefore ? 2 : 1};"
      >
        <span
          class="badge badge-outline gap-1 text-xs font-heading font-medium px-3 py-1"
          style="background-color: var(--color-card-base); border-color: var(--color-border); color: var(--color-text-muted);"
        >
          {beforeTitle}
        </span>
        <ul class="space-y-3 text-xs font-sans" style="color: var(--color-text-muted);">
          {#each beforeItems as item}
            <li class="flex items-center gap-2" style="color: var(--color-error);">
              <X size={15} class="shrink-0" />
              <span>{item}</span>
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    {#if hasAfter}
      <!-- Kartu Sesudah / Produk Kami -->
      <div
        data-node="feature_card"
        role="button"
        tabindex="0"
        on:click={handleAfterClick}
        on:keydown={handleAfterKeydown}
        class={`bg-[var(--color-card-base)] p-6 border-2 space-y-4 shadow-sm relative transition-all duration-150 cursor-pointer ${
          activeNodeId === 'feature_item_1'
            ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
            : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
        }`}
        style="border-radius: var(--btn-radius, 16px); border-color: var(--color-primary); order: {isAfterBefore ? 1 : 2};"
      >
        <span
          class="badge badge-primary gap-1 text-xs font-heading font-semibold shadow-xs px-3 py-1"
          style="background-color: var(--btn-primary-bg, var(--color-primary)); color: var(--theme-btn-primary-text, var(--btn-primary-text, currentColor));"
        >
          {afterTitle}
        </span>
        <ul class="space-y-3 text-xs text-[var(--color-text-main)] font-medium font-sans">
          {#each afterItems as item}
            <li class="flex items-center gap-2" style="color: var(--color-primary);">
              <Check size={15} class="shrink-0" />
              <span>{item}</span>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
    </div>
  {/if}
</div>

<style>
  .comparison-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }

  @container featurecard (min-width: 640px) {
    .comparison-grid {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 24px !important;
    }
  }
</style>
