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

<div class="py-12 text-center">
  <FeaturesHeaderTitle
    {badgeText}
    {title}
    {subtitle}
    {activeNodeId}
    {selectNode}
    badgeColorClass="bg-emerald-50/90 dark:bg-emerald-950/70 border-emerald-200/90 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300"
    dotColorClass="bg-emerald-500"
    maxWidthClass="max-w-xl"
  />

  <div class="comparison-grid text-left">
    <!-- Kartu Sebelum / Produk Biasa -->
    <div
      data-node="feature_card"
      role="button"
      tabindex="0"
      on:click={handleBeforeClick}
      on:keydown={handleBeforeKeydown}
      class={`bg-[var(--color-nested-base,#f1f5f9)] p-6 rounded-2xl border space-y-4 shadow-xs transition-all duration-150 cursor-pointer ${
        activeNodeId === 'feature_item_0'
          ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
          : 'border-[var(--color-border,rgba(15,23,42,0.08))] hover:border-blue-400/80 hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
      }`}
    >
      <span class="inline-flex items-center rounded-full border border-slate-300 dark:border-slate-700 px-3 py-1 bg-slate-200/80 dark:bg-slate-800/80 text-[var(--color-text-secondary,#334155)] text-xs font-heading font-medium">
        {beforeTitle}
      </span>
      <ul class="space-y-3 text-xs text-[var(--color-text-muted,#64748b)] font-sans">
        {#each beforeItems as item}
          <li class="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <X size={15} class="shrink-0" />
            <span>{item}</span>
          </li>
        {/each}
      </ul>
    </div>

    <!-- Kartu Sesudah / Produk Kami -->
    <div
      data-node="feature_card"
      role="button"
      tabindex="0"
      on:click={handleAfterClick}
      on:keydown={handleAfterKeydown}
      class={`bg-[var(--color-card-base,#ffffff)] p-6 rounded-2xl border-2 space-y-4 shadow-sm relative transition-all duration-150 cursor-pointer ${
        activeNodeId === 'feature_item_1'
          ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
          : 'border-emerald-500 hover:border-blue-400/80 hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
      }`}
    >
      <span class="inline-flex items-center rounded-full bg-emerald-600 text-white px-3 py-1 text-xs font-heading font-semibold shadow-xs">
        {afterTitle}
      </span>
      <ul class="space-y-3 text-xs text-[var(--color-text-main,#0f172a)] font-medium font-sans">
        {#each afterItems as item}
          <li class="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <Check size={15} class="shrink-0" />
            <span>{item}</span>
          </li>
        {/each}
      </ul>
    </div>
  </div>
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
