<script lang="ts">
  import { onMount } from 'svelte';
  import { type DirectoryStore, getStoreUrl } from './directory.types';
  import { formatIDR } from '@/lib/currency';
  import { getMainDomain } from '@/lib/domain';

  export let store: DirectoryStore;

  let mainDomain = 'localhost:4321';
  onMount(() => {
    mainDomain = getMainDomain();
  });
</script>

<a
  href={getStoreUrl(store.subdomain)}
  target="_blank"
  rel="noopener noreferrer"
  class="group relative p-6 rounded-3xl bg-card border border-border shadow-xs hover:shadow-lg hover:border-orange/30 hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col gap-4 text-main"
>
  <!-- Top: Logo & Stats/Distance -->
  <div class="flex items-start justify-between gap-3">
    <div class="w-12 h-12 rounded-2xl bg-nested border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
      {#if store.logoUrl}
        <img src={store.logoUrl} alt={store.name} class="w-full h-full object-cover" loading="lazy" />
      {:else}
        <span class="material-symbols-outlined text-muted text-[22px]">storefront</span>
      {/if}
    </div>

    <div class="flex flex-col items-end shrink-0">
      {#if store.distance !== null}
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange/10 border border-orange/20 text-orange dark:text-orange-400 text-xs font-semibold">
          <span class="material-symbols-outlined text-[13px]">near_me</span>
          {store.distance} km
        </span>
      {:else}
        <span class="text-[11px] font-bold uppercase tracking-wider text-muted font-mono">Kunjungan</span>
        <span class="text-xs font-semibold text-secondary flex items-center gap-1 mt-0.5">
          {store.totalViews.toLocaleString('id-ID')}
          <span class="material-symbols-outlined text-[13px] text-muted">visibility</span>
        </span>
      {/if}
    </div>
  </div>

  <!-- Store Info -->
  <div class="space-y-1">
    <h2 class="font-bold text-main font-heading group-hover:text-orange transition-colors text-lg tracking-tight line-clamp-1">
      {store.name}
    </h2>

    <p class="text-xs text-secondary line-clamp-1 flex items-center gap-1">
      <span class="material-symbols-outlined text-[13px] text-muted">link</span>
      <span class="font-mono text-muted">{store.subdomain}.{mainDomain}</span>
    </p>

    {#if store.address}
      <p class="text-xs text-secondary line-clamp-1 flex items-center gap-1 pt-0.5">
        <span class="material-symbols-outlined text-[13px] text-muted">location_on</span>
        <span>{store.address}</span>
      </p>
    {/if}
  </div>

  <!-- Category & Products -->
  <div class="space-y-2 pt-0.5">
    {#if store.category}
      <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-nested border border-border text-secondary text-[11px] font-medium">
        {#if store.category.icon}
          <span class="material-symbols-outlined text-[13px] text-orange">{store.category.icon}</span>
        {/if}
        <span>{store.category.name}</span>
      </div>
    {/if}

    {#if store.sampleProducts && store.sampleProducts.length > 0}
      <div class="flex flex-wrap gap-1.5 pt-1">
        {#each store.sampleProducts as prod (prod.id)}
          <span class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-nested/60 border border-border/80 text-secondary max-w-full">
            <span class="inline-block truncate max-w-[100px] align-middle">{prod.name}</span>
            <span class="text-orange font-semibold shrink-0">{formatIDR(prod.price)}</span>
          </span>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Bottom CTA -->
  <div class="mt-auto pt-3.5 flex items-center justify-between border-t border-border">
    <span class="inline-flex items-center gap-1.5 text-xs text-secondary font-medium">
      <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
      Toko Aktif
    </span>
    <span class="text-xs font-bold text-orange group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
      Kunjungi Toko
      <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
    </span>
  </div>
</a>
