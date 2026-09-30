<script lang="ts">
  import { CheckCircle2 } from 'lucide-svelte';
  import HeroHeaderContent from './HeroHeaderContent.svelte';
  import HeroImageCard from './HeroImageCard.svelte';

  import { resolveFeatureIcon, stripEmoji } from './heroIcons';

  export let badgeText: string = 'Organik & Higienis';
  export let badgeIcon: string = 'leaf';
  export let tagName: string = 'h1';
  export let title: string = 'Kemasan Aman, Nutrisi Alami Terjaga Utuh';
  export let subtitle: string = 'Diproduksi dengan standar keamanan pangan tertinggi. Cocok untuk konsumsi harian keluarga dan oleh-oleh premium.';
  export let ctaText: string = 'Pesan Sekarang';
  export let ctaLink: string = '#';
  export let secondaryCtaText: string = 'Sertifikasi Kami';
  export let secondaryCtaLink: string = '#certification';
  export let imageUrl: string = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80';
  export let imageFrame: 'none' | 'card' | 'grid' = 'none';
  export let imageShape: 'rounded' | 'square' | 'circle' | 'squircle' = 'rounded';
  export let waNumber: string = '';
  export let trustBadges: Array<{ text: string; icon?: string }> = [];
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

  $: defaultBadges = [
    { text: 'Halal MUI', icon: 'CheckCircle2' },
    { text: 'Izin BPOM RI', icon: 'CheckCircle2' },
    { text: 'P-IRT Terdaftar', icon: 'CheckCircle2' },
  ];
  $: activeBadges = Array.isArray(trustBadges) && trustBadges.length > 0 ? trustBadges : defaultBadges;
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
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 bg-primary/10'
          : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
    >
      {#each activeBadges as badge}
        {@const IconComp = resolveFeatureIcon(badge.icon || 'CheckCircle2') || CheckCircle2}
        <span class="flex items-center gap-1.5">
          <svelte:component this={IconComp} size={13} style="color: var(--color-primary);" />
          <span>{stripEmoji(badge.text)}</span>
        </span>
      {/each}
    </div>
  {/if}
{/snippet}

{#snippet imageBlock()}
  {#if imageUrl}
    <HeroImageCard
      {imageUrl}
      altText={title}
      {imageFrame}
      {imageShape}
      aspectRatio="aspect-[4/3]"
      nodeKey="hero_image"
      isActive={isImageActive}
      {selectNode}
      {selectNodeKey}
    />
  {/if}
{/snippet}

{#snippet textBlock(align: 'left' | 'center')}
  <div class={align === 'center' ? 'max-w-2xl mx-auto text-center space-y-6' : 'text-left space-y-6'}>
    <HeroHeaderContent
      {badgeText}
      {badgeIcon}
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
