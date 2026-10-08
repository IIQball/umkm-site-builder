<script lang="ts">
  import { generateWhatsAppLink } from '@/lib/whatsapp';
  import HeroImageCard from './HeroImageCard.svelte';
  import { resolveFeatureIcon, stripEmoji } from './heroIcons';

  export let badgeText: string = 'HOT NEW MENU 2026';
  export let badgeIcon: string = 'Flame';
  export let tagName: string = 'h1';
  export let title: string = 'Sensasi Pedas Manis Bikin Nagih Terus!';
  export let subtitle: string = 'Camilan kriuk dengan bumbu tabur melimpah. Cocok untuk teman nonton dan nongkrong asyik.';
  export let ctaText: string = 'Borong Sekarang';
  export let ctaLink: string = '#';
  export let imageUrl: string = 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80';
  export let imageFrame: 'none' | 'card' | 'grid' = 'none';
  export let imageShape: 'rounded' | 'square' | 'circle' | 'squircle' = 'rounded';
  export let waNumber: string = '';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'cta', 'image'];
  export let stickerText: string = 'PROMO TERBATAS!';
  export let badgeBgColor: string = '';
  export let cardBgColor: string = '';

  $: hasImage = elementOrder.includes('image');
  $: imgIdx = elementOrder.indexOf('image');
  $: titleIdx = elementOrder.indexOf('title') !== -1 ? elementOrder.indexOf('title') : 1;
  $: isImageLeft = imgIdx !== -1 ? imgIdx < titleIdx : false;
  $: textSlots = elementOrder.filter((s) => s !== 'image');

  $: waUrl = generateWhatsAppLink(waNumber, `Halo, saya mau beli: ${title}`);
  $: effectiveCtaLink = waNumber ? waUrl : ctaLink;

  $: isBadgeActive = activeNodeId === 'hero_badge' || activeNodeId === 'badge';
  $: isTitleActive = activeNodeId === 'hero_title' || activeNodeId === 'title';
  $: isSubtitleActive = activeNodeId === 'hero_subtitle' || activeNodeId === 'subtitle';
  $: isCtaActive = activeNodeId === 'hero_cta' || activeNodeId === 'cta';
  $: isImageActive = activeNodeId === 'hero_image' || activeNodeId === 'image';
</script>

{#snippet promoSticker()}
  <span
    class="absolute bottom-4 left-4 font-black text-xs px-3 py-1.5 rounded-lg shadow-md -rotate-6 font-heading z-10"
    style="background-color: {badgeBgColor || 'var(--theme-secondary, var(--color-secondary, #fbbf24))'}; color: {badgeBgColor ? 'white' : '#0f172a'};"
  >
    {stickerText || 'PROMO TERBATAS!'}
  </span>
{/snippet}

{#snippet imageBlock()}
  {#if imageUrl}
    <HeroImageCard
      {imageUrl}
      altText={title}
      {imageFrame}
      {imageShape}
      aspectRatio="aspect-square"
      maxWidthClass="w-full max-w-sm mx-auto"
      nodeKey="hero_image"
      isActive={isImageActive}
      {selectNode}
      {selectNodeKey}
      customOverlay={promoSticker}
    />
  {/if}
{/snippet}

{#snippet textBlock(centered = false)}
  <div class={centered ? 'text-center space-y-4 max-w-2xl mx-auto' : 'text-left space-y-4'}>
    {#each textSlots as slot (slot)}
      {#if slot === 'badge' && badgeText}
        {@const IconComponent = resolveFeatureIcon(badgeIcon)}
        <div
          data-node="badge"
          role="button"
          tabindex="0"
          on:click={(e) => selectNode && selectNode(e, 'hero_badge')}
          on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_badge')}
          style="border-radius: var(--theme-btn-radius, var(--btn-radius, 9999px)); font-family: var(--font-heading, inherit);"
          class={`badge badge-outline inline-flex items-center gap-1.5 px-3 py-1 text-2xs font-heading font-medium border border-[var(--color-border)] bg-[var(--color-card-base)] text-[var(--color-text-main)] shadow-xs -rotate-2 mb-2 transition-all cursor-pointer ${
            isBadgeActive ? 'ring-2 ring-primary ring-offset-2' : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
          }`}
        >
          {#if IconComponent}
            <svelte:component this={IconComponent} size={12} class="text-[var(--color-primary)] shrink-0" />
          {:else}
            <span class="w-1.5 h-1.5 rounded-full" style="background-color: var(--color-primary);"></span>
          {/if}
          <span>{stripEmoji(badgeText)}</span>
        </div>
      {:else if slot === 'title'}
        <svelte:element
          this={tagName || 'h1'}
          data-node="title"
          role="button"
          tabindex="0"
          on:click={(e) => selectNode && selectNode(e, 'hero_title')}
          on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_title')}
          style="font-size: var(--text-h1-size, inherit); font-weight: var(--text-h1-weight, inherit); font-family: var(--font-heading, inherit); color: var(--color-text-main);"
          class={`text-heading-xl font-heading font-black tracking-tight mb-2 transition-all cursor-pointer rounded-xl p-1.5 -ml-1.5 block ${
            isTitleActive ? 'ring-2 ring-primary ring-offset-2 bg-primary/10' : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
          }`}
        >
          {title}
        </svelte:element>
      {:else if slot === 'subtitle' && subtitle}
        <div
          data-node="subtitle"
          role="button"
          tabindex="0"
          on:click={(e) => selectNode && selectNode(e, 'hero_subtitle')}
          on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_subtitle')}
          class={`cursor-pointer mb-2 rounded-xl p-1.5 -ml-1.5 transition-all ${
            isSubtitleActive ? 'ring-2 ring-primary ring-offset-2 bg-primary/10' : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
          }`}
        >
          <p
            style="font-size: var(--text-body-size, inherit); font-weight: var(--text-body-weight, inherit); color: var(--color-text-secondary);"
            class="text-body-base leading-relaxed"
          >
            {subtitle}
          </p>
        </div>
      {:else if slot === 'cta' && ctaText}
        <div
          data-node="cta"
          role="button"
          tabindex="0"
          on:click={(e) => selectNode && selectNode(e, 'hero_cta')}
          on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_cta')}
          class={`cq-btn-group pt-2 rounded-xl p-1.5 -ml-1.5 transition-all cursor-pointer ${
            centered ? 'justify-center' : 'justify-start'
          } ${
            isCtaActive ? 'ring-2 ring-primary ring-offset-2 bg-primary/10' : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
          }`}
        >
          <a
            href={effectiveCtaLink}
            target={waNumber ? '_blank' : '_self'}
            rel={waNumber ? 'noreferrer' : ''}
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-primary, var(--color-primary)); color: var(--theme-btn-primary-text, currentColor);"
            class="btn btn-primary font-heading font-bold shadow-xs px-6"
          >
            {ctaText || 'Borong Sekarang'}
          </a>
        </div>
      {/if}
    {/each}
  </div>
{/snippet}

<div
  class="rounded-3xl p-6 sm:p-10 border border-[var(--color-border)] my-4"
  style="background-color: {cardBgColor || 'var(--color-bg-secondary)'};"
>
  {#if !hasImage}
    {@render textBlock(true)}
  {:else}
    <div class="cq-grid-split items-center gap-8">
      {#if isImageLeft}
        {@render imageBlock()}
        {@render textBlock(false)}
      {:else}
        {@render textBlock(false)}
        {@render imageBlock()}
      {/if}
    </div>
  {/if}
</div>
