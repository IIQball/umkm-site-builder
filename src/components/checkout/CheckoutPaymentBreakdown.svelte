<script lang="ts">
  import {
    Check,
    Copy,
    CreditCard,
    RefreshCw,
    LayoutDashboard,
    Palette,
    Lock,
    Handshake,
  } from 'lucide-svelte';
  import type { CheckoutPageData } from '@/types';
  import { Button, Badge } from '@/components/ui';
  import { formatIDR } from '@/lib/currency';

  export let pageData: CheckoutPageData;
  export let checkoutTitle: string;
  export let checkoutDescription: string;
  export let isTemplatePurchase: boolean;
  export let copied: boolean = false;
  export let onCopyInvoice: () => void;
  export let onOpenPaymentModal: () => void;
</script>

<div class="bg-card border border-border rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
  <div>
    <h2 class="text-heading-sm font-bold text-main font-heading">
      {checkoutTitle}
    </h2>
    <p class="text-body-xs text-secondary mt-0.5">
      {checkoutDescription}
    </p>
  </div>

  {#if pageData.assistedMerchantName || pageData.assistedStoreName}
    <div class="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 space-y-1">
      <div class="flex items-center gap-1.5 text-xs font-bold text-main font-heading">
        <Handshake size={14} class="text-primary" />
        <span>Pembelian untuk Merchant Binaan</span>
      </div>
      <p class="text-2xs text-secondary leading-relaxed">
        Dibelikan untuk <strong class="text-main font-semibold">{pageData.assistedStoreName || 'Toko Merchant'}</strong> ({pageData.assistedMerchantName}). Template otomatis terpasang ke akun merchant setelah pembayaran lunas.
      </p>
    </div>
  {/if}

  <div class="flex items-center justify-between bg-nested/80 px-3.5 py-2.5 rounded-2xl border border-light">
    <div class="min-w-0">
      <span class="text-2xs text-secondary font-medium uppercase tracking-wider">No. Invoice Tagihan</span>
      <p class="font-mono text-xs font-bold text-main truncate mt-0.5">{pageData.invoiceId}</p>
    </div>
    <button
      type="button"
      class="p-2 rounded-xl bg-card hover:bg-nested text-secondary hover:text-main active:scale-95 transition-all cursor-pointer border border-light shadow-2xs"
      title="Salin Nomor Invoice"
      on:click={onCopyInvoice}
    >
      {#if copied}
        <Check size={14} class="text-success" />
      {:else}
        <Copy size={14} />
      {/if}
    </button>
  </div>

  <!-- Price Breakdown -->
  <div class="space-y-2.5 pt-2 border-t border-border text-xs">
    <div class="flex justify-between items-center text-secondary">
      <span>Biaya Lisensi Template</span>
      <span class="font-mono font-medium text-main">
        {formatIDR(pageData.baseAmount ?? (pageData.amount - (pageData.adminFee || 0)))}
      </span>
    </div>
    {#if pageData.adminFee && pageData.adminFee > 0}
      <div class="flex justify-between items-start text-secondary">
        <div class="min-w-0 pr-2">
          <span class="text-main font-medium block">Biaya Jasa Pendampingan</span>
          <span class="text-xs text-secondary block mt-0.5">Fee pendampingan resmi admin untuk toko merchant binaan</span>
        </div>
        <span class="font-mono font-bold text-primary shrink-0">
          +{formatIDR(pageData.adminFee)}
        </span>
      </div>
    {/if}
    <div class="flex justify-between items-center text-secondary">
      <span>Biaya Layanan & Payment Gateway</span>
      <Badge variant="success" size="sm" dot={false} class="font-mono font-bold">Gratis Rp 0</Badge>
    </div>
    <div class="flex justify-between items-center text-secondary">
      <span>PPN / Pajak Transaksi</span>
      <span class="font-mono font-medium text-secondary">Termasuk (0%)</span>
    </div>

    <div class="flex justify-between items-baseline pt-4 border-t border-border">
      <span class="text-sm font-extrabold text-main font-heading">Total Pembayaran</span>
      <span class="font-mono text-2xl font-black text-primary">
        {formatIDR(pageData.amount)}
      </span>
    </div>
  </div>

  <!-- Action CTA Buttons -->
  <div class="pt-3 space-y-2.5">
    {#if pageData.status === 'success'}
      <div class="p-4 rounded-2xl bg-success/10 border border-success/20 text-center space-y-2">
        <span class="text-xs font-bold text-success block font-heading">
          🎉 Transaksi Berhasil & Aktif!
        </span>
        <p class="text-2xs text-secondary leading-relaxed font-sans">
          Template kini telah ditambahkan ke koleksi toko Anda dan siap diterapkan langsung ke storefront.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        <Button
          href="/dashboard"
          variant="primary"
          size="md"
          fullWidth
          class="w-full font-bold shadow-xs active:scale-95 text-xs rounded-2xl"
        >
          <LayoutDashboard size={15} />
          <span>Dashboard</span>
        </Button>
        <Button
          href="/dashboard/templates"
          variant="secondary"
          size="md"
          fullWidth
          class="w-full font-bold active:scale-95 text-xs rounded-2xl"
        >
          <Palette size={15} />
          <span>Galeri Template</span>
        </Button>
      </div>
    {:else if pageData.status === 'pending'}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        class="w-full font-bold shadow-md shadow-primary/20 text-sm active:scale-95 py-3 rounded-2xl whitespace-nowrap"
        on:click={onOpenPaymentModal}
      >
        <CreditCard size={18} />
        <span>Bayar Sekarang</span>
      </Button>

      <div class="flex items-center justify-center gap-2 pt-1 text-2xs text-secondary">
        <Lock size={12} class="text-success" />
        <span>Enkripsi SSL 256-bit & Xendit Verified Gateway</span>
      </div>
    {:else}
      <Button
        href={isTemplatePurchase ? '/templates' : '/dashboard'}
        variant="primary"
        size="md"
        fullWidth
        class="w-full font-bold shadow-xs active:scale-95 text-xs rounded-2xl"
      >
        <RefreshCw size={15} />
        <span>Pilih Template Lain</span>
      </Button>
    {/if}
  </div>
</div>
