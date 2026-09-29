<script lang="ts">
  import HeroHeaderContent from './HeroHeaderContent.svelte';

  export let badgeText: string = '🌿 Organik & Higienis';
  export let tagName: string = 'h1';
  export let title: string = 'Kemasan Aman, Nutrisi Alami Terjaga Utuh';
  export let subtitle: string = 'Diproduksi dengan standar keamanan pangan tertinggi. Cocok untuk konsumsi harian keluarga dan oleh-oleh premium.';
  export let ctaText: string = 'Pesan Sekarang';
  export let ctaLink: string = '#';
  export let secondaryCtaText: string = 'Sertifikasi Kami';
  export let secondaryCtaLink: string = '#certification';
  export let imageUrl: string = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80'
  export let waNumber: string = '';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'cta', 'trust_badges', 'image'];

  $: hasImage = elementOrder.includes('image');
  $: hasTrustBadges = elementOrder.includes('trust_badges');
  $: imgIdx = elementOrder.indexOf('image');
  $: titleIdx = elementOrder.indexOf('title') !== -1 ? elementOrder.indexOf('title') : 1;
  $: isImageLeft = imgIdx !== -1 ? imgIdx < titleIdx : false;
  $: isImageActive = activeNodeId === 'hero_image' || activeNodeId === 'image';
  $: isBadgesActive = activeNodeId === 'hero_trust_badges' || activeNodeId === 'trust_badges';
</script>

{#snippet badgesBlock(centered = false)}
  {#if hasTrustBadges}
    <div
      data-node="hero_trust_badges"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_trust_badges')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_trust_badges')}
      class={`flex flex-wrap items-center ${centered ? 'justify-center' : 'justify-start'} gap-4 pt-4 border-t border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] font-medium p-1.5 rounded-xl transition-all cursor-pointer ${
        isBadgesActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900 bg-primary/10'
          : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
    >
      <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full" style="background-color: var(--color-primary);"></span> Halal MUI</span>
      <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full" style="background-color: var(--color-primary);"></span> Izin BPOM RI</span>
      <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full" style="background-color: var(--color-primary);"></span> P-IRT Terdaftar</span>
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
      class={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-[var(--color-nested-base)] transition-all cursor-pointer ${
        isImageActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
          : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
    >
      <img src={imageUrl} alt={title} class="w-full h-full object-cover" />
      <div
        style="background-color: var(--color-primary); color: var(--theme-btn-primary-text, currentColor);"
        class="badge badge-primary absolute top-4 right-4 w-14 h-14 rounded-full p-0 flex items-center justify-center text-[10px] font-bold text-center leading-tight shadow-lg rotate-12 border-0"
      >
        100%<br />ASLI
      </div>
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
    {@render badgesBlock(align === 'center')}
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
