<script lang="ts">
  import { Handshake, Store, Palette, ArrowRight } from 'lucide-svelte';
  import { Modal, Button, Badge } from '@/components/ui';
  import { formatIDR } from '@/lib/currency';
  import { getOptimizedCloudinaryUrl } from '@/lib/cloudinary';
  import type { PublicTemplate } from '../marketplace.types';

  export let open: boolean = false;
  export let template: PublicTemplate | null = null;
  export let isAdmin: boolean = false;
  export let selectedTenant: { id: string; name: string; storeName: string; storeId: string } | null = null;
  export let adminServiceFee: number = 5000;
  export let isOwnedForTenant: boolean = false;
  export let isSubmitting: boolean = false;
  export let onConfirm: () => void;
  export let onCancel: () => void;

  $: isFree = template ? template.price === 0 : false;
  $: isAlreadyOwned = isFree || isOwnedForTenant;
  $: basePrice = isAlreadyOwned ? 0 : (template ? template.price : 0);
  $: applicableFee = isAdmin && selectedTenant && !isAlreadyOwned ? adminServiceFee : 0;
  $: totalPrice = basePrice + applicableFee;
  $: optimizedThumbnail = template ? getOptimizedCloudinaryUrl(template.thumbnailUrl, 160) : '';
</script>

<Modal
  bind:open
  size="md"
  closeOnEsc={!isSubmitting}
  closeOnBackdrop={!isSubmitting}
  showCloseButton={!isSubmitting}
  on:close={onCancel}
>
  <svelte:fragment slot="header">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
        {#if isAdmin && selectedTenant}
          <Handshake size={20} />
        {:else}
          <Palette size={20} />
        {/if}
      </div>
      <div>
        <h2 class="text-heading-sm font-bold text-main font-heading">
          {isAdmin && selectedTenant
            ? (isAlreadyOwned ? 'Pasang Template ke Toko Binaan' : 'Beli Template untuk Toko Binaan')
            : (isFree ? 'Pasang Desain Template' : 'Konfirmasi Pembelian Template')}
        </h2>
        <p class="text-body-xs text-secondary mt-0.5">
          {isAdmin && selectedTenant
            ? (isAlreadyOwned ? 'Template ini sudah dimiliki merchant. Terapkan langsung ke toko.' : 'Rincian transaksi pembelian template atas nama merchant')
            : 'Pastikan rincian pesanan template Anda sudah sesuai'}
        </p>
      </div>
    </div>
  </svelte:fragment>

  {#if template}
    <div class="space-y-4">
      <!-- Template Info Summary Card -->
      <div class="p-3.5 rounded-2xl bg-nested border border-light flex items-center gap-3.5">
        <div class="w-16 h-16 rounded-xl overflow-hidden bg-card border border-light shrink-0 flex items-center justify-center">
          {#if template.thumbnailUrl}
            <img src={optimizedThumbnail} alt={template.name} class="w-full h-full object-cover" loading="lazy" />
          {:else}
            <Palette size={24} class="text-muted" />
          {/if}
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-bold text-main font-heading truncate">{template.name}</h3>
            {#if template.categoryName}
              <Badge variant="secondary" size="sm">{template.categoryName}</Badge>
            {/if}
          </div>
          <p class="text-xs text-secondary mt-0.5">
            Kreator: <strong class="text-main font-semibold">{template.designerName || 'Kreator Desain'}</strong>
          </p>
        </div>
      </div>

      <!-- Merchant Target Box (If Admin) -->
      {#if isAdmin && selectedTenant}
        <div class="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-2xs font-semibold uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <Store size={13} class="text-primary" />
              Toko Merchant Tujuan
            </span>
            <Badge variant="info" size="sm">Tenant Binaan</Badge>
          </div>
          <div class="flex items-baseline justify-between text-xs">
            <span class="font-bold text-main">{selectedTenant.storeName}</span>
            <span class="text-secondary text-2xs">Pemilik: {selectedTenant.name}</span>
          </div>
        </div>
      {/if}

      <!-- Financial Cost Breakdown -->
      <div class="p-4 rounded-2xl bg-card border border-light shadow-2xs space-y-3 text-xs">
        <span class="text-2xs font-bold uppercase tracking-wider text-secondary block font-heading">
          Rincian Pembayaran
        </span>

        <div class="space-y-2 text-secondary">
          <div class="flex justify-between items-center">
            <span>Harga Template</span>
            <span class="font-mono font-medium text-main">
              {isAlreadyOwned ? (isFree ? 'Gratis (Rp 0)' : 'Sudah Dimiliki (Rp 0)') : formatIDR(basePrice)}
            </span>
          </div>

          {#if isAdmin && selectedTenant && !isAlreadyOwned}
            <div class="p-2.5 rounded-xl bg-primary/5 border border-primary/15 space-y-1">
              <div class="flex justify-between items-center">
                <span class="text-main font-semibold flex items-center gap-1.5">
                  Fee Jasa Pendampingan
                  <Badge variant="info" size="sm">+Fee Admin</Badge>
                </span>
                <span class="font-mono font-bold text-primary">
                  +{formatIDR(applicableFee)}
                </span>
              </div>
              <p class="text-xs-dense text-secondary leading-relaxed">
                Biaya jasa pendampingan otomatis ditambahkan ke total invoice tagihan dan dikreditkan ke saldo dompet Anda setelah pembayaran sukses.
              </p>
            </div>
          {/if}

          <div class="flex justify-between items-center text-success">
            <span>Biaya Layanan SaaS</span>
            <span class="font-mono font-semibold">Gratis Rp 0</span>
          </div>

          <div class="pt-2 border-t border-light flex justify-between items-baseline">
            <span class="text-sm font-extrabold text-main font-heading">Total Tagihan</span>
            <span class="font-mono text-lg font-black text-primary">
              {isAlreadyOwned ? 'Gratis Rp 0' : formatIDR(totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <svelte:fragment slot="footer">
    <div class="flex items-center justify-end gap-2.5 w-full">
      <Button
        variant="secondary"
        size="md"
        disabled={isSubmitting}
        on:click={onCancel}
        class="rounded-xl font-semibold"
      >
        Batal
      </Button>

      <Button
        variant="primary"
        size="md"
        loading={isSubmitting}
        disabled={isSubmitting}
        on:click={onConfirm}
        class="rounded-xl font-bold shadow-xs flex items-center gap-2"
      >
        <span>{isAlreadyOwned ? 'Pasang Sekarang' : 'Lanjut ke Pembayaran'}</span>
        {#if !isSubmitting}
          <ArrowRight size={15} />
        {/if}
      </Button>
    </div>
  </svelte:fragment>
</Modal>
