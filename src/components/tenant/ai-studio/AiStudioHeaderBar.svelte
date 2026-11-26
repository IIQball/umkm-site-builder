<script lang="ts">
  import { Badge } from '@/components/ui';
  import { Sparkles, Image as ImageIcon, Zap } from 'lucide-svelte';
  import type { AiStudioMainTab } from './studio.types';

  export let mainTab: AiStudioMainTab = 'studio';
  export let assetsCount = 0;
  export let storeName = '';
  export let creditBalance = 0;
  export let creditStatusStyle: { badge: string; subtext: string };
</script>

<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-card rounded-3xl border border-light shadow-xs">
  <div class="flex items-center gap-1.5 p-1 bg-nested rounded-2xl border border-light overflow-x-auto max-w-full">
    <button
      type="button"
      class="px-4 py-2 text-xs font-heading font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap {mainTab === 'studio' ? 'bg-card text-main shadow-xs border border-light' : 'text-secondary hover:text-main'}"
      on:click={() => (mainTab = 'studio')}
    >
      <Sparkles size={14} class="text-primary" />
      <span>Studio Desain</span>
    </button>
    <button
      type="button"
      class="px-4 py-2 text-xs font-heading font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap {mainTab === 'gallery' ? 'bg-card text-main shadow-xs border border-light' : 'text-secondary hover:text-main'}"
      on:click={() => (mainTab = 'gallery')}
    >
      <ImageIcon size={14} />
      <span>Galeri Desain ({assetsCount})</span>
    </button>
  </div>

  <div class="flex flex-wrap items-center gap-2.5">
    {#if storeName}
      <Badge variant="secondary" size="md" dot={true}>Toko: {storeName}</Badge>
    {/if}
    <a
      href="/dashboard/credits/buy"
      class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs border {creditStatusStyle.badge}"
      title="Klik untuk isi ulang kredit"
    >
      <Zap size={13} />
      <span>{creditBalance} Kredit</span>
      <span class="text-2xs font-normal {creditStatusStyle.subtext}">• Top Up</span>
    </a>
    <Badge variant="primary" size="md" dot={false}>Studio Visual</Badge>
  </div>
</div>

