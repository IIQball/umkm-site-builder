<script lang="ts">
  import { ImageOff } from 'lucide-svelte';

  export let src: string | undefined | null = undefined;
  export let alt: string = 'Image';
  export let className: string = '';
  export let loading: 'lazy' | 'eager' = 'lazy';
  export let fallbackText: string = 'Gambar tidak tersedia';

  let hasError = false;

  function handleError() {
    hasError = true;
  }
</script>

{#if src && !hasError}
  <img
    {src}
    {alt}
    class={className}
    {loading}
    on:error={handleError}
  />
{:else}
  <div class={`flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 p-4 ${className}`}>
    <ImageOff size={24} class="mb-1.5 opacity-50 text-slate-300 dark:text-slate-600" />
    <span class="text-[10px] font-medium opacity-70 text-slate-400">{fallbackText}</span>
  </div>
{/if}
