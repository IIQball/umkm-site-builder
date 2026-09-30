<script lang="ts">
  import type { Snippet } from 'svelte';

  export let imageUrl: string = '';
  export let altText: string = 'Foto Hero';
  export let imageFrame: 'none' | 'card' | 'grid' = 'none';
  export let imageShape: 'rounded' | 'square' | 'circle' | 'squircle' = 'rounded';
  export let aspectRatio: string = 'aspect-[4/3]';
  export let maxWidthClass: string = 'w-full';
  export let nodeKey: string = 'hero_image';
  export let isActive: boolean = false;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;
  export let customOverlay: Snippet | undefined = undefined;

  $: isCircle = imageShape === 'circle';
  $: isSquare = imageShape === 'square';
  $: isSquircle = imageShape === 'squircle';

  $: shapeClass = isCircle
    ? 'rounded-full aspect-square max-w-[340px] mx-auto'
    : isSquare
      ? 'rounded-none'
      : isSquircle
        ? 'rounded-[2.5rem]'
        : 'rounded-2xl';

  $: effectiveAspect = isCircle ? 'aspect-square' : aspectRatio;
</script>

{#if imageUrl}
  <div
    data-node={nodeKey}
    role="button"
    tabindex="0"
    on:click={(e) => selectNode && selectNode(e, nodeKey)}
    on:keydown={(e) => selectNodeKey && selectNodeKey(e, nodeKey)}
    class={`relative ${maxWidthClass} transition-all cursor-pointer select-none ${
      isActive
        ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100'
        : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
    } ${isCircle ? 'rounded-full' : isSquare ? 'rounded-none' : isSquircle ? 'rounded-[2.5rem]' : 'rounded-2xl'}`}
  >
    <!-- Aksen Grid Modern di Belakang Foto (Hanya jika opsi grid dipilih) -->
    {#if imageFrame === 'grid'}
      <div class="absolute -inset-3 -z-10 opacity-30 pointer-events-none overflow-hidden rounded-3xl">
        <svg class="w-full h-full text-[var(--color-primary)]" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`hero-grid-${nodeKey}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" stroke-width="0.75" stroke-opacity="0.35" />
              <circle cx="20" cy="20" r="1.5" fill="currentColor" fill-opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#hero-grid-${nodeKey})`} />
        </svg>
      </div>
    {/if}

    <!-- Frame / Card Wrapper atau Real Foto Murni (Default) -->
    {#if imageFrame === 'card'}
      <div class={`p-2.5 bg-[var(--color-card-base)] border border-[var(--color-border)] shadow-md overflow-hidden ${shapeClass}`}>
        <div class={`w-full ${effectiveAspect} overflow-hidden ${shapeClass}`}>
          <img src={imageUrl} alt={altText} class="w-full h-full object-cover" />
        </div>
      </div>
    {:else}
      <!-- Real Foto Murni (Default - Tanpa Card Luar) -->
      <div class={`w-full ${effectiveAspect} overflow-hidden shadow-sm ${shapeClass}`}>
        <img src={imageUrl} alt={altText} class="w-full h-full object-cover" />
      </div>
    {/if}

    {#if customOverlay}
      {@render customOverlay()}
    {/if}
  </div>
{/if}
