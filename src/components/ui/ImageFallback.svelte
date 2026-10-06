<script lang="ts">
  import { ImageOff } from 'lucide-svelte';
  import { getOptimizedCloudinaryUrl } from '@/lib/cloudinary';

  export let src: string | undefined | null = undefined;
  export let alt: string = 'Image';
  export let className: string = '';
  export let loading: 'lazy' | 'eager' = 'lazy';
  export let fallbackText: string = 'Gambar tidak tersedia';
  export let width: number | string | undefined = undefined;
  export let height: number | string | undefined = undefined;

  let hasError = false;

  $: numWidth = typeof width === 'number' ? width : 500;
  $: optimizedSrc = getOptimizedCloudinaryUrl(src, numWidth);
  $: { src; hasError = false; }

  function handleError() {
    hasError = true;
  }
</script>

{#if optimizedSrc && !hasError}
  <img
    src={optimizedSrc}
    {alt}
    {width}
    {height}
    class={className}
    {loading}
    on:error={handleError}
  />
{:else}
  <div
    class={`flex flex-col items-center justify-center bg-nested text-muted p-4 ${className}`}
    style:width={typeof width === 'number' ? `${width}px` : width}
    style:height={typeof height === 'number' ? `${height}px` : height}
  >
    <ImageOff size={24} class="mb-1.5 opacity-50 text-muted" />
    <span class="text-3xs font-medium text-muted">{fallbackText}</span>
  </div>
{/if}
