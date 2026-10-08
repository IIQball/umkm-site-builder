<script lang="ts">
  import { Eye, ShoppingCart, CheckCircle2 } from 'lucide-svelte';
  import { Button, Badge } from '@/components/ui';
  import { formatIDR } from '@/lib/currency';
  import { getOptimizedCloudinaryUrl } from '@/lib/cloudinary';
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

  let imageLoadError = false;

  $: isAdmin = userRole === 'admin' || userRole === 'superadmin';
  $: displayPrice = (isAdmin && hasSelectedTenant && tpl.price > 0)
    ? tpl.price + adminServiceFee
    : tpl.price;
  $: optimizedThumbnail = getOptimizedCloudinaryUrl(tpl.thumbnailUrl, 600);
</script>

<div
  class="bg-card rounded-3xl overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group relative"
>
  <!-- Thumbnail Frame -->
  <div class="relative aspect-[16/10] w-full bg-nested overflow-hidden flex items-center justify-center">
    {#if tpl.thumbnailUrl && !imageLoadError}
      <img
        src={optimizedThumbnail}
        alt={tpl.name}
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        loading="lazy"
        on:error={() => (imageLoadError = true)}
      />
    {:else}
      <div
        class="absolute inset-0 bg-nested flex flex-col items-center justify-center gap-1.5 text-muted p-4 text-center"
      >
        <div
          class="w-10 h-10 rounded-xl bg-card flex items-center justify-center text-muted shadow-2xs"
        >
          <span class="material-symbols-outlined text-xl">palette</span>
        </div>
        <span class="text-xs font-medium text-muted">Tanpa Pratinjau</span>
      </div>
    {/if}

    <!-- Top Overlay Badges -->
    <div
      class="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10"
    >
      {#if tpl.categoryName}
        <span
          class="inline-flex items-center gap-1.5 bg-card/90 backdrop-blur-md text-main px-2.5 py-1 rounded-full text-xs font-semibold shadow-xs"
        >
          <span class="material-symbols-outlined text-xs text-primary">{tpl.categoryIcon || 'category'}</span>
          <span>{tpl.categoryName}</span>
        </span>
      {:else}
        <span
          class="inline-flex items-center gap-1 bg-card/90 backdrop-blur-md text-secondary px-2.5 py-1 rounded-full text-xs font-semibold shadow-xs"
        >
          Umum
        </span>
      {/if}

      {#if tpl.price === 0}
        <span
          class="inline-flex items-center gap-1 bg-success text-success-content px-2.5 py-0.5 rounded-full text-xs font-bold shadow-xs"
        >
          Gratis
        </span>
      {:else if !isAdmin && isOwned}
        <span
          class="inline-flex items-center gap-1 bg-card/90 backdrop-blur-md text-success px-2.5 py-0.5 rounded-full text-xs font-bold shadow-xs"
        >
          <CheckCircle2 size={12} />
          Dimiliki
        </span>
      {/if}
    </div>
  </div>

  <!-- Card Content Body -->
  <div class="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
    <div class="space-y-3">
      <!-- Title & Price Block: Clean vertical hierarchy, wrap downward if long -->
      <div class="space-y-1.5">
        <h2
          class="text-base sm:text-lg font-bold text-main font-heading group-hover:text-primary transition-colors leading-snug break-words"
          title={tpl.name}
        >
          {tpl.name}
        </h2>

        <!-- Price & Termasuk Fee badge -->
        <div class="flex items-center gap-2 flex-wrap pt-0.5">
          {#if tpl.price === 0}
            <span class="text-base sm:text-lg font-black text-success font-mono">
              Gratis
            </span>
          {:else}
            <span
              class="text-lg sm:text-xl font-extrabold text-main font-mono tracking-tight leading-none"
            >
              {formatIDR(displayPrice)}
            </span>
            {#if isAdmin && hasSelectedTenant && adminServiceFee > 0}
              <span
                class="inline-flex items-center text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full"
              >
                Termasuk Fee
              </span>
            {/if}
          {/if}
        </div>
      </div>

      <!-- Description -->
      <p class="text-xs text-secondary line-clamp-2 leading-relaxed font-sans">
        {tpl.description || 'Desain website siap pakai untuk mempercantik storefront toko online Anda.'}
      </p>

      <!-- Admin Fee Breakdown Card -->
      {#if isAdmin && hasSelectedTenant && tpl.price > 0}
        <div
          class="p-2.5 rounded-xl bg-nested/80 text-2xs text-secondary flex items-center justify-between font-sans"
        >
          <span class="font-medium">Fee Pendampingan:</span>
          <span class="font-mono font-bold text-primary">+{formatIDR(adminServiceFee)}</span>
        </div>
      {/if}

      <!-- Designer Info (Dedicated Row - Never Squished!) -->
      <div class="pt-0.5 flex items-center gap-2 min-w-0">
        <div
          class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0"
        >
          {(tpl.designerName || 'K').charAt(0).toUpperCase()}
        </div>
        <p class="text-xs text-secondary truncate font-sans">
          Oleh <strong class="text-main font-semibold hover:text-primary transition-colors">{tpl.designerName || 'Kreator Desain'}</strong>
        </p>
      </div>
    </div>

    <!-- Action Buttons Row -->
    <div class="pt-3 border-t border-border/40 dark:border-white/10 flex items-center gap-2">
      <Button
        href={`/builder/preview/${tpl.id}`}
        variant="secondary"
        size="sm"
        class="rounded-xl font-bold px-3.5 shrink-0"
        title="Buka Demo Template"
      >
        <Eye size={14} />
        <span>Demo</span>
      </Button>

      {#if !isAdmin && isOwned}
        <div class="flex-1 flex justify-end">
          <Badge
            variant="success"
            size="lg"
            dot={false}
            class="gap-1.5 w-full justify-center py-1.5 font-bold"
          >
            <CheckCircle2 size={13} />
            Dimiliki
          </Badge>
        </div>
      {:else if isTenantOrGuest || isAdmin}
        {@const isAdminInstall = isAdmin && (isOwnedBySelectedTenant || (tpl.price === 0 && !hasSelectedTenant))}
        <Button
          variant={isAdminInstall ? 'primary' : (tpl.price === 0 ? 'secondary' : 'primary')}
          size="sm"
          class="flex-1 rounded-xl font-bold justify-center truncate {(!isAdmin && tpl.price === 0) ? '!bg-success hover:!bg-success/90 !text-success-content' : ''}"
          loading={isPurchasing}
          disabled={isPurchasing}
          on:click={() => onPurchase(tpl)}
        >
          {#if !isPurchasing}
            <ShoppingCart size={14} class="shrink-0" />
          {/if}
          <span class="truncate">
            {isAdmin
              ? (isAdminInstall ? 'Pasang ke Merchant' : 'Beli untuk Merchant')
              : (tpl.price === 0 ? 'Gunakan' : 'Beli')}
          </span>
        </Button>
      {/if}
    </div>
  </div>
</div>
