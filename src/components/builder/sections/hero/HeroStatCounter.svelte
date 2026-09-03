<script lang="ts">
  import HeroHeaderContent from './HeroHeaderContent.svelte';

  export let badgeText: string = 'Catering Harian & Prasmanan';
  export let tagName: string = 'h1';
  export let title: string = 'Pilihan Utama Jamuan Kantor & Syukuran';
  export let subtitle: string = 'Menyajikan menu prasmanan higienis, lezat, dan tepat waktu untuk berbagai skala acara.';
  export let ctaText: string = 'Pesan Paket Catering';
  export let ctaLink: string = '#';
  export let secondaryCtaText: string = '';
  export let secondaryCtaLink: string = '#';
  export let imageUrl: string = 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80';
  export let waNumber: string = '';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;

  $: isStatActive = activeNodeId === 'hero_stat_counter' || activeNodeId === 'stat_counter';
  $: isImageActive = activeNodeId === 'hero_image' || activeNodeId === 'image';
</script>

<div class="py-10">
  <div class="cq-grid-split items-center gap-8">
    <div class="text-left space-y-6">
      <HeroHeaderContent
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        {secondaryCtaText}
        {secondaryCtaLink}
        {waNumber}
        {activeNodeId}
        {selectNode}
        {selectNodeKey}
        align="left"
      />

      <!-- Stat Metrics Counter Row (Sub-node hero_stat_counter) -->
      <div
        data-node="hero_stat_counter"
        role="button"
        tabindex="0"
        on:click={(e) => selectNode && selectNode(e, 'hero_stat_counter')}
        on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_stat_counter')}
        class={`cq-stat-container pt-6 border-t border-[var(--color-border,rgba(15,23,42,0.08))] rounded-2xl p-2 transition-all cursor-pointer ${
          isStatActive
            ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 bg-blue-50/20 dark:bg-blue-950/20'
            : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
        }`}
      >
        <div>
          <p class="text-2xl font-heading font-black text-[var(--color-text-main,#0f172a)]">25.000+</p>
          <p class="text-xs text-[var(--color-text-secondary,#334155)] font-medium font-sans">Porsi Terkirim</p>
        </div>
        <div>
          <p class="text-2xl font-heading font-black text-[var(--color-text-main,#0f172a)]">4.9 / 5.0</p>
          <p class="text-xs text-[var(--color-text-secondary,#334155)] font-medium font-sans">Kepuasan Konsumen</p>
        </div>
        <div>
          <p class="text-2xl font-heading font-black text-[var(--color-text-main,#0f172a)]">100%</p>
          <p class="text-xs text-[var(--color-text-secondary,#334155)] font-medium font-sans">Higienis & Halal</p>
        </div>
      </div>
    </div>

    <!-- Image Showcase (Sub-node hero_image) -->
    <div
      data-node="image"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_image')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_image')}
      class={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-slate-100 dark:bg-slate-800 transition-all cursor-pointer p-1 ${
        isImageActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
          : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
      }`}
    >
      <img src={imageUrl} alt={title} class="w-full h-full object-cover rounded-xl" />
    </div>
  </div>
</div>
