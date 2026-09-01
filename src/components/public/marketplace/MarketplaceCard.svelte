<script lang="ts">
  import { Palette, Eye, ShoppingCart, CheckCircle2 } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import { formatCurrency } from '@/lib/utils';
  import type { PublicTemplate } from '../marketplace.types';

  export let tpl: PublicTemplate;
  export let isOwned: boolean = false;
  export let isPurchasing: boolean = false;
  export let isTenantOrGuest: boolean = true;
  export let onPurchase: (tpl: PublicTemplate) => void;
</script>

<div class="bg-card border border-light hover:border-slate-300 dark:hover:border-slate-700 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group relative">
  <!-- Thumbnail Frame -->
  <div class="relative h-52 w-full bg-nested flex items-center justify-center overflow-hidden border-b border-light">
    {#if tpl.thumbnailUrl}
      <img
        src={tpl.thumbnailUrl}
        alt={tpl.name}
        class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
      />
    {:else}
      <div class="flex flex-col items-center justify-center text-muted gap-2 p-6 text-center">
        <div class="w-12 h-12 rounded-2xl bg-card border border-light flex items-center justify-center text-muted shadow-2xs">
          <Palette size={24} />
        </div>
        <span class="text-xs font-medium text-secondary">Pratinjau Desain Toko</span>
      </div>
    {/if}

    <!-- Floating Top Badges -->
    <div class="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
      {#if tpl.categoryName}
        <span class="inline-flex items-center gap-1.5 bg-card/90 dark:bg-slate-900/90 backdrop-blur-md text-main border border-light px-3 py-1 rounded-full text-3xs font-bold shadow-xs">
          <span class="material-symbols-outlined text-xs text-primary">{tpl.categoryIcon || 'category'}</span>
          <span>{tpl.categoryName}</span>
        </span>
      {:else}
        <span class="inline-flex items-center gap-1 bg-card/90 dark:bg-slate-900/90 backdrop-blur-md text-secondary border border-light px-3 py-1 rounded-full text-3xs font-bold shadow-xs">
          Umum
        </span>
      {/if}

      {#if tpl.price === 0}
        <span class="inline-flex items-center gap-1 bg-emerald-500 text-white px-3 py-1 rounded-full text-3xs font-bold shadow-xs tracking-wider uppercase">
          Gratis
        </span>
      {:else}
        <span class="inline-flex items-center gap-1 bg-card/95 dark:bg-slate-900/95 backdrop-blur-md text-main font-mono font-black px-3 py-1 rounded-full text-xs shadow-xs border border-light">
          {formatCurrency(tpl.price)}
        </span>
      {/if}
    </div>
  </div>

  <!-- Card Content Body -->
  <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
    <div class="space-y-2">
      <div class="flex items-start justify-between gap-2">
        <h3 class="text-heading-sm font-bold text-main font-heading group-hover:text-primary transition-colors line-clamp-1">
          {tpl.name}
        </h3>
      </div>
      <p class="text-body-xs text-secondary line-clamp-2 leading-relaxed">
        {tpl.description || 'Desain website siap pakai untuk mempercantik storefront toko online Anda.'}
      </p>
    </div>

    <div class="pt-4 border-t border-light/60 flex items-center justify-between gap-2">
      <!-- Designer Info -->
      <div class="flex items-center gap-2 min-w-0">
        <div class="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-3xs flex-shrink-0">
          {(tpl.designerName || 'D').charAt(0).toUpperCase()}
        </div>
        <span class="text-3xs text-secondary truncate font-sans">
          Oleh: <strong class="text-main font-semibold">{tpl.designerName || 'Kreator Desain'}</strong>
        </span>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <Button
          href={`/builder/preview/${tpl.id}`}
          target="_blank"
          variant="secondary"
          size="xs"
          className="rounded-xl font-bold"
          title="Buka Demo Template"
        >
          <Eye size={13} />
          <span>Demo</span>
        </Button>

        {#if isOwned}
          <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
            <CheckCircle2 size={13} />
            <span>Dimiliki</span>
          </span>
        {:else if isTenantOrGuest}
          <Button
            variant={tpl.price === 0 ? 'secondary' : 'primary'}
            size="xs"
            className="rounded-xl font-bold {tpl.price === 0 ? '!bg-emerald-600 hover:!bg-emerald-700 !text-white' : ''}"
            loading={isPurchasing}
            disabled={isPurchasing}
            on:click={() => onPurchase(tpl)}
          >
            {#if !isPurchasing}
              <ShoppingCart size={13} />
            {/if}
            <span>{tpl.price === 0 ? 'Gunakan' : 'Beli'}</span>
          </Button>
        {/if}
      </div>
    </div>
  </div>
</div>
