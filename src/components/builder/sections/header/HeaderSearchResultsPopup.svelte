<script lang="ts">
  import { ShieldAlert, ArrowRight } from 'lucide-svelte';
  import { formatIDR } from '@/lib/currency';
  import type { SearchProduct } from './headerSearch.helpers';

  export let searchResults: SearchProduct[] = [];
  export let debouncedQuery: string = '';
  export let hasThreatWarning: boolean = false;
  export let onSelectProduct: (e: MouseEvent, prod: SearchProduct) => void;
  export let onViewAll: (e: MouseEvent) => void;
  export let isMobile: boolean = false;
</script>

<div
  style="border-radius: var(--theme-btn-radius, var(--btn-radius, 12px)); background-color: var(--theme-surface, var(--color-card-base, white)); border: 1px solid var(--color-border); color: var(--theme-text-primary, var(--color-text-main)); font-family: var(--theme-font-body, inherit);"
  class={`absolute left-0 right-0 top-full mt-2 p-2 shadow-2xl z-50 text-left space-y-1 ${
    isMobile ? '' : 'animate-in fade-in zoom-in-95 duration-100'
  }`}
>
  {#if hasThreatWarning}
    <div
      style="border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); font-size: calc(var(--theme-text-caption, 12px) * 0.9);"
      class="px-2.5 py-1.5 bg-warning/10 text-warning flex items-center gap-1.5"
    >
      <ShieldAlert size={13} class="flex-shrink-0" />
      <span>Input mencurigakan difilter demi keamanan.</span>
    </div>
  {/if}

  {#if searchResults.length === 0}
    <div
      style="color: var(--theme-text-muted, var(--color-text-muted)); font-size: var(--theme-text-caption, 12px);"
      class="p-3 text-center"
    >
      Tidak ada produk yang cocok dengan "{debouncedQuery}"
    </div>
  {:else}
    {#each searchResults as prod}
      <button
        type="button"
        on:click={(e) => onSelectProduct(e, prod)}
        style="border-radius: calc(var(--theme-btn-radius, var(--btn-radius, 8px)) * 0.75);"
        class="w-full flex items-center justify-between p-2 hover:bg-[var(--color-nested-base)] transition-colors text-left cursor-pointer"
      >
        <div class="truncate mr-2">
          <span
            style="font-family: var(--theme-font-heading, inherit); font-size: var(--theme-text-caption, 12px); font-weight: var(--text-h3-weight, 600);"
            class="block truncate"
          >{prod.name}</span>
          <span
            style="color: var(--theme-text-muted, var(--color-text-muted)); font-size: calc(var(--theme-text-caption, 12px) * 0.85);"
            class="block"
          >{prod.category || 'Katalog'}</span>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          {#if prod.price}
            <span
              style="color: var(--theme-primary, var(--color-primary)); font-family: var(--theme-font-heading, inherit); font-size: var(--theme-text-caption, 12px); font-weight: var(--text-h3-weight, 600);"
            >{formatIDR(prod.price)}</span>
          {/if}
          <ArrowRight size={12} style="color: var(--theme-text-muted, var(--color-text-muted));" />
        </div>
      </button>
    {/each}

    <div style="border-top: 1px solid var(--color-border);" class="pt-1 text-center">
      <button
        type="button"
        on:click={onViewAll}
        style="color: var(--theme-primary, var(--color-primary)); font-family: var(--theme-font-heading, inherit); font-size: calc(var(--theme-text-caption, 12px) * 0.95); font-weight: var(--text-h3-weight, 600);"
        class="hover:underline py-1 block w-full cursor-pointer"
      >
        Lihat Semua di Katalog Produk →
      </button>
    </div>
  {/if}
</div>
