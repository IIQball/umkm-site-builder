<script lang="ts">
  import { Palette, Eye, ShoppingCart, CheckCircle2 } from 'lucide-svelte';
  import { Button, Badge } from '@/components/ui';
  import { formatIDR } from '@/lib/currency';
  import type { PublicTemplate } from '../marketplace.types';

  export let tpl: PublicTemplate;
  export let isOwned: boolean = false;
  export let isPurchasing: boolean = false;
  export let isTenantOrGuest: boolean = true;
  export let userRole: string | null = null;
  export let adminServiceFee: number = 0;
  export let hasSelectedTenant: boolean = false;
  export let isOwnedBySelectedTenant: boolean = false;
  export let onPurchase: (tpl: PublicTemplate) => void;

  $: isAdmin = userRole === 'admin' || userRole === 'superadmin';
  $: displayPrice = (isAdmin && hasSelectedTenant && tpl.price > 0)
    ? tpl.price + adminServiceFee
    : tpl.price;
</script>

<div class="bg-card border border-light hover:border-border rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group relative">
  <!-- Thumbnail Frame -->
  <div class="relative h-52 w-full flex items-center justify-center overflow-hidden">
    {#if tpl.thumbnailUrl}
      <img
        src={tpl.thumbnailUrl}
        alt={tpl.name}
        class="w-full h-full object-cover"
      />
    {:else}
      <div class="flex flex-col items-center justify-center text-muted gap-2 p-6 text-center w-full h-full bg-nested/40">
        <div class="w-12 h-12 rounded-2xl bg-card border border-light flex items-center justify-center text-muted shadow-2xs">
          <Palette size={24} />
        </div>
        <span class="text-xs font-medium text-secondary">Pratinjau Desain Toko</span>
      </div>
    {/if}

    <!-- Floating Top Badges -->
    <div class="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
      {#if tpl.categoryName}
        <span class="inline-flex items-center gap-1.5 bg-card/90 backdrop-blur-md text-main border border-light px-3 py-1 rounded-full text-xs font-semibold shadow-xs">
          <span class="material-symbols-outlined text-xs text-primary">{tpl.categoryIcon || 'category'}</span>
          <span>{tpl.categoryName}</span>
        </span>
      {:else}
        <span class="inline-flex items-center gap-1 bg-card/90 backdrop-blur-md text-secondary border border-light px-3 py-1 rounded-full text-xs font-semibold shadow-xs">
          Umum
        </span>
      {/if}

      {#if tpl.price === 0}
        <span class="inline-flex items-center gap-1 bg-success text-success-content px-3 py-1 rounded-full text-xs font-bold shadow-xs">
          Gratis
        </span>
      {:else}
        <div class="flex flex-col items-end gap-0.5">
          <span class="inline-flex items-center gap-1 bg-card/95 backdrop-blur-md text-main font-mono font-black px-3 py-1 rounded-full text-xs shadow-xs border border-light">
            {formatIDR(displayPrice)}
          </span>
          {#if isAdmin && hasSelectedTenant && adminServiceFee > 0}
            <span class="text-2xs font-semibold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.2 rounded-md">
              Termasuk Fee
            </span>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!-- Card Content Body -->
  <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
    <div class="space-y-2">
      <div class="flex items-start justify-between gap-2">
        <h2 class="text-heading-sm font-bold text-main font-heading group-hover:text-primary transition-colors line-clamp-1">
          {tpl.name}
        </h2>
      </div>
      <p class="text-body-xs text-secondary line-clamp-2 leading-relaxed">
        {tpl.description || 'Desain website siap pakai untuk mempercantik storefront toko online Anda.'}
      </p>

      {#if isAdmin && hasSelectedTenant && tpl.price > 0}
        <div class="mt-2 px-2.5 py-1.5 rounded-xl bg-primary/5 border border-primary/15 text-xs-dense text-secondary flex items-center justify-between">
          <span>Fee Pendampingan:</span>
          <span class="font-mono font-bold text-primary">+{formatIDR(adminServiceFee)}</span>
        </div>
      {/if}
    </div>

    <div class="pt-4 border-t border-light/60 flex items-center justify-between gap-2">
      <!-- Designer Info -->
      <div class="flex items-center gap-2 min-w-0">
        <div class="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
          {(tpl.designerName || 'D').charAt(0).toUpperCase()}
        </div>
        <span class="text-xs text-secondary truncate font-sans">
          Oleh: <strong class="text-main font-semibold">{tpl.designerName || 'Kreator Desain'}</strong>
        </span>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <Button
          href={`/builder/preview/${tpl.id}`}
          target="_blank"
          variant="secondary"
          size="sm"
          class="rounded-xl font-bold"
          title="Buka Demo Template"
        >
          <Eye size={14} />
          <span>Demo</span>
        </Button>

        {#if !isAdmin && isOwned}
          <Badge variant="success" size="lg" dot={false} class="gap-1.5">
            <CheckCircle2 size={13} />
            Dimiliki
          </Badge>
        {:else if isTenantOrGuest || isAdmin}
          {@const isAdminInstall = isAdmin && (isOwnedBySelectedTenant || (tpl.price === 0 && !hasSelectedTenant))}
          <Button
            variant={isAdminInstall ? 'primary' : (tpl.price === 0 ? 'secondary' : 'primary')}
            size="sm"
            class="rounded-xl font-bold {(!isAdmin && tpl.price === 0) ? '!bg-success hover:!bg-success/90 !text-success-content' : ''}"
            loading={isPurchasing}
            disabled={isPurchasing}
            on:click={() => onPurchase(tpl)}
          >
            {#if !isPurchasing}
              <ShoppingCart size={14} />
            {/if}
            <span>
              {isAdmin
                ? (isAdminInstall ? 'Pasang ke Tenant' : 'Beli untuk Merchant')
                : (tpl.price === 0 ? 'Gunakan' : 'Beli')}
            </span>
          </Button>
        {/if}
      </div>
    </div>
  </div>
</div>
