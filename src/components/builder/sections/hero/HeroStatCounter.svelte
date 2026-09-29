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
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'cta', 'stat_counter', 'image'];

  $: hasImage = elementOrder.includes('image');
  $: hasStatCounter = elementOrder.includes('stat_counter');
  $: imgIdx = elementOrder.indexOf('image');
  $: titleIdx = elementOrder.indexOf('title') !== -1 ? elementOrder.indexOf('title') : 1;
  $: isImageLeft = imgIdx !== -1 ? imgIdx < titleIdx : false;
  $: isStatActive = activeNodeId === 'hero_stat_counter' || activeNodeId === 'stat_counter';
  $: isImageActive = activeNodeId === 'hero_image' || activeNodeId === 'image';
</script>

{#snippet statBlock()}
  {#if hasStatCounter}
    <div
      data-node="hero_stat_counter"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_stat_counter')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_stat_counter')}
      class={`cq-stat-container pt-6 border-t border-[var(--color-border)] rounded-2xl p-2 transition-all cursor-pointer ${
        isStatActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900 bg-primary/10'
          : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
    >
      <div class="stats stats-horizontal shadow-none bg-transparent w-full border-0">
        <div class="stat px-2 py-1">
          <div class="stat-value text-2xl font-heading font-black text-[var(--color-text-main)]">25.000+</div>
          <div class="stat-desc text-xs text-[var(--color-text-secondary)] font-medium font-sans">Porsi Terkirim</div>
        </div>
        <div class="stat px-2 py-1">
          <div class="stat-value text-2xl font-heading font-black text-[var(--color-text-main)]">4.9 / 5.0</div>
          <div class="stat-desc text-xs text-[var(--color-text-secondary)] font-medium font-sans">Kepuasan Konsumen</div>
        </div>
        <div class="stat px-2 py-1">
          <div class="stat-value text-2xl font-heading font-black text-[var(--color-text-main)]">100%</div>
          <div class="stat-desc text-xs text-[var(--color-text-secondary)] font-medium font-sans">Higienis & Halal</div>
        </div>
      </div>
    </div>
  {/if}
{/snippet}

{#snippet imageBlock()}
  {#if imageUrl}
    <div
      data-node="image"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_image')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_image')}
      class={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-[var(--color-nested-base)] border border-[var(--color-border)] transition-all cursor-pointer p-1 ${
        isImageActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
          : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
    >
      <img src={imageUrl} alt={title} class="w-full h-full object-cover rounded-xl" />
    </div>
  {/if}
{/snippet}

{#snippet textBlock(align: 'left' | 'center')}
  <div class={align === 'center' ? 'max-w-2xl mx-auto text-center space-y-6' : 'text-left space-y-6'}>
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
      {elementOrder}
      {align}
    />
    {@render statBlock()}
  </div>
{/snippet}

<div class="py-10">
  {#if !hasImage}
    {@render textBlock('center')}
  {:else}
    <div class="cq-grid-split items-center gap-8">
      {#if isImageLeft}
        {@render imageBlock()}
        {@render textBlock('left')}
      {:else}
        {@render textBlock('left')}
        {@render imageBlock()}
      {/if}
    </div>
  {/if}
</div>
