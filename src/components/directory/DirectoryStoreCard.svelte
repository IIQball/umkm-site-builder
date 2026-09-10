<script lang="ts">
  import { type DirectoryStore, getStoreUrl } from './directory.types';
  import { formatIDR } from '@/lib/currency';

  export let store: DirectoryStore;
</script>

<a
  href={getStoreUrl(store.subdomain)}
  target="_blank"
  rel="noopener noreferrer"
  class="group relative p-5 rounded-3xl bg-white dark:bg-zinc-900/70 border border-zinc-200/70 dark:border-zinc-800/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col gap-3.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out"
>
  <!-- Top: Logo & Stats/Distance -->
  <div class="flex items-start justify-between gap-3">
    <div class="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0 border border-zinc-100 dark:border-zinc-700/60 shadow-sm">
      {#if store.logoUrl}
        <img src={store.logoUrl} alt={store.name} class="w-full h-full object-cover" loading="lazy" />
      {:else}
        <span class="material-symbols-outlined text-zinc-400 dark:text-zinc-500 text-[22px]">storefront</span>
      {/if}
    </div>

    <div class="flex flex-col items-end gap-1 shrink-0">
      {#if store.distance !== null}
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <span class="material-symbols-outlined text-[14px]">near_me</span>
          {store.distance} km
        </span>
      {:else}
        <span class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Kunjungan</span>
        <span class="text-xs font-semibold text-zinc-600 dark:text-zinc-300 flex items-center gap-1">
          {store.totalViews.toLocaleString('id-ID')}
          <span class="material-symbols-outlined text-[13px] text-zinc-400">visibility</span>
        </span>
      {/if}
    </div>
  </div>

  <!-- Store Info -->
  <div class="space-y-1">
    <div class="flex items-center gap-2">
      <h3 class="font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors text-base">
        {store.name}
      </h3>
    </div>

    <p class="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 flex items-center gap-1">
      <span class="material-symbols-outlined text-[14px] text-zinc-400">link</span>
      {store.subdomain}
    </p>

    {#if store.address}
      <p class="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 flex items-center gap-1 pt-0.5">
        <span class="material-symbols-outlined text-[14px] text-zinc-400">location_on</span>
        {store.address}
      </p>
    {/if}
  </div>

  <!-- Category & Products -->
  <div class="space-y-2 pt-1">
    {#if store.category}
      <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium">
        {#if store.category.icon}
          <span class="material-symbols-outlined text-[13px]">{store.category.icon}</span>
        {/if}
        <span>{store.category.name}</span>
      </div>
    {/if}

    {#if store.sampleProducts && store.sampleProducts.length > 0}
      <div class="flex flex-wrap gap-1.5 pt-1">
        {#each store.sampleProducts as prod (prod.id)}
          <span class="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50 text-zinc-600 dark:text-zinc-300">
            <span class="truncate max-w-[110px]">{prod.name}</span>
            <span class="text-emerald-600 dark:text-emerald-400 font-medium">{formatIDR(prod.price)}</span>
          </span>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Bottom CTA -->
  <div class="mt-auto pt-3.5 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80">
    <span class="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
      <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
      Toko Buka
    </span>
    <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
      Kunjungi
      <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
    </span>
  </div>
</a>
